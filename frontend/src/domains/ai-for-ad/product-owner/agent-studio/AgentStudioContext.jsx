import React, { useCallback, useMemo, useState } from 'react';
import { AgentStudioContext } from './useAgentStudio';
import {
  SEED_AGENTS,
  SEED_AUDIT,
  SEED_HARNESS_RUNS,
  EVAL_RULES,
  DEFAULT_PASS_THRESHOLD,
  GOVERNANCE_POLICIES,
  getStage,
  getStageBlockers,
  computeEvaluation,
  isEvaluationPassing,
  evaluatePolicies
} from './agentStudioData';
import { SEED_WORKFLOWS, RUN_STATUS as WF_RUN_STATUS, settleRun } from './workflows/adWorkflowModel';

/**
 * AgentStudioContext — shared state for F1–F5 inside the AI Experience Zone.
 *
 * Mounted once in AdExperienceZone.jsx so the Onboarding Studio (inside the
 * Agent & Workflow Catalogue), AI Harness, Evaluation Center and Governance
 * Center all read and mutate the same agents, runs and audit trail.
 */
const CURRENT_USER = 'Carl Weber';
let seq = 0;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(seq += 1)}`;
const nowIso = () => new Date().toISOString();

export function AgentStudioProvider({ children, onNavigate }) {
  const [agents, setAgents] = useState(SEED_AGENTS);
  const [audit, setAudit] = useState(SEED_AUDIT);
  const [harnessRuns, setHarnessRuns] = useState(SEED_HARNESS_RUNS);
  const [threshold, setThreshold] = useState(DEFAULT_PASS_THRESHOLD);
  const [rules, setRules] = useState(EVAL_RULES);
  const [workflows, setWorkflows] = useState(SEED_WORKFLOWS);
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [workflowRequest, setWorkflowRequest] = useState(null);

  // Cross-tab navigation: which agent to preselect and which catalogue view to open
  const [focusAgentId, setFocusAgentId] = useState(null);
  const [pendingCatalogueView, setPendingCatalogueView] = useState(null);

  const getAgent = useCallback((id) => agents.find((a) => a.id === id), [agents]);

  const addAudit = useCallback((entry) => {
    setAudit((prev) => [{ id: newId('au'), ts: nowIso(), actor: CURRENT_USER, type: 'lifecycle', ...entry }, ...prev]);
  }, []);

  const patchAgent = useCallback((id, patch) => {
    setAgents((prev) => prev.map((a) => (a.id === id
      ? { ...a, ...(typeof patch === 'function' ? patch(a) : patch), updatedAt: nowIso() }
      : a)));
  }, []);

  // ---------------------------------------------------------------- F1 / F2
  const registerAgent = useCallback((draft) => {
    const id = newId('agent');
    const agent = {
      ...draft,
      id,
      catalogueId: null,
      stage: 1,
      operationalState: 'Onboarding',
      evalProfile: 86 + (draft.name.length % 7),
      runtime: { ...draft.runtime },
      governance: { status: 'not_submitted', decidedBy: null, decidedAt: null, comment: '' },
      certificateId: null,
      evaluation: null,
      reuseCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    setAgents((prev) => [agent, ...prev]);
    addAudit({ action: 'Agent registered', agentId: id, detail: `Registered on ${draft.runtime.type} for ${draft.program} (ASIL ${draft.asil})` });
    return id;
  }, [addAudit]);

  const updateAgent = useCallback((id, patch) => patchAgent(id, patch), [patchAgent]);

  /** Mock health check: succeeds when base URL is https and an agent ID is present. */
  const verifyRuntime = useCallback((id) => new Promise((resolve) => {
    patchAgent(id, (a) => ({ runtime: { ...a.runtime, status: 'verifying' } }));
    setTimeout(() => {
      setAgents((prev) => prev.map((a) => {
        if (a.id !== id) return a;
        const ok = /^https:\/\/.+/.test(a.runtime.baseUrl || '') && Boolean((a.runtime.agentId || '').trim());
        const latencyMs = ok ? 38 + (a.name.length * 7) % 90 : null;
        resolve({ ok, latencyMs });
        return { ...a, runtime: { ...a.runtime, status: ok ? 'connected' : 'failed', latencyMs }, updatedAt: nowIso() };
      }));
      addAudit({ action: 'Runtime verified', agentId: id, detail: 'Health check executed against runtime endpoint', type: 'lifecycle' });
    }, 1200);
  }), [patchAgent, addAudit]);

  const blockersFor = useCallback((agent) => getStageBlockers(agent, { rules, threshold, audit }), [rules, threshold, audit]);

  /** Moves an agent one stage forward when its exit criteria are met. */
  const advanceStage = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent || agent.stage >= 9) return { ok: false, blockers: ['Already published'] };
    const blockers = blockersFor(agent);
    if (blockers.length) return { ok: false, blockers };
    const next = agent.stage + 1;
    patchAgent(id, {
      stage: next,
      ...(next === 6 ? { governance: { ...agent.governance, status: 'pending' } } : {}),
      ...(next === 9 ? { operationalState: 'Active' } : {})
    });
    addAudit({ action: 'Stage advanced', agentId: id, detail: `${getStage(agent.stage).label} → ${getStage(next).label}` });
    return { ok: true, stage: next };
  }, [agents, blockersFor, patchAgent, addAudit]);

  const setStage = useCallback((id, stage, reason) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    patchAgent(id, { stage });
    addAudit({ action: stage < agent.stage ? 'Stage regressed' : 'Stage set', agentId: id, detail: `${getStage(agent.stage).label} → ${getStage(stage).label}${reason ? ` · ${reason}` : ''}` });
  }, [agents, patchAgent, addAudit]);

  const setOperationalState = useCallback((id, state) => {
    patchAgent(id, { operationalState: state });
    addAudit({ action: `Agent ${state.toLowerCase()}`, agentId: id, detail: `Operational state set to ${state}`, type: 'governance' });
  }, [patchAgent, addAudit]);

  // ---------------------------------------------------------------- F5
  /** Runs a (mock) evaluation and applies lifecycle consequences. */
  const runEvaluation = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return null;
    const runs = (agent.evaluation?.runs || 0) + 1;
    const { score, dims } = computeEvaluation(agent, runs);
    const evaluation = { score, dims, lastRun: nowIso(), runs };
    const pass = isEvaluationPassing(agent, evaluation, rules, threshold);
    evaluation.failed = !pass;

    let stage = agent.stage;
    let governance = agent.governance;
    if (pass && agent.stage === 5) {
      stage = 6;
      governance = { ...agent.governance, status: 'pending' };
    } else if (!pass && agent.stage >= 4 && agent.stage <= 6) {
      stage = 3;
      governance = { ...agent.governance, status: 'not_submitted' };
    }
    patchAgent(id, { evaluation, stage, governance });
    addAudit({
      action: pass ? 'Evaluation passed' : 'Evaluation failed',
      agentId: id,
      actor: 'Evaluation Center',
      type: 'evaluation',
      detail: `Score ${score}/100 (threshold ${threshold})${stage !== agent.stage ? ` · ${getStage(agent.stage).label} → ${getStage(stage).label}` : ''}`
    });
    if (pass && stage === 6 && agent.stage === 5) {
      addAudit({ action: 'Governance submitted', agentId: id, actor: 'System', type: 'governance', detail: `Routed to ${agent.approver || 'unassigned approver'}` });
    }
    return { evaluation, pass, stage };
  }, [agents, rules, threshold, patchAgent, addAudit]);

  const toggleRule = useCallback((ruleId) => {
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const updateRule = useCallback((ruleId, patch) => {
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...patch } : r)));
  }, []);

  /** Adds rules from an uploaded rule pack (already parsed). */
  const addRules = useCallback((newRules, source = 'Rule pack') => {
    setRules((prev) => [...prev, ...newRules.map((r) => ({ enabled: true, blocking: false, ...r, id: r.id || newId('rule') }))]);
    addAudit({ action: 'Rule pack uploaded', actor: CURRENT_USER, type: 'evaluation', detail: `${newRules.length} rule(s) added from ${source}` });
  }, [addAudit]);

  // ---------------------------------------------------------------- F4
  const policyChecks = useCallback((agent) => evaluatePolicies(agent, audit), [audit]);

  const mandatoryFailures = useCallback((agent) => {
    const checks = evaluatePolicies(agent, audit);
    return GOVERNANCE_POLICIES.filter((p) => p.mandatory && !checks[p.id].pass);
  }, [audit]);

  const decideGovernance = useCallback((id, decision, comment = '', actor = CURRENT_USER) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return { ok: false, reason: 'Agent not found' };
    if (decision === 'approve' && mandatoryFailures(agent).length) return { ok: false, reason: 'Mandatory guardrails failing' };
    if (decision === 'reject' && !comment.trim()) return { ok: false, reason: 'A comment is required to reject' };
    const approved = decision === 'approve';
    patchAgent(id, {
      governance: { status: approved ? 'approved' : 'rejected', decidedBy: actor, decidedAt: nowIso(), comment },
      stage: approved ? Math.max(agent.stage, 7) : Math.min(agent.stage, 5)
    });
    addAudit({ action: approved ? 'Approval granted' : 'Approval rejected', agentId: id, actor, type: 'governance', detail: comment || (approved ? 'All mandatory guardrails satisfied' : '') });
    return { ok: true };
  }, [agents, mandatoryFailures, patchAgent, addAudit]);

  const rescanCompliance = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return null;
    const checks = evaluatePolicies(agent, audit);
    const passed = GOVERNANCE_POLICIES.filter((p) => checks[p.id].pass).length;
    addAudit({ action: 'Compliance scan', agentId: id, actor: 'Governance Center', type: 'governance', detail: `${passed}/${GOVERNANCE_POLICIES.length} policies compliant` });
    return checks;
  }, [agents, audit, addAudit]);

  const issueCertificate = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent || agent.stage !== 7) return null;
    const certificateId = `AD-CERT-2026-${String(200 + (agent.name.length * 13) % 700).padStart(4, '0')}`;
    patchAgent(id, { stage: 8, certificateId });
    addAudit({ action: 'Certificate issued', agentId: id, type: 'governance', detail: `${certificateId} · version ${agent.version} frozen` });
    return certificateId;
  }, [agents, patchAgent, addAudit]);

  const publishAgent = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent || agent.stage !== 8) return false;
    patchAgent(id, { stage: 9, operationalState: 'Active' });
    addAudit({ action: 'Agent published', agentId: id, type: 'lifecycle', detail: 'Published to AD runtime and AI Studio' });
    return true;
  }, [agents, patchAgent, addAudit]);

  // ---------------------------------------------------------------- F3
  const recordHarnessRun = useCallback((run) => {
    const id = run.id || newId('run');
    setHarnessRuns((prev) => [{ ...run, id }, ...prev.filter((r) => r.id !== id)]);
    return id;
  }, []);

  const updateHarnessRun = useCallback((runId, patch) => {
    setHarnessRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...(typeof patch === 'function' ? patch(r) : patch) } : r)));
  }, []);

  const approveHarnessRun = useCallback((runId, actor = CURRENT_USER) => {
    setHarnessRuns((prev) => prev.map((r) => {
      if (r.id !== runId) return r;
      return {
        ...r,
        status: 'completed',
        approver: actor,
        steps: r.steps.map((s) => (s.key === 'human' ? { ...s, status: 'passed', detail: `Approved by ${actor}` } : s)),
        log: [...r.log, { t: nowIso(), level: 'INFO', msg: `Approved by ${actor} — run completed` }]
      };
    }));
    const run = harnessRuns.find((r) => r.id === runId);
    addAudit({ action: 'Harness run approved', agentId: run?.agentId, actor, type: 'harness', detail: `Run ${runId} released` });
  }, [harnessRuns, addAudit]);

  // ---------------------------------------------------------------- Workflows
  const saveWorkflow = useCallback((workflow) => {
    const id = workflow.id || `WF-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const ts = nowIso();
    setWorkflows((prev) => {
      const existing = prev.find((w) => w.id === id);
      const saved = { ...existing, ...workflow, id, source: workflow.source || 'Custom', createdAt: existing?.createdAt || workflow.createdAt || ts, updatedAt: ts };
      return existing ? prev.map((w) => (w.id === id ? saved : w)) : [saved, ...prev];
    });
    addAudit({ action: 'Workflow saved', type: 'workflow', detail: `${workflow.name} (${id})` });
    return id;
  }, [addAudit]);

  const recordWorkflowRun = useCallback((run) => {
    setWorkflowRuns((prev) => [run, ...prev.filter((r) => r.id !== run.id)]);
    addAudit({ action: 'Workflow run started', type: 'workflow', detail: `${run.title} → ${run.status}` });
  }, [addAudit]);

  /** Approve resumes the run after the gate; reject ends it. Returns the updated run. */
  const decideWorkflowApproval = useCallback((runId, approve, actor = CURRENT_USER) => {
    const run = workflowRuns.find((r) => r.id === runId);
    if (!run || run.status !== WF_RUN_STATUS.AWAITING_APPROVAL) return null;
    const next = approve
      ? settleRun({ ...run, approvedStepIndexes: [...run.approvedStepIndexes, run.pendingApprovalIndex], decidedBy: actor }, run.pendingApprovalIndex + 1)
      : { ...run, status: WF_RUN_STATUS.REJECTED, decidedBy: actor };
    setWorkflowRuns((prev) => prev.map((r) => (r.id === runId ? next : r)));
    addAudit({ action: approve ? 'Workflow gate approved' : 'Workflow gate rejected', actor, type: 'workflow', detail: run.title });
    return next;
  }, [workflowRuns, addAudit]);

  // ---------------------------------------------------------------- navigation
  const navigate = useCallback(({ tab, agentId = null, view = null }) => {
    if (agentId) setFocusAgentId(agentId);
    if (view) setPendingCatalogueView(view);
    if (tab && onNavigate) onNavigate(tab);
  }, [onNavigate]);

  /** Opens AI Studio → Workflows with a saved workflow, or a new one seeded with an agent. */
  const openWorkflow = useCallback(({ workflowId = null, withAgentId = null, create = false }) => {
    setWorkflowRequest({ workflowId, withAgentId, create, token: Date.now() });
    setPendingCatalogueView('workflows');
    if (onNavigate) onNavigate('agents');
  }, [onNavigate]);

  const consumeWorkflowRequest = useCallback(() => setWorkflowRequest(null), []);

  const consumeCatalogueView = useCallback(() => {
    const v = pendingCatalogueView;
    if (v) setPendingCatalogueView(null);
    return v;
  }, [pendingCatalogueView]);

  const value = useMemo(() => ({
    currentUser: CURRENT_USER,
    agents, audit, harnessRuns, threshold, rules,
    getAgent, blockersFor, policyChecks, mandatoryFailures,
    registerAgent, updateAgent, verifyRuntime, advanceStage, setStage, setOperationalState,
    runEvaluation, setThreshold, toggleRule, updateRule, addRules,
    decideGovernance, rescanCompliance, issueCertificate, publishAgent,
    recordHarnessRun, updateHarnessRun, approveHarnessRun,
    workflows, workflowRuns, saveWorkflow, recordWorkflowRun, decideWorkflowApproval,
    workflowRequest, openWorkflow, consumeWorkflowRequest,
    addAudit,
    focusAgentId, setFocusAgentId, pendingCatalogueView, consumeCatalogueView, navigate
  }), [
    workflows, workflowRuns, saveWorkflow, recordWorkflowRun, decideWorkflowApproval,
    workflowRequest, openWorkflow, consumeWorkflowRequest,
    agents, audit, harnessRuns, threshold, rules,
    getAgent, blockersFor, policyChecks, mandatoryFailures,
    registerAgent, updateAgent, verifyRuntime, advanceStage, setStage, setOperationalState,
    runEvaluation, toggleRule, updateRule, addRules,
    decideGovernance, rescanCompliance, issueCertificate, publishAgent,
    recordHarnessRun, updateHarnessRun, approveHarnessRun,
    addAudit,
    focusAgentId, pendingCatalogueView, consumeCatalogueView, navigate
  ]);

  return <AgentStudioContext.Provider value={value}>{children}</AgentStudioContext.Provider>;
}

