/**
 * AI for AD — SDLC Knowledge Fabric model.
 * Each AD feature thread is traced through the ASPICE / ISO 26262 V-model:
 * Requirement → Safety Analysis → Architecture → Implementation → Verification → Release & Field → AI Agents.
 * Knowledge-source ids are the Agent Studio catalogue ids, so agent coverage is real.
 */
import { KNOWLEDGE_SOURCES } from '../../agent-studio/agentStudioData';

export const AD_KNOWLEDGE_LANES = Object.freeze([
  { id: 'requirement', label: 'Requirements', system: 'Polarion · DOORS NG · Euro NCAP', process: 'SYS.2 · SWE.1' },
  { id: 'safety', label: 'Safety Analysis', system: 'Medini Analyze · HARA / FMEA / FTA', process: 'ISO 26262-3 / 21448' },
  { id: 'design', label: 'Architecture & Design', system: 'AUTOSAR ARXML · Simulink', process: 'SWE.2 · SWE.3' },
  { id: 'code', label: 'Implementation & Build', system: 'GitHub Enterprise · Jenkins · MISRA', process: 'SWE.3 · SWE.4' },
  { id: 'verification', label: 'Verification (SIL / HIL)', system: 'OpenSCENARIO · dSPACE SCALEXIO', process: 'SWE.5 · SWE.6 · SYS.4' },
  { id: 'release', label: 'Release & Field', system: 'Release Gate · Balocco Fleet Data Lake', process: 'SYS.5 · SUP.8' },
  { id: 'agent', label: 'Bound AI Agents', system: 'Agent Studio · AI for AD', process: 'Agentic SDLC' }
]);

export const AD_KNOWLEDGE_LAYOUT = Object.freeze({ columnWidth: 224, rowHeight: 100 });

export const RECORD_STATUS = Object.freeze({
  verified: { label: 'Verified', tone: 'verified' },
  'in-progress': { label: 'In progress', tone: 'progress' },
  gap: { label: 'Trace gap', tone: 'gap' }
});

export const getKnowledgeSource = (id) => KNOWLEDGE_SOURCES.find((ks) => ks.id === id) || null;

// Shared records appear once in the Explore view and link several threads.
const SHARED = {
  misraGate: { recordId: 'QG-MISRA-2012', label: 'MISRA C:2012 Static Analysis Gate', knowledgeSource: 'ks_misra', status: 'verified', count: '0 mandatory violations', detail: 'Polyspace + Coverity gate on every merge request; deviations require FuSa sign-off.' },
  fusionSwc: { recordId: 'SWC-FusionManager', label: 'FusionManager SWC (AUTOSAR)', knowledgeSource: 'ks_arxml', status: 'verified', count: 'ARXML r4.2.7', detail: 'Adaptive AUTOSAR component arbitrating radar and camera object lists at 20 Hz.' },
  rel42: { recordId: 'REL-4.2-GATE', label: 'Release 4.2 Readiness Gate', knowledgeSource: 'ks_polarion', status: 'in-progress', count: 'Gate G5 · 87% ready', detail: 'Release checklist in Polarion: HIL coverage, open defects, safety case and cybersecurity evidence.' },
  balocco: { recordId: 'FLD-BAL-2291', label: 'Balocco Shadow-Mode Campaign', knowledgeSource: 'ks_balocco', status: 'verified', count: '41,200 km · 0 safety events', detail: 'Proving-ground shadow run comparing planner output against driver input in rain and dusk conditions.' }
};

export const AD_SCENARIOS = [
  {
    id: 'FEAT-HWP-01',
    title: 'Highway Pilot — Truck Cut-in Response',
    release: 'Release 4.2',
    asil: 'ASIL D',
    phase: 'Verification',
    owner: 'Matteo Ferri',
    summary: 'L3 highway pilot must react to aggressive heavy-truck cut-ins within 8 m at up to 130 km/h.',
    knowledge: {
      requirement: [
        { recordId: 'REQ-AD-142', label: 'Cut-in reaction ≤ 300 ms at 130 km/h', knowledgeSource: 'ks_polarion', status: 'verified', count: 'Approved · INVEST 92', detail: 'System shall initiate deceleration within 300 ms of a lateral intrusion into the ego lane.' },
        { recordId: 'SYS-REQ-0931', label: 'UNECE R157 ALKS lateral limit', knowledgeSource: 'ks_doors', status: 'verified', count: 'Baseline BL-2026.3', detail: 'Lateral acceleration during collision avoidance shall not exceed 3.0 m/s².' }
      ],
      safety: [
        { recordId: 'HZ-017 / SG-04', label: 'Late braking on cut-in (HARA)', knowledgeSource: 'ks_safety', status: 'verified', count: 'ASIL D · S3 E4 C3', detail: 'Safety goal SG-04: avoid insufficient deceleration when a vehicle enters the ego lane.' }
      ],
      design: [
        { recordId: 'SWC-TrajPlanner', label: 'Trajectory Planner SWC', knowledgeSource: 'ks_arxml', status: 'verified', count: 'ARXML r4.2.7', detail: 'Planner component with a dedicated cut-in arbitration port and 50 ms cycle.' },
        { recordId: 'MDL-LongCtrl-v5', label: 'Longitudinal Control Model', knowledgeSource: 'ks_simulink', status: 'verified', count: 'Simulink · MIL passed', detail: 'MPC longitudinal controller with jerk-limited emergency deceleration profile.' }
      ],
      code: [
        { recordId: 'PR-4821', label: 'Cut-in arbitration merge request', knowledgeSource: 'ks_arxml', status: 'verified', count: 'Merged · 94% MC/DC', detail: 'Implements SG-04 arbitration logic; unit tests trace to REQ-AD-142.' },
        SHARED.misraGate
      ],
      verification: [
        { recordId: 'SCN-CUTIN-402', label: 'OpenSCENARIO cut-in family', knowledgeSource: 'ks_scenarios', status: 'verified', count: '5,000 variants', detail: 'Parameterised cut-in with truck deceleration from -2.0 to -6.5 m/s² and gaps from 4 to 12 m.' },
        { recordId: 'HIL-RUN-88213', label: 'SCALEXIO HIL regression', knowledgeSource: 'ks_hil', status: 'in-progress', count: '97.4% pass · 13 open', detail: '13 failing runs at 130 km/h with wet road friction; root cause assigned to planner team.' }
      ],
      release: [SHARED.rel42, SHARED.balocco]
    }
  },
  {
    id: 'FEAT-AEB-02',
    title: 'Urban AEB — Occluded Pedestrian (Euro NCAP 2026)',
    release: 'Release 4.2',
    asil: 'ASIL C',
    phase: 'Verification gap',
    owner: 'Anna Keller',
    summary: 'AEB must detect a pedestrian emerging from behind a parked van at dusk on wet roads.',
    knowledge: {
      requirement: [
        { recordId: 'REQ-AD-187', label: 'Detect occluded VRU at TTC ≥ 1.2 s', knowledgeSource: 'ks_polarion', status: 'verified', count: 'Approved · INVEST 88', detail: 'System shall classify an emerging pedestrian with confidence ≥ 0.9 before TTC 1.2 s.' },
        { recordId: 'NCAP-CPNCO-2026', label: 'Euro NCAP CPNCO protocol', knowledgeSource: 'ks_ncap', status: 'verified', count: 'Protocol v10.4', detail: 'Car-to-Pedestrian Nearside Child Obstructed test case, 20–60 km/h.' }
      ],
      safety: [
        { recordId: 'FMEA-PER-044', label: 'Camera occlusion misclassification', knowledgeSource: 'ks_safety', status: 'verified', count: 'RPN 168 → 42', detail: 'FMEA entry with radar micro-Doppler hand-off as mitigation for occluded camera frames.' }
      ],
      design: [SHARED.fusionSwc],
      code: [
        { recordId: 'PR-4907', label: 'VRU tracker occlusion handling', knowledgeSource: 'ks_arxml', status: 'in-progress', count: 'In review · 2 approvals', detail: 'Adds occlusion-aware track initiation; awaiting FuSa reviewer.' },
        SHARED.misraGate
      ],
      verification: [
        { recordId: 'SCN-NCAP-CPNCO', label: 'NCAP CPNCO scenario set', knowledgeSource: 'ks_scenarios', status: 'verified', count: '1,200 variants', detail: 'Scenario library covering child/adult targets, 3 occluder types and 4 light levels.' },
        { recordId: 'HIL-VRU-WETDUSK', label: 'HIL wet-dusk VRU campaign', knowledgeSource: 'ks_hil', status: 'gap', count: '34 reqs without evidence', detail: 'HIL campaign blocked by supplier LiDAR SDK v3.2; 34 ASIL C requirements have no test evidence.' }
      ],
      release: [
        { recordId: 'FLD-DIS-089', label: 'Late pedestrian acquisition in rain', knowledgeSource: 'ks_balocco', status: 'in-progress', count: 'Disengagement · retraining', detail: 'Lens water droplets delayed classification by 120 ms; radar hand-off verified, model retraining queued.' }
      ]
    }
  },
  {
    id: 'FEAT-FUS-03',
    title: 'Radar–Camera Fusion Confidence in Heavy Rain',
    release: 'Release 4.2',
    asil: 'ASIL C',
    phase: 'Released',
    owner: 'Lukas Schneider',
    summary: 'Fused object confidence must stay above threshold at rain rates above 15 mm/h.',
    knowledge: {
      requirement: [
        { recordId: 'REQ-AD-211', label: 'Fusion confidence ≥ 0.92 in rain', knowledgeSource: 'ks_polarion', status: 'verified', count: 'Approved · INVEST 90', detail: 'Fused object confidence shall remain ≥ 0.92 for targets within 120 m at rain rate ≥ 15 mm/h.' }
      ],
      safety: [
        { recordId: 'FTA-FUS-012', label: 'Fusion dropout fault tree', knowledgeSource: 'ks_safety', status: 'verified', count: 'PMHF 4.1 FIT', detail: 'Fault tree for simultaneous camera degradation and radar clutter; meets ASIL C target.' }
      ],
      design: [
        SHARED.fusionSwc,
        { recordId: 'MDL-EKF-Fusion', label: 'Extended Kalman fusion model', knowledgeSource: 'ks_simulink', status: 'verified', count: 'Simulink · back-to-back OK', detail: 'EKF with rain-adaptive measurement covariance for radar and camera.' }
      ],
      code: [
        { recordId: 'BLD-J-7731', label: 'Nightly fusion build', knowledgeSource: 'ks_arxml', status: 'verified', count: 'Jenkins · green 14 days', detail: 'Cross-compiled for STLA Brain; artefacts signed and archived.' },
        SHARED.misraGate
      ],
      verification: [
        { recordId: 'HIL-RAIN-5520', label: 'Balocco rain replay on HIL', knowledgeSource: 'ks_hil', status: 'verified', count: '2,400 replays · 99.1% pass', detail: 'Recorded Balocco rain drives replayed through SCALEXIO with sensor fault injection.' }
      ],
      release: [SHARED.rel42, SHARED.balocco]
    }
  },
  {
    id: 'FEAT-LCC-04',
    title: 'Lane Centering on Degraded Markings',
    release: 'Release 4.3',
    asil: 'ASIL B',
    phase: 'Design',
    owner: 'Jonas Weber',
    summary: 'Lane centering must keep the lane when markings are worn, patched or partially covered.',
    knowledge: {
      requirement: [
        { recordId: 'REQ-AD-305', label: 'Lane keep with ≥ 40% marking loss', knowledgeSource: 'ks_polarion', status: 'verified', count: 'Approved · INVEST 85', detail: 'System shall maintain lateral error < 0.3 m with up to 40% of lane markings missing.' },
        { recordId: 'SYS-REQ-1102', label: 'Road-edge fallback estimation', knowledgeSource: 'ks_doors', status: 'in-progress', count: 'Draft · review open', detail: 'Use road-edge and leading-vehicle trail as fallback lane geometry.' }
      ],
      safety: [
        { recordId: 'HZ-031', label: 'Unintended lane departure', knowledgeSource: 'ks_safety', status: 'in-progress', count: 'ASIL B · SG pending', detail: 'Hazard identified; safety goal not yet linked to the lane estimator architecture.' }
      ],
      design: [
        { recordId: 'SWC-LaneEstimator', label: 'Lane Estimator SWC', knowledgeSource: 'ks_arxml', status: 'in-progress', count: 'ARXML draft r4.3.0', detail: 'New component fusing camera lane lines, road edges and HD-map priors.' }
      ],
      code: [
        { recordId: 'PR-5012', label: 'Lane estimator skeleton', knowledgeSource: 'ks_arxml', status: 'in-progress', count: 'Draft · 38% unit tests', detail: 'Initial implementation behind feature flag; MISRA scan pending.' }
      ],
      verification: [
        { recordId: 'SCN-LANE-FADED', label: 'Faded-marking scenario set', knowledgeSource: 'ks_scenarios', status: 'gap', count: 'Not yet authored', detail: 'No OpenSCENARIO variants exist for worn or patched markings; blocks SWE.6 planning.' }
      ],
      release: [
        { recordId: 'REL-4.3-GATE', label: 'Release 4.3 Readiness Gate', knowledgeSource: 'ks_polarion', status: 'gap', count: 'Gate G3 · planned', detail: 'Planned for Q1 2027; entry criteria not yet met.' }
      ]
    }
  }
];

const PIPELINE = ['requirement', 'safety', 'design', 'code', 'verification', 'release'];

export function scenarioSources(scenario) {
  const ids = new Set();
  PIPELINE.forEach((lane) => (scenario.knowledge[lane] || []).forEach((r) => r.knowledgeSource && ids.add(r.knowledgeSource)));
  return ids;
}

export function scenarioCoverage(scenario) {
  const records = PIPELINE.flatMap((lane) => scenario.knowledge[lane] || []);
  const verified = records.filter((r) => r.status === 'verified').length;
  const gaps = records.filter((r) => r.status === 'gap').length;
  return { total: records.length, verified, gaps, percent: Math.round((verified / Math.max(1, records.length)) * 100) };
}

export function boundAgentsFor(scenario, agents) {
  const sources = scenarioSources(scenario);
  return agents
    .map((agent) => ({ agent, overlap: (agent.knowledge || []).filter((ks) => sources.has(ks)).length }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map(({ agent }) => agent);
}

export function buildAdKnowledgeGraph(agents = []) {
  const nodes = new Map();
  const edges = new Map();

  const addNode = (node, scenarioId) => {
    const existing = nodes.get(node.id);
    if (existing) {
      if (!existing.scenarioIds.includes(scenarioId)) existing.scenarioIds.push(scenarioId);
    } else {
      nodes.set(node.id, { ...node, scenarioIds: [scenarioId] });
    }
    return node.id;
  };

  const link = (sources, targets, scenarioId) => {
    sources.forEach((source) => targets.forEach((target) => {
      const id = `${source}->${target}`;
      const existing = edges.get(id);
      if (existing) {
        if (!existing.scenarioIds.includes(scenarioId)) existing.scenarioIds.push(scenarioId);
      } else {
        edges.set(id, { id, source, target, scenarioIds: [scenarioId] });
      }
    }));
  };

  AD_SCENARIOS.forEach((scenario) => {
    const laneIds = PIPELINE.map((lane) => (scenario.knowledge[lane] || []).map((r) => {
      const ks = getKnowledgeSource(r.knowledgeSource);
      return addNode({
        id: `${lane}:${r.recordId}`,
        lane,
        label: r.label,
        recordId: r.recordId,
        system: ks?.system || 'SDLC Record',
        knowledgeSource: r.knowledgeSource,
        status: r.status,
        count: r.count,
        detail: r.detail
      }, scenario.id);
    }));

    const agentIds = boundAgentsFor(scenario, agents).map((a) => addNode({
      id: `agent:${a.id}`,
      lane: 'agent',
      label: a.name,
      recordId: a.id,
      system: a.family || 'Agent Studio',
      knowledgeSource: null,
      status: a.operationalState === 'Active' ? 'verified' : 'in-progress',
      count: `ASIL ${a.asil} · ${a.operationalState}`,
      detail: a.purpose
    }, scenario.id));

    [...laneIds, agentIds].reduce((prev, curr) => {
      if (curr.length === 0) return prev;
      link(prev, curr, scenario.id);
      return curr;
    });
  });

  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

export function filterAdGraphToScenario(graph, scenarioId) {
  return {
    nodes: graph.nodes.filter((node) => node.scenarioIds.includes(scenarioId)),
    edges: graph.edges.filter((edge) => edge.scenarioIds.includes(scenarioId))
  };
}

export function layoutAdKnowledgeGraph(nodes) {
  const byLane = AD_KNOWLEDGE_LANES.map((lane) => nodes.filter((node) => node.lane === lane.id));
  const tallest = Math.max(1, ...byLane.map((laneNodes) => laneNodes.length));
  const positions = {};

  byLane.forEach((laneNodes, laneIndex) => {
    const offset = ((tallest - laneNodes.length) * AD_KNOWLEDGE_LAYOUT.rowHeight) / 2;
    laneNodes.forEach((node, row) => {
      positions[node.id] = {
        x: laneIndex * AD_KNOWLEDGE_LAYOUT.columnWidth,
        y: offset + row * AD_KNOWLEDGE_LAYOUT.rowHeight
      };
    });
  });

  return positions;
}

const recordsOf = (...ids) => ids.reduce((sum, id) => sum + (getKnowledgeSource(id)?.records || 0), 0);

export function getAdMemoryCounters() {
  const coverage = AD_SCENARIOS.map(scenarioCoverage);
  const avgTrace = Math.round(coverage.reduce((s, c) => s + c.percent, 0) / coverage.length);
  return [
    { id: 'requirements', label: 'Requirements', value: recordsOf('ks_polarion', 'ks_doors'), hint: 'Polarion AD-1xx + DOORS NG system baseline' },
    { id: 'safety', label: 'Safety Work Products', value: recordsOf('ks_safety'), hint: 'HARA, FMEA and FTA items in Medini Analyze' },
    { id: 'design', label: 'Architecture Artefacts', value: recordsOf('ks_arxml', 'ks_simulink'), hint: 'AUTOSAR ARXML components + Simulink models' },
    { id: 'verification', label: 'Test Evidence', value: recordsOf('ks_hil', 'ks_scenarios'), hint: 'SIL/HIL results + OpenSCENARIO variants' },
    { id: 'fleet', label: 'Fleet Telemetry Frames', value: recordsOf('ks_balocco'), hint: 'Balocco proving-ground shadow-mode data' },
    { id: 'trace', label: 'End-to-End Traceability', value: `${avgTrace}%`, hint: `Verified links across ${AD_SCENARIOS.length} feature threads` }
  ];
}

const bestAgentFor = (ks, agents) => agents
  .filter((a) => (a.knowledge || []).includes(ks))
  .sort((a, b) => (b.evalProfile || 0) - (a.evalProfile || 0))[0] || null;

export function getAdDebtProfile(agents = []) {
  const items = [
    {
      id: 'DEBT-SDLC-01',
      title: '34 ASIL C VRU requirements have no HIL test evidence',
      area: 'Verification (SWE.6)',
      knowledgeSource: 'ks_hil',
      priority: 'High',
      severity: 'Release 4.2 blocker',
      costOfInaction: 'Euro NCAP 2026 rating at risk',
      scenarioLinked: 'FEAT-AEB-02'
    },
    {
      id: 'DEBT-SDLC-02',
      title: 'Hazard HZ-031 not linked to a safety goal or ARXML component',
      area: 'Safety Analysis (ISO 26262-3)',
      knowledgeSource: 'ks_safety',
      priority: 'High',
      severity: 'ASPICE SWE.2 finding',
      costOfInaction: 'Release 4.3 design gate slip',
      scenarioLinked: 'FEAT-LCC-04'
    },
    {
      id: 'DEBT-SDLC-03',
      title: 'No agent is bound to the MISRA / AUTOSAR C++14 rule base',
      area: 'Implementation (SWE.4)',
      knowledgeSource: 'ks_misra',
      priority: 'Medium',
      severity: 'Automation gap',
      costOfInaction: '≈ 120 h/month manual deviation review',
      scenarioLinked: 'FEAT-FUS-03'
    }
  ];

  agents
    .filter((a) => (a.knowledge || []).length === 0)
    .forEach((a) => items.push({
      id: `DEBT-AGT-${a.id}`,
      title: `${a.name} has no knowledge source bound`,
      area: 'Agent Studio',
      knowledgeSource: null,
      priority: 'Medium',
      severity: 'Ungrounded agent',
      costOfInaction: 'Cannot pass groundedness guardrail',
      agentLinked: a.id
    }));

  const resolved = items.map((item) => {
    const agent = item.knowledgeSource ? bestAgentFor(item.knowledgeSource, agents) : null;
    return { ...item, recommendedAgent: agent?.name || null };
  });

  const records = AD_SCENARIOS.map(scenarioCoverage);
  const total = records.reduce((s, c) => s + c.total, 0);
  const open = records.reduce((s, c) => s + (c.total - c.verified), 0);

  return {
    index: Math.round((open / Math.max(1, total)) * 100),
    gaps: records.reduce((s, c) => s + c.gaps, 0),
    items: resolved
  };
}
