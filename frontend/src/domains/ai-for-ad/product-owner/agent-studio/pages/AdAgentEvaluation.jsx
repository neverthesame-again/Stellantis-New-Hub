import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gauge, Cpu, Rocket, ListChecks, BarChart3, CheckCircle2, XCircle, Filter, Eye, EyeOff, X } from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import { AD_SUBDOMAINS, EVAL_DIMENSIONS, applyRules, getStage } from '../agentStudioData';
import { aggregateDimensions, summarizeAgent } from '../components/evaluation/evalUtils';
import EvalKpis from '../components/evaluation/EvalKpis';
import Leaderboard from '../components/evaluation/Leaderboard';
import AgentEvaluationPanel from '../components/evaluation/AgentEvaluationPanel';
import { RecentRuns, ActivityFeed } from '../components/evaluation/EvalSidebar';
import PlatformAggregates from '../components/evaluation/PlatformAggregates';
import RulesTable from '../components/evaluation/RulesTable';
import RulePackUpload from '../components/evaluation/RulePackUpload';
import '../adAgentStudio.css';
import '../adAgentEvaluation.css';

/** Per-dimension scoring tick: 8 dimensions + 1 "apply rules" tick ≈ 1.4 s. */
const RUN_STEP_MS = 155;
const TOAST_MS = 5200;

/**
 * F5 — Evaluation Center (AI for AD · Product Owner).
 * Scores AD agents on 8 automotive quality dimensions against the live pass
 * threshold and blocking rules; passing at stage 5 routes to governance.
 */
export default function AdAgentEvaluation() {
  const {
    agents, audit, threshold, setThreshold, rules, toggleRule, updateRule, addRules,
    runEvaluation, focusAgentId, setFocusAgentId, navigate
  } = useAgentStudio();

  const [tab, setTab] = useState('evaluations');
  const [subDomain, setSubDomain] = useState('all');
  const [showNotEvaluated, setShowNotEvaluated] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [running, setRunning] = useState(null); // { agentId, step }
  const [toast, setToast] = useState(null); // { text, kind }

  const timers = useRef([]);
  const toastTimer = useRef(null);
  const runRef = useRef(runEvaluation);
  useEffect(() => { runRef.current = runEvaluation; }, [runEvaluation]);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((text, kind = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ text, kind });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  // ---------------------------------------------------------------- derived
  const agentsById = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, a])), [agents]);

  const summaries = useMemo(
    () => Object.fromEntries(agents.map((a) => [a.id, summarizeAgent(a, rules, threshold)])),
    [agents, rules, threshold]
  );

  const ranked = useMemo(() => {
    const evaluated = agents
      .filter((a) => a.evaluation)
      .sort((a, b) => b.evaluation.score - a.evaluation.score || a.name.localeCompare(b.name));
    const pending = agents.filter((a) => !a.evaluation).sort((a, b) => b.stage - a.stage || a.name.localeCompare(b.name));
    return [
      ...evaluated.map((a, i) => ({ agent: a, summary: summaries[a.id], rank: i + 1 })),
      ...pending.map((a) => ({ agent: a, summary: summaries[a.id], rank: null }))
    ];
  }, [agents, summaries]);

  const rows = useMemo(
    () => ranked.filter(({ agent, summary }) =>
      (subDomain === 'all' || agent.subDomain === subDomain) && (showNotEvaluated || summary.evaluated)),
    [ranked, subDomain, showNotEvaluated]
  );

  const readyAgents = useMemo(
    () => agents.filter((a) => a.stage === 5 && !summaries[a.id].pass),
    [agents, summaries]
  );

  const stats = useMemo(() => {
    const evaluated = agents.filter((a) => a.evaluation);
    const sums = evaluated.map((a) => summaries[a.id]);
    return {
      total: agents.length,
      evaluated: evaluated.length,
      avgScore: evaluated.length
        ? Math.round((evaluated.reduce((s, a) => s + a.evaluation.score, 0) / evaluated.length) * 10) / 10
        : null,
      totalRuns: evaluated.reduce((s, a) => s + (a.evaluation.runs || 0), 0),
      failing: sums.filter((s) => !s.pass).length,
      violations: sums.reduce((n, s) => n + s.blocking.length, 0),
      violatingAgents: sums.filter((s) => s.blocking.length).length,
      advisories: sums.reduce((n, s) => n + s.advisory.length, 0),
      ready: readyAgents.length
    };
  }, [agents, summaries, readyAgents]);

  const aggregates = useMemo(() => aggregateDimensions(agents), [agents]);
  const platformDims = useMemo(
    () => (stats.evaluated ? Object.fromEntries(aggregates.map((d) => [d.key, d.avg])) : null),
    [aggregates, stats.evaluated]
  );

  const enabledRuleCount = rules.filter((r) => r.enabled).length;

  // ---------------------------------------------------------------- selection
  // Deep link from another tab: adopt the focused agent during render, then clear it in the context.
  const [adoptedFocus, setAdoptedFocus] = useState(null);
  if (focusAgentId && focusAgentId !== adoptedFocus) {
    setAdoptedFocus(focusAgentId);
    if (agentsById[focusAgentId]) {
      setSelectedId(focusAgentId);
      setTab('evaluations');
    }
  } else if (!focusAgentId && adoptedFocus) {
    setAdoptedFocus(null);
  }
  useEffect(() => {
    if (focusAgentId) setFocusAgentId(null);
  }, [focusAgentId, setFocusAgentId]);

  const defaultId = agents.find((a) => a.stage === 5)?.id || ranked[0]?.agent.id || null;
  const selected = agentsById[selectedId] || agentsById[defaultId] || null;

  // ---------------------------------------------------------------- run
  const handleRun = useCallback((agent) => {
    if (running) return;
    const prevStage = agent.stage;
    const agentId = agent.id;
    setSelectedId(agentId);
    setRunning({ agentId, step: 0 });
    timers.current = EVAL_DIMENSIONS.map((_, i) =>
      setTimeout(() => setRunning({ agentId, step: i + 1 }), (i + 1) * RUN_STEP_MS));
    timers.current.push(setTimeout(() => {
      const res = runRef.current(agentId);
      setRunning(null);
      if (!res) {
        showToast('Evaluation could not be started — agent not found', 'error');
        return;
      }
      const { evaluation, pass, stage } = res;
      const failures = applyRules(agent, evaluation, rules, threshold).filter((o) => !o.pass && o.rule.blocking);
      const scoreText = `${evaluation.score}/100`;
      let text;
      if (pass && prevStage === 5 && stage === 6) {
        text = `${agent.name} passed (${scoreText}) — moved to Evaluated, routed to governance${agent.approver ? ` (${agent.approver})` : ''}`;
      } else if (pass) {
        text = `${agent.name} passed (${scoreText}) — lifecycle unchanged at ${getStage(stage).label}`;
      } else {
        const why = failures.length
          ? `${failures.length} blocking violation${failures.length === 1 ? '' : 's'}: ${failures.map((f) => f.rule.name).join(', ')}`
          : 'below threshold';
        text = stage !== prevStage
          ? `${agent.name} failed (${scoreText}, ${why}) — moved back to ${getStage(stage).label}`
          : `${agent.name} failed (${scoreText}, ${why}) — lifecycle unchanged`;
      }
      showToast(text, pass ? 'success' : 'error');
    }, (EVAL_DIMENSIONS.length + 1) * RUN_STEP_MS));
  }, [running, rules, threshold, showToast]);

  const selectReady = () => {
    if (readyAgents[0]) {
      setSelectedId(readyAgents[0].id);
      if (subDomain !== 'all' && readyAgents[0].subDomain !== subDomain) setSubDomain('all');
    }
  };

  // ---------------------------------------------------------------- render
  return (
    <div className="ad-studio-scope ad-eval-page">
      <header className="ad-studio-header">
        <div className="ad-studio-header-title">
          <div className="ad-studio-header-icon"><Gauge size={20} /></div>
          <div>
            <span className="ad-studio-eyebrow">Quality Assurance</span>
            <h2>Evaluation Center <span className="ad-studio-badge is-mono">ISO 26262 · ASPICE · SOTIF</span></h2>
            <p>Score AD agents against automotive quality dimensions and blocking rules — only agents that clear the bar move to governance.</p>
          </div>
        </div>
        <div className="ad-studio-header-actions">
          <button type="button" className="ad-studio-btn" onClick={() => navigate({ tab: 'harness', agentId: selected?.id })}>
            <Cpu size={13} /> AI Harness
          </button>
          <button type="button" className="ad-studio-btn is-primary" onClick={() => navigate({ tab: 'agents', agentId: selected?.id, view: 'onboarding' })}>
            <Rocket size={13} /> Onboarding Studio
          </button>
        </div>
      </header>

      <div className="ad-eval-tabs" role="tablist" aria-label="Evaluation Center sections">
        <button type="button" role="tab" aria-selected={tab === 'evaluations'} className={`ad-eval-tab ${tab === 'evaluations' ? 'is-active' : ''}`} onClick={() => setTab('evaluations')}>
          <BarChart3 size={13} /> Agent Evaluations
          <span className="ad-eval-tab-badge">{stats.evaluated}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'rules'} className={`ad-eval-tab ${tab === 'rules' ? 'is-active' : ''}`} onClick={() => setTab('rules')}>
          <ListChecks size={13} /> Rules &amp; Guardrails
          <span className="ad-eval-tab-badge">{enabledRuleCount}</span>
        </button>
      </div>

      <EvalKpis stats={stats} threshold={threshold} onThreshold={setThreshold} onSelectReady={selectReady} />

      {tab === 'evaluations' ? (
        <>
          <div className="ad-eval-filters">
            <span className="ad-studio-label"><Filter size={11} /> Sub-domain</span>
            <div className="ad-eval-filter-chips">
              {['all', ...AD_SUBDOMAINS].map((s) => {
                const count = s === 'all' ? agents.length : agents.filter((a) => a.subDomain === s).length;
                return (
                  <button key={s} type="button" className={`ad-studio-chip ${subDomain === s ? 'is-selected' : ''}`} onClick={() => setSubDomain(s)}>
                    {s === 'all' ? 'All sub-domains' : s}
                    <span className="ad-eval-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className={`ad-studio-chip ad-eval-toggle ${showNotEvaluated ? 'is-selected' : ''}`}
              onClick={() => setShowNotEvaluated((v) => !v)}
              aria-pressed={showNotEvaluated}
            >
              {showNotEvaluated ? <Eye size={12} /> : <EyeOff size={12} />} Show not evaluated
            </button>
          </div>

          <div className="ad-studio-split-3">
            <Leaderboard
              rows={rows}
              totalCount={agents.length}
              selectedId={selected?.id}
              onSelect={setSelectedId}
              threshold={threshold}
              runningId={running?.agentId}
            />
            <AgentEvaluationPanel
              agent={selected}
              summary={selected ? summaries[selected.id] : null}
              threshold={threshold}
              rules={rules}
              running={running && running.agentId === selected?.id ? running.step : null}
              runDisabled={Boolean(running)}
              onRun={handleRun}
              onNavigate={navigate}
              platformDims={platformDims}
            />
            <div className="ad-eval-side">
              <RecentRuns audit={audit} agentsById={agentsById} threshold={threshold} selectedId={selected?.id} onSelect={setSelectedId} />
              <ActivityFeed audit={audit} agentsById={agentsById} />
            </div>
          </div>

          <PlatformAggregates aggregates={aggregates} threshold={threshold} evaluatedCount={stats.evaluated} />
        </>
      ) : (
        <div className="ad-eval-rules-layout">
          <RulesTable rules={rules} agents={agents} threshold={threshold} onToggle={toggleRule} onUpdate={updateRule} />
          <RulePackUpload rules={rules} addRules={addRules} onToast={showToast} />
        </div>
      )}

      {toast && (
        <div className={`ad-studio-toast ${toast.kind === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
          {toast.kind === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} className="ad-eval-toast-ok" />}
          <span>{toast.text}</span>
          <button type="button" className="ad-eval-toast-close" onClick={() => setToast(null)} aria-label="Dismiss"><X size={13} /></button>
        </div>
      )}
    </div>
  );
}
