import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Filter,
  SlidersHorizontal,
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
  BarChart3,
  Gauge,
  Sliders,
  Server,
  Cloud,
  HardDrive
} from 'lucide-react';
import '../adModelCatalogue.css';

// Facet Constants
const ALL_PROVIDERS = ['Anthropic', 'Google', 'OpenAI', 'Mistral AI', 'Meta AI', 'DeepSeek AI'];
const ALL_CAPABILITIES = [
  'General Reasoning & Code',
  'Deep & Complex Reasoning',
  'Multimodal Telemetry & Vision',
  'Edge Simulation & Diagnostics'
];
const ALL_DEPLOYMENTS = [
  'Dedicated Sovereign Cloud',
  'Multi-Tenant Cloud API',
  'On-Premise Sovereign Cluster',
  'Private VPC Appliance'
];
const ALL_COST_TIERS = [
  'Economy Compute',
  'Standard Compute',
  'Premium Compute'
];

// 6 Commercial & Enterprise Foundation Models (Zero Internal AI Labs)
const INITIAL_MODELS = [
  {
    id: 'sonnet',
    name: 'Claude Sonnet 5',
    version: 'v5.1-Sonnet',
    provider: 'Anthropic',
    deployType: 'Dedicated Sovereign Cloud',
    costTier: 'Standard Compute',
    capabilityGroup: 'General Reasoning & Code',
    risk: 'Low Risk',
    status: 'Subscribed',
    scope: 'Project: Release 4.2 Program',
    desc: 'High-throughput reasoning and code generation for automotive software requirements, test generation, and safety analysis.',
    modality: 'Text • Structured JSON',
    latency: 'Low (<450ms)',
    latencyMs: 412,
    monthlyQuota: { used: 620000, total: 1000000, pct: 62 },
    benchmarkHighlight: '94% Requirement Traceability • 92% Code Accuracy',
    limitations: [
      'Cloud API latency depends on uplink network SLA (< 450ms typical). Not for hard real-time vehicle gateway actuators.',
      'Rate-limited to 1,000 requests/minute per enterprise agreement.'
    ],
    benchmarks: [
      { metric: 'Code & Test Generation Accuracy', val: '92.4%', note: 'Automotive C++ & Python test suites' },
      { metric: 'Requirement Traceability Match', val: '94.1%', note: 'NCAP requirement audit benchmarks' },
      { metric: 'Mean Inference Latency', val: '412 ms', note: 'Standard query completion' }
    ],
    usecases: [
      'Primary model for automotive requirement drafting and ISO 26262 verification test suites.',
      'Backbone for Trajectory Planner Edge-Case requirement analysis.'
    ],
    dataRestrictions: 'Approved for EU Sovereign Data Processing. Zero training retention per enterprise contract.',
    policy: 'Approved for PM Engineering workflow and automated requirement generation. Does not require dual-key sign-off.'
  },
  {
    id: 'opus',
    name: 'Claude Opus 5',
    version: 'v5.0-Opus',
    provider: 'Anthropic',
    deployType: 'Multi-Tenant Cloud API',
    costTier: 'Premium Compute',
    capabilityGroup: 'Deep & Complex Reasoning',
    risk: 'Low Risk',
    status: 'Approved',
    scope: 'Individual Project Scope Eligible',
    desc: 'Deep reasoning engine tailored for complex safety-case argument analysis, ASIL-D hazard validation, and ISO 26262 compliance proofs.',
    modality: 'Text • Structured Proofs',
    latency: 'Medium (~1.2s)',
    latencyMs: 1200,
    monthlyQuota: { used: 140000, total: 500000, pct: 28 },
    benchmarkHighlight: '98% Safety Case Precision • 99% Traceability',
    limitations: [
      'Higher latency profile (~1.2s mean) unsuitable for real-time edge or proving ground loops.',
      'High compute cost tier requiring portfolio budget justification.'
    ],
    benchmarks: [
      { metric: 'Safety-Case Argument Precision', val: '98.2%', note: 'ISO 26262 Part 3 benchmark' },
      { metric: 'Formal Traceability Proofs', val: '99.0%', note: 'ASIL-D audit rigor benchmark' }
    ],
    usecases: [
      'Complex safety-case argument generation, ASIL-D hazard analysis, and regulatory dossier preparation.'
    ],
    dataRestrictions: 'Approved under Stellantis Enterprise Privacy Shield.',
    policy: 'Access gated for Functional Safety and Systems Leads.'
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5 Pro',
    version: 'v2.5-Pro',
    provider: 'Google',
    deployType: 'Dedicated Sovereign Cloud',
    costTier: 'Standard Compute',
    capabilityGroup: 'Multimodal Telemetry & Vision',
    risk: 'Low Risk',
    status: 'Approved',
    scope: 'Project Scope Eligible',
    desc: 'Multimodal vision-language foundation model for automated driving incident analysis, camera log captioning, and multi-sensor document digestion.',
    modality: 'Text + Image (Multimodal)',
    latency: 'Low (<550ms)',
    latencyMs: 510,
    monthlyQuota: { used: 1280000, total: 2000000, pct: 64 },
    benchmarkHighlight: '2M Token Context Window • EU Frankfurt Sovereign GCP',
    limitations: [
      'Network jitter may impact batch telemetry ingest throughput.',
      'Requires GCP private interconnect endpoint.'
    ],
    benchmarks: [
      { metric: 'Multimodal Video Log Comprehension', val: '91.8%', note: 'Drive scene QA benchmark' },
      { metric: 'Context Retention at 1M Tokens', val: '99.4%', note: 'Needle-in-haystack test' }
    ],
    usecases: [
      'Continuous camera telemetry analysis, disengagement log captioning, and multi-sensor document digestion.'
    ],
    dataRestrictions: 'EU Sovereign Frankfurt cluster deployment.',
    policy: 'Approved for engineering analysis of proving ground video and incident logs.'
  },
  {
    id: 'gpt5',
    name: 'GPT-5',
    version: 'v5.0-Preview',
    provider: 'OpenAI',
    deployType: 'Multi-Tenant Cloud API',
    costTier: 'Premium Compute',
    capabilityGroup: 'Deep & Complex Reasoning',
    risk: 'High / Restricted',
    status: 'Restricted',
    scope: 'Restricted / Gated',
    desc: 'Next-generation frontier reasoning foundation model currently restricted from automotive deployment pending sovereign audit.',
    modality: 'Text • US Cloud',
    latency: 'Variable (~800ms)',
    latencyMs: 800,
    monthlyQuota: null,
    benchmarkHighlight: 'Gated: Directive 2026-03 • Egress Prohibited',
    isRestricted: true,
    limitations: [
      'RESTRICTED: Pending EU Data Sovereignty audit certification.',
      'Cannot receive confidential vehicle telemetry or ASIL-D safety logs.'
    ],
    benchmarks: [
      { metric: 'Theoretical Reasoning Score', val: '97.5%', note: 'Vendor benchmark (Non-audited)' }
    ],
    usecases: [
      'Restricted from all production AD and vehicle firmware pipelines.'
    ],
    dataRestrictions: 'PROHIBITED from processing any confidential telemetry, vehicle schematics, or customer data.',
    policy: 'Exceptions require Corporate AI Safety Board unanimous sign-off and Legal risk acceptance.'
  },
  {
    id: 'mistral',
    name: 'Mistral Large 2',
    version: 'v2.1-Sovereign',
    provider: 'Mistral AI',
    deployType: 'On-Premise Sovereign Cluster',
    costTier: 'Economy Compute',
    capabilityGroup: 'General Reasoning & Code',
    risk: 'Low Risk',
    status: 'Available',
    scope: 'Enterprise On-Prem',
    desc: 'European sovereign frontier foundation model deployed on Stellantis internal Paris & Frankfurt datacenter clusters with complete zero-egress guarantee.',
    modality: 'Text • Sovereign On-Prem',
    latency: 'Ultra-Low (<300ms)',
    latencyMs: 280,
    monthlyQuota: { used: 410000, total: 800000, pct: 51 },
    benchmarkHighlight: '100% On-Premise Sovereign • 0ms Cloud Egress',
    limitations: [
      'Deployed on internal GPU cluster; subject to cluster scheduling priority queues.',
      'Requires internal network VPN or high-speed proving ground fiber.'
    ],
    benchmarks: [
      { metric: 'Automotive C++ Code Review Accuracy', val: '93.1%', note: 'Internal Stellantis benchmark' },
      { metric: 'On-Premise Inference Latency', val: '280 ms', note: 'Hardware cluster mean' }
    ],
    usecases: [
      'Confidential telemetry analysis, internal AD-108 patch generation, and sovereign engineering sandbox.'
    ],
    dataRestrictions: 'EU Sovereign On-Premise Only (Stellantis Private Data Center). Zero telemetry egress.',
    policy: 'Pre-approved for all engineering tiers under standard enterprise license.'
  },
  {
    id: 'llama',
    name: 'Llama 3.3 70B Enterprise',
    version: 'v3.3-OrinVPC',
    provider: 'Meta AI',
    deployType: 'Private VPC Appliance',
    costTier: 'Economy Compute',
    capabilityGroup: 'Edge Simulation & Diagnostics',
    risk: 'Low Risk',
    status: 'Approved',
    scope: 'Simulation Bench Scope',
    desc: 'Fine-tuned open architecture containerized inside Stellantis Private VPC for high-throughput Balocco proving ground simulation telemetry digestion.',
    modality: 'Text • Private VPC Container',
    latency: 'Ultra-Low (<200ms)',
    latencyMs: 185,
    monthlyQuota: { used: 890000, total: 1500000, pct: 59 },
    benchmarkHighlight: 'Hardware-in-the-Loop Diagnostics • 185ms Inference',
    limitations: [
      'Quantized for NVIDIA Orin & DGX clusters; edge-case fine-tuning requires quarterly validation.',
      'Dedicated compute instances must be maintained per test bench.'
    ],
    benchmarks: [
      { metric: 'HIL Fault Trace Diagnostics', val: '95.6%', note: 'Balocco Rig benchmark' },
      { metric: 'Simulation Turnaround Latency', val: '185 ms', note: 'Dedicated VPC runtime' }
    ],
    usecases: [
      'Automated Hardware-in-the-Loop simulation diagnostics and ghost radar echo classification logs.'
    ],
    dataRestrictions: 'Private VPC Appliance with hardware isolation. Complies with ISO 26262 Part 4.',
    policy: 'Approved for Balocco test bench operators and Autonomous Driving verification engineers.'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-R1 Automotive',
    version: 'v1.2-R1-Sovereign',
    provider: 'DeepSeek AI',
    deployType: 'On-Premise Sovereign Cluster',
    costTier: 'Economy Compute',
    capabilityGroup: 'Deep & Complex Reasoning',
    risk: 'Low Risk',
    status: 'Approved',
    scope: 'Proving Ground Cluster',
    desc: 'Open-weights mathematical reasoning model containerized on internal Stellantis GPU clusters for automated trajectory calculus, path planning proofs, and physics verification.',
    modality: 'Text • Sovereign On-Prem',
    latency: 'Medium (~650ms)',
    latencyMs: 650,
    monthlyQuota: { used: 320000, total: 750000, pct: 43 },
    benchmarkHighlight: '96.4% Math & Logic Reasoning • 0ms Sovereign Egress',
    limitations: [
      'Batch reasoning throughput depends on nightly cluster job priority.',
      'Requires private cluster GPU node allocation.'
    ],
    benchmarks: [
      { metric: 'Trajectory Optimization Verification', val: '96.4%', note: 'Internal Stellantis benchmark' },
      { metric: 'Kinematic Constraint Proof Accuracy', val: '95.1%', note: 'Safety envelope benchmark' }
    ],
    usecases: [
      'Automated trajectory solver verification and kinematic constraint formal proofs.'
    ],
    dataRestrictions: 'EU Sovereign On-Premise Only (Stellantis Private Data Center). Zero telemetry egress.',
    policy: 'Approved for AD Controls and Trajectory Planning engineering squads.'
  },
  {
    id: 'geminiflash',
    name: 'Gemini 2.5 Flash',
    version: 'v2.5-Flash',
    provider: 'Google',
    deployType: 'Multi-Tenant Cloud API',
    costTier: 'Economy Compute',
    capabilityGroup: 'Multimodal Telemetry & Vision',
    risk: 'Low Risk',
    status: 'Available',
    scope: 'Telemetry Pipeline Scope',
    desc: 'High-speed multimodal vision-language model optimized for real-time video frame triage, radar point-cloud anomaly detection, and rapid sensor telemetry summarization.',
    modality: 'Text + Image (Multimodal)',
    latency: 'Ultra-Low (<220ms)',
    latencyMs: 215,
    monthlyQuota: { used: 195000, total: 1000000, pct: 20 },
    benchmarkHighlight: 'Sub-250ms Multimodal Ingest • 1M Token Context',
    limitations: [
      'Slightly lower reasoning depth on complex ISO 26262 formal proofs compared to Gemini 2.5 Pro.',
      'Cloud API subject to standard network egress latency.'
    ],
    benchmarks: [
      { metric: 'Video Frame Anomaly Triage', val: '93.2%', note: 'Proving ground clip QA' },
      { metric: 'Multi-Sensor Timestamp Alignment', val: '97.0%', note: 'Telemetry sync test' }
    ],
    usecases: [
      'Real-time camera telemetry triage, disengagement video frame captioning, and fast sensor diagnostics.'
    ],
    dataRestrictions: 'Stellantis Enterprise Cloud Gateway with automatic PII scrubbing.',
    policy: 'Pre-approved for all Perception and Telemetry engineering workflows.'
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-MOD-109',
    model: 'LiDAR-Net Pro',
    type: 'New Onboarding',
    timestamp: 'Today 09:15',
    scope: 'Release 4.2 (Next-Gen Perception)',
    status: 'pending',
    statusLabel: 'Pending Review',
    note: 'Under EU sovereign data residency check & vendor SOC2 audit.'
  },
  {
    id: 'REQ-MOD-104',
    model: 'Claude Opus 5',
    type: 'ASIL-D Proof Access',
    timestamp: 'Yesterday 14:30',
    scope: 'Project: Release 4.2 Program',
    status: 'approved',
    statusLabel: 'Approved',
    note: 'Co-signed by Lead Safety Engineer Dr. Marco V. Routed via Tab 2 Inbox.'
  },
  {
    id: 'REQ-MOD-098',
    model: 'GPT-5 Exception',
    type: 'Policy Exception',
    timestamp: '4 days ago',
    scope: 'Individual PM Sandbox',
    status: 'denied',
    statusLabel: 'Denied',
    note: 'Denied by AI Safety Board: US cloud egress violates ISO 26262 data policy.'
  }
];

export default function AdModelCatalogue() {
  // Navigation sub-tab
  const [activeSubtab, setActiveSubtab] = useState('browse'); // 'browse' | 'compare' | 'requests'

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Search & Filter State (Empty array = No filter applied on this dimension / All included)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedCaps, setSelectedCaps] = useState([]);
  const [selectedDeployments, setSelectedDeployments] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Slide-over Drawer
  const [drawerModel, setDrawerModel] = useState(null);

  // Modals
  const [subscribeModalModel, setSubscribeModalModel] = useState(null);
  const [subscribeScope, setSubscribeScope] = useState('Project');
  const [selectedProject, setSelectedProject] = useState('Release 4.2 Program');

  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    provider: 'Mistral AI',
    version: 'v1.0',
    justification: '',
    sovereignConfirmed: true
  });

  const [exceptionModalModel, setExceptionModalModel] = useState(null);
  const [exceptionReason, setExceptionReason] = useState('Air-gapped synthetic edge case evaluation only.');

  // Requests Table Filter
  const [reqFilter, setReqFilter] = useState('all');
  const [requestsList, setRequestsList] = useState(INITIAL_REQUESTS);

  // Model List State (to support real subscribe / scope updates)
  const [modelsList, setModelsList] = useState(INITIAL_MODELS);

  // Check if any facet filter is active
  const hasActiveFilters = Boolean(
    selectedCaps.length > 0 ||
    selectedDeployments.length > 0 ||
    selectedCosts.length > 0 ||
    selectedProviders.length > 0 ||
    selectedRisks.length > 0 ||
    searchQuery.trim() !== ''
  );

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProviders([]);
    setSelectedCaps([]);
    setSelectedDeployments([]);
    setSelectedCosts([]);
    setSelectedRisks([]);
    setSortBy('recommended');
    showToast('Facet filters reset — Showing all models');
  };

  // Dynamic Facet Count Engine (Calculates matching count across all facets in real-time)
  const getDynamicCount = (facetCategory, value) => {
    return modelsList.filter(m => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.deployType.toLowerCase().includes(q) ||
          m.costTier.toLowerCase().includes(q);
        if (!match) return false;
      }
      // 2. Provider Check
      if (facetCategory === 'provider') {
        if (m.provider !== value) return false;
      } else if (selectedProviders.length > 0) {
        if (!selectedProviders.includes(m.provider)) return false;
      }
      // 3. Capability Check
      if (facetCategory === 'capability') {
        if (m.capabilityGroup !== value) return false;
      } else if (selectedCaps.length > 0) {
        if (!selectedCaps.includes(m.capabilityGroup)) return false;
      }
      // 4. Deployment Check
      if (facetCategory === 'deployment') {
        if (m.deployType !== value) return false;
      } else if (selectedDeployments.length > 0) {
        if (!selectedDeployments.includes(m.deployType)) return false;
      }
      // 5. Cost Check
      if (facetCategory === 'cost') {
        if (m.costTier !== value) return false;
      } else if (selectedCosts.length > 0) {
        if (!selectedCosts.includes(m.costTier)) return false;
      }
      // 6. Risk Check
      if (facetCategory === 'risk') {
        if ((m.isRestricted ? 'restricted' : 'low') !== value) return false;
      } else if (selectedRisks.length > 0) {
        if (!selectedRisks.includes(m.isRestricted ? 'restricted' : 'low')) return false;
      }

      return true;
    }).length;
  };

  // Filter Models in real-time
  const filteredModels = useMemo(() => {
    let list = modelsList.filter(m => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.version.toLowerCase().includes(q) ||
          m.deployType.toLowerCase().includes(q) ||
          m.costTier.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Provider
      if (selectedProviders.length > 0 && !selectedProviders.includes(m.provider)) return false;
      // Capability
      if (selectedCaps.length > 0 && !selectedCaps.includes(m.capabilityGroup)) return false;
      // Deployment Type
      if (selectedDeployments.length > 0 && !selectedDeployments.includes(m.deployType)) return false;
      // Cost Tier
      if (selectedCosts.length > 0 && !selectedCosts.includes(m.costTier)) return false;
      // Risk
      if (selectedRisks.length > 0 && !selectedRisks.includes(m.isRestricted ? 'restricted' : 'low')) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'latency') {
      list = [...list].sort((a, b) => a.latencyMs - b.latencyMs);
    } else if (sortBy === 'cost') {
      const tierRank = { 'Economy Compute': 1, 'Standard Compute': 2, 'Premium Compute': 3 };
      list = [...list].sort((a, b) => (tierRank[a.costTier] || 0) - (tierRank[b.costTier] || 0));
    } else if (sortBy === 'risk') {
      list = [...list].sort((a, b) => (a.isRestricted ? 1 : 0) - (b.isRestricted ? 1 : 0));
    }

    return list;
  }, [modelsList, searchQuery, selectedProviders, selectedCaps, selectedDeployments, selectedCosts, selectedRisks, sortBy]);

  // Handle Subscription
  const handleConfirmSubscribe = () => {
    if (!subscribeModalModel) return;
    setModelsList(prev => prev.map(m => {
      if (m.id === subscribeModalModel.id) {
        return {
          ...m,
          status: 'Subscribed',
          scope: subscribeScope === 'Project' ? `Project: ${selectedProject}` : `${subscribeScope} Scope`
        };
      }
      return m;
    }));
    showToast(`Subscription confirmed for ${subscribeModalModel.name} (${subscribeScope})`);
    setSubscribeModalModel(null);
  };

  // Handle Onboarding Submission
  const handleSubmitOnboard = (e) => {
    e.preventDefault();
    if (!onboardForm.name) return;
    const newReq = {
      id: `REQ-MOD-${Math.floor(100 + Math.random() * 900)}`,
      model: onboardForm.name,
      type: 'New Onboarding',
      timestamp: 'Just now',
      scope: 'Release 4.2 Program',
      status: 'pending',
      statusLabel: 'Pending Review',
      note: `Requested by PM: ${onboardForm.justification.slice(0, 50)}...`
    };
    setRequestsList(prev => [newReq, ...prev]);
    setOnboardingModalOpen(false);
    showToast(`Onboarding request submitted for ${onboardForm.name}`);
    setOnboardForm({ name: '', provider: 'Mistral AI', version: 'v1.0', justification: '', sovereignConfirmed: true });
  };

  // Handle Exception Submission
  const handleSubmitException = () => {
    showToast(`Exception request submitted for ${exceptionModalModel?.name}. Routed to AI Safety Board.`);
    setExceptionModalModel(null);
  };

  // Filter Requests
  const filteredRequests = useMemo(() => {
    if (reqFilter === 'all') return requestsList;
    return requestsList.filter(r => r.status === reqFilter);
  }, [requestsList, reqFilter]);

  return (
    <div className="ad-models-container">

      {/* Floating Bottom-Right Corner Toast Notification */}
      {toastMessage && (
        <div className="ad-inbox-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* HEADER & SUB-NAV BAR                                              */}
      {/* ================================================================= */}
      <div className="ad-models-header-card">
        <div className="ad-models-header-title-group">
          <div className="ad-models-header-icon">
            <Cpu size={22} />
          </div>
          <div className="ad-models-header-text">
            <h2>
              <span>Model Catalogue</span>
              <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
                {modelsList.length} Models Active
              </span>
            </h2>
            <p>Commercial &amp; enterprise automotive foundation models, empirical radar benchmark evaluations, and multi-tier subscription quotas.</p>
          </div>
        </div>

        {/* Sub-nav Buttons & Onboarding Trigger */}
        <div className="ad-models-subnav-actions">
          <div className="ad-models-subtab-track">
            <button
              onClick={() => setActiveSubtab('browse')}
              className={`ad-models-subtab-btn ${activeSubtab === 'browse' ? 'active' : ''}`}
            >
              <SlidersHorizontal size={14} />
              <span>Browse Models ({modelsList.length})</span>
            </button>
            <button
              onClick={() => setActiveSubtab('compare')}
              className={`ad-models-subtab-btn ${activeSubtab === 'compare' ? 'active' : ''}`}
            >
              <BarChart3 size={14} />
              <span>Compare Models (3)</span>
            </button>
            <button
              onClick={() => setActiveSubtab('requests')}
              className={`ad-models-subtab-btn ${activeSubtab === 'requests' ? 'active' : ''}`}
            >
              <Clock size={14} />
              <span>My Requests &amp; Quotas ({requestsList.length})</span>
            </button>
          </div>

          <button
            onClick={() => setOnboardingModalOpen(true)}
            className="ad-btn-onboard"
          >
            <Plus size={14} />
            <span>Request New Model Onboarding</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SUB-TAB 1: BROWSE MODELS (FACET FILTERS + MODEL CARDS)             */}
      {/* ================================================================= */}
      {activeSubtab === 'browse' && (
        <div className="ad-models-browse-layout">

          {/* Left Facet Filters Aside */}
          <aside className="ad-models-facet-aside">
            <div className="ad-facet-header">
              <div className="ad-facet-title">
                <Filter size={13} />
                <span>Facet Filters</span>
              </div>
              <button onClick={handleResetFilters} className="ad-facet-reset-btn">
                Reset All
              </button>
            </div>

            {/* 1. Capability Filter (DYNAMIC COUNTERS) */}
            <div className="ad-facet-section">
              <div className="ad-facet-section-header">
                <span>Capability</span>
              </div>
              <div className="ad-facet-options">
                {ALL_CAPABILITIES.map(cap => {
                  const count = getDynamicCount('capability', cap);
                  const checked = selectedCaps.includes(cap);
                  return (
                    <label key={cap} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCaps([...selectedCaps, cap]);
                            } else {
                              setSelectedCaps(selectedCaps.filter(c => c !== cap));
                            }
                          }}
                        />
                        <span>{cap}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Deployment Type Filter (DYNAMIC COUNTERS) */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header">
                <span>Deployment Type</span>
              </div>
              <div className="ad-facet-options">
                {ALL_DEPLOYMENTS.map(dep => {
                  const count = getDynamicCount('deployment', dep);
                  const checked = selectedDeployments.includes(dep);
                  return (
                    <label key={dep} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDeployments([...selectedDeployments, dep]);
                            } else {
                              setSelectedDeployments(selectedDeployments.filter(d => d !== dep));
                            }
                          }}
                        />
                        <span>{dep}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Cost Tier Filter (DYNAMIC COUNTERS - ZERO DOLLAR SIGNS) */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header">
                <span>Cost Tier</span>
              </div>
              <div className="ad-facet-options">
                {ALL_COST_TIERS.map(tier => {
                  const count = getDynamicCount('cost', tier);
                  const checked = selectedCosts.includes(tier);
                  return (
                    <label key={tier} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCosts([...selectedCosts, tier]);
                            } else {
                              setSelectedCosts(selectedCosts.filter(t => t !== tier));
                            }
                          }}
                        />
                        <span>{tier}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Provider Filter (DYNAMIC COUNTERS) */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header">
                <span>Provider</span>
              </div>
              <div className="ad-facet-options">
                {ALL_PROVIDERS.map(prov => {
                  const count = getDynamicCount('provider', prov);
                  const checked = selectedProviders.includes(prov);
                  return (
                    <label key={prov} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProviders([...selectedProviders, prov]);
                            } else {
                              setSelectedProviders(selectedProviders.filter(p => p !== prov));
                            }
                          }}
                        />
                        <span>{prov}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Risk Rating Filter (DYNAMIC COUNTERS) */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header">
                <span>Risk Rating</span>
              </div>
              <div className="ad-facet-options">
                <label className={`ad-facet-label ${getDynamicCount('risk', 'low') === 0 ? 'zero-count' : ''} ${selectedRisks.includes('low') ? 'is-checked' : ''}`}>
                  <div className="ad-facet-label-left">
                    <input
                      type="checkbox"
                      checked={selectedRisks.includes('low')}
                      onChange={(e) => {
                        setSelectedRisks(e.target.checked ? [...selectedRisks, 'low'] : selectedRisks.filter(r => r !== 'low'));
                      }}
                    />
                    <span>Low Risk</span>
                  </div>
                  <span className="ad-facet-count">{getDynamicCount('risk', 'low')}</span>
                </label>
                <label className={`ad-facet-label ${getDynamicCount('risk', 'restricted') === 0 ? 'zero-count' : ''} ${selectedRisks.includes('restricted') ? 'is-checked' : ''}`}>
                  <div className="ad-facet-label-left">
                    <input
                      type="checkbox"
                      checked={selectedRisks.includes('restricted')}
                      onChange={(e) => {
                        setSelectedRisks(e.target.checked ? [...selectedRisks, 'restricted'] : selectedRisks.filter(r => r !== 'restricted'));
                      }}
                    />
                    <span>High / Restricted</span>
                  </div>
                  <span className="ad-facet-count">{getDynamicCount('risk', 'restricted')}</span>
                </label>
              </div>
            </div>

          </aside>

          {/* Main Grid Area */}
          <main className="ad-models-main-area">

            {/* Search Bar & Controls */}
            <div className="ad-models-search-bar">
              <div className="ad-models-search-input-box">
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search models by name, provider, deployment type, cost tier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ad-models-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="ad-models-meta-count">
                <span>Showing {filteredModels.length} of {modelsList.length} Models</span>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: 'transparent', border: 'none', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="recommended">Recommended Fit (AI for AD)</option>
                    <option value="cost">Cost Tier (Economy &rarr; Premium)</option>
                    <option value="latency">Latency (Fastest First)</option>
                    <option value="risk">Risk Rating (Low &rarr; High)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Tag Strip */}
            {hasActiveFilters && (
              <div className="ad-active-filters-bar">
                <span className="ad-active-filters-label">Active Filters:</span>
                {selectedCaps.map(c => (
                  <span key={c} className="ad-filter-chip">
                    <span>Cap: {c}</span>
                    <button onClick={() => setSelectedCaps(selectedCaps.filter(x => x !== c))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedDeployments.map(d => (
                  <span key={d} className="ad-filter-chip">
                    <span>Deploy: {d}</span>
                    <button onClick={() => setSelectedDeployments(selectedDeployments.filter(x => x !== d))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedCosts.map(t => (
                  <span key={t} className="ad-filter-chip">
                    <span>Cost: {t}</span>
                    <button onClick={() => setSelectedCosts(selectedCosts.filter(x => x !== t))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedProviders.map(p => (
                  <span key={p} className="ad-filter-chip">
                    <span>Provider: {p}</span>
                    <button onClick={() => setSelectedProviders(selectedProviders.filter(x => x !== p))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {selectedRisks.map(r => (
                  <span key={r} className="ad-filter-chip">
                    <span>Risk: {r === 'low' ? 'Low Risk' : 'High / Restricted'}</span>
                    <button onClick={() => setSelectedRisks(selectedRisks.filter(x => x !== r))} title="Remove filter"><X size={11} /></button>
                  </span>
                ))}
                {searchQuery.trim() && (
                  <span className="ad-filter-chip">
                    <span>Search: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} title="Clear search"><X size={11} /></button>
                  </span>
                )}
                <button onClick={handleResetFilters} className="ad-filter-chip-clear">Clear All</button>
              </div>
            )}

            {/* Models Grid */}
            {filteredModels.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface-primary)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                <Cpu size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>No Models Match Filter Criteria</h4>
                <p style={{ margin: '4px 0 16px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Try adjusting your Capability, Deployment Type, Cost Tier, or Provider selections.
                </p>
                <button onClick={handleResetFilters} className="ad-btn-subscribe">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="ad-models-grid">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`ad-model-card ${model.isRestricted ? 'restricted' : ''}`}
                  >
                    <div>
                      {/* Top Tag Strip */}
                      <div className="ad-model-top-strip">
                        <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
                          {model.provider}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`st-badge ${model.isRestricted ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.62rem' }}>
                            {model.risk}
                          </span>
                          <span className={`st-badge ${model.status === 'Subscribed' ? 'badge-purple' : model.status === 'Approved' ? 'badge-secondary' : 'badge-danger'}`} style={{ fontSize: '0.62rem' }}>
                            {model.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & Version */}
                      <div className="ad-model-title-row">
                        <h3>{model.name}</h3>
                        <span className="ad-model-version-tag">{model.version}</span>
                      </div>

                      {/* Description */}
                      <p className="ad-model-desc">{model.desc}</p>

                      {/* Attributes Grid (NO DOLLAR SIGNS) */}
                      <div className="ad-model-attrs-grid">
                        <div>
                          <span className="ad-model-attr-label">Capability:</span>
                          <span className="ad-model-attr-val" style={{ color: '#2563eb' }}>{model.capabilityGroup}</span>
                        </div>
                        <div>
                          <span className="ad-model-attr-label">Cost Tier:</span>
                          <span className="ad-model-attr-val" style={{ color: model.costTier === 'Economy Compute' ? '#16a34a' : model.costTier === 'Premium Compute' ? '#9333ea' : '#2563eb' }}>
                            {model.costTier}
                          </span>
                        </div>
                        <div>
                          <span className="ad-model-attr-label">Deployment Type:</span>
                          <span className="ad-model-attr-val">{model.deployType}</span>
                        </div>
                        <div>
                          <span className="ad-model-attr-label">Latency Benchmark:</span>
                          <span className="ad-model-attr-val">{model.latency}</span>
                        </div>
                        <div style={{ gridColumn: 'span 2', paddingTop: '6px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
                          <span className="ad-model-attr-label">Scope / Highlight:</span>
                          <span className="ad-model-attr-val" style={{ color: model.isRestricted ? '#e11d48' : '#1e40af' }}>
                            {model.scope}
                          </span>
                        </div>
                      </div>

                      {/* Quota Gauge (if applicable) */}
                      {model.monthlyQuota && (
                        <div className="ad-model-quota-strip">
                          <div className="ad-model-quota-info">
                            <span>Monthly Token Quota ({model.monthlyQuota.pct}%)</span>
                            <span>{(model.monthlyQuota.used / 1000).toFixed(0)}k / {(model.monthlyQuota.total / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="ad-model-quota-track">
                            <div
                              className="ad-model-quota-bar"
                              style={{
                                width: `${model.monthlyQuota.pct}%`,
                                background: model.monthlyQuota.pct > 80 ? '#e11d48' : '#2563eb'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Restricted Governance Banner */}
                      {model.isRestricted && (
                        <div style={{ marginTop: '10px', padding: '10px', borderRadius: '10px', background: 'var(--badge-critical-bg)', border: '1px solid var(--badge-critical-border)', fontSize: '0.7rem', color: 'var(--badge-critical-text)', lineHeight: 1.4 }}>
                          <strong>Governance Gating Directive 2026-03:</strong> Egress prohibited pending EU Sovereign Data Residency audit. Cannot be deployed to vehicle firmware or safety-critical pipelines.
                        </div>
                      )}
                    </div>

                    {/* Card Action Footer */}
                    <div className="ad-model-card-footer">
                      {model.isRestricted ? (
                        <button
                          onClick={() => setExceptionModalModel(model)}
                          className="ad-btn-exception"
                        >
                          <AlertTriangle size={13} />
                          <span>Request Exception</span>
                        </button>
                      ) : model.status === 'Subscribed' ? (
                        <button
                          onClick={() => setSubscribeModalModel(model)}
                          className="ad-btn-scope-modify"
                        >
                          Modify Scope
                        </button>
                      ) : (
                        <button
                          onClick={() => setSubscribeModalModel(model)}
                          className="ad-btn-subscribe"
                        >
                          Subscribe Model
                        </button>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => setDrawerModel(model)}
                          className="ad-btn-card-details"
                        >
                          {model.isRestricted ? 'Gating Details' : 'Model Card'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSubtab('compare');
                            showToast(`Opened comparison matrix for ${model.name}`);
                          }}
                          className="ad-btn-card-details"
                          title="Compare in Matrix"
                          style={{ padding: '6px 8px' }}
                        >
                          <BarChart3 size={13} />
                        </button>
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
      {/* SUB-TAB 2: COMPARE MODELS (SVG OVERLAID RADAR + SPEC MATRIX)       */}
      {/* ================================================================= */}
      {activeSubtab === 'compare' && (
        <div className="ad-models-compare-card">
          <div className="ad-compare-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>Evaluation Mode</span>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Comparing 3 Candidate Commercial Foundation Models
                </h3>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Evaluation Context: <strong>Safety-Case Documentation Review &amp; ASIL-D Argument Validation (Release 4.2)</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>Claude Sonnet 5</span>
              <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>Claude Opus 5</span>
              <span className="st-badge badge-success" style={{ fontSize: '0.65rem' }}>Gemini 2.5 Pro</span>
            </div>
          </div>

          {/* Upper Grid: 4-Axis Overlaid Radar + Empirical Synthesis */}
          <div className="ad-radar-spec-grid">

            {/* Overlaid SVG Radar Chart */}
            <div className="ad-radar-box">
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                4-Axis Performance &amp; Safety Radar
              </div>
              <svg className="ad-radar-svg" viewBox="0 0 440 400" style={{ width: '100%', maxWidth: '360px', height: 'auto' }}>
                {/* Concentric Polygons */}
                <polygon points="220,160 260,200 220,240 180,200" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="220,120 300,200 220,280 140,200" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="220,80  340,200 220,320 100,200" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="220,40  380,200 220,360 60,200" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Axes */}
                <line x1="220" y1="40" x2="220" y2="360" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="60" y1="200" x2="380" y2="200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Axis Labels */}
                <text x="220" y="24" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Accuracy &amp; Precision</text>
                <text x="390" y="204" textAnchor="start" fill="#0f172a" fontSize="10" fontWeight="bold">Speed &amp; Latency</text>
                <text x="220" y="385" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Cost-Efficiency</text>
                <text x="50" y="204" textAnchor="end" fill="#0f172a" fontSize="10" fontWeight="bold">Safety &amp; ISO 26262</text>

                {/* Claude Opus 5 (Purple) */}
                <polygon points="220,43.2 335.2,200 220,292.8 61.6,200" fill="rgba(147, 51, 234, 0.16)" stroke="#9333ea" strokeWidth="2.5" />
                <circle cx="220" cy="43.2" r="3.5" fill="#9333ea" />
                <circle cx="335.2" cy="200" r="3.5" fill="#9333ea" />
                <circle cx="220" cy="292.8" r="3.5" fill="#9333ea" />
                <circle cx="61.6" cy="200" r="3.5" fill="#9333ea" />

                {/* Claude Sonnet 5 (Blue) */}
                <polygon points="220,52.8 370.4,200 220,340.8 76,200" fill="rgba(37, 99, 235, 0.16)" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="220" cy="52.8" r="3.5" fill="#2563eb" />
                <circle cx="370.4" cy="200" r="3.5" fill="#2563eb" />
                <circle cx="220" cy="340.8" r="3.5" fill="#2563eb" />
                <circle cx="76" cy="200" r="3.5" fill="#2563eb" />

                {/* Gemini 2.5 Pro (Emerald) */}
                <polygon points="220,54.4 367.2,200 220,337.6 79.2,200" fill="rgba(5, 150, 105, 0.16)" stroke="#059669" strokeWidth="2" />
                <circle cx="220" cy="54.4" r="3" fill="#059669" />
                <circle cx="367.2" cy="200" r="3.5" fill="#059669" />
                <circle cx="220" cy="337.6" r="3.5" fill="#059669" />
                <circle cx="79.2" cy="200" r="3.5" fill="#059669" />
              </svg>
            </div>

            {/* Empirical Synthesis Cards */}
            <div className="ad-radar-legend-list">
              <div className="ad-radar-legend-card" style={{ background: 'var(--badge-info-bg)', border: '1px solid var(--badge-info-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--badge-info-text)' }}>Claude Sonnet 5 &bull; Recommended Workhorse</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--badge-info-text)' }}>Score: 91/100</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Optimal balance for daily PM engineering. High latency throughput (94%) and Standard Compute cost efficiency while maintaining 90% ISO safety rigor.
                </p>
              </div>

              <div className="ad-radar-legend-card" style={{ background: 'var(--badge-purple-bg)', border: '1px solid var(--badge-purple-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--badge-purple-text)' }}>Claude Opus 5 &bull; Deep Safety Specialist</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--badge-purple-text)' }}>Score: 82/100</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Highest accuracy (98%) and safety traceability (99%). Premium Compute tier justified for critical quarterly ASIL-D reviews.
                </p>
              </div>

              <div className="ad-radar-legend-card" style={{ background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--badge-success-text)' }}>Gemini 2.5 Pro &bull; Multimodal Champion</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--badge-success-text)' }}>Score: 89/100</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Exceptional multimodal camera telemetry digestion. 2M token context window allows ingest of raw incident camera clips; sovereign EU Frankfurt endpoint.
                </p>
              </div>
            </div>
          </div>

          {/* Synchronized Spec Diff Matrix Table */}
          <div className="ad-spec-table-wrap">
            <table className="ad-spec-table">
              <thead>
                <tr>
                  <th>Specification Dimension</th>
                  <th style={{ color: 'var(--badge-info-text)', background: 'var(--badge-info-bg)' }}>Claude Sonnet 5 (Recommended)</th>
                  <th style={{ color: 'var(--badge-purple-text)', background: 'var(--badge-purple-bg)' }}>Claude Opus 5</th>
                  <th style={{ color: 'var(--badge-success-text)', background: 'var(--badge-success-bg)' }}>Gemini 2.5 Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Provider &amp; Model Version</td>
                  <td style={{ fontWeight: 600, color: '#1e40af' }}>Anthropic &bull; v5.1</td>
                  <td style={{ fontWeight: 600, color: '#6b21a8' }}>Anthropic &bull; v5.0</td>
                  <td style={{ fontWeight: 600, color: '#065f46' }}>Google GCP &bull; v2.5</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Primary Modality</td>
                  <td>Text &bull; Structured JSON</td>
                  <td>Text &bull; Formal Proofs</td>
                  <td>Text + Image &bull; Multimodal</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Deployment Type</td>
                  <td>Dedicated Sovereign Cloud</td>
                  <td>Multi-Tenant Cloud API</td>
                  <td>Dedicated Sovereign Cloud</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Context Window</td>
                  <td>200,000 Tokens</td>
                  <td>200,000 Tokens</td>
                  <td style={{ fontWeight: 700, color: '#047857' }}>2,000,000 Tokens</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Mean Inference Latency</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>412 ms (Fastest)</td>
                  <td style={{ color: '#b45309' }}>1,200 ms (~3x Slower)</td>
                  <td>510 ms (Nominal)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Cost Tier</td>
                  <td>Standard Compute</td>
                  <td style={{ color: '#7e22ce', fontWeight: 700 }}>Premium Compute</td>
                  <td>Standard Compute</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>ISO 26262 Suitability</td>
                  <td>Automated Requirement &amp; Test Drafting</td>
                  <td style={{ fontWeight: 700, color: '#6b21a8' }}>ASIL-D Argument Formal Validation</td>
                  <td>Disengagement Telemetry &amp; Camera Logs</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Data Residency Zone</td>
                  <td>EU Sovereign Frankfurt Cluster</td>
                  <td>EU Sovereign Frankfurt Cluster</td>
                  <td>EU Sovereign GCP Frankfurt (CMEK)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 3: MY REQUESTS & QUOTAS                                   */}
      {/* ================================================================= */}
      {activeSubtab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Section 1: Requests Table */}
          <div className="ad-requests-card">
            <div className="ad-requests-header">
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Model Access &amp; Onboarding Requests
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Track PM onboarding submissions, gated access requests, and governance exception petitions.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="ad-requests-filter-pills">
                {['all', 'pending', 'approved', 'denied'].map(status => (
                  <button
                    key={status}
                    onClick={() => setReqFilter(status)}
                    className={`ad-req-pill ${reqFilter === status ? 'active' : ''}`}
                  >
                    {status.toUpperCase()} ({status === 'all' ? requestsList.length : requestsList.filter(r => r.status === status).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="ad-spec-table-wrap">
              <table className="ad-spec-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Model Name</th>
                    <th>Request Type</th>
                    <th>Timestamp</th>
                    <th>Scope / Program</th>
                    <th>Status</th>
                    <th>Governance Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(req => (
                    <tr key={req.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{req.id}</td>
                      <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{req.model}</td>
                      <td>
                        <span className="st-badge badge-info" style={{ fontSize: '0.62rem' }}>{req.type}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{req.timestamp}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{req.scope}</td>
                      <td>
                        <span className={`st-badge ${req.status === 'approved' ? 'badge-success' : req.status === 'pending' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.62rem' }}>
                          {req.statusLabel}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.note}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {req.status === 'approved' ? (
                          <button
                            onClick={() => {
                              const found = modelsList.find(m => m.name.includes(req.model));
                              if (found) setSubscribeModalModel(found);
                              else showToast(`Opening subscription for ${req.model}`);
                            }}
                            className="ad-btn-subscribe"
                            style={{ padding: '4px 8px', fontSize: '0.68rem' }}
                          >
                            Subscribe
                          </button>
                        ) : req.status === 'pending' ? (
                          <button
                            onClick={() => {
                              setRequestsList(prev => prev.filter(r => r.id !== req.id));
                              showToast(`Request ${req.id} withdrawn.`);
                            }}
                            className="ad-btn-card-details"
                            style={{ padding: '4px 8px', fontSize: '0.68rem', color: '#e11d48' }}
                          >
                            Withdraw
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`Opening Governance Appeal dossier for ${req.id}`)}
                            className="ad-btn-card-details"
                            style={{ padding: '4px 8px', fontSize: '0.68rem' }}
                          >
                            Appeal
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Real-time Quota Consumption Gauges */}
          <div className="ad-quotas-grid">
            {/* Quota 1: Claude Sonnet 5 */}
            <div className="ad-quota-gauge-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
                  <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>Claude Sonnet 5 &bull; Monthly Quota Burn</strong>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.62rem' }}>Project Scoped</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }}>
                  620,000 <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 1,000,000 Tokens</span>
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb', fontSize: '0.78rem' }}>62.0% Used</span>
              </div>

              <div className="ad-model-quota-track" style={{ height: '8px' }}>
                <div className="ad-model-quota-bar" style={{ width: '62%', background: '#2563eb' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                <div>Avg Burn: <strong style={{ color: 'var(--text-primary)' }}>42k / day</strong></div>
                <div>Exhaustion: <strong style={{ color: 'var(--text-primary)' }}>11 days</strong></div>
                <div style={{ textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>&check; On Track</div>
              </div>
            </div>

            {/* Quota 2: Gemini 2.5 Pro */}
            <div className="ad-quota-gauge-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
                  <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>Gemini 2.5 Pro &bull; Multimodal Telemetry Context Quota</strong>
                </div>
                <span className="st-badge badge-success" style={{ fontSize: '0.62rem' }}>EU Sovereign GCP</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }}>
                  1,280,000 <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 2,000,000 Tokens</span>
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#059669', fontSize: '0.78rem' }}>64.0% Used</span>
              </div>

              <div className="ad-model-quota-track" style={{ height: '8px' }}>
                <div className="ad-model-quota-bar" style={{ width: '64%', background: '#059669' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                <div>Avg Burn: <strong style={{ color: 'var(--text-primary)' }}>84k / day</strong></div>
                <div>Context Cap: <strong style={{ color: 'var(--text-primary)' }}>2.0M Tokens</strong></div>
                <div style={{ textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>&check; Compliant</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SLIDE-OVER MODEL DATASHEET DRAWER                                 */}
      {/* ================================================================= */}
      {drawerModel && (
        <div className="ad-drawer-backdrop" onClick={() => setDrawerModel(null)}>
          <div className="ad-slide-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ad-drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>{drawerModel.provider}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{drawerModel.version}</span>
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  {drawerModel.name}
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Status: <strong>{drawerModel.status}</strong> &bull; {drawerModel.scope}
                </div>
              </div>

              <button
                onClick={() => setDrawerModel(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ad-drawer-body">
              {/* Architecture & Deployment */}
              <div>
                <div className="ad-drawer-section-title">1. Architecture &amp; Deployment Engine</div>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--surface-tertiary, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)', fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {drawerModel.desc} Modality: {drawerModel.modality}. Deployment Architecture: {drawerModel.deployType} ({drawerModel.costTier}).
                </div>
              </div>

              {/* Limitations */}
              <div>
                <div className="ad-drawer-section-title">2. Operational Limitations &amp; Blindspots</div>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--badge-high-bg)', border: '1px solid var(--badge-high-border)', color: 'var(--badge-high-text)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {drawerModel.limitations.map((lim, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empirical Benchmarks */}
              <div>
                <div className="ad-drawer-section-title">3. Empirical Automotive Benchmarks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {drawerModel.benchmarks.map((bm, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', background: 'var(--surface-tertiary, #f8fafc)', border: '1px solid var(--border-color, #f1f5f9)' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{bm.metric}</strong>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{bm.note}</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>{bm.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <div className="ad-drawer-section-title">4. Approved Use Cases</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {drawerModel.usecases.map((uc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Check size={13} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Residency & Policy */}
              <div>
                <div className="ad-drawer-section-title">5. Data Residency &amp; Governance Policy</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem' }}>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--badge-info-bg)', border: '1px solid var(--badge-info-border)', color: 'var(--badge-info-text)' }}>
                    <strong>Residency:</strong> {drawerModel.dataRestrictions}
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--surface-tertiary, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)', color: 'var(--text-secondary)' }}>
                    <strong>Policy:</strong> {drawerModel.policy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUBSCRIBE / SCOPE MODAL                                           */}
      {/* ================================================================= */}
      {subscribeModalModel && (
        <div className="ad-modal-backdrop" onClick={() => setSubscribeModalModel(null)}>
          <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>
                  Configure Subscription Scope &bull; {subscribeModalModel.name}
                </h3>
              </div>
              <button onClick={() => setSubscribeModalModel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div className="ad-modal-body">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Select the organizational scope level to allocate token consumption quotas ({subscribeModalModel.costTier}) and assign billing to the appropriate cost center.
              </p>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Subscription Scope Tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['Organization', 'Portfolio', 'Project', 'Individual Sandbox'].map(scope => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setSubscribeScope(scope)}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        border: subscribeScope === scope ? '2px solid #2563eb' : '1px solid var(--border-color, #cbd5e1)',
                        background: subscribeScope === scope ? '#eff6ff' : 'transparent',
                        color: subscribeScope === scope ? '#1d4ed8' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

              {subscribeScope === 'Project' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Target Engineering Project</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="ad-facet-select"
                  >
                    <option value="Release 4.2 Program">Release 4.2 Program (AD-104 / AD-108)</option>
                    <option value="Release 3.4 Maintenance">Release 3.4 Maintenance &bull; Adaptive Cruise</option>
                    <option value="Next-Gen Perception Labs">Next-Gen Perception Labs &bull; LiDAR Benchmark</option>
                  </select>
                </div>
              )}

              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', color: 'var(--badge-success-text)', fontSize: '0.7rem' }}>
                &check; <strong>Pre-approved:</strong> Meets all ISO 26262 compliance gates for automated requirements generation under {subscribeModalModel.costTier}.
              </div>
            </div>

            <div className="ad-modal-footer">
              <button onClick={() => setSubscribeModalModel(null)} className="ad-btn-card-details">
                Cancel
              </button>
              <button onClick={handleConfirmSubscribe} className="ad-btn-subscribe">
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* ONBOARDING REQUEST MODAL                                          */}
      {/* ================================================================= */}
      {onboardingModalOpen && (
        <div className="ad-modal-backdrop" onClick={() => setOnboardingModalOpen(false)}>
          <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>
                  Request New Model Onboarding (PRD §5.3)
                </h3>
              </div>
              <button onClick={() => setOnboardingModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitOnboard}>
              <div className="ad-modal-body">
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Model Name &amp; Candidate Version</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Qwen 2.5 Coder, DeepSeek R1..."
                    value={onboardForm.name}
                    onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.75rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Vendor / Provider</label>
                    <select
                      value={onboardForm.provider}
                      onChange={(e) => setOnboardForm({ ...onboardForm, provider: e.target.value })}
                      className="ad-facet-select"
                    >
                      <option value="Mistral AI">Mistral AI (EU Sovereign)</option>
                      <option value="Anthropic">Anthropic PBC</option>
                      <option value="Google Cloud">Google Cloud</option>
                      <option value="Meta AI">Meta AI (Open Weight)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Intended Program</label>
                    <select className="ad-facet-select">
                      <option>Release 4.2 Program</option>
                      <option>Release 3.4 Maintenance</option>
                      <option>Autonomous Systems Sandbox</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Technical &amp; Business Justification</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify why existing approved models cannot fulfill this use case..."
                    value={onboardForm.justification}
                    onChange={(e) => setOnboardForm({ ...onboardForm, justification: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.72rem', outline: 'none' }}
                  />
                </div>

                <label className="ad-facet-label" style={{ fontSize: '0.7rem' }}>
                  <input
                    type="checkbox"
                    checked={onboardForm.sovereignConfirmed}
                    onChange={(e) => setOnboardForm({ ...onboardForm, sovereignConfirmed: e.target.checked })}
                  />
                  <span>Confirm data residency complies with EU sovereign cluster requirements.</span>
                </label>
              </div>

              <div className="ad-modal-footer">
                <button type="button" onClick={() => setOnboardingModalOpen(false)} className="ad-btn-card-details">
                  Cancel
                </button>
                <button type="submit" className="ad-btn-subscribe">
                  Submit Onboarding Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GOVERNANCE EXCEPTION MODAL                                        */}
      {/* ================================================================= */}
      {exceptionModalModel && (
        <div className="ad-modal-backdrop" onClick={() => setExceptionModalModel(null)}>
          <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header" style={{ background: 'var(--badge-critical-bg)', borderBottomColor: 'var(--badge-critical-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--badge-critical-text)' }} />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--badge-critical-text)' }}>
                  Governance Directive 2026-03 &bull; Exception Petition
                </h3>
              </div>
              <button onClick={() => setExceptionModalModel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="ad-modal-body">
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong>{exceptionModalModel.name}</strong> is currently restricted due to US cloud egress data residency restrictions under Directive 2026-03.
              </p>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Exception Mitigation Statement</label>
                <textarea
                  rows={3}
                  value={exceptionReason}
                  onChange={(e) => setExceptionReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.72rem', outline: 'none' }}
                />
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--badge-critical-bg)', border: '1px solid var(--badge-critical-border)', color: 'var(--badge-critical-text)', fontSize: '0.7rem' }}>
                Requires unanimous sign-off by AI Safety Board and Legal Counsel.
              </div>
            </div>

            <div className="ad-modal-footer">
              <button onClick={() => setExceptionModalModel(null)} className="ad-btn-card-details">
                Cancel
              </button>
              <button onClick={handleSubmitException} className="ad-btn-exception">
                Submit Exception Petition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
