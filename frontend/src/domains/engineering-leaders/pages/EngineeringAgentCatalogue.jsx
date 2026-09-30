import React, { useState } from 'react';
import {
  Bot,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  Sliders,
  X,
  Cpu,
  Wrench,
  FileCode,
  Check,
  Info,
  ExternalLink,
  Play,
  RotateCw
} from 'lucide-react';
import { engineeringExperienceData } from '../mockData.js';

// Automated Automotive Test Harness Profiles & Assertion Specs (8 Deep Realistic Validation Stages)
const AGENT_HARNESS_SPECS = {
  'AGT-01': {
    passed: 99,
    total: 100,
    latency: '285ms',
    stepLatencies: ['28ms', '42ms', '31ms', '45ms', '52ms', '34ms', '27ms', '26ms'],
    steps: [
      'Ingesting ArchiMate 3.1 & AUTOSAR Adaptive metamodel contracts',
      'Parsing AST & resolving cross-zone microservice dependency graph',
      'Checking cyclic dependency & zonal gateway interface constraints',
      'Simulating SOME/IP RPC serialization & 15ms latency budget envelopes',
      'Executing 100 EARB architectural invariant rule assertions',
      'Verifying POSIX microkernel memory bounds & thread-safety isolation',
      'Auditing cryptographic dual-key signatures & SHA-256 integrity hash',
      'Validating deterministic blueprint output & generating compliance manifest'
    ]
  },
  'AGT-02': {
    passed: 100,
    total: 100,
    latency: '460ms',
    stepLatencies: ['38ms', '55ms', '72ms', '64ms', '58ms', '61ms', '52ms', '60ms'],
    steps: [
      'Ingesting ISO 26262 Part 6 ASIL-D safety invariants & TSR contracts',
      'Parsing AST control flow graphs & verifying worst-case execution time (WCET)',
      'Injecting synthetic bit-flip, memory corruption & pointer isolation faults',
      'Checking hardware watchdog timing matrices & 5ms heartbeat envelopes',
      'Running SonarQube & Clang-Tidy MISRA C++:2023 zero-defect rule assertions',
      'Auditing formal dual-key cryptographic safety signature & HMAC-SHA256 digest',
      'Evaluating fail-operational safety state transitions under bus blackout simulation',
      'Certifying zero-tolerance ASIL-D production release gate clearance'
    ]
  },
  'AGT-03': {
    passed: 97,
    total: 100,
    latency: '315ms',
    stepLatencies: ['25ms', '48ms', '39ms', '41ms', '36ms', '54ms', '38ms', '34ms'],
    steps: [
      'Parsing ARXML v4.4 schema definitions & SOME/IP service interface contracts',
      'Synthesizing C++17 adaptive AUTOSAR component skeletons & proxy bindings',
      'Running Clang-Tidy MISRA C++:2023 compliance matrix & static memory linter',
      'Verifying ara::core and ara::com serialization & zero-copy IPC buffers',
      'Executing thread-safety, mutex deadlock & reentrancy static assertions',
      'Compiling GoogleTest & GMock assertion suites in isolated Turin container',
      'Benchmarking cycle overhead & dynamic allocation bounds (< 250ns allocation floor)',
      'Emitting signed CMake build targets, ARXML package artifacts & test coverage'
    ]
  },
  'AGT-04': {
    passed: 98,
    total: 100,
    latency: '390ms',
    stepLatencies: ['32ms', '46ms', '51ms', '62ms', '59ms', '47ms', '45ms', '48ms'],
    steps: [
      'Ingesting Vector CANoe & dSPACE HIL test bench digital oscilloscope traces',
      'Isolating CAN FD bus arbitration drift, clock jitter & transceiver delay',
      'Correlating timing jitter anomalies against transient bus load spikes (> 85%)',
      'Formulating dynamic CAPL assertion timing patches & tolerance envelopes',
      'Simulating closed-loop virtual CANoe test bench playback under noise',
      'Verifying zero false-positive regression escapes across 240 test suites',
      'Packaging healed PyTest & CAPL test fixtures with versioned changelog',
      'Committing verified test suite patch to HIL cluster continuous integration'
    ]
  },
  'AGT-05': {
    passed: 96,
    total: 100,
    latency: '420ms',
    stepLatencies: ['45ms', '52ms', '61ms', '54ms', '58ms', '49ms', '53ms', '48ms'],
    steps: [
      'Streaming 150k live vehicle telemetry frames via multi-region Kafka cluster',
      'Normalizing chassis CAN FD signals: steering angle, battery voltage & motor RPM',
      'Evaluating ECU memory volatility, stack frame depth & DTC error distribution',
      'Modeling blast radius threshold across 500-vehicle canary deployment cohort',
      'Simulating automated rollback trigger conditions under simulated sensor blackout',
      'Checking fleet battery thermal delta & BMS firmware stability invariants',
      'Running Bayesian anomaly detection inference on fleet divergence metrics',
      'Issuing cryptographic canary rollout gate clearance & executive notification'
    ]
  },
  'AGT-06': {
    passed: 94,
    total: 100,
    latency: '510ms',
    stepLatencies: ['58ms', '64ms', '72ms', '69ms', '65ms', '68ms', '59ms', '55ms'],
    steps: [
      'Parsing legacy Fortran 90 routines & Simulink dynamic state-space blocks',
      'Extracting differential equation matrices & thermodynamic thermal lookups',
      'Translating mathematical routines into modern ISO C++20 modular templates',
      'Running IEEE 754 double-precision parity assertions against Fortran gold standard',
      'Enforcing fixed-point arithmetic bounds & zero dynamic heap allocation in fast loop',
      'Benchmarking loop execution latency on Turin target ARM64 & x86_64 architectures',
      'Executing automated SIMD vectorization & cache-locality optimization checks',
      'Emitting verified C++20 powertrain mathematical library & parity validation proof'
    ]
  },
  'AGT-07': {
    passed: 100,
    total: 100,
    latency: '195ms',
    stepLatencies: ['18ms', '24ms', '28ms', '22ms', '26ms', '25ms', '27ms', '25ms'],
    steps: [
      'Ingesting raw chassis CAN bus capture dumps & vehicle telemetry payloads',
      'Analyzing payload egress routing against Stellantis Data Boundary Directive #GOV-901',
      'Scanning unmasked VIN, GPS geolocation & raw chassis frame identifiers',
      'Detecting missing NeMo Sovereign Tokenizer privacy anonymization layer',
      'Triggering SecOps egress policy violation intercept & critical risk alarm',
      'Freezing outbound AWS S3 upload pipeline & revoking IAM credentials',
      'Generating forensic security compliance audit record & CVE risk classification',
      'Enforcing administrative quarantine lock & notifying Chief AI Officer cabinet'
    ]
  },
  'AGT-08': {
    passed: 98,
    total: 100,
    latency: '260ms',
    stepLatencies: ['22ms', '34ms', '38ms', '29ms', '35ms', '31ms', '37ms', '34ms'],
    steps: [
      'Loading legacy AUTOSAR 3.2 XML schema definitions from cold storage archive',
      'Parsing ECU configuration description (ECUC) & flat port interface trees',
      'Checking backward compatibility against legacy BSW (Basic Software) modules',
      'Evaluating schema constraints against deprecated OSEK-OS kernel bindings',
      'Detecting deprecated static memory partition limits & 16-bit CAN ID constraints',
      'Running legacy regression assertion suite against archived 2022 test baseline',
      'Generating migration mapping table targeting modern STLA Adaptive AUTOSAR',
      'Emitting historical archive report & flagging deprecation sunset clearance'
    ]
  }
};

const getHarnessSpec = (agentId) => {
  if (AGENT_HARNESS_SPECS[agentId]) {
    return AGENT_HARNESS_SPECS[agentId];
  }
  const charCode = agentId ? agentId.charCodeAt(agentId.length - 1) : 0;
  const passed = 95 + (charCode % 6);
  const latency = `${240 + ((charCode * 11) % 180)}ms`;
  return {
    passed,
    total: 100,
    latency,
    stepLatencies: ['28ms', '35ms', '42ms', '38ms', '44ms', '31ms', '29ms', '33ms'],
    steps: [
      'Initializing sandboxed ECU test environment & mock automotive service bus',
      'Ingesting metamodel contracts, interface schemas & architectural constraints',
      'Generating synthetic automotive input vectors & boundary condition matrices',
      'Executing agentic reasoning pipeline & ISO/MISRA compliance rule assertions',
      'Simulating real-time bus latency envelopes & memory safety bounds',
      'Running cyclic dependency & cross-zone security integrity verification',
      'Auditing formal dual-key cryptographic signatures & execution telemetry',
      'Packaging verified automotive compliance manifest & test assertion report'
    ]
  };
};

/**
 * PRD §5.4 — Agent and Agentic Workflow Catalogue
 * Automotive Autonomous Agents across 4 Lifecycle States (Active, Experimental, Suspended, Retired) & L1-L4 Autonomy
 */
export default function EngineeringAgentCatalogue({ agents = [], onSubscribeAgent, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [agentLifecycleFilter, setAgentLifecycleFilter] = useState('All');
  const [agentAutonomyFilter, setAgentAutonomyFilter] = useState('All');
  const [subscribeAgentModal, setSubscribeAgentModal] = useState(null);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [selectedProjectForAgent, setSelectedProjectForAgent] = useState('STLA Large SDV Platform Phase 2');
  const [subscribedMap, setSubscribedMap] = useState({});
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [localAgents, setLocalAgents] = useState([]);
  const [harnessState, setHarnessState] = useState(() => {
    const spec = AGENT_HARNESS_SPECS['AGT-01'];
    return {
      'AGT-01': {
        running: false,
        stepIndex: spec.steps.length,
        progress: 100,
        result: {
          passed: spec.passed,
          total: spec.total,
          score: `${Math.round((spec.passed / spec.total) * 100)}%`,
          latency: spec.latency,
          steps: spec.steps,
          stepLatencies: spec.stepLatencies
        }
      }
    };
  });

  const handleRunHarness = (agentId, agentName, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    const spec = getHarnessSpec(agentId);
    const totalSteps = spec.steps.length;

    // Allocate ~720ms per step so full execution takes ~6 seconds with realistic stage transitions
    const stepDuration = 720;
    const finalDelay = totalSteps * stepDuration + 300;

    // Automatic Step 1: Initializing
    setHarnessState(prev => ({
      ...prev,
      [agentId]: {
        running: true,
        stepIndex: 1,
        totalSteps,
        currentStepText: spec.steps[0],
        completedStepIndices: [],
        progress: Math.round((1 / (totalSteps + 1)) * 100),
        result: null
      }
    }));

    // Sequential transitions for each intermediate step
    for (let i = 1; i < totalSteps; i++) {
      setTimeout(() => {
        setHarnessState(prev => {
          if (!prev[agentId]?.running) return prev;
          const completed = [];
          for (let c = 0; c < i; c++) completed.push(c);
          return {
            ...prev,
            [agentId]: {
              ...prev[agentId],
              stepIndex: i + 1,
              currentStepText: spec.steps[i],
              completedStepIndices: completed,
              progress: Math.round(((i + 1) / (totalSteps + 1)) * 100)
            }
          };
        });
      }, i * stepDuration);
    }

    // Final Completion
    setTimeout(() => {
      setHarnessState(prev => ({
        ...prev,
        [agentId]: {
          running: false,
          stepIndex: totalSteps,
          progress: 100,
          completedStepIndices: spec.steps.map((_, idx) => idx),
          result: {
            passed: spec.passed,
            total: spec.total,
            score: `${Math.round((spec.passed / spec.total) * 100)}%`,
            latency: spec.latency,
            steps: spec.steps,
            stepLatencies: spec.stepLatencies || spec.steps.map((_, idx) => `${20 + ((idx * 17 + 7) % 35)}ms`)
          }
        }
      }));

      if (showToast) {
        showToast(`Harness completed for "${agentName}": Passed ${spec.passed}/${spec.total} assertions in ${spec.latency}.`);
      }
    }, finalDelay);
  };
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    squad: 'Cockpit UX Guild',
    type: 'Internal Squad',
    domain: 'Software Engineering',
    autonomyLevel: 'L2 Semi-Autonomous',
    primaryModel: 'Claude 3.5 Sonnet Enterprise'
  });

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!onboardForm.name.trim()) return;

    const newAgent = {
      id: `AGT-NEW-${Date.now().toString().slice(-3)}`,
      name: onboardForm.name.trim(),
      domain: onboardForm.domain,
      purpose: `Automated ${onboardForm.type} agent for ${onboardForm.squad}`,
      autonomyLevel: onboardForm.autonomyLevel,
      lifecycleStage: 'Active',
      squad: onboardForm.squad,
      type: onboardForm.type,
      primaryFoundationModel: onboardForm.primaryModel,
      subscribed: false,
      executionMetrics: {
        totalRuns: 140,
        successRate: '99.4%',
        avgDuration: '0.8s'
      }
    };

    setLocalAgents(prev => [newAgent, ...prev]);
    setShowOnboardModal(false);
    setOnboardForm({
      name: '',
      squad: 'Cockpit UX Guild',
      type: 'Internal Squad',
      domain: 'Software Engineering',
      autonomyLevel: 'L2 Semi-Autonomous',
      primaryModel: 'Claude 3.5 Sonnet Enterprise'
    });
    if (showToast) {
      showToast(`Agent "${newAgent.name}" registered and onboarded into Catalogue!`);
    }
  };

  const isAgentSubscribed = (agent) => {
    if (!agent) return false;
    if (subscribedMap[agent.id] !== undefined) {
      return subscribedMap[agent.id];
    }
    return Boolean(agent.subscribed);
  };

  const handleToggleSubscribe = (agent, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!agent) return;

    const currentStatus = isAgentSubscribed(agent);
    const nextStatus = !currentStatus;

    setSubscribedMap(prev => ({
      ...prev,
      [agent.id]: nextStatus
    }));

    const targetProject = agent.subscribedToProject || selectedProjectForAgent || 'STLA Large SDV Platform Phase 2';
    if (onSubscribeAgent) {
      onSubscribeAgent(agent.id, targetProject, nextStatus);
    }

    if (showToast) {
      if (nextStatus) {
        showToast(`Subscribed "${agent.name}" to ${targetProject}`);
      } else {
        showToast(`Unsubscribed "${agent.name}"`);
      }
    }
  };

  // Guarantee fallback to mockData if agents prop is empty or loading
  const baseList = (agents && agents.length > 0) ? agents : (engineeringExperienceData?.agents || []);
  const agentsList = [...localAgents, ...baseList];

  const filteredAgents = agentsList.filter(a => {
    const stage = a.lifecycleStage || a.lifecycleStatus || 'Active';
    const autonomy = a.autonomyLevel || 'L2';
    const name = (a.name || '').toLowerCase();
    const purpose = (a.purpose || a.role || a.businessFunction || '').toLowerCase();
    const domain = (a.domain || a.targetDiscipline || '').toLowerCase();
    const technology = (a.technology || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) ||
      purpose.includes(query) ||
      domain.includes(query) ||
      technology.includes(query);

    const matchesLifecycle = agentLifecycleFilter === 'All' || stage.toLowerCase() === agentLifecycleFilter.toLowerCase();
    const matchesAutonomy = agentAutonomyFilter === 'All' || autonomy.toLowerCase().includes(agentAutonomyFilter.toLowerCase());
    return matchesSearch && matchesLifecycle && matchesAutonomy;
  });

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (subscribeAgentModal) {
      setSubscribedMap(prev => ({
        ...prev,
        [subscribeAgentModal.id]: true
      }));
      if (onSubscribeAgent) {
        onSubscribeAgent(subscribeAgentModal.id, selectedProjectForAgent, true);
      }
      if (showToast) showToast(`Agent "${subscribeAgentModal?.name}" subscribed to ${selectedProjectForAgent}!`);
    }
    setSubscribeAgentModal(null);
  };

  const activeCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Active').length;
  const experimentalCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Experimental').length;
  const suspendedCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Suspended').length;
  const retiredCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Retired').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Info Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} color="var(--stellantis-action, #0284c7)" />
            <span>Agent Studio</span>
            <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
              {agentsList.length} Autonomous Agents Registered
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Autonomous automotive agentic workflows spanning enterprise software architecture, ASIL-D safety gating, AUTOSAR generation, and canary validation.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="st-badge badge-success" style={{ fontSize: '0.72rem' }}>
            {activeCount} Active
          </span>
          <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
            {experimentalCount} Experimental
          </span>
          <span className="st-badge badge-warning" style={{ fontSize: '0.72rem' }}>
            {suspendedCount} Suspended
          </span>
          <span className="st-badge badge-neutral" style={{ fontSize: '0.72rem' }}>
            {retiredCount} Retired
          </span>
          <span className="st-badge badge-purple" style={{ fontSize: '0.72rem' }}>
            {agentsList.filter(a => isAgentSubscribed(a)).length} Subscribed
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search agents by name, domain, capability, technology, foundation model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={agentLifecycleFilter}
            onChange={(e) => setAgentLifecycleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <option value="All">All Lifecycle Stages ({agentsList.length})</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Experimental">Experimental ({experimentalCount})</option>
            <option value="Suspended">Suspended ({suspendedCount})</option>
            <option value="Retired">Retired ({retiredCount})</option>
          </select>

          <select
            value={agentAutonomyFilter}
            onChange={(e) => setAgentAutonomyFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <option value="All">All Autonomy Levels</option>
            <option value="L1">L1 Copilot / Supervised</option>
            <option value="L2">L2 Semi-Autonomous</option>
            <option value="L3">L3 Conditional Autonomy</option>
            <option value="L4">L4 High Autonomy</option>
          </select>

          <button
            id="btn-onboard-agent"
            onClick={() => setShowOnboardModal(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--stellantis-action, #0284c7)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={15} /> Onboard Agent
          </button>
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredAgents.map((agent) => {
          const stage = agent.lifecycleStage || agent.lifecycleStatus || 'Active';
          const autonomy = agent.autonomyLevel || 'L2 Copilot';
          const successRate = agent.executionMetrics?.successRate || agent.evaluationMetrics?.taskSuccessRate || '98.5%';
          const totalRuns = agent.executionMetrics?.totalRuns || 4200;
          const avgDuration = agent.executionMetrics?.avgDuration || '1.2s';
          const domainName = agent.domain || agent.targetDiscipline || 'Software Engineering';
          const description = agent.purpose || agent.role || agent.businessFunction || 'Automates automotive SDV workflows';
          const modelsList = Array.isArray(agent.modelDependencies) ? agent.modelDependencies.join(', ') : (agent.primaryFoundationModel || 'Claude 3.5 Sonnet / DeepSeek');
          const subscribedProject = agent.subscribedToProject || (Array.isArray(agent.subscribedProjects) ? agent.subscribedProjects.join(', ') : 'STLA Large SDV Platform Phase 2');
          const isSubscribed = isAgentSubscribed(agent);

          return (
            <div
              key={agent.id}
              className="st-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: stage === 'Active' ? '4px solid #10b981' :
                  (stage === 'Experimental' ? '4px solid #0284c7' :
                  (stage === 'Suspended' ? '4px solid #f59e0b' : '4px solid #64748b'))
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action, #0284c7)' }}>{agent.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {domainName}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                    {agent.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {agent.technology || agent.projectType || 'LangGraph / Agent Mesh'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`st-badge ${
                    stage === 'Active' ? 'badge-success' :
                    (stage === 'Experimental' ? 'badge-info' :
                    (stage === 'Suspended' ? 'badge-warning' : 'badge-neutral'))
                  }`}>
                    {stage}
                  </span>
                  <span className="st-badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {autonomy}
                  </span>
                </div>
              </div>

              {/* Purpose / Role */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {description}
              </div>

              {/* Performance Metrics Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                padding: '8px 12px',
                background: 'var(--bg-subtle, rgba(0,0,0,0.02))',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.72rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>SUCCESS RATE</span>
                  <strong style={{ color: '#10b981' }}>{successRate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>TOTAL RUNS</span>
                  <strong style={{ color: '#0284c7' }}>{totalRuns}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>LATENCY</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{avgDuration}</strong>
                </div>
              </div>

              {/* Dependencies Snippets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>Foundation Models: <strong style={{ color: 'var(--text-primary)' }}>{modelsList}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span>Subscribed Project:</span>
                  <strong style={{ color: isSubscribed ? '#10b981' : 'var(--text-primary)' }}>{subscribedProject}</strong>
                  {isSubscribed && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                      Active
                    </span>
                  )}
                </div>
                {agent.tools && (
                  <div>Integrated Tools: <strong style={{ color: 'var(--text-primary)' }}>{Array.isArray(agent.tools) ? agent.tools.join(' • ') : agent.tools}</strong></div>
                )}
              </div>

              {/* Live Harness Execution & Multi-Step Progress Banner */}
              {harnessState[agent.id]?.running && (
                <div style={{
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.35)',
                  borderRadius: '6px',
                  padding: '9px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem' }}>
                    <span style={{ color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RotateCw size={11} className="animate-spin" />
                      Stage {harnessState[agent.id].stepIndex} of {harnessState[agent.id].totalSteps}: Automated Verification
                    </span>
                    <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.68rem', fontFamily: 'monospace' }}>
                      {harnessState[agent.id].progress}%
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${harnessState[agent.id].progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  {/* Current Active Step */}
                  <div style={{
                    fontSize: '0.66rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(2, 132, 199, 0.12)',
                    padding: '4px 7px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    lineHeight: 1.25
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      boxShadow: '0 0 6px #0284c7',
                      flexShrink: 0
                    }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong>Active:</strong> {harnessState[agent.id].currentStepText}...
                    </span>
                  </div>

                  {/* Real-time live completed checklist */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    maxHeight: '85px',
                    overflowY: 'auto',
                    paddingRight: '2px',
                    fontSize: '0.62rem'
                  }}>
                    {getHarnessSpec(agent.id).steps.map((st, idx) => {
                      const isDone = (harnessState[agent.id].completedStepIndices || []).includes(idx);
                      const isCurrent = harnessState[agent.id].stepIndex === (idx + 1);
                      if (!isDone && !isCurrent) return null;
                      return (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: isDone ? '#10b981' : '#0284c7',
                          fontWeight: isCurrent ? 600 : 400
                        }}>
                          {isDone ? (
                            <CheckCircle2 size={10} style={{ color: '#10b981', flexShrink: 0 }} />
                          ) : (
                            <RotateCw size={9} className="animate-spin" style={{ color: '#0284c7', flexShrink: 0 }} />
                          )}
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Step {idx + 1}: {st} {isDone ? '(passed)' : '(evaluating...)'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live Harness Completed Results Banner */}
              {harnessState[agent.id]?.result && !harnessState[agent.id]?.running && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginTop: '4px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.70rem'
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={12} /> Passed {harnessState[agent.id].result.passed}/{harnessState[agent.id].result.total} test assertions
                    </span>
                    <span style={{
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '0.65rem'
                    }}>
                      ⚡ {harnessState[agent.id].result.latency}
                    </span>
                  </div>

                  {/* Automated steps breakdown with scroll / compact view */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    paddingTop: '5px',
                    borderTop: '1px dashed rgba(16, 185, 129, 0.25)',
                    fontSize: '0.64rem',
                    color: 'var(--text-secondary)',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    paddingRight: '3px'
                  }}>
                    {harnessState[agent.id].result.steps && harnessState[agent.id].result.steps.map((st, sIdx) => {
                      const lat = harnessState[agent.id].result.stepLatencies?.[sIdx];
                      return (
                        <div
                          key={sIdx}
                          title={`Step ${sIdx + 1}: ${st}${lat ? ` (${lat})` : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            lineHeight: 1.25,
                            padding: '1px 0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flex: 1 }}>
                            <CheckCircle2 size={10} style={{ color: '#10b981', flexShrink: 0 }} />
                            <span style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Step {sIdx + 1}:</strong> {st}
                            </span>
                          </div>
                          {lat && (
                            <span style={{
                              flexShrink: 0,
                              fontSize: '0.58rem',
                              fontFamily: 'monospace',
                              color: 'var(--text-muted)',
                              background: 'rgba(0,0,0,0.04)',
                              padding: '0 4px',
                              borderRadius: '3px'
                            }}>
                              {lat}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', marginTop: 'auto', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedAgentDetails(agent)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Info size={11} />
                    <span>Charter</span>
                  </button>

                  <button
                    id={`btn-harness-${agent.id}`}
                    onClick={(e) => handleRunHarness(agent.id, agent.name, e)}
                    disabled={harnessState[agent.id]?.running}
                    style={{
                      background: harnessState[agent.id]?.result ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface-secondary)',
                      border: harnessState[agent.id]?.result ? '1px solid #10b981' : '1px solid var(--border-color)',
                      color: harnessState[agent.id]?.result ? '#10b981' : 'var(--stellantis-action, #0284c7)',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: harnessState[agent.id]?.running ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Execute test and evaluation harness"
                  >
                    {harnessState[agent.id]?.running ? (
                      <>
                        <RotateCw size={11} className="animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play size={11} />
                        <span>{harnessState[agent.id]?.result ? 'Re-run' : 'Run Harness'}</span>
                      </>
                    )}
                  </button>

                </div>

                <button
                  onClick={(e) => handleToggleSubscribe(agent, e)}
                  style={{
                    background: isSubscribed ? 'var(--badge-success-bg, #ecfdf5)' : 'var(--stellantis-action, #0284c7)',
                    color: isSubscribed ? '#10b981' : '#ffffff',
                    border: isSubscribed ? '1px solid #10b981' : 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title={isSubscribed ? "Click to unsubscribe" : "Click to subscribe"}
                >
                  {isSubscribed ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Charter & Specification Modal */}
      {selectedAgentDetails && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedAgentDetails(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">{selectedAgentDetails.name}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {selectedAgentDetails.id} • {selectedAgentDetails.domain} • {selectedAgentDetails.autonomyLevel}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAgentDetails(null)} className="ad-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="ad-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h5 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                  Purpose & Business Function
                </h5>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {selectedAgentDetails.purpose || selectedAgentDetails.businessFunction}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>INPUT CONTRACTS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedAgentDetails.inputs || 'Automotive PRD, ARXML schema, C++ Pull Requests'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>OUTPUT ARTIFACTS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedAgentDetails.outputs || 'EARB Architecture Charter, ASIL Audit Certificate'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>INTEGRATED TOOLS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {Array.isArray(selectedAgentDetails.tools) ? selectedAgentDetails.tools.join(', ') : selectedAgentDetails.tools}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>FOUNDATION MODEL DEPENDENCIES</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {Array.isArray(selectedAgentDetails.modelDependencies) ? selectedAgentDetails.modelDependencies.join(', ') : selectedAgentDetails.modelDependencies}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>EVALUATION & BENCHMARKS</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedAgentDetails.evaluationResults || '99.1% Pass Rate across 4,200 gate checks.'}
                </div>
                {harnessState[selectedAgentDetails.id]?.result && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle2 size={12} /> Automated Test Harness: Passed {harnessState[selectedAgentDetails.id].result.passed}/{harnessState[selectedAgentDetails.id].result.total} Assertions
                      </span>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        ⚡ {harnessState[selectedAgentDetails.id].result.latency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '140px', overflowY: 'auto', paddingRight: '2px' }}>
                      {harnessState[selectedAgentDetails.id].result.steps.map((st, sIdx) => {
                        const lat = harnessState[selectedAgentDetails.id].result.stepLatencies?.[sIdx];
                        return (
                          <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                              <CheckCircle2 size={10} style={{ color: '#10b981', flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <strong>Step {sIdx + 1}:</strong> {st}
                              </span>
                            </div>
                            {lat && <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: '0.60rem', color: 'var(--text-muted)' }}>{lat}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGENT OWNER</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    {selectedAgentDetails.owner || 'AI Center of Excellence'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>RISK CLASSIFICATION</div>
                  <div style={{ fontSize: '0.76rem', color: selectedAgentDetails.riskRating === 'Critical' ? '#ef4444' : 'var(--text-primary)' }}>
                    {selectedAgentDetails.riskRating || 'Medium'}
                  </div>
                </div>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedAgentDetails(null)}
                className="st-btn st-btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleSubscribe(selectedAgentDetails);
                  setSelectedAgentDetails(null);
                }}
                style={{
                  background: isAgentSubscribed(selectedAgentDetails) ? 'var(--badge-success-bg, #ecfdf5)' : 'var(--stellantis-action, #0284c7)',
                  color: isAgentSubscribed(selectedAgentDetails) ? '#10b981' : '#ffffff',
                  border: isAgentSubscribed(selectedAgentDetails) ? '1px solid #10b981' : 'none',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAgentSubscribed(selectedAgentDetails) ? <CheckCircle2 size={13} /> : <Plus size={13} />}
                <span>{isAgentSubscribed(selectedAgentDetails) ? 'Subscribed' : 'Subscribe to Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Agent Modal */}
      {subscribeAgentModal && (
        <div className="ad-modal-backdrop" onClick={() => setSubscribeAgentModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">Subscribe Agent to Project</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{subscribeAgentModal.name} ({subscribeAgentModal.id})</div>
                </div>
              </div>
              <button onClick={() => setSubscribeAgentModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubscribeSubmit}>
              <div className="ad-modal-body">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Engineering Project:</label>
                  <select
                    value={selectedProjectForAgent}
                    onChange={(e) => setSelectedProjectForAgent(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="STLA Large SDV Platform Phase 2">STLA Large SDV Platform Phase 2</option>
                    <option value="Maserati GranTurismo Folgore ADAS v3.4">Maserati GranTurismo Folgore ADAS v3.4</option>
                    <option value="Ram 1500 REV Autonomous Towing">Ram 1500 REV Autonomous Towing</option>
                    <option value="Jeep Recon Trail-Rated Offroad Autonomy">Jeep Recon Trail-Rated Offroad Autonomy</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Execution Permission Tier:</label>
                  <select
                    defaultValue="Project Level"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="Project Level">Project Level (Authorized for squad pipelines)</option>
                    <option value="Team Level">Team Level (Restricted to exploratory squads)</option>
                    <option value="Portfolio Level">Portfolio Level (Enterprise Multi-Project Allocation)</option>
                  </select>
                </div>
              </div>

              <div className="ad-modal-footer">
                <button type="button" onClick={() => setSubscribeAgentModal(null)} className="st-btn st-btn-secondary">Cancel</button>
                <button type="submit" className="st-btn st-btn-primary">Confirm Project Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: ONBOARD & REGISTER AGENT MODAL
          ========================================================= */}
      {showOnboardModal && (
        <div className="ad-modal-backdrop" onClick={() => setShowOnboardModal(false)}>
          <div className="ad-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">Onboard & Register Agent</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Register squad or external partner agent</div>
                </div>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <form onSubmit={handleOnboardSubmit}>
              <div className="ad-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Agent Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUTOSAR Safety Validator Agent"
                    value={onboardForm.name}
                    onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Source / Origin:</label>
                    <select
                      value={onboardForm.type}
                      onChange={(e) => setOnboardForm({ ...onboardForm, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.8rem' }}
                    >
                      <option value="Internal Squad">Internal Squad</option>
                      <option value="External Partner (Bosch)">External Partner (Bosch)</option>
                      <option value="External Partner (Harman)">External Partner (Harman)</option>
                      <option value="Third-Party Vendor">Third-Party Vendor</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Squad / Guild:</label>
                    <select
                      value={onboardForm.squad}
                      onChange={(e) => setOnboardForm({ ...onboardForm, squad: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.8rem' }}
                    >
                      <option value="Cockpit UX Guild">Cockpit UX Guild</option>
                      <option value="Powertrain QA">Powertrain QA</option>
                      <option value="Telematics Core">Telematics Core</option>
                      <option value="DevOps & CI/CD">DevOps & CI/CD</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Autonomy Tier:</label>
                    <select
                      value={onboardForm.autonomyLevel}
                      onChange={(e) => setOnboardForm({ ...onboardForm, autonomyLevel: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.8rem' }}
                    >
                      <option value="L1 Copilot / Supervised">L1 Copilot / Supervised</option>
                      <option value="L2 Semi-Autonomous">L2 Semi-Autonomous</option>
                      <option value="L3 Conditional Autonomy">L3 Conditional Autonomy</option>
                      <option value="L4 High Autonomy">L4 High Autonomy</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Primary Model:</label>
                    <select
                      value={onboardForm.primaryModel}
                      onChange={(e) => setOnboardForm({ ...onboardForm, primaryModel: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.8rem' }}
                    >
                      <option value="Claude 3.5 Sonnet Enterprise">Claude 3.5 Sonnet Enterprise</option>
                      <option value="DeepSeek Coder V2 (Turin Local)">DeepSeek Coder V2 (Turin)</option>
                      <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                      <option value="Mistral Large 2 (Private Cloud)">Mistral Large 2 (Private)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ad-modal-footer">
                <button type="button" onClick={() => setShowOnboardModal(false)} className="st-btn st-btn-secondary">Cancel</button>
                <button type="submit" className="st-btn st-btn-primary">Register & Onboard Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
