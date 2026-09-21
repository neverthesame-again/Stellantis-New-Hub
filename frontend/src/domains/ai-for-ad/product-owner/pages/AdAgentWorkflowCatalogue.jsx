import React, { useState, useMemo } from 'react';
import {
  Bot,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  Clock,
  Database,
  Lock,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  Plus,
  ChevronDown,
  Gauge,
  Cpu,
  Activity,
  Zap,
  Kanban
} from 'lucide-react';
import '../adAgentCatalogue.css';

// Facet Constants
const ALL_LIFECYCLES = ['Active', 'Experimental', 'Suspended', 'Retired'];
const ALL_DOMAINS = [
  'Perception Engineering',
  'Product Management',
  'Supply Chain / Dependency',
  'Release Engineering',
  'Procurement',
  'Diagnostics'
];
const ALL_PROJECT_TYPES = ['Safety-Critical', 'Non-Safety-Critical'];
const ALL_AUTONOMY = ['Supervised (Human-in-Loop)', 'Autonomous', 'Static Rule-Based'];

// 8 Automotive Foundation Agents & Workflows (Exactly 2 Active, 2 Experimental, 2 Suspended, 2 Retired)
const INITIAL_AGENTS = [
  // 1. ACTIVE #1
  {
    id: 'scorer',
    name: 'Fusion Confidence Scorer Agent',
    type: 'Autonomous Agent',
    lifecycleStage: 'Active',
    domain: 'Perception Engineering',
    projectType: 'Safety-Critical',
    autonomy: 'Supervised (Human-in-Loop)',
    risk: 'Medium Risk',
    statusBadge: 'Active in Production',
    desc: 'Scores fused radar + camera object detections for statistical confidence before proposals are ingested by the Trajectory Planner.',
    stamps: [
      { label: 'Precision', val: '94.2%', note: '▲ +1.2pt' },
      { label: 'Daily Executions', val: '1,240', note: '0 Fatal Errors' },
      { label: 'Success Rate', val: '96.0%', note: 'SLA Compliant' }
    ],
    dependencies: ['VisionTransformer v2', 'Radar Fusion Model v3'],
    purpose: 'Real-time arbitration of radar echo point clouds against visual bounding boxes to reject false positive reflections on highway guardrails.',
    owner: 'Sensor Fusion Platform Team',
    inputs: 'Synchronized camera frames, Continental ARS548 radar point clouds, ego-vehicle velocity state vector.',
    outputs: 'Unified 3D bounding box track objects with velocity vector, heading, and covariance ellipsoids.',
    tools: 'Radar Fusion Model v3, VisionTransformer v2, Kalman Track Manager',
    permissions: 'Low-level vehicle CAN bus read, telemetry pipeline egress.',
    evalResults: [
      { metric: 'Detection Precision', val: '94.2%', delta: '+1.2pt vs Baseline' },
      { metric: 'Mean Inference Latency', val: '11.4 ms', delta: 'Deterministic Target < 15ms' },
      { metric: 'Ghost Echo Rejection', val: '98.1%', delta: 'Balocco Proving Ground Certified' }
    ]
  },
  // 2. ACTIVE #2
  {
    id: 'req_engine',
    name: 'Requirements Engine (AI)',
    type: 'Autonomous Software Agent',
    lifecycleStage: 'Active',
    domain: 'Product Management',
    projectType: 'Non-Safety-Critical',
    autonomy: 'Supervised (Human-in-Loop)',
    risk: 'Low Risk',
    statusBadge: 'Active in Production',
    desc: 'Synthesizes customer, Euro NCAP, and regulatory specifications into structured Jira user stories, Gherkin acceptance criteria, and INVEST scores.',
    stamps: [
      { label: 'PO Acceptance', val: '88.0%', note: 'Sprint 42 Rate' },
      { label: 'Draft Time Drop', val: '14 min', note: 'Down from 3.8h' },
      { label: 'INVEST Score', val: '91/100', note: 'Automated Audit' }
    ],
    dependencies: ['Claude Sonnet 5', 'Jira REST Sync', 'INVEST Automated Auditor'],
    purpose: 'Automated parsing of unstructured PRDs and ISO 26262 requirements into formal backlog items with automated ambiguity analysis.',
    owner: 'AI for AD Product Operations',
    inputs: 'Unstructured PRD documents, Euro NCAP Protocol v3.4 PDF specs, Jira backlog epics.',
    outputs: 'Drafted user stories, Gherkin acceptance criteria, ambiguity flags, dependency impact analysis.',
    tools: 'Claude Sonnet 5, Jira REST Sync, INVEST Automated Auditor',
    permissions: 'Read/Write access to Jira Product Backlog (Draft status only); cannot publish without PM approval.',
    evalResults: [
      { metric: 'PO Acceptance Rate', val: '88.0%', delta: 'Sprint 42 Refinement Benchmark' },
      { metric: 'Drafting Time Drop', val: '14 min', delta: 'Down from 3.8h baseline' },
      { metric: 'INVEST Quality Score', val: '91/100', delta: 'Automated Audit' }
    ]
  },
  // 3. EXPERIMENTAL #1
  {
    id: 'emulator',
    name: 'Synthetic Emulator Mitigation Agent',
    type: 'Experimental Agent',
    lifecycleStage: 'Experimental',
    domain: 'Supply Chain / Dependency',
    projectType: 'Safety-Critical',
    autonomy: 'Supervised (Human-in-Loop)',
    risk: 'Medium Risk',
    statusBadge: 'Experimental • Requires Approval',
    desc: 'Emulates missing hardware sensor signals when physical components are delayed (e.g., Supplier LiDAR SDK delay) to unblock downstream perception testing.',
    stamps: [
      { label: 'Mitigation Rate', val: '75.0%', note: '3 of 4 Tests' },
      { label: 'Hardware Fidelity', val: '91.4%', note: 'Point Cloud Match' },
      { label: 'Approval Status', val: 'Pending', note: 'Awaiting PM Sign-off' }
    ],
    dependencies: ['High-Fidelity Vehicle Dynamics Model', 'Balocco Synthetic Sim Engine'],
    notice: 'Governance Restriction: Must be approved via Workflow Inbox before running on production HIL testbeds. Ties to Workflow Inbox Item 6.',
    purpose: 'Generates high-fidelity synthetic sensor telemetry to unblock downstream perception testing during hardware supplier delays.',
    owner: 'Simulation & Emulation Engineering Group',
    inputs: 'Simulated Balocco road telemetry, weather scenario matrices, synthetic LiDAR ray-tracing.',
    outputs: 'Emulated 3D LiDAR point cloud stream, synchronization heartbeat.',
    tools: 'Balocco Proving Ground Synthetic Sim Engine, PointCloud Synthesizer',
    permissions: 'Execution blocked in production until Governance Sign-Off in Workflow Inbox.',
    evalResults: [
      { metric: 'Mitigation Rate', val: '75.0%', delta: '3 of 4 Trials Successful' },
      { metric: 'Hardware Fidelity', val: '91.4%', delta: 'Point Cloud Match' },
      { metric: 'Approval Status', val: 'Pending', delta: 'Awaiting PM Sign-off' }
    ]
  },
  // 4. EXPERIMENTAL #2
  {
    id: 'trajectory_sentinel',
    name: 'Trajectory Planner Edge-Case Sentinel',
    type: 'Experimental Agentic Workflow',
    lifecycleStage: 'Experimental',
    domain: 'Perception Engineering',
    projectType: 'Safety-Critical',
    autonomy: 'Supervised (Human-in-Loop)',
    risk: 'High Risk',
    statusBadge: 'Experimental • Proving Ground Validation',
    desc: 'Multi-agent adversarial sentinel that injects rare dynamic obstacles and low-visibility weather cut-ins to audit Trajectory Planner pathing stability.',
    stamps: [
      { label: 'Corner-Case F1', val: '89.2%', note: 'Adversarial Bench' },
      { label: 'Pathing Latency', val: '12.4 ms', note: 'Nominal Response' },
      { label: 'ISO 26262 Gate', val: 'In Review', note: 'Part 3 Audit' }
    ],
    dependencies: ['DeepSeek-R1 Automotive', 'CarSim Proving Ground Engine'],
    notice: 'Gated Sandbox: Execution restricted to air-gapped Balocco Rig #4 until Functional Safety Lead co-signs ISO 26262 compliance ticket.',
    purpose: 'Continuous adversarial probing of vehicle trajectory splines to identify emergency braking threshold edge cases.',
    owner: 'Autonomous Driving Controls Squad',
    inputs: 'Vehicle trajectory splines, steering angle telemetry, synthetic actor velocity vectors.',
    outputs: 'Kinematic instability reports, safety margin violation timestamps, deceleration gradient logs.',
    tools: 'CarSim 2026.1, DeepSeek-R1 Automotive Math Solver, Balocco Proving Ground Telemetry Ingest',
    permissions: 'Air-gapped HIL cluster access only; read-only vehicle dynamics loop.',
    evalResults: [
      { metric: 'Adversarial F1 Score', val: '89.2%', delta: 'Tested across 1,800 scenarios' },
      { metric: 'Pathing Stability Retention', val: '97.8%', delta: 'Nominal highway dynamics' },
      { metric: 'Audit Clearance', val: 'Tier 2 Pending', delta: 'Routed to Workflow Inbox' }
    ]
  },
  // 5. SUSPENDED #1
  {
    id: 'vendor_risk',
    name: 'Vendor Risk Scoring Agent',
    type: 'Autonomous Classifier',
    lifecycleStage: 'Suspended',
    domain: 'Procurement',
    projectType: 'Non-Safety-Critical',
    autonomy: 'Autonomous',
    risk: 'High Risk (Suspended)',
    statusBadge: 'Suspended • Calibration Drift',
    desc: 'Monitors tier-1 supplier component delivery schedules, firmware compliance history, and supplier defect rates to predict supply chain bottlenecks.',
    stamps: [
      { label: 'FP Spike', val: '+18.0%', note: 'Exceeded 5% Threshold' },
      { label: 'Last Active', val: '3d ago', note: 'Paused by Gov Office' },
      { label: 'Recalibration', val: 'Stage 2/4', note: 'MLOps In Progress' }
    ],
    dependencies: ['Procurement Risk Classifier v1.8', 'SAP ERP Connector'],
    notice: 'Suspended: False-Positive Rate Spiked 18%. Agent execution paused by Governance Office following abnormal risk flags on Continental supply lines.',
    purpose: 'Continuous risk scoring of external automotive electronics suppliers to preempt supply chain interruptions.',
    owner: 'Global Procurement & Quality Governance',
    inputs: 'Supplier defect reports, shipping logs, component firmware release dates.',
    outputs: 'Vendor risk index score (0-100), supplier escalation triggers.',
    tools: 'ML Classification Model, ERP Data Ingestion',
    permissions: 'Execution suspended by Corporate Governance Office.',
    evalResults: [
      { metric: 'False-Positive Spike', val: '+18.0%', delta: 'Exceeded 5% Threshold' },
      { metric: 'Status', val: 'Offline', delta: 'Under MLOps Recalibration' }
    ]
  },
  // 6. SUSPENDED #2
  {
    id: 'release_mon',
    name: 'Release Readiness Monitor',
    type: 'Autonomous Sentinel',
    lifecycleStage: 'Suspended',
    domain: 'Release Engineering',
    projectType: 'Safety-Critical',
    autonomy: 'Autonomous',
    risk: 'Medium Risk (Suspended)',
    statusBadge: 'Suspended • Telemetry Drift',
    desc: 'Continuously aggregates HIL simulation coverage, PR merge velocity, and blocker bugs to compute real-time Go/No-Go release readiness.',
    stamps: [
      { label: 'Sync Drift', val: '+220ms', note: 'Orin NPU Clock Jitter' },
      { label: 'Gate Integrity', val: '86% HIL', note: 'Below 90% Target' },
      { label: 'Audit Status', val: 'Suspended', note: 'Ticket #EXC-402' }
    ],
    dependencies: ['Balocco Rig #4 Telemetry Webhook', 'Jenkins Release Pipeline'],
    notice: 'Suspended: Balocco HIL Telemetry Sync Drift. Temporarily suspended pending Orin NPU hardware clock calibration review (Inbox Item 3).',
    purpose: 'Aggregates multi-source test verification data into holistic release gate readiness indices.',
    owner: 'Release Operations & Program Management',
    inputs: 'GitHub PR telemetry, Balocco HIL simulation bench metrics, Jira blocker tickets.',
    outputs: 'Release Readiness percentage score, blocker alert notifications, ISO 26262 audit compliance checklist.',
    tools: 'Rule-based evaluation engine, ML anomaly detector, CI/CD webhooks',
    permissions: 'Read-only access to CI/CD pipelines, HIL test results, and release dashboard.',
    evalResults: [
      { metric: 'Clock Drift', val: '220 ms', delta: 'Exceeded 50ms tolerance' },
      { metric: 'HIL Sync Status', val: 'Pending Patch', delta: 'Orin NPU firmware patch required' }
    ]
  },
  // 7. RETIRED #1
  {
    id: 'legacy_diag',
    name: 'Legacy Diagnostic Bot',
    type: 'Rule-Based Diagnostic Bot',
    lifecycleStage: 'Retired',
    domain: 'Diagnostics',
    projectType: 'Non-Safety-Critical',
    autonomy: 'Static Rule-Based',
    risk: 'Archived / Read-Only',
    statusBadge: 'Retired FY25 (Archived)',
    desc: 'Legacy OBD-II diagnostic fault code parser and rule-based trouble ticket router used during Release 2.x and 3.x vehicle maintenance.',
    stamps: [
      { label: 'Decommissioned', val: 'Q4 FY25', note: 'Final Run v1.4' },
      { label: 'Total Tickets', val: '142,800', note: 'Historical Archive' },
      { label: 'Succession', val: 'Llama 3.3', note: 'Migrated to Orin VPC' }
    ],
    dependencies: ['Regex DTC Rule Parser v1.4'],
    notice: 'Archived: Decommissioned in Q4 FY25. Replaced by Next-Gen Multimodal Diagnostic telemetry agent running on Private VPC.',
    purpose: 'Legacy OBD-II diagnostic fault code parser and rule-based trouble ticket router.',
    owner: 'Vehicle Service Operations',
    inputs: 'OBD-II vehicle test logs, DTC error codes.',
    outputs: 'Trouble ticket routing tags, maintenance service codes.',
    tools: 'Regex Rule Parser',
    permissions: 'Read-only archive access.',
    evalResults: [
      { metric: 'Lifecycle', val: 'Retired', delta: 'Decommissioned Q4 FY25' }
    ]
  },
  // 8. RETIRED #2
  {
    id: 'legacy_linter',
    name: 'Static PR Quality Gate Bot',
    type: 'Rule-Based Linter Bot',
    lifecycleStage: 'Retired',
    domain: 'Release Engineering',
    projectType: 'Non-Safety-Critical',
    autonomy: 'Static Rule-Based',
    risk: 'Archived / Read-Only',
    statusBadge: 'Retired FY25 (Archived)',
    desc: 'Static code analysis bot checking MISRA C++ formatting and comment headers prior to pull request integration.',
    stamps: [
      { label: 'Decommissioned', val: 'Q2 FY25', note: 'Legacy Linter' },
      { label: 'Total PRs', val: '86,400', note: 'Historical Volume' },
      { label: 'Succession', val: 'CodePilot Pro', note: 'AI Native Replacement' }
    ],
    dependencies: ['Clang-Tidy MISRA Rulepack 2018'],
    notice: 'Archived: Superseded by AI Code Reviewer and Requirements Engine in Q2 FY25. Read-only compliance audit records preserved.',
    purpose: 'Legacy static analysis linting for C++ automotive embedded firmware.',
    owner: 'Engineering Tools & DevOps Squad',
    inputs: 'Git diffs, C++ source files, pull request metadata.',
    outputs: 'Static violation annotations, commit status checks.',
    tools: 'Clang-Tidy, Cppcheck',
    permissions: 'Read-only archive access.',
    evalResults: [
      { metric: 'Lifecycle', val: 'Retired', delta: 'Decommissioned Q2 FY25' }
    ]
  }
];

export default function AdAgentWorkflowCatalogue({ onNavigateToInbox, onNavigateToTrace }) {
  // Sub-tabs Navigation
  const [activeSubtab, setActiveSubtab] = useState('catalog'); // 'catalog' | 'lifecycle'

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Search & Filter State (Empty array = No filter applied on this dimension / All included)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLifecycles, setSelectedLifecycles] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
  const [selectedAutonomy, setSelectedAutonomy] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Modals & Drawers
  const [drawerAgent, setDrawerAgent] = useState(null);
  const [subscribeModalAgent, setSubscribeModalAgent] = useState(null);
  const [subscribeProject, setSubscribeProject] = useState('Release 4.2 Program');
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  // Model & Agent state
  const [agentsList, setAgentsList] = useState(INITIAL_AGENTS);

  // Check if any facet filter is active
  const hasActiveFilters = Boolean(
    selectedLifecycles.length > 0 ||
    selectedDomains.length > 0 ||
    selectedProjectTypes.length > 0 ||
    selectedAutonomy.length > 0 ||
    searchQuery.trim() !== ''
  );

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLifecycles([]);
    setSelectedDomains([]);
    setSelectedProjectTypes([]);
    setSelectedAutonomy([]);
    setSortBy('recommended');
    showToast('Facet filters reset — Showing all 8 agents');
  };

  // Dynamic Facet Count Engine (Calculates matching count across all facets in real-time)
  const getDynamicCount = (facetCategory, value) => {
    return agentsList.filter(agent => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = agent.name.toLowerCase().includes(q) ||
          agent.domain.toLowerCase().includes(q) ||
          agent.desc.toLowerCase().includes(q) ||
          agent.type.toLowerCase().includes(q) ||
          agent.lifecycleStage.toLowerCase().includes(q);
        if (!match) return false;
      }
      // 2. Lifecycle Stage Check
      if (facetCategory === 'lifecycle') {
        if (agent.lifecycleStage !== value) return false;
      } else if (selectedLifecycles.length > 0) {
        if (!selectedLifecycles.includes(agent.lifecycleStage)) return false;
      }
      // 3. Domain Check
      if (facetCategory === 'domain') {
        if (agent.domain !== value) return false;
      } else if (selectedDomains.length > 0) {
        if (!selectedDomains.includes(agent.domain)) return false;
      }
      // 4. Project Type Check
      if (facetCategory === 'projectType') {
        if (agent.projectType !== value) return false;
      } else if (selectedProjectTypes.length > 0) {
        if (!selectedProjectTypes.includes(agent.projectType)) return false;
      }
      // 5. Autonomy Level Check
      if (facetCategory === 'autonomy') {
        if (agent.autonomy !== value) return false;
      } else if (selectedAutonomy.length > 0) {
        if (!selectedAutonomy.includes(agent.autonomy)) return false;
      }

      return true;
    }).length;
  };

  // Filtered Agents list
  const filteredAgents = useMemo(() => {
    let list = agentsList.filter(agent => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = agent.name.toLowerCase().includes(q) ||
          agent.domain.toLowerCase().includes(q) ||
          agent.desc.toLowerCase().includes(q) ||
          agent.type.toLowerCase().includes(q) ||
          agent.lifecycleStage.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Lifecycle
      if (selectedLifecycles.length > 0 && !selectedLifecycles.includes(agent.lifecycleStage)) return false;
      // Domain
      if (selectedDomains.length > 0 && !selectedDomains.includes(agent.domain)) return false;
      // Project Type
      if (selectedProjectTypes.length > 0 && !selectedProjectTypes.includes(agent.projectType)) return false;
      // Autonomy
      if (selectedAutonomy.length > 0 && !selectedAutonomy.includes(agent.autonomy)) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'lifecycle') {
      const order = { 'Active': 1, 'Experimental': 2, 'Suspended': 3, 'Retired': 4 };
      list = [...list].sort((a, b) => (order[a.lifecycleStage] || 99) - (order[b.lifecycleStage] || 99));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [agentsList, searchQuery, selectedLifecycles, selectedDomains, selectedProjectTypes, selectedAutonomy, sortBy]);

  // Handle Subscription
  const handleConfirmSubscribe = () => {
    if (!subscribeModalAgent) return;
    showToast(`Subscribed ${subscribeModalAgent.name} to ${subscribeProject}`);
    setSubscribeModalAgent(null);
  };

  // Handle Initiate Approval
  const handleInitiateApproval = (agent) => {
    showToast(`Governance approval initiated for ${agent.name}. Governance ticket dispatched to Workflow Inbox (Tab 2).`);
    if (onNavigateToInbox) {
      setTimeout(() => {
        // Optional quick link
      }, 2000);
    }
  };

  return (
    <div className="ad-agents-container">

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="ad-inbox-toast" style={{ bottom: '24px', right: '24px', zIndex: 2000 }}>
          <div className="ad-inbox-toast-dot" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ad-inbox-toast-close">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Header & Sub-nav Bar */}
      <div className="ad-agents-header-card">
        <div className="ad-agents-header-title-group">
          <div className="ad-agents-header-icon">
            <Bot size={22} />
          </div>
          <div className="ad-agents-header-text">
            <h2>
              <span>Agent &amp; Agentic Workflow Catalogue</span>
              <span className="st-badge badge-purple" style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                {agentsList.length} Registered • 2 Active • 2 Experimental • 2 Suspended • 2 Retired
              </span>
            </h2>
            <p>Autonomous engineering agents, multi-agent workflows, Performance Passports, and stage-gated governance.</p>
          </div>
        </div>

        {/* Sub-nav Buttons & Registration Trigger */}
        <div className="ad-agents-subnav-actions">
          <div className="ad-agents-subtab-track">
            <button
              onClick={() => setActiveSubtab('catalog')}
              className={`ad-agents-subtab-btn ${activeSubtab === 'catalog' ? 'active' : ''}`}
            >
              <Layers size={14} />
              <span>All Agents &amp; Workflows ({agentsList.length})</span>
            </button>
            <button
              onClick={() => setActiveSubtab('lifecycle')}
              className={`ad-agents-subtab-btn ${activeSubtab === 'lifecycle' ? 'active' : ''}`}
            >
              <Kanban size={14} />
              <span>Lifecycle Board (Kanban)</span>
            </button>
          </div>

          <button
            onClick={() => setRegistrationModalOpen(true)}
            className="ad-btn-register"
          >
            <Plus size={14} />
            <span>Register New Agent</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SUB-TAB 1: ALL AGENTS & WORKFLOWS (CATALOG VIEW WITH FACETS)       */}
      {/* ================================================================= */}
      {activeSubtab === 'catalog' && (
        <div className="ad-agents-browse-layout">

          {/* Left Facet Filter Aside */}
          <aside className="ad-agents-facet-aside">
            <div className="ad-agent-facet-header">
              <div className="ad-agent-facet-title">
                <Filter size={13} />
                <span>Facet Filters</span>
              </div>
              <button onClick={handleResetFilters} className="ad-agent-facet-reset-btn">
                Reset All
              </button>
            </div>

            {/* 1. Lifecycle Stage (DYNAMIC COUNTERS: EXACTLY 2 EACH AT BASELINE) */}
            <div className="ad-agent-facet-section">
              <div className="ad-agent-facet-section-header">
                <span>Lifecycle Stage</span>
                <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>4 Stages</span>
              </div>
              <div className="ad-agent-facet-options">
                {ALL_LIFECYCLES.map(stage => {
                  const count = getDynamicCount('lifecycle', stage);
                  const checked = selectedLifecycles.includes(stage);
                  const dotColor = stage === 'Active' ? '#10b981' : stage === 'Experimental' ? '#f59e0b' : stage === 'Suspended' ? '#ef4444' : '#94a3b8';
                  return (
                    <label key={stage} className={`ad-agent-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-agent-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedLifecycles(e.target.checked ? [...selectedLifecycles, stage] : selectedLifecycles.filter(s => s !== stage));
                          }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
                          {stage}
                        </span>
                      </div>
                      <span className="ad-agent-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Domain (DYNAMIC COUNTERS) */}
            <div className="ad-agent-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-agent-facet-section-header">
                <span>Domain</span>
              </div>
              <div className="ad-agent-facet-options">
                {ALL_DOMAINS.map(dom => {
                  const count = getDynamicCount('domain', dom);
                  const checked = selectedDomains.includes(dom);
                  return (
                    <label key={dom} className={`ad-agent-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-agent-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedDomains(e.target.checked ? [...selectedDomains, dom] : selectedDomains.filter(d => d !== dom));
                          }}
                        />
                        <span>{dom}</span>
                      </div>
                      <span className="ad-agent-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Project Type (DYNAMIC COUNTERS) */}
            <div className="ad-agent-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-agent-facet-section-header">
                <span>Project Type</span>
              </div>
              <div className="ad-agent-facet-options">
                {ALL_PROJECT_TYPES.map(proj => {
                  const count = getDynamicCount('projectType', proj);
                  const checked = selectedProjectTypes.includes(proj);
                  return (
                    <label key={proj} className={`ad-agent-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-agent-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedProjectTypes(e.target.checked ? [...selectedProjectTypes, proj] : selectedProjectTypes.filter(p => p !== proj));
                          }}
                        />
                        <span>{proj}</span>
                      </div>
                      <span className="ad-agent-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Autonomy Level (DYNAMIC COUNTERS) */}
            <div className="ad-agent-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-agent-facet-section-header">
                <span>Autonomy Level</span>
              </div>
              <div className="ad-agent-facet-options">
                {ALL_AUTONOMY.map(aut => {
                  const count = getDynamicCount('autonomy', aut);
                  const checked = selectedAutonomy.includes(aut);
                  return (
                    <label key={aut} className={`ad-agent-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-agent-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedAutonomy(e.target.checked ? [...selectedAutonomy, aut] : selectedAutonomy.filter(a => a !== aut));
                          }}
                        />
                        <span>{aut}</span>
                      </div>
                      <span className="ad-agent-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Main Cards Area */}
          <main className="ad-agents-main-area">

            {/* Search Bar & Controls */}
            <div className="ad-agents-search-bar">
              <div className="ad-agents-search-input-box">
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search agents by name, domain, model dependencies, or lifecycle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ad-agents-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="ad-agents-meta-count">
                <span>Showing {filteredAgents.length} of {agentsList.length} Agents</span>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: 'transparent', border: 'none', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="recommended">Recommended Fit (AI for AD)</option>
                    <option value="lifecycle">Lifecycle (Active First)</option>
                    <option value="name">Alphabetical (A &rarr; Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Tag Strip */}
            {hasActiveFilters && (
              <div className="ad-agent-active-filters-bar">
                <span className="ad-agent-active-filters-label">Active Filters:</span>
                {selectedLifecycles.map(s => (
                  <span key={s} className="ad-agent-filter-chip">
                    <span>Stage: {s}</span>
                    <button onClick={() => setSelectedLifecycles(selectedLifecycles.filter(x => x !== s))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedDomains.map(d => (
                  <span key={d} className="ad-agent-filter-chip">
                    <span>Domain: {d}</span>
                    <button onClick={() => setSelectedDomains(selectedDomains.filter(x => x !== d))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedProjectTypes.map(p => (
                  <span key={p} className="ad-agent-filter-chip">
                    <span>Type: {p}</span>
                    <button onClick={() => setSelectedProjectTypes(selectedProjectTypes.filter(x => x !== p))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedAutonomy.map(a => (
                  <span key={a} className="ad-agent-filter-chip">
                    <span>Autonomy: {a}</span>
                    <button onClick={() => setSelectedAutonomy(selectedAutonomy.filter(x => x !== a))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {searchQuery.trim() && (
                  <span className="ad-agent-filter-chip">
                    <span>Search: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} title="Clear search"><X size={11} /></button>
                  </span>
                )}
                <button onClick={handleResetFilters} className="ad-agent-filter-chip-clear">Clear All</button>
              </div>
            )}

            {/* Cards Grid */}
            {filteredAgents.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface-primary)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                <Bot size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>No Agents Match Filter Criteria</h4>
                <p style={{ margin: '4px 0 16px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Try adjusting your Lifecycle Stage, Domain, or Project Type selections.
                </p>
                <button onClick={handleResetFilters} className="ad-btn-subscribe-agent">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="ad-agents-grid">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`ad-agent-card ${agent.lifecycleStage.toLowerCase()}`}
                  >
                    <div>
                      {/* Top Tag Strip */}
                      <div className="ad-agent-top-strip">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>
                            {agent.type}
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {agent.domain}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            className={`st-badge ${agent.lifecycleStage === 'Active' ? 'badge-success' : agent.lifecycleStage === 'Experimental' ? 'badge-warning' : agent.lifecycleStage === 'Suspended' ? 'badge-danger' : 'badge-secondary'}`}
                            style={{ fontSize: '0.65rem' }}
                          >
                            {agent.lifecycleStage}
                          </span>
                          <span className={`st-badge ${agent.risk.includes('Low') ? 'badge-info' : agent.risk.includes('Medium') ? 'badge-secondary' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                            {agent.risk}
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="ad-agent-title-row">
                        <div>
                          <h3 className="ad-agent-title">{agent.name}</h3>
                          <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {agent.autonomy} • {agent.projectType}
                          </div>
                        </div>
                      </div>

                      <p className="ad-agent-desc">{agent.desc}</p>

                      {/* Notice Banner (for Experimental / Suspended / Retired) */}
                      {agent.notice && (
                        <div className={`ad-agent-notice-box ${agent.lifecycleStage.toLowerCase()}`}>
                          {agent.lifecycleStage === 'Experimental' ? (
                            <Lock size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          ) : agent.lifecycleStage === 'Suspended' ? (
                            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          ) : (
                            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          )}
                          <span>{agent.notice}</span>
                        </div>
                      )}

                      {/* Performance Passport Stamp Matrix */}
                      <div className="ad-agent-stamp-matrix">
                        {agent.stamps.map((stamp, sIdx) => (
                          <div key={sIdx} className="ad-stamp-cell">
                            <span className="ad-stamp-label">{stamp.label}</span>
                            <span className="ad-stamp-val">{stamp.val}</span>
                            <span className="ad-stamp-note" style={{ color: stamp.note.includes('▲') ? '#10b981' : 'var(--text-muted)' }}>
                              {stamp.note}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Dependencies */}
                      <div className="ad-agent-deps-row">
                        <span>Dependencies:</span>
                        {agent.dependencies.map((dep, dIdx) => (
                          <span
                            key={dIdx}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'var(--surface-tertiary, #f1f5f9)',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              color: 'var(--text-primary, #1e293b)',
                              fontWeight: 600
                            }}
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="ad-agent-card-actions">
                      <button
                        onClick={() => setDrawerAgent(agent)}
                        className="ad-btn-passport"
                      >
                        Performance Passport
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {agent.lifecycleStage === 'Active' && (
                          <>
                            <button
                              onClick={() => setSubscribeModalAgent(agent)}
                              className="ad-btn-subscribe-agent"
                            >
                              Subscribe to Project
                            </button>
                            {agent.id === 'scorer' && (
                              <button
                                onClick={() => {
                                  if (onNavigateToTrace) {
                                    onNavigateToTrace();
                                  } else {
                                    showToast('Deep-linking to Execution Node Trace #AD-71029 in Persona Dashboard');
                                  }
                                }}
                                className="ad-btn-log-link"
                                title="Inspect Live Level 6 Execution Trace"
                              >
                                <span>Log #71029</span>
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </>
                        )}

                        {agent.lifecycleStage === 'Experimental' && (
                          <button
                            onClick={() => handleInitiateApproval(agent)}
                            className="ad-btn-initiate-approval"
                          >
                            <ShieldCheck size={14} />
                            <span>Initiate Approval</span>
                          </button>
                        )}

                        {agent.lifecycleStage === 'Suspended' && (
                          <button
                            onClick={() => showToast(`Opening Governance Calibration & Drift Report for ${agent.name}`)}
                            className="ad-btn-passport"
                            style={{ color: 'var(--badge-critical-text)', borderColor: 'var(--badge-critical-border)', background: 'var(--badge-critical-bg)' }}
                          >
                            Audit Report
                          </button>
                        )}

                        {agent.lifecycleStage === 'Retired' && (
                          <button
                            onClick={() => showToast(`Accessing Historical Archive Logs for ${agent.name} (Read-Only)`)}
                            className="ad-btn-passport"
                            style={{ color: '#64748b' }}
                          >
                            Archive Log
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </main>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: LIFECYCLE BOARD (4-STAGE KANBAN OPERATIONAL VIEW)       */}
      {/* ================================================================= */}
      {activeSubtab === 'lifecycle' && (
        <div className="ad-kanban-board-container">

          {/* Kanban Header Summary */}
          <div className="ad-kanban-summary-card">
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Autonomous Agent Lifecycle Kanban
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Governance pipeline tracking agents from experimental validation to active production, suspension, and retirement.
              </p>
            </div>
            <div className="ad-kanban-stage-pills">
              <span className="st-badge badge-warning" style={{ fontSize: '0.7rem' }}>
                Experimental (2)
              </span>
              <span className="st-badge badge-success" style={{ fontSize: '0.7rem' }}>
                Active in Production (2)
              </span>
              <span className="st-badge badge-danger" style={{ fontSize: '0.7rem' }}>
                Suspended (2)
              </span>
              <span className="st-badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                Retired (2)
              </span>
            </div>
          </div>

          {/* 4-Column Kanban Grid */}
          <div className="ad-kanban-grid">

            {/* COLUMN 1: EXPERIMENTAL (2) */}
            <div className="ad-kanban-column ad-kanban-col-experimental">
              <div className="ad-kanban-col-header">
                <div className="ad-kanban-col-title">
                  <span className="ad-kanban-dot-experimental" />
                  <span>EXPERIMENTAL</span>
                </div>
                <span className="ad-kanban-col-badge">
                  {agentsList.filter(a => a.lifecycleStage === 'Experimental').length}
                </span>
              </div>

              <div className="ad-kanban-cards-stack">
                {agentsList.filter(a => a.lifecycleStage === 'Experimental').map((agent) => (
                  <div key={agent.id} className="ad-kanban-card ad-kanban-card-experimental">
                    <div className="ad-kanban-card-top">
                      <span className="st-badge badge-warning" style={{ fontSize: '0.62rem' }}>
                        🔒 Needs Approval
                      </span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {agent.domain}
                      </span>
                    </div>
                    <div className="ad-kanban-card-title">{agent.name}</div>
                    <div className="ad-kanban-card-desc">{agent.desc}</div>
                    <div className="ad-kanban-card-metric">
                      <span>{agent.stamps[0].label}: <strong>{agent.stamps[0].val}</strong></span>
                      <span>{agent.stamps[0].note}</span>
                    </div>
                    <div className="ad-kanban-card-actions">
                      <button
                        onClick={() => setDrawerAgent(agent)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Passport
                      </button>
                      <button
                        onClick={() => handleInitiateApproval(agent)}
                        className="ad-btn-initiate-approval"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: ACTIVE (2) */}
            <div className="ad-kanban-column ad-kanban-col-active">
              <div className="ad-kanban-col-header">
                <div className="ad-kanban-col-title">
                  <span className="ad-kanban-dot-active" />
                  <span>ACTIVE IN PRODUCTION</span>
                </div>
                <span className="ad-kanban-col-badge">
                  {agentsList.filter(a => a.lifecycleStage === 'Active').length}
                </span>
              </div>

              <div className="ad-kanban-cards-stack">
                {agentsList.filter(a => a.lifecycleStage === 'Active').map((agent) => (
                  <div key={agent.id} className="ad-kanban-card ad-kanban-card-active">
                    <div className="ad-kanban-card-top">
                      <span className="st-badge badge-success" style={{ fontSize: '0.62rem' }}>
                        Active
                      </span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {agent.domain}
                      </span>
                    </div>
                    <div className="ad-kanban-card-title">{agent.name}</div>
                    <div className="ad-kanban-card-desc">{agent.desc}</div>
                    <div className="ad-kanban-card-metric">
                      <span>{agent.stamps[0].label}: <strong>{agent.stamps[0].val}</strong></span>
                      <span style={{ fontWeight: 700 }}>{agent.stamps[0].note}</span>
                    </div>
                    <div className="ad-kanban-card-actions">
                      <button
                        onClick={() => setDrawerAgent(agent)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Passport
                      </button>
                      <button
                        onClick={() => setSubscribeModalAgent(agent)}
                        className="ad-btn-subscribe-agent"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: SUSPENDED (2) */}
            <div className="ad-kanban-column ad-kanban-col-suspended">
              <div className="ad-kanban-col-header">
                <div className="ad-kanban-col-title">
                  <span className="ad-kanban-dot-suspended" />
                  <span>SUSPENDED (DRIFT)</span>
                </div>
                <span className="ad-kanban-col-badge">
                  {agentsList.filter(a => a.lifecycleStage === 'Suspended').length}
                </span>
              </div>

              <div className="ad-kanban-cards-stack">
                {agentsList.filter(a => a.lifecycleStage === 'Suspended').map((agent) => (
                  <div key={agent.id} className="ad-kanban-card ad-kanban-card-suspended">
                    <div className="ad-kanban-card-top">
                      <span className="st-badge badge-danger" style={{ fontSize: '0.62rem' }}>
                        Suspended
                      </span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {agent.domain}
                      </span>
                    </div>
                    <div className="ad-kanban-card-title">{agent.name}</div>
                    <div className="ad-kanban-card-desc">{agent.desc}</div>
                    <div className="ad-kanban-card-metric">
                      <span>{agent.stamps[0].label}: <strong>{agent.stamps[0].val}</strong></span>
                      <span>{agent.stamps[0].note}</span>
                    </div>
                    <div className="ad-kanban-card-actions">
                      <button
                        onClick={() => setDrawerAgent(agent)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Passport
                      </button>
                      <button
                        onClick={() => showToast(`Opening Governance Incident Log for ${agent.name}`)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem', color: '#b91c1c' }}
                      >
                        Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4: RETIRED ARCHIVE (2) */}
            <div className="ad-kanban-column ad-kanban-col-retired">
              <div className="ad-kanban-col-header">
                <div className="ad-kanban-col-title">
                  <span className="ad-kanban-dot-retired" />
                  <span>RETIRED ARCHIVE</span>
                </div>
                <span className="ad-kanban-col-badge">
                  {agentsList.filter(a => a.lifecycleStage === 'Retired').length}
                </span>
              </div>

              <div className="ad-kanban-cards-stack">
                {agentsList.filter(a => a.lifecycleStage === 'Retired').map((agent) => (
                  <div key={agent.id} className="ad-kanban-card ad-kanban-card-retired">
                    <div className="ad-kanban-card-top">
                      <span className="st-badge badge-secondary" style={{ fontSize: '0.62rem' }}>
                        Archived
                      </span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {agent.domain}
                      </span>
                    </div>
                    <div className="ad-kanban-card-title">{agent.name}</div>
                    <div className="ad-kanban-card-desc">{agent.desc}</div>
                    <div className="ad-kanban-card-metric">
                      <span>Decommissioned:</span>
                      <strong>{agent.stamps[0].val}</strong>
                    </div>
                    <div className="ad-kanban-card-actions">
                      <button
                        onClick={() => setDrawerAgent(agent)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Passport
                      </button>
                      <button
                        onClick={() => showToast(`Accessing Historical Archives for ${agent.name}`)}
                        className="ad-btn-passport"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.68rem' }}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PERFORMANCE PASSPORT SLIDE-OVER DRAWER                            */}
      {/* ================================================================= */}
      {drawerAgent && (
        <div className="ad-agent-drawer-backdrop" onClick={() => setDrawerAgent(null)}>
          <div className="ad-agent-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ad-agent-drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>
                    {drawerAgent.type}
                  </span>
                  <span className={`st-badge ${drawerAgent.lifecycleStage === 'Active' ? 'badge-success' : drawerAgent.lifecycleStage === 'Experimental' ? 'badge-warning' : drawerAgent.lifecycleStage === 'Suspended' ? 'badge-danger' : 'badge-secondary'}`} style={{ fontSize: '0.65rem' }}>
                    {drawerAgent.statusBadge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {drawerAgent.name}
                </h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
                  {drawerAgent.domain} • {drawerAgent.projectType}
                </div>
              </div>
              <button onClick={() => setDrawerAgent(null)} className="ad-agent-drawer-close-btn">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ad-agent-drawer-body">
              <div className="ad-agent-drawer-section">
                <span className="ad-agent-drawer-section-title">Operational Purpose</span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {drawerAgent.purpose}
                </p>
              </div>

              <div className="ad-agent-drawer-section">
                <span className="ad-agent-drawer-section-title">Ownership &amp; Governance</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--surface-tertiary)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Lead Engineering Squad</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{drawerAgent.owner}</div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--surface-tertiary)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Autonomy Clearance</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{drawerAgent.autonomy}</div>
                  </div>
                </div>
              </div>

              <div className="ad-agent-drawer-section">
                <span className="ad-agent-drawer-section-title">Empirical Benchmark Evaluations</span>
                <div className="ad-agent-eval-grid">
                  {drawerAgent.evalResults.map((res, rIdx) => (
                    <div key={rIdx} className="ad-agent-eval-item">
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{res.metric}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{res.delta}</div>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#4338ca' }}>
                        {res.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ad-agent-drawer-section">
                <span className="ad-agent-drawer-section-title">Telemetry I/O &amp; Tool Contracts</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Inputs: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{drawerAgent.inputs}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Outputs: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{drawerAgent.outputs}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Tool Contracts: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{drawerAgent.tools}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Security &amp; Permissions: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{drawerAgent.permissions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUBSCRIBE TO PROJECT MODAL                                        */}
      {/* ================================================================= */}
      {subscribeModalAgent && (
        <div className="ad-agent-modal-backdrop" onClick={() => setSubscribeModalAgent(null)}>
          <div className="ad-agent-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--badge-info-bg)', color: 'var(--badge-info-text)', border: '1px solid var(--badge-info-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>Subscribe Agent to Project</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subscribeModalAgent.name}</div>
                </div>
              </div>
              <button onClick={() => setSubscribeModalAgent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.78rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Select the project scope to bind this autonomous agent to active engineering workflows and telemetry monitors:
              </p>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Target Automotive Project
                </label>
                <select
                  value={subscribeProject}
                  onChange={(e) => setSubscribeProject(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.75rem' }}
                >
                  <option value="Release 4.2 Program">Release 4.2 Program (Active L2+ Production)</option>
                  <option value="Release 3.4 Maintenance">Release 3.4 Maintenance (Fleet Patch)</option>
                  <option value="Next-Gen Perception R&D">Next-Gen Perception R&D (Air-gapped Sandbox)</option>
                </select>
              </div>

              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <strong>Inheritance Policy:</strong> Agent quotas and runtime tokens are automatically inherited from your Product Manager portfolio allotment.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setSubscribeModalAgent(null)} className="ad-btn-passport">
                Cancel
              </button>
              <button onClick={handleConfirmSubscribe} className="ad-btn-subscribe-agent">
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* AGENT REGISTRATION PORTAL MODAL                                   */}
      {/* ================================================================= */}
      {registrationModalOpen && (
        <div className="ad-agent-modal-backdrop" onClick={() => setRegistrationModalOpen(false)}>
          <div className="ad-agent-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0b1a30', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>Register New Agent</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Autonomous Agent Blueprint Gateway</div>
                </div>
              </div>
              <button onClick={() => setRegistrationModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Initiate onboarding for a new candidate agent or multi-agent orchestration pipeline under Stellantis AI Safety Board directives:
              </p>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Agent Name</label>
                <input
                  type="text"
                  placeholder="e.g., LiDAR-Vision Synchronizer Agent"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Domain</label>
                  <select style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.72rem' }}>
                    <option>Perception Engineering</option>
                    <option>Product Management</option>
                    <option>Supply Chain / Dependency</option>
                    <option>Release Engineering</option>
                    <option>Diagnostics</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Initial Stage</label>
                  <select style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.72rem' }}>
                    <option>Experimental (Air-gapped)</option>
                    <option>Active in Production</option>
                  </select>
                </div>
              </div>

              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Registration creates an initial <strong>Candidate Passport</strong> and dispatches an ISO 26262 Tier 2 checklist request to Functional Safety.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setRegistrationModalOpen(false)} className="ad-btn-passport">
                Cancel
              </button>
              <button
                onClick={() => {
                  setRegistrationModalOpen(false);
                  showToast('Candidate Agent blueprint submitted. Verification ticket logged.');
                }}
                className="ad-btn-subscribe-agent"
              >
                Submit Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
