/**
 * AI Harness (F3) — pure helpers: readiness, gauges, pipeline planning,
 * mock artefacts, templates and recommendations. No React in here.
 */
import {
  RUNTIMES,
  SKILL_LIBRARY,
  KNOWLEDGE_SOURCES,
  TOOLS,
  WORKFLOWS,
  HARNESS_STEPS,
  applyRules,
  isEvaluationPassing
} from '../../agentStudioData';

// ---------------------------------------------------------------------------
// Small utils
// ---------------------------------------------------------------------------
export const hashStr = (str) => {
  let h = 2166136261;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const byId = (list, id) => list.find((x) => x.id === id);
const fmtNum = (n) => n.toLocaleString('en-GB');

export const runtimeLabel = (type) => byId(RUNTIMES, type)?.label || type || '—';

export const formatDuration = (ms) => (ms ? `${(ms / 1000).toFixed(1)} s` : '—');

export const formatClock = (iso) => {
  if (!iso) return '--:--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const RUN_STATUS_META = {
  completed: { label: 'Completed', cls: 'is-success' },
  awaiting_approval: { label: 'Awaiting approval', cls: 'is-warning' },
  failed: { label: 'Failed', cls: 'is-critical' },
  running: { label: 'Running', cls: 'is-info' }
};

export const STEP_BY_KEY = Object.fromEntries(HARNESS_STEPS.map((s) => [s.key, s]));

/** Next id in the seed format (run-71032 …). */
export const nextRunId = (runs) => {
  const max = runs.reduce((m, r) => {
    const n = Number(String(r.id).replace(/^run-/, ''));
    return Number.isFinite(n) && n > m ? n : m;
  }, 71000);
  return `run-${max + 1}`;
};

// ---------------------------------------------------------------------------
// Readiness & execution plane
// ---------------------------------------------------------------------------
export function harnessReadiness(agent) {
  if (!agent) return { ready: false, reason: 'No agent selected' };
  if (agent.runtime?.status !== 'connected') return { ready: false, reason: `Runtime not verified — stage ${agent.stage}` };
  if (agent.stage < 2) return { ready: false, reason: `Registered only — stage ${agent.stage}` };
  if (agent.operationalState === 'Suspended') return { ready: false, reason: 'Suspended — re-evaluation required' };
  return { ready: true, reason: '' };
}

export const isHarnessReady = (agent) => harnessReadiness(agent).ready;

export const approvalForced = (agent) => ['C', 'D'].includes(agent?.asil);

export function executionPlaneNote(agent) {
  const label = runtimeLabel(agent.runtime?.type);
  if (agent.runtime?.type === 'SEL') return `Orchestration routes through ${label} execution plane via SEL Nexus automation-agents API`;
  if (agent.runtime?.type === 'BEDROCK') return `Orchestration routes through ${label} execution plane (EU-Frankfurt, Bedrock Guardrails)`;
  if (agent.runtime?.type === 'FOUNDRY') return `Orchestration routes through ${label} execution plane (TCS tenant isolation)`;
  return `Orchestration routes through ${label} execution plane (${agent.runtime?.baseUrl || 'custom endpoint'})`;
}

// ---------------------------------------------------------------------------
// Gauges — deterministic from the agent
// ---------------------------------------------------------------------------
const EXPECTED_KNOWLEDGE = {
  Perception: ['Validation', 'Telemetry', 'Architecture'],
  'Planning & Control': ['Validation', 'Safety', 'Standards'],
  'Requirements & Safety': ['Requirements', 'Safety', 'Standards'],
  'Validation & HIL': ['Validation', 'Architecture', 'Standards'],
  'Release & Operations': ['Requirements', 'Validation', 'Standards']
};

export function computeGauges(agent) {
  const ksCount = agent.knowledge.length;
  const skills = agent.skills.map((id) => byId(SKILL_LIBRARY, id)).filter(Boolean);
  const grounded = agent.evaluation?.dims?.groundedness;

  const base = Math.min(100, 40 + ksCount * 14 + skills.length * 4);
  let confidence = grounded ? Math.round(0.55 * grounded + 0.45 * base) : Math.min(78, base);
  if (!ksCount) confidence = Math.min(confidence, 32);

  const avgReuse = skills.length ? skills.reduce((s, k) => s + k.reuse, 0) / skills.length : 0;
  const reuse = skills.length ? Math.min(100, Math.round(40 + skills.length * 15 + avgReuse * 4)) : 0;

  const expected = EXPECTED_KNOWLEDGE[agent.subDomain] || [];
  const cats = new Set(agent.knowledge.map((id) => byId(KNOWLEDGE_SOURCES, id)?.category));
  const covered = expected.filter((c) => cats.has(c));
  const coverage = expected.length
    ? Math.min(100, Math.round((covered.length / expected.length) * 85 + Math.min(15, ksCount * 5)))
    : 0;

  return {
    confidence,
    reuse,
    coverage,
    hints: {
      confidence: grounded ? `${ksCount} sources · groundedness ${grounded}` : `${ksCount} sources · provisional`,
      reuse: skills.length ? `${skills.length} skills · avg reuse ${avgReuse.toFixed(1)}×` : 'No certified skills',
      coverage: `${covered.length}/${expected.length} ${agent.subDomain} categories`
    },
    missingCategories: expected.filter((c) => !cats.has(c))
  };
}

// ---------------------------------------------------------------------------
// Pipeline plan — decides every step outcome up-front (deterministic)
// ---------------------------------------------------------------------------
/**
 * Returns [{ key, status: 'passed'|'failed'|'waiting', ms, detail, logs:[{level,msg}] }]
 * truncated after the first failed step.
 */
export function planHarnessRun(agent, task, opts) {
  const { requireApproval, dryRun, rules, threshold, harnessRuns = [], agents = [], currentUser } = opts;
  const seed = hashStr(`${agent.id}:${task}:${Date.now()}`);
  const rnd = (salt, span) => hashStr(`${seed}:${salt}`) % span;
  const ms = (step) => Math.max(160, Math.round(step.baseMs * 1.6 + rnd(step.key, 260) - 130));
  const ticket = (task.match(/AD-\d{2,4}/i) || [])[0]?.toUpperCase();

  const ks = agent.knowledge.map((id) => byId(KNOWLEDGE_SOURCES, id)).filter(Boolean);
  const skills = agent.skills.map((id) => byId(SKILL_LIBRARY, id)).filter(Boolean);
  const tools = agent.tools.map((id) => byId(TOOLS, id)).filter(Boolean);
  const wfs = agent.workflows.map((id) => byId(WORKFLOWS, id)).filter(Boolean);
  const peers = agents.filter((a) => a.id !== agent.id && a.workflows.some((w) => agent.workflows.includes(w)));
  const reused = skills.filter((s) => s.sourceAgent !== agent.name);
  const rtLabel = runtimeLabel(agent.runtime.type);
  const approver = agent.approver || currentUser;

  const builders = {
    context: () => {
      if (!ks.length) {
        return {
          status: 'passed',
          detail: 'No knowledge sources bound — purpose-only context',
          logs: [{ level: 'WARN', msg: 'Context: no knowledge sources bound — outputs will be weakly grounded' }]
        };
      }
      const records = ks.reduce((s, k) => s + k.records, 0);
      const inScope = Math.max(12, Math.round(records * (0.01 + rnd('scope', 40) / 1000)));
      const logs = [{ level: 'INFO', msg: `Context: ${ks.map((k) => k.name).join(', ')}` }];
      if (ticket) logs.push({ level: 'INFO', msg: `Resolved ${ticket} in Polarion — linked epic, 3 upstream requirements` });
      logs.push({ level: 'INFO', msg: `${fmtNum(inScope)} of ${fmtNum(records)} records in scope after relevance filter` });
      return { status: 'passed', detail: `${ks.length} knowledge sources collected · ${fmtNum(inScope)} records in scope`, logs };
    },
    prompt: () => {
      const tokens = 1800 + rnd('tokens', 1400);
      if (!skills.length) {
        return {
          status: 'passed',
          detail: `Purpose-only prompt · ASIL ${agent.asil} constraints · ${fmtNum(tokens)} tokens`,
          logs: [{ level: 'WARN', msg: 'Prompt: no certified skills attached — falling back to agent purpose' }]
        };
      }
      return {
        status: 'passed',
        detail: `${skills.length} certified skill${skills.length > 1 ? 's' : ''} · ASIL ${agent.asil} constraints · ${fmtNum(tokens)} tokens`,
        logs: [{ level: 'INFO', msg: `Prompt assembled (${fmtNum(tokens)} tokens) with skills: ${skills.map((s) => s.name).join(', ')}` }]
      };
    },
    memory: () => {
      const chunks = 4 + rnd('mem', 9);
      const prior = harnessRuns.filter((r) => r.agentId === agent.id).length;
      return {
        status: 'passed',
        detail: `${chunks} memory chunks retrieved · ${prior} prior harness run${prior === 1 ? '' : 's'}`,
        logs: [{ level: 'INFO', msg: `Memory: ${chunks} chunks (similar defects, prior decisions), ${prior} prior run(s) for this agent` }]
      };
    },
    tools: () => {
      if (!tools.length) {
        return {
          status: 'passed',
          detail: 'No tools connected — reasoning-only execution',
          logs: [{ level: 'WARN', msg: 'Tool routing: no engineering tools connected — no external calls' }]
        };
      }
      const names = tools.map((t) => t.name);
      const logs = tools.map((t) => ({
        level: 'INFO',
        msg: `→ ${t.name} (${t.category}): ${1 + rnd(t.id, 4)} call(s)${dryRun ? ' — simulated' : ` · ${30 + rnd(`${t.id}l`, 180)} ms`}`
      }));
      if (dryRun) logs.push({ level: 'WARN', msg: 'Dry run: write operations suppressed — no tickets, links or commits created' });
      return {
        status: 'passed',
        detail: dryRun ? `Dry run — ${names.join(', ')} simulated, writes suppressed` : `Invoked ${names.join(', ')}`,
        logs
      };
    },
    workflow: () => {
      if (!wfs.length) {
        return {
          status: 'passed',
          detail: 'Not mapped to a workflow — standalone execution',
          logs: [{ level: 'WARN', msg: 'Workflow routing: agent not mapped to any agentic workflow (lifecycle stage 5 open)' }]
        };
      }
      return {
        status: 'passed',
        detail: `Positioned in ${wfs.map((w) => w.name).join(' · ')}`,
        logs: [{ level: 'INFO', msg: `Workflow graph: ${wfs.map((w) => w.name).join(', ')}` }]
      };
    },
    collab: () => {
      const logs = [];
      peers.slice(0, 2).forEach((p) => logs.push({ level: 'INFO', msg: `Hand-off with peer agent ${p.name}` }));
      reused.slice(0, 2).forEach((s) => logs.push({ level: 'INFO', msg: `Reused skill "${s.name}" from ${s.sourceAgent}` }));
      if (!logs.length) logs.push({ level: 'INFO', msg: 'No peer agents in mapped workflows — solo execution' });
      const detail = peers.length
        ? `Hand-off with ${peers.slice(0, 2).map((p) => p.name).join(', ')}${peers.length > 2 ? ` +${peers.length - 2}` : ''}`
        : reused.length ? `${reused.length} reused skill${reused.length > 1 ? 's' : ''} from peer agents` : 'Solo execution — no peer hand-offs';
      return { status: 'passed', detail, logs };
    },
    eval: () => {
      const ev = agent.evaluation;
      if (!ev) {
        return {
          status: 'passed',
          detail: `Quality gate: PROVISIONAL (${agent.evalProfile || 85}/100, uncertified)`,
          logs: [{ level: 'WARN', msg: `No certified evaluation — provisional score ${agent.evalProfile || 85}/100. Run the Evaluation Center before promotion.` }]
        };
      }
      const outcomes = applyRules(agent, ev, rules, threshold);
      const passing = !ev.failed && isEvaluationPassing(agent, ev, rules, threshold);
      if (!passing) {
        const violated = outcomes.filter((o) => !o.pass && o.rule.blocking);
        const logs = violated.map((o) => ({ level: 'ERROR', msg: `Rule "${o.rule.name}" violated: ${o.actual} < ${o.min}` }));
        if (!violated.length) logs.push({ level: 'ERROR', msg: `Latest evaluation marked FAILED (${ev.score}/100)` });
        const worst = violated[0];
        return {
          status: 'failed',
          detail: `Quality gate: FAIL (${ev.score}/100${worst ? `, ${worst.rule.dimension === 'overall' ? 'threshold' : worst.rule.dimension} ${worst.actual}` : ''})`,
          logs
        };
      }
      const advisories = outcomes.filter((o) => !o.pass && !o.rule.blocking);
      return {
        status: 'passed',
        detail: `Quality gate: PASS (${ev.score}/100 · threshold ${threshold})`,
        logs: [
          { level: 'INFO', msg: `Quality gate PASS (${ev.score}/100) — ${outcomes.length} rule(s) evaluated` },
          ...advisories.map((o) => ({ level: 'WARN', msg: `Advisory "${o.rule.name}": ${o.actual} < ${o.min}` }))
        ]
      };
    },
    policy: () => {
      if (agent.runtime.status !== 'connected') {
        return {
          status: 'failed',
          detail: `Blocked — ${rtLabel} runtime not verified (UNECE R155)`,
          logs: [
            { level: 'ERROR', msg: `UNECE R155 / ISO 21434: runtime ${rtLabel} status "${agent.runtime.status}" — unverified endpoint` },
            { level: 'ERROR', msg: 'Policy Enforcement denied execution — verify the runtime in the Onboarding Studio' }
          ]
        };
      }
      if (agent.operationalState === 'Suspended') {
        return {
          status: 'failed',
          detail: 'Blocked — agent operational state is Suspended',
          logs: [{ level: 'ERROR', msg: 'Governance: agent is Suspended — execution denied until re-evaluation and reinstatement' }]
        };
      }
      const logs = [
        { level: 'INFO', msg: `ISO 26262 ASIL ${agent.asil}: tool confidence and output constraints enforced` },
        { level: 'INFO', msg: 'MISRA C:2012 / AUTOSAR C++14 rule pack applied to generated code' },
        { level: 'INFO', msg: `UNECE R155: ${tools.length} least-privilege tool grant(s) verified` }
      ];
      if (agent.knowledge.includes('ks_balocco')) logs.push({ level: 'INFO', msg: 'GDPR: fleet telemetry access through anonymised view only' });
      return { status: 'passed', detail: `ISO 26262 (ASIL ${agent.asil}) · MISRA · R155 · GDPR enforced`, logs };
    },
    observe: () => {
      const trace = `tr-${(seed % 0xffffff).toString(16).padStart(6, '0')}`;
      return {
        status: 'passed',
        detail: `Trace ${trace} exported to AD observability bus`,
        logs: [{ level: 'INFO', msg: `Telemetry: trace ${trace}, ${12 + rnd('spans', 30)} spans, audit record written` }]
      };
    },
    human: () => {
      if (requireApproval) {
        return {
          status: 'waiting',
          detail: `Awaiting ${approver} (ASIL ${agent.asil}${approvalForced(agent) ? ' · mandatory' : ''})`,
          logs: [{ level: 'INFO', msg: `Routed to human approval — ${approver}${approvalForced(agent) ? ' (ASIL C/D policy)' : ''}` }]
        };
      }
      return {
        status: 'passed',
        detail: `Auto-released — ASIL ${agent.asil}, approval not required`,
        logs: [{ level: 'INFO', msg: 'Human approval not required for this run — auto-released' }]
      };
    }
  };

  const plan = [];
  for (const step of HARNESS_STEPS) {
    const outcome = builders[step.key]();
    plan.push({ key: step.key, ms: ms(step), ...outcome });
    if (outcome.status === 'failed') break;
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Output artefacts — deterministic from task text + agent
// ---------------------------------------------------------------------------
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 28);

export function buildArtefacts(run, agent) {
  const task = run.task || '';
  const seed = hashStr(`${run.id}:${task}`);
  const n = (min, span, salt) => min + (hashStr(`${seed}:${salt}`) % span);
  const kb = (salt) => {
    const v = n(8, 900, `kb${salt}`);
    return v > 600 ? `${(v / 380).toFixed(1)} MB` : `${v} KB`;
  };
  const ticket = (task.match(/AD-\d{2,4}/i) || [])[0]?.toUpperCase();
  const linkTo = ticket ? `linked to ${ticket}` : 'linked to Release 4.2';
  const base = ticket || slug(agent?.name || 'harness');
  const row = (name, type, salt) => ({ name, type, size: kb(salt), link: linkTo });

  if (/scenario|edge.?case|openscenario|ncap|cut-in|adversarial/i.test(task)) {
    const v = n(10, 12, 'v');
    return {
      headline: `${v} OpenSCENARIO variants generated`,
      metrics: [
        { label: 'Variants', value: v },
        { label: 'SOTIF triggering conditions', value: n(3, 6, 't') },
        { label: 'Edge-case coverage', value: `+${n(6, 12, 'c')} %` }
      ],
      rows: [
        row(`${base}_variants.xosc`, 'OpenSCENARIO 1.2', 1),
        row(`${base}_parameter_space.json`, 'Parameter set', 2),
        row('sotif_triggering_conditions.xlsx', 'SOTIF analysis', 3),
        row('scenario_review_note.md', 'Review note', 4)
      ]
    };
  }
  if (/acceptance|criteria|user stor|draft/i.test(task)) {
    const c = n(5, 5, 'c');
    const s = n(86, 12, 's');
    return {
      headline: `${c} acceptance criteria drafted — INVEST ${s}/100`,
      metrics: [
        { label: 'Criteria', value: c },
        { label: 'INVEST score', value: `${s}/100` },
        { label: 'Trace links proposed', value: n(4, 8, 'l') }
      ],
      rows: [
        row(`${base}_acceptance_criteria.feature`, 'Gherkin', 1),
        row(`${base}_invest_report.pdf`, 'Quality report', 2),
        row('polarion_trace_links.csv', 'Trace links', 3)
      ]
    };
  }
  if (/hil|triage|failure|bench|nightly/i.test(task)) {
    const f = n(9, 20, 'f');
    const k = n(2, 4, 'k');
    return {
      headline: `${f} HIL failures triaged into ${k} root-cause clusters`,
      metrics: [
        { label: 'Failures triaged', value: f },
        { label: 'Root-cause clusters', value: k },
        { label: 'Flaky tests isolated', value: n(1, 4, 'fl') }
      ],
      rows: [
        row('hil_triage_report.html', 'Triage report', 1),
        row('failure_clusters.csv', 'Cluster export', 2),
        row('jira_defect_drafts.json', 'Jira drafts', 3)
      ]
    };
  }
  if (/sdk|delay|supplier|impact|vendor/i.test(task)) {
    const e = n(3, 6, 'e');
    return {
      headline: `${e} epics impacted — ${n(21, 40, 'sp')} story points at risk`,
      metrics: [
        { label: 'Epics impacted', value: e },
        { label: 'Mitigations proposed', value: n(2, 4, 'm') },
        { label: 'Schedule slip avoided', value: `${n(4, 9, 'd')} days` }
      ],
      rows: [
        row('sdk_delay_impact_matrix.xlsx', 'Impact matrix', 1),
        row('mitigation_plan.md', 'Mitigation plan', 2),
        row('jira_epic_updates.json', 'Jira updates', 3)
      ]
    };
  }
  if (/trace|link|aspice/i.test(task)) {
    const l = n(40, 90, 'l');
    return {
      headline: `${l} traceability links recovered — ASPICE SWE.1–SWE.6`,
      metrics: [
        { label: 'Links recovered', value: l },
        { label: 'Orphan requirements', value: n(2, 9, 'o') },
        { label: 'Trace coverage', value: `${n(90, 9, 'tc')} %` }
      ],
      rows: [
        row('release_4_2_trace_matrix.xlsx', 'Trace matrix', 1),
        row('polarion_link_patch.json', 'Polarion patch', 2),
        row('orphan_requirements.csv', 'Gap list', 3)
      ]
    };
  }
  if (/exception|timeout|radar|fusion|detection|re-score|score/i.test(task)) {
    const d = n(600, 1400, 'd');
    return {
      headline: `Root cause isolated — ${fmtNum(d)} fused detections re-scored`,
      metrics: [
        { label: 'Detections re-scored', value: fmtNum(d) },
        { label: 'Mean confidence', value: `0.${n(86, 12, 'mc')}` },
        { label: 'Timeouts reproduced', value: n(3, 9, 'to') }
      ],
      rows: [
        row(`${base}_root_cause.md`, 'RCA report', 1),
        row('fusion_confidence_scores.parquet', 'Score export', 2),
        row('hil_replay_traces.mf4', 'MDF4 traces', 3),
        row('fix_proposal.patch', 'Code patch (MISRA clean)', 4)
      ]
    };
  }
  if (/hazard|hara|asil|safety goal/i.test(task)) {
    return {
      headline: `${n(6, 8, 'h')} hazardous events assessed — ${n(2, 4, 'g')} safety goals proposed`,
      metrics: [
        { label: 'Hazardous events', value: n(6, 8, 'h') },
        { label: 'Safety goals', value: n(2, 4, 'g') },
        { label: 'ASIL D items', value: n(1, 3, 'ad') }
      ],
      rows: [row('hara_worksheet.xlsx', 'HARA worksheet', 1), row('safety_goals.md', 'Safety goals', 2)]
    };
  }
  if (/release|readiness|gate/i.test(task)) {
    return {
      headline: `Release readiness ${n(78, 18, 'r')}/100 — ${n(2, 5, 'b')} blockers open`,
      metrics: [
        { label: 'Readiness', value: `${n(78, 18, 'r')}/100` },
        { label: 'Blockers', value: n(2, 5, 'b') },
        { label: 'HIL coverage', value: `${n(84, 12, 'hc')} %` }
      ],
      rows: [row('release_readiness_report.pdf', 'Readiness report', 1), row('blocker_list.csv', 'Blockers', 2)]
    };
  }
  return {
    headline: `Analysis report generated by ${agent?.name || 'agent'}`,
    metrics: [
      { label: 'Findings', value: n(4, 9, 'fi') },
      { label: 'Recommendations', value: n(2, 5, 're') },
      { label: 'Sources cited', value: n(6, 14, 'sc') }
    ],
    rows: [row(`${slug(task) || 'harness'}_report.md`, 'Report', 1), row('evidence_bundle.zip', 'Evidence bundle', 2)]
  };
}

// ---------------------------------------------------------------------------
// Workflow templates & Release 4.2 recommendations
// ---------------------------------------------------------------------------
export const HARNESS_TEMPLATES = {
  wf_req_test: {
    description: 'Turn a Polarion requirement into acceptance criteria and test cases with ASPICE bidirectional links.',
    steps: ['Ingest requirement', 'Draft acceptance criteria', 'Generate test cases', 'Link in Polarion', 'Evaluation gate'],
    task: 'Draft acceptance criteria for AD-115 Lane Keep Enhancement'
  },
  wf_radar_triage: {
    description: 'Cluster radar–vision fusion defects, replay HIL traces and propose a MISRA-clean fix.',
    steps: ['Pull defect logs', 'Replay HIL traces', 'Score fusion confidence', 'Propose fix', 'Human approval'],
    task: 'Clear AD-108 Radar-Vision Fusion timeout exception'
  },
  wf_release_42: {
    description: 'Aggregate HIL coverage, open defects and compliance items into a Release 4.2 gate decision.',
    steps: ['Collect HIL coverage', 'Recover trace links', 'Score readiness', 'List blockers', 'Governance sign-off', 'Publish report'],
    task: 'Recover missing traceability links for Release 4.2 SW requirements'
  },
  wf_supplier: {
    description: 'Quantify supplier SDK slippage and stand up synthetic-data mitigations for blocked epics.',
    steps: ['Read SDK release notes', 'Map impacted epics', 'Propose mitigation', 'Update Jira'],
    task: 'Assess LiDAR SDK v3.2 delay impact on Sprint 43 epics'
  },
  wf_asil_review: {
    description: 'Review ASIL-D exceptions with adversarial scenarios and HARA evidence before the safety board.',
    steps: ['Load HARA', 'Generate adversarial scenarios', 'Assess hazards', 'Evaluation gate', 'Safety board approval'],
    task: 'Generate edge-case scenarios for AD-108 Radar-Vision Fusion timeout'
  },
  wf_hil_closure: {
    description: 'Close HIL coverage gaps by triaging nightly failures and generating missing test benches runs.',
    steps: ['Triage nightly failures', 'Detect coverage gaps', 'Generate scenarios', 'Schedule bench runs'],
    task: 'Triage HIL failures from Test Bench #4 nightly run'
  }
};

export const RELEASE_RECOMMENDATIONS = [
  {
    id: 'rec_ad108',
    title: 'Clear AD-108 Radar-Vision Fusion timeout exception',
    why: 'Blocks the Release 4.2 gate · ASIL C perception path',
    priority: 'Critical',
    workflow: 'wf_radar_triage',
    subDomain: 'Perception',
    task: 'Clear AD-108 Radar-Vision Fusion timeout exception'
  },
  {
    id: 'rec_hil',
    title: 'Close HIL coverage gaps on Test Bench #4',
    why: '11 nightly failures unresolved · coverage 84 % vs 90 % target',
    priority: 'High',
    workflow: 'wf_hil_closure',
    subDomain: 'Validation & HIL',
    task: 'Triage HIL failures from Test Bench #4 nightly run'
  },
  {
    id: 'rec_trace',
    title: 'Recover Release 4.2 SW requirement traceability',
    why: 'ASPICE SWE.1–SWE.6 audit in 3 weeks',
    priority: 'Medium',
    workflow: 'wf_release_42',
    subDomain: 'Requirements & Safety',
    task: 'Recover missing traceability links for Release 4.2 SW requirements'
  }
];

/** Best-fit harness-ready agent for a workflow / sub-domain. */
export function bestAgentFor(agents, { workflow, subDomain }) {
  const scored = agents
    .filter(isHarnessReady)
    .map((a) => ({
      a,
      s: (a.workflows.includes(workflow) ? 100 : 0)
        + (a.subDomain === subDomain ? 30 : 0)
        + (a.evaluation && !a.evaluation.failed ? a.evaluation.score : (a.evalProfile || 80) / 2)
    }))
    .filter((x) => x.s >= 100 || x.a.subDomain === subDomain)
    .sort((x, y) => y.s - x.s);
  return scored[0]?.a || null;
}
