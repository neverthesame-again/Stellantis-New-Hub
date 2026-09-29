import React, { useState } from 'react';
import { Blocks, Database, Wrench, Workflow, Check, Recycle, TriangleAlert, BadgeCheck } from 'lucide-react';
import { SKILL_LIBRARY, KNOWLEDGE_SOURCES, TOOLS, WORKFLOWS } from '../../agentStudioData';
import { FormSection } from './FormSection';
import { formatCount } from './onboardingHelpers';

const SKILL_CATS = ['All', ...Array.from(new Set(SKILL_LIBRARY.map((s) => s.category)))];
const TOOL_CATS = Array.from(new Set(TOOLS.map((t) => t.category)));
const MAX_TOOL_GRANTS = 6; // Cybersecurity guardrail (ISO/SAE 21434 least privilege)

const countBadge = (n, noun) => (
  <span className={`ad-studio-badge ${n ? 'is-success' : ''}`}>{n} {noun}{n === 1 ? '' : 's'}</span>
);

/** Section 03 — certified skills. */
export function SkillsSection({ index, selected, onToggle }) {
  const [cat, setCat] = useState('All');
  const list = SKILL_LIBRARY.filter((s) => cat === 'All' || s.category === cat);
  return (
    <FormSection
      id="skills"
      index={index}
      icon={Blocks}
      title="Certified skills"
      subtitle="Reuse skills certified on other AD agents instead of re-building them. Reuse counts feed the skill economy KPI."
      aside={countBadge(selected.length, 'skill')}
    >
      <div className="ad-onb-chip-row">
        {SKILL_CATS.map((c) => (
          <button key={c} type="button" className={`ad-studio-chip ad-onb-chip-sm ${cat === c ? 'is-selected' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="ad-onb-pick-grid">
        {list.map((s) => {
          const on = selected.includes(s.id);
          return (
            <button key={s.id} type="button" className={`ad-onb-pick ${on ? 'is-selected' : ''}`} onClick={() => onToggle(s.id)} aria-pressed={on}>
              <span className="ad-onb-pick-head">
                <strong>{s.name}</strong>
                <span className="ad-onb-pick-check">{on && <Check size={11} strokeWidth={3} />}</span>
              </span>
              <span className="ad-onb-pick-meta"><BadgeCheck size={11} /> from {s.sourceAgent}</span>
              <span className="ad-onb-pick-tags">
                <span className="ad-studio-badge is-purple ad-onb-badge-xs">{s.category}</span>
                <span className="ad-studio-badge is-mono ad-onb-badge-xs"><Recycle size={9} /> ×{s.reuse}</span>
              </span>
            </button>
          );
        })}
      </div>
    </FormSection>
  );
}

/** Section 04 — knowledge sources (RAG grounding). */
export function KnowledgeSection({ index, selected, asil, onToggle }) {
  const fleetWarning = selected.includes('ks_balocco') && asil === 'QM';
  const totalRecords = KNOWLEDGE_SOURCES.filter((k) => selected.includes(k.id)).reduce((s, k) => s + k.records, 0);
  return (
    <FormSection
      id="knowledge"
      index={index}
      icon={Database}
      title="Knowledge sources"
      subtitle="Engineering systems the agent is grounded in. Groundedness is scored against these sources in the Evaluation Center."
      aside={<>{countBadge(selected.length, 'source')}{totalRecords > 0 && <span className="ad-studio-badge is-mono">{formatCount(totalRecords)} records</span>}</>}
    >
      <div className="ad-onb-pick-grid">
        {KNOWLEDGE_SOURCES.map((k) => {
          const on = selected.includes(k.id);
          return (
            <button key={k.id} type="button" className={`ad-onb-pick ${on ? 'is-selected' : ''}`} onClick={() => onToggle(k.id)} aria-pressed={on}>
              <span className="ad-onb-pick-head">
                <strong>{k.name}</strong>
                <span className="ad-onb-pick-check">{on && <Check size={11} strokeWidth={3} />}</span>
              </span>
              <span className="ad-onb-pick-meta">{k.system}</span>
              <span className="ad-onb-pick-tags">
                <span className="ad-studio-badge ad-onb-badge-xs">{k.category}</span>
                <span className="ad-studio-badge is-mono ad-onb-badge-xs">{formatCount(k.records)} records</span>
              </span>
            </button>
          );
        })}
      </div>
      {fleetWarning && (
        <div className="ad-onb-note is-warn">
          <TriangleAlert size={13} />
          <span>Fleet telemetry bound to a QM agent — the <strong>Data Protection (GDPR)</strong> guardrail will fail. Use a safety-rated scope with anonymisation attestation or unbind this source.</span>
        </div>
      )}
    </FormSection>
  );
}

/** Section 05 — connected engineering tools, grouped by category. */
export function ToolsSection({ index, selected, onToggle }) {
  const over = selected.length > MAX_TOOL_GRANTS;
  return (
    <FormSection
      id="tools"
      index={index}
      icon={Wrench}
      title="Connected tools"
      subtitle="Least-privilege tool grants the agent may call at runtime (routed through the AI Harness)."
      aside={<span className={`ad-studio-badge is-mono ${over ? 'is-critical' : selected.length ? 'is-success' : ''}`}>{selected.length}/{MAX_TOOL_GRANTS} grants</span>}
    >
      <div className="ad-onb-tool-groups">
        {TOOL_CATS.map((cat) => (
          <div key={cat} className="ad-onb-tool-group">
            <span className="ad-onb-tool-cat">{cat}</span>
            <div className="ad-onb-chip-row">
              {TOOLS.filter((t) => t.category === cat).map((t) => {
                const on = selected.includes(t.id);
                return (
                  <button key={t.id} type="button" className={`ad-studio-chip ${on ? 'is-selected' : ''}`} onClick={() => onToggle(t.id)} aria-pressed={on}>
                    {on && <Check size={11} strokeWidth={3} />}{t.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {over && (
        <div className="ad-onb-note is-warn">
          <TriangleAlert size={13} />
          <span>More than {MAX_TOOL_GRANTS} tool grants — the <strong>Cybersecurity (ISO/SAE 21434 · UNECE R155)</strong> guardrail requires least privilege.</span>
        </div>
      )}
    </FormSection>
  );
}

/** Section 06 — agentic workflow mapping. */
export function WorkflowsSection({ index, selected, agents, selfId, onToggle }) {
  return (
    <FormSection
      id="workflows"
      index={index}
      icon={Workflow}
      title="Workflow mapping"
      subtitle="Agentic workflows this agent participates in. Peer agents in the same workflow are listed for hand-off planning."
      aside={countBadge(selected.length, 'workflow')}
    >
      <div className="ad-onb-wf-list">
        {WORKFLOWS.map((w) => {
          const on = selected.includes(w.id);
          const peers = agents.filter((a) => a.id !== selfId && a.workflows.includes(w.id));
          return (
            <label key={w.id} className={`ad-onb-wf ${on ? 'is-selected' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => onToggle(w.id)} />
              <span className="ad-onb-wf-name">{w.name}</span>
              <span className="ad-onb-wf-peers" title={peers.map((p) => p.name).join(', ')}>
                {peers.length ? `${peers.length} peer agent${peers.length === 1 ? '' : 's'}` : 'No peers yet'}
              </span>
            </label>
          );
        })}
      </div>
    </FormSection>
  );
}
