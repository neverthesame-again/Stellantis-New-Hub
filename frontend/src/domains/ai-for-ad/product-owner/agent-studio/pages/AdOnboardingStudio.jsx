import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Rocket, Plus, Car, Lock, PauseCircle, Save, ArrowRight, Undo2, X, Sparkles,
  CircleCheck, TriangleAlert, Info, UserRound
} from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import { getStage, formatDateTime } from '../agentStudioData';
import StudioKpis from '../components/onboarding/StudioKpis';
import SkillLibraryStrip from '../components/onboarding/SkillLibraryStrip';
import AgentList from '../components/onboarding/AgentList';
import LifecyclePanel from '../components/onboarding/LifecyclePanel';
import IdentitySection from '../components/onboarding/IdentitySection';
import RuntimeSection from '../components/onboarding/RuntimeSection';
import { SkillsSection, KnowledgeSection, ToolsSection, WorkflowsSection } from '../components/onboarding/CapabilitySections';
import { EvaluationPreview, GovernanceSection } from '../components/onboarding/EvalGovernanceSections';
import { SectionNav } from '../components/onboarding/FormSection';
import {
  draftFromAgent, newRegistrationDraft, sameDraft, sameRuntimeConfig, changedFields,
  validateDraft, normaliseDraft, getRuntime, defaultHealthUrl, isLocked, nextStageOf,
  scrollToSection, FIELD_LABELS
} from '../components/onboarding/onboardingHelpers';
import '../adAgentStudio.css';
import '../adOnboardingStudio.css';

/**
 * F1 + F2 — Agent Onboarding Studio (AI for AD · Product Owner).
 *
 * Registers AD agents on SEL, AWS Bedrock, Azure AI Foundry or external
 * runtimes, binds skills / knowledge / tools / workflows and tracks each agent
 * through the 9-stage lifecycle. Rendered inside the Agent & Workflow Catalogue.
 *
 * Props:
 *  - registerRequest: truthy token → open a fresh registration draft
 *  - onRegisterRequestHandled: called once the request has been consumed
 */
export default function AdOnboardingStudio({ registerRequest = null, onRegisterRequestHandled }) {
  const {
    agents, audit, threshold, blockersFor, mandatoryFailures,
    registerAgent, updateAgent, verifyRuntime, advanceStage, publishAgent, addAudit,
    focusAgentId, setFocusAgentId, navigate
  } = useAgentStudio();

  const [selectedId, setSelectedId] = useState(() => focusAgentId || agents[0]?.id || null);
  const [mode, setMode] = useState(registerRequest ? 'new' : 'edit');
  const [returnToId, setReturnToId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [newDraft, setNewDraft] = useState(newRegistrationDraft);
  const [touched, setTouched] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [toast, setToast] = useState(null);

  // ------------------------------------------------------------------ toast
  const notify = useCallback((msg, tone = 'info') => setToast({ msg, tone, key: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ------------------------------------------------------------------ external requests
  const startNewRegistration = useCallback(() => {
    setReturnToId(selectedId);
    setMode('new');
    setNewDraft(newRegistrationDraft());
    setTouched({});
    setShowErrors(false);
  }, [selectedId]);

  useEffect(() => {
    if (!registerRequest) return;
    startNewRegistration();
    onRegisterRequestHandled?.();
    // Only react to a new request token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRequest]);

  useEffect(() => {
    if (!focusAgentId) return;
    if (agents.some((a) => a.id === focusAgentId)) {
      setSelectedId(focusAgentId);
      setMode('edit');
    }
    setFocusAgentId(null);
  }, [focusAgentId, agents, setFocusAgentId]);

  // ------------------------------------------------------------------ derived state
  const isNew = mode === 'new';
  const agent = isNew ? null : (agents.find((a) => a.id === selectedId) || agents[0] || null);
  const baseDraft = useMemo(() => (agent ? draftFromAgent(agent) : null), [agent]);
  const draft = isNew ? newDraft : (agent ? (drafts[agent.id] || baseDraft) : null);
  const dirty = Boolean(!isNew && agent && drafts[agent.id] && !sameDraft(drafts[agent.id], baseDraft));
  const locked = isLocked(agent);
  const editable = isNew || (agent && !locked);

  const dirtyIds = useMemo(() => Object.keys(drafts).filter((id) => {
    const a = agents.find((x) => x.id === id);
    return a && !sameDraft(drafts[id], draftFromAgent(a));
  }), [drafts, agents]);

  const errors = useMemo(() => (draft ? validateDraft(draft, agents, agent?.id) : {}), [draft, agents, agent]);
  const visibleErrors = Object.fromEntries(Object.entries(errors).filter(([k]) => showErrors || touched[k]));
  const blockers = agent ? blockersFor(agent) : [];
  const configChanged = Boolean(agent && draft && !sameRuntimeConfig(draft.runtime, baseDraft.runtime));

  // ------------------------------------------------------------------ draft editing
  const updateDraft = useCallback((fn) => {
    if (isNew) {
      setNewDraft((d) => fn(d));
    } else if (agent) {
      setDrafts((prev) => ({ ...prev, [agent.id]: fn(prev[agent.id] || baseDraft) }));
    }
  }, [isNew, agent, baseDraft]);

  const onField = (key, value) => updateDraft((d) => ({ ...d, [key]: value }));
  const onBlur = (key) => setTouched((t) => (t[key] ? t : { ...t, [key]: true }));
  const toggleIn = (key) => (id) => updateDraft((d) => ({
    ...d,
    [key]: d[key].includes(id) ? d[key].filter((x) => x !== id) : [...d[key], id]
  }));
  const onSelectRuntime = (type) => {
    if (draft.runtime.type === type) return;
    const rt = getRuntime(type);
    updateDraft((d) => ({ ...d, runtime: { type, baseUrl: rt.defaultBaseUrl, agentId: '', healthUrl: defaultHealthUrl(type) } }));
  };
  const onRuntimeField = (key, value) => updateDraft((d) => ({ ...d, runtime: { ...d.runtime, [key]: value } }));

  const errorSummary = (errs) => Object.keys(errs).map((k) => FIELD_LABELS[k] || k).join(', ');

  // ------------------------------------------------------------------ actions
  const handleSelect = (id) => {
    setSelectedId(id);
    setMode('edit');
    setShowErrors(false);
    setTouched({});
  };

  const handleSave = () => {
    if (!agent || !dirty) return;
    if (Object.keys(errors).length) {
      setShowErrors(true);
      notify(`Fix before saving: ${errorSummary(errors)}`, 'error');
      scrollToSection('identity');
      return;
    }
    const clean = normaliseDraft(draft);
    const changed = changedFields(baseDraft, clean);
    const rtChanged = !sameRuntimeConfig(clean.runtime, baseDraft.runtime);
    updateAgent(agent.id, (a) => ({
      ...clean,
      runtime: rtChanged ? { ...a.runtime, ...clean.runtime, status: 'unverified', latencyMs: null } : a.runtime
    }));
    addAudit({ action: 'Registration updated', agentId: agent.id, detail: `Changed: ${changed.join(', ') || '—'}` });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[agent.id];
      return next;
    });
    setShowErrors(false);
    setTouched({});
    notify(rtChanged
      ? `Saved ${clean.name} — runtime endpoint changed, verify the connection again`
      : `Registration saved · ${changed.length} field${changed.length === 1 ? '' : 's'} updated`, 'success');
  };

  const handleDiscard = () => {
    if (!agent) return;
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[agent.id];
      return next;
    });
    setShowErrors(false);
    setTouched({});
    notify('Unsaved changes discarded');
  };

  const handleVerify = async () => {
    if (!agent) return;
    const id = agent.id;
    const name = agent.name;
    if (configChanged) {
      const cfg = normaliseDraft(draft).runtime;
      updateAgent(id, (a) => ({ runtime: { ...a.runtime, ...cfg } }));
      setDrafts((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], runtime: cfg } } : prev));
      addAudit({ action: 'Runtime reconfigured', agentId: id, detail: `${getRuntime(cfg.type).label} · ${cfg.baseUrl}` });
    }
    setVerifyingId(id);
    const res = await verifyRuntime(id);
    setVerifyingId(null);
    if (res.ok) notify(`Runtime connected — ${name} answered the health check in ${res.latencyMs} ms`, 'success');
    else notify(`Health check failed for ${name}: an https:// base URL and ${getRuntime(draft.runtime.type).idLabel} are required`, 'error');
  };

  const handleAdvance = () => {
    if (!agent) return;
    if (dirty) {
      notify('Save the registration before advancing', 'error');
      return;
    }
    const res = advanceStage(agent.id);
    if (res.ok) notify(`${agent.name} advanced to ${getStage(res.stage).label} (${res.stage}/9)`, 'success');
    else notify(`Cannot advance yet — ${res.blockers.join(' · ')}`, 'error');
  };

  const handlePublish = () => {
    if (!agent) return;
    if (publishAgent(agent.id)) notify(`${agent.name} published to the AD runtime and catalogue`, 'success');
    else notify('Only certified agents (stage 8) can be published', 'error');
  };

  const handleRegister = () => {
    if (Object.keys(errors).length) {
      setShowErrors(true);
      notify(`Complete the required fields: ${errorSummary(errors)}`, 'error');
      scrollToSection('identity');
      return;
    }
    const clean = normaliseDraft(newDraft);
    const id = registerAgent({ ...clean, runtime: { ...clean.runtime, status: 'unverified', latencyMs: null } });
    setSelectedId(id);
    setMode('edit');
    setNewDraft(newRegistrationDraft());
    setShowErrors(false);
    setTouched({});
    notify(`Registered ${clean.name} — stage 1 · Registered. Next: verify the runtime connection.`, 'success');
  };

  const handleCancelNew = () => {
    setMode('edit');
    setSelectedId(returnToId && agents.some((a) => a.id === returnToId) ? returnToId : agents[0]?.id || null);
    setShowErrors(false);
    setTouched({});
  };

  const goTo = (tab) => agent && navigate({ tab, agentId: agent.id });

  // ------------------------------------------------------------------ render helpers
  const sectionNav = draft ? [
    { key: 'identity', label: 'Identity', complete: !['name', 'program', 'team', 'owner', 'purpose', 'asil', 'subDomain', 'version'].some((k) => errors[k]) },
    { key: 'runtime', label: 'Runtime', complete: Boolean(agent && agent.runtime.status === 'connected' && !configChanged) },
    { key: 'skills', label: 'Skills', complete: draft.skills.length > 0 },
    { key: 'knowledge', label: 'Knowledge', complete: draft.knowledge.length > 0 },
    { key: 'tools', label: 'Tools', complete: draft.tools.length > 0 },
    { key: 'workflows', label: 'Workflows', complete: draft.workflows.length > 0 },
    { key: 'evaluation', label: 'Evaluation', complete: Boolean(agent?.evaluation && !agent.evaluation.failed) },
    { key: 'governance', label: 'Governance', complete: Boolean(draft.approver) }
  ] : [];

  const next = nextStageOf(agent);
  const errorCount = Object.keys(errors).length;

  return (
    <div className="ad-studio-scope ad-onb-page">
      {toast && (
        <div key={toast.key} className={`ad-studio-toast ${toast.tone === 'error' ? 'is-error' : ''}`} role="status">
          {toast.tone === 'error' ? <TriangleAlert size={14} /> : toast.tone === 'success' ? <CircleCheck size={14} /> : <Info size={14} />}
          <span>{toast.msg}</span>
          <button type="button" className="ad-onb-toast-close" onClick={() => setToast(null)} aria-label="Dismiss"><X size={12} /></button>
        </div>
      )}

      {/* ---------------------------------------------------------------- header */}
      <header className="ad-studio-header">
        <div className="ad-studio-header-title">
          <div className="ad-studio-header-icon"><Rocket size={20} /></div>
          <div>
            <span className="ad-studio-eyebrow">Agent Onboarding Studio</span>
            <h2>
              Onboard, connect &amp; certify AD agents
              <span className="ad-studio-badge is-mono is-purple">ISO 26262 · ASPICE · SOTIF</span>
            </h2>
            <p>Register AD agents on SEL, AWS Bedrock, Azure AI Foundry or external runtimes — scoped to vehicle programs and gated by ISO 26262 / ASPICE.</p>
          </div>
        </div>
        <div className="ad-studio-header-actions">
          <span className="ad-onb-user"><UserRound size={12} /> Carl Weber · Product Owner</span>
          <button type="button" className="ad-studio-btn is-primary" onClick={startNewRegistration} disabled={isNew}>
            <Plus size={14} /> Register Agent
          </button>
        </div>
      </header>

      <StudioKpis agents={agents} />

      <SkillLibraryStrip
        agents={agents}
        attached={draft?.skills || []}
        canAttach={Boolean(editable && draft)}
        targetName={draft?.name || 'the new agent'}
        onToggle={toggleIn('skills')}
      />

      <div className="ad-studio-split ad-onb-split">
        <AgentList agents={agents} selectedId={agent?.id} newMode={isNew} dirtyIds={dirtyIds} onSelect={handleSelect} />

        <div className="ad-onb-workspace">
          {!draft ? (
            <div className="ad-studio-card">
              <div className="ad-studio-empty">
                No agents in the studio yet.
                <div className="ad-onb-mt">
                  <button type="button" className="ad-studio-btn is-primary" onClick={startNewRegistration}><Plus size={13} /> Register the first agent</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ------------------------------------------------ workspace header */}
              <section className="ad-studio-card ad-onb-ws-head">
                <div className="ad-onb-ws-icon">{isNew ? <Sparkles size={18} /> : <Car size={18} />}</div>
                <div className="ad-onb-ws-titles">
                  <span className="ad-studio-eyebrow">{isNew ? 'New registration' : 'Agent workspace'}</span>
                  <h3>{draft.name.trim() || 'Untitled agent'}</h3>
                  <div className="ad-studio-agent-item-tags">
                    {draft.asil && <span className={`ad-studio-badge ad-studio-asil asil-${draft.asil}`}>ASIL {draft.asil}</span>}
                    <span className="ad-studio-badge is-mono is-info">{getRuntime(draft.runtime.type).label}</span>
                    {draft.version && <span className="ad-studio-badge is-mono">v{draft.version}</span>}
                    {draft.subDomain && <span className="ad-studio-badge">{draft.subDomain}</span>}
                    {agent && (
                      <span className={`ad-studio-badge ${agent.operationalState === 'Active' ? 'is-success' : agent.operationalState === 'Suspended' ? 'is-critical' : 'is-warning'}`}>
                        {agent.operationalState}
                      </span>
                    )}
                    {agent && !agent.catalogueId && <span className="ad-studio-badge is-purple">Studio-only</span>}
                  </div>
                </div>
                <div className="ad-onb-ws-meta">
                  {agent ? (
                    <>
                      <span className="ad-onb-mono">{agent.id}</span>
                      <span>Owner {agent.owner || '—'}</span>
                      <span>Registered {formatDateTime(agent.createdAt)}</span>
                      <span>Updated {formatDateTime(agent.updatedAt)}</span>
                    </>
                  ) : (
                    <>
                      <span>Stage 0 → 1 · Registered</span>
                      <span>{errorCount ? `${errorCount} required item${errorCount === 1 ? '' : 's'} open` : 'Ready to register'}</span>
                    </>
                  )}
                </div>
              </section>

              {agent?.operationalState === 'Suspended' && (
                <div className="ad-onb-banner is-bad">
                  <PauseCircle size={15} />
                  <span><strong>Suspended by governance.</strong> {agent.governance?.comment || 'Execution paused in the AD runtime.'} Re-evaluation is required before reactivation.</span>
                </div>
              )}

              {agent && (
                <LifecyclePanel
                  agent={agent}
                  blockers={blockers}
                  threshold={threshold}
                  audit={audit}
                  dirty={dirty}
                  onAdvance={handleAdvance}
                  onPublish={handlePublish}
                  onNavigate={goTo}
                  onJump={scrollToSection}
                />
              )}

              {isNew && (
                <div className="ad-onb-banner is-info">
                  <Info size={15} />
                  <span>Registration creates the agent at <strong>stage 1 · Registered</strong>. Runtime verification, skills, tools and workflow mapping move it through stages 2–5 before the Evaluation Center and Governance Center take over.</span>
                </div>
              )}

              {locked && (
                <div className="ad-onb-banner is-lock">
                  <Lock size={15} />
                  <span><strong>Version frozen by certificate {agent.certificateId || '—'}.</strong> v{agent.version} is read-only; register a new version to change identity, runtime or bindings.</span>
                </div>
              )}

              <SectionNav items={sectionNav} />

              <fieldset className="ad-onb-fieldset" disabled={locked}>
                <IdentitySection index={1} draft={draft} errors={visibleErrors} onField={onField} onBlur={onBlur} />
                <RuntimeSection
                  index={2}
                  runtime={draft.runtime}
                  live={agent?.runtime}
                  isNew={isNew}
                  configChanged={configChanged}
                  verifying={Boolean(agent && verifyingId === agent.id)}
                  onSelectRuntime={onSelectRuntime}
                  onRuntimeField={onRuntimeField}
                  onVerify={handleVerify}
                />
                <SkillsSection index={3} selected={draft.skills} onToggle={toggleIn('skills')} />
                <KnowledgeSection index={4} selected={draft.knowledge} asil={draft.asil} onToggle={toggleIn('knowledge')} />
                <ToolsSection index={5} selected={draft.tools} onToggle={toggleIn('tools')} />
                <WorkflowsSection index={6} selected={draft.workflows} agents={agents} selfId={agent?.id} onToggle={toggleIn('workflows')} />
              </fieldset>

              <EvaluationPreview index={7} agent={agent} threshold={threshold} onNavigate={agent ? goTo : null} />
              <GovernanceSection
                index={8}
                agent={agent}
                approver={draft.approver}
                asil={draft.asil}
                disabled={locked}
                failures={agent ? mandatoryFailures({ ...agent, approver: draft.approver }) : null}
                onApprover={(v) => onField('approver', v)}
                onNavigate={agent ? goTo : null}
              />

              {/* ------------------------------------------------ sticky footer */}
              <div className="ad-onb-footer">
                {isNew ? (
                  <>
                    <span className="ad-onb-footer-status">
                      <span className={`ad-onb-status-dot ${errorCount ? 'is-warn' : 'is-good'}`} />
                      {errorCount ? `${errorCount} item${errorCount === 1 ? '' : 's'} to complete` : 'Ready to register'}
                    </span>
                    <div className="ad-onb-footer-actions">
                      <button type="button" className="ad-studio-btn is-ghost" onClick={handleCancelNew}>Cancel</button>
                      <button type="button" className="ad-studio-btn is-primary" onClick={handleRegister}><Plus size={13} /> Register agent</button>
                    </div>
                  </>
                ) : locked ? (
                  <>
                    <span className="ad-onb-footer-status"><Lock size={12} /> Read-only · certified version</span>
                    <div className="ad-onb-footer-actions">
                      {agent.stage === 8 && (
                        <button type="button" className="ad-studio-btn is-primary" onClick={handlePublish}><Rocket size={13} /> Publish to AD runtime</button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="ad-onb-footer-status">
                      <span className={`ad-onb-status-dot ${dirty ? 'is-warn' : 'is-good'}`} />
                      {dirty ? 'Unsaved changes' : `All changes saved · ${formatDateTime(agent.updatedAt)}`}
                    </span>
                    <div className="ad-onb-footer-actions">
                      {dirty && <button type="button" className="ad-studio-btn is-ghost" onClick={handleDiscard}><Undo2 size={13} /> Discard</button>}
                      <button type="button" className="ad-studio-btn is-primary" onClick={handleSave} disabled={!dirty}><Save size={13} /> Save registration</button>
                      {next && (
                        <button type="button" className="ad-studio-btn is-good" onClick={handleAdvance} disabled={dirty} title={dirty ? 'Save the registration before advancing' : undefined}>
                          Advance to {next.label} <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
