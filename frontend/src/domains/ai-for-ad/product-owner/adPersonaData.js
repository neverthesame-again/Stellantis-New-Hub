/**
 * Mock Data for Persona Dashboard (PRD §5.1)
 * Active Persona: Product Manager — AI for AD (Autonomous Driving)
 * System Class: Enterprise AI Governance & Engineering Operating Model Cockpit
 */

export const personaContextData = {
  userRole: {
    title: 'Product Manager',
    rbacTier: 'RBAC Tier 2 (Governance & Backlog Authority)',
    badgeLabel: 'Role: Product Manager',
    isReadOnly: true
  },

  businessUnits: [
    { id: 'ai-for-ad', label: 'AI for AD' },
    { id: 'ai-for-ams', label: 'AI for AMS' },
    { id: 'eng-leaders', label: 'Engineering Leaders' }
  ],

  portfolios: [
    { id: 'l2-plus', label: 'L2+ Autonomous Systems' },
    { id: 'urban-highway', label: 'Urban & Highway Pilot' },
    { id: 'connected-fleet', label: 'Connected Fleet & Cloud AI' }
  ],

  projectAssignments: [
    { id: 'release-4-2', label: 'Release 4.2 Program' },
    { id: 'release-3-4', label: 'Release 3.4 Maintenance' },
    { id: 'next-gen-rd', label: 'Next-Gen Perception R&D' }
  ],

  // Dynamic configurations mapped to project selection
  projectConfigurations: {
    'release-4-2': {
      subscriptions: {
        modelsCount: 3,
        agentsCount: 2,
        toolsCount: 4,
        models: ['Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'GPT-4o'],
        agents: ['Requirements Review Agent', 'Code Analysis Agent'],
        tools: ['Jira Cloud API', 'GitHub Enterprise', 'SonarQube Scanner', 'Confluence Bridge']
      },
      authority: {
        safetyTier: 'Safety Tier 2',
        monetaryCeiling: '€500,000',
        carveOutNotice: 'Safety Carve-Out: Cannot approve ASIL-D exceptions solo. Requires Lead Functional Safety Engineer co-signature per L2+ Autonomous Systems policy.',
        delegatedLead: 'Dr. Marco V. (Lead Safety Engineer)'
      },
      activeTasks: {
        totalOpen: 6,
        criticalCount: 3,
        standardCount: 3,
        criticalTasks: [
          {
            id: 'task-1',
            title: 'API gateway latency timeout requires approval',
            deadline: 'Due Today',
            tier: 'Critical Architecture Gate',
            originator: 'Backend Core Service'
          },
          {
            id: 'task-2',
            title: 'Security compliance certificate renewal',
            deadline: 'Due Today',
            tier: 'Enterprise Security Gate',
            originator: 'Infra SecOps'
          },
          {
            id: 'task-3',
            title: 'ASIL-D Safety Gate sign-off blocking Sprint 43',
            deadline: 'Due Tomorrow',
            tier: 'Functional Safety Sign-off',
            originator: 'Systems Safety Board'
          }
        ]
      },
      governance: [
        {
          id: 'gov-1',
          title: 'ASIL-D Compliance Review',
          countdownText: '5 days left',
          urgency: 'amber',
          standard: 'ISO 26262 Part 4 Clause 7',
          verified: false
        },
        {
          id: 'gov-2',
          title: 'ISO 26262 Gate Sign-off',
          countdownText: '12 days left',
          urgency: 'emerald',
          standard: 'UNECE R157 Cybersecurity & Safety',
          verified: false
        }
      ]
    },
    'release-3-4': {
      subscriptions: {
        modelsCount: 2,
        agentsCount: 1,
        toolsCount: 3,
        models: ['Claude 3.5 Sonnet', 'Gemini 1.5 Flash'],
        agents: ['Regression Checker Agent'],
        tools: ['GitHub Actions', 'Jira API', 'GitLab CI']
      },
      authority: {
        safetyTier: 'Safety Tier 2',
        monetaryCeiling: '€350,000',
        carveOutNotice: 'Standard maintenance threshold applies. Dual-Key approval required for core patches.',
        delegatedLead: 'Stefan R. (Lead Architect)'
      },
      activeTasks: {
        totalOpen: 3,
        criticalCount: 1,
        standardCount: 2,
        criticalTasks: [
          {
            id: 'task-m1',
            title: 'Database connection pool throttling on v3.4 firmware',
            deadline: 'Due Friday',
            tier: 'Patch Regression',
            originator: 'Telemetry Daemon'
          }
        ]
      },
      governance: [
        {
          id: 'gov-m1',
          title: 'Quarterly Patch Audit Sign-off',
          countdownText: '18 days left',
          urgency: 'emerald',
          standard: 'ASPICE Level 3 Process',
          verified: true
        }
      ]
    },
    'next-gen-rd': {
      subscriptions: {
        modelsCount: 4,
        agentsCount: 3,
        toolsCount: 5,
        models: ['Gemini 2.5 Pro', 'Claude 3.7 Sonnet', 'GPT-4o Realtime', 'Llama 3.3 70B'],
        agents: ['Code Synthesis Agent', 'Automated QA Agent', 'Security Review Agent'],
        tools: ['Docker Hub', 'Kubernetes Operator', 'Weights & Biases', 'GitHub Enterprise', 'Postman API']
      },
      authority: {
        safetyTier: 'R&D Sandbox (Tier 1)',
        monetaryCeiling: '€1,000,000',
        carveOutNotice: 'R&D experimental domain. No safety-critical production gating restrictions on internal prototypes.',
        delegatedLead: 'Dr. Elena K. (Head of AD AI Research)'
      },
      activeTasks: {
        totalOpen: 8,
        criticalCount: 2,
        standardCount: 6,
        criticalTasks: [
          {
            id: 'task-rd1',
            title: 'GPU compute quota threshold alert on high-density cluster',
            deadline: 'Due in 2 days',
            tier: 'Compute Budget Alert',
            originator: 'HPC Benchmark'
          },
          {
            id: 'task-rd2',
            title: 'Multi-modal token sequence alignment validation',
            deadline: 'Due in 4 days',
            tier: 'Model Convergence',
            originator: 'Training Monitor'
          }
        ]
      },
      governance: [
        {
          id: 'gov-rd1',
          title: 'EU AI Act High-Risk Pre-Assessment',
          countdownText: '9 days left',
          urgency: 'amber',
          standard: 'EU AI Act Annex III Safety Systems',
          verified: false
        }
      ]
    }
  }
};

/**
 * 6-Level Drill-Down Explorer Hierarchy Data
 * Flat breadcrumb navigation controlling single dynamic detail stage.
 */
export const drillDownLevelsData = {
  level1: {
    level: 1,
    id: 'portfolio',
    layerTag: 'PORTFOLIO',
    shortTitle: 'L2+ Systems',
    shortIndicator: '91% Compliance',
    indicatorType: 'success',
    title: 'L2+ Autonomous Systems Portfolio',
    subtitle: 'Enterprise Portfolio Operations • Stellantis Platform Hub',
    statusBadge: 'Tier 1 Portfolio',
    metrics: [
      { label: 'Governance Compliance', value: '91%', change: '▲ +3pts this quarter', type: 'success' },
      { label: 'Active Projects', value: '3 Projects', subtext: 'Release 4.2 · v3.4 · Next-Gen', type: 'neutral' },
      { label: 'Active Workflows', value: '9 Workflows', subtext: '94% avg health SLA', type: 'neutral' },
      { label: 'Allocated Budget', value: '€3.8M', subtext: '74% consumed (€2.81M spend)', type: 'warning' }
    ],
    portfolioProjects: [
      { name: 'Release 4.2 Program (Primary)', health: '94%', gate: 'RC2', compliance: '91%', budget: '74%', isPrimary: true },
      { name: 'Release 3.4 Maintenance', health: '98%', gate: 'Stable', compliance: '96%', budget: '58%' },
      { name: 'Next-Gen Perception R&D', health: '89%', gate: 'Feasibility', compliance: '86%', budget: '82%' }
    ]
  },

  level2: {
    level: 2,
    id: 'project',
    layerTag: 'PROJECT',
    shortTitle: 'Release 4.2',
    shortIndicator: 'RC2 · 4 Workflows',
    indicatorType: 'neutral',
    title: 'Release 4.2 Program',
    subtitle: 'Production Deployment Milestone Gate • Sprints 42–43',
    statusBadge: 'Gate: RC2',
    metrics: [
      { label: 'Program Status', value: 'On Track', subtext: 'Sprints 42–43 on schedule', type: 'success' },
      { label: 'Milestone Gate', value: 'RC2', subtext: 'Release Candidate 2 due in 14d', type: 'neutral' },
      { label: 'Active Workflows', value: '4 Workflows', subtext: 'Perception, Verification, Plan, Safety', type: 'neutral' },
      { label: 'Primary Risk', value: 'LiDAR SDK Delay', subtext: 'Mitigated by synthetic emulator', type: 'warning' }
    ],
    workflowsList: [
      { id: 'AD-101', name: 'Perception Pipeline', status: 'Active', passRate: '98%', sla: '18.2ms' },
      { id: 'WF-104', name: 'Safety Verification Pipeline (Core)', status: 'Active', passRate: '94%', sla: '28.4ms', isPrimary: true },
      { id: 'AD-108', name: 'Trajectory Planning', status: 'At Risk', passRate: '89%', sla: '22.0ms' },
      { id: 'AD-112', name: 'Safety Validation Gate', status: 'Gated', passRate: '91%', sla: '31.5ms' }
    ]
  },

  level3: {
    level: 3,
    id: 'workflow',
    layerTag: 'WORKFLOW',
    shortTitle: 'Safety Pipeline',
    shortIndicator: '28.4ms SLA Met',
    indicatorType: 'success',
    title: 'Safety Verification Pipeline (WF-104)',
    subtitle: 'Automated Multi-Stage Safety & Code Verification Pipeline',
    statusBadge: 'Pipeline: Active',
    metrics: [
      { label: 'Pipeline Status', value: 'Active', subtext: 'Supervised (Human-on-the-loop)', type: 'success' },
      { label: 'Daily Executions', value: '1,240 Runs', subtext: '94% passing validation', type: 'neutral' },
      { label: 'Runtime Latency', value: '28.4ms', subtext: 'Budget: 35.0ms (PASS)', type: 'success' },
      { label: 'Pipeline Stages', value: '4 Stages', subtext: 'Ingest → Rules → AI → Gate', type: 'neutral' }
    ],
    streamArchitecture: [
      { name: 'Input Data Ingestion', detail: 'Telemetry & Code Artifact Ingestion Buffer', latency: '4.2ms' },
      { name: 'Static Rule Engine', detail: 'Architecture Compliance & Lint Rule Verification', latency: '3.1ms' },
      { name: 'Requirements Review Agent', detail: 'Claude 3.5 Sonnet Automotive Spec Verification', latency: '16.4ms' },
      { name: 'Compliance Gatekeeper', detail: 'Fail-operational ASIL-D Boundary Verification', latency: '4.7ms' }
    ]
  },

  level4: {
    level: 4,
    id: 'agent',
    layerTag: 'AGENT',
    shortTitle: 'Review Agent',
    shortIndicator: '94% Precision',
    indicatorType: 'success',
    title: 'Requirements Review Agent',
    subtitle: 'Autonomous Agent validating architecture specifications and safety requirement traceability',
    statusBadge: 'Active Production',
    metrics: [
      { label: 'Agent Lifecycle', value: 'Active Production', subtext: 'De-escalation protocol armed', type: 'success' },
      { label: 'Team Owner', value: 'Safety Architecture', subtext: 'Lead: Dr. Marco V.', type: 'neutral' },
      { label: 'Precision Rating', value: '94%', subtext: '▲ +1pt this month (F1: 0.932)', type: 'success' },
      { label: 'Inference Load', value: '8,900 calls/day', subtext: 'EU Sovereign Cloud Infrastructure', type: 'neutral' }
    ],
    agentTasks: [
      'Parses and audits safety requirements against ISO 26262 specifications',
      'Performs static semantic verification on architecture interfaces',
      'Calculates automated requirement coverage and test traceability completeness',
      'Flags unverified edge cases and exception handling deviations'
    ]
  },

  level5: {
    level: 5,
    id: 'model',
    layerTag: 'MODEL',
    shortTitle: 'Claude 3.5',
    shortIndicator: 'INT8 · Sovereign',
    indicatorType: 'purple',
    title: 'Claude 3.5 Sonnet (Enterprise Automotive Model)',
    subtitle: 'Anthropic Foundation Model • Fine-Tuned on Automotive Engineering Taxonomies',
    statusBadge: 'Tool-Qualified',
    metrics: [
      { label: 'Provider', value: 'Anthropic Gateway', subtext: 'Stellantis Private Sovereign VPC', type: 'neutral' },
      { label: 'Risk Rating', value: 'Low Risk', subtext: 'ISO 26262 Tool Qualification Certified', type: 'success' },
      { label: 'Inference Engine', value: 'TensorRT / FP16', subtext: 'High-throughput enterprise runtime', type: 'success' },
      { label: 'Data Residency', value: 'EU Sovereign', subtext: 'Dedicated Frankfurt & Paris VPCs', type: 'neutral' }
    ],
    modelSpecs: {
      architecture: 'Claude 3.5 Sonnet (Fine-Tuned for Automotive Engineering & ASIL Requirements)',
      quantization: 'FP16 & INT8 Optimized Inference Engine with 500h calibration',
      contextWindow: '200k Token Context Window for Multi-Spec Verification',
      safetyClearance: 'ISO 26262 Part 6 Clause 8 Software Tool Qualification'
    }
  },

  level6: {
    level: 6,
    id: 'execution',
    layerTag: 'EXECUTION',
    shortTitle: 'Run #71029',
    shortIndicator: 'Passed (0.97 Conf)',
    indicatorType: 'success',
    title: 'Execution #RUN-71029 (Live Verification Trace)',
    subtitle: 'Real-time telemetry trace • Test Platform: Maserati Grecale Prototype #12',
    statusBadge: 'ASIL-D Passed',
    metrics: [
      { label: 'Inference Latency', value: '16.4ms', subtext: 'Budget: 25.0ms (PASS)', type: 'success' },
      { label: 'Verification Score', value: '0.97', subtext: 'Threshold: 0.85 (PASSED)', type: 'success' },
      { label: 'Safety Gate', value: 'ASIL-D Ready', subtext: 'Validated for release integration', type: 'success' },
      { label: 'Test Platform', value: 'Vehicle #12', subtext: 'Maserati Grecale Prototype', type: 'neutral' }
    ],
    telemetryReadout: {
      batchId: 'Verification Batch #RUN-71029',
      timestamp: 'Today, 09:14:22.842 CET',
      sensorRig: 'Sensor Rig 3 (Front Long-Range Radar + Stereo Optical Disparity)',
      vehicleSpeed: '112.4 km/h (Active Highway Pilot Mode)',
      dopplerVelocityAlignment: '0.02 m/s variance (Limit: < 0.10 m/s)',
      opticalDisparityDepth: '48.2 meters (Ground truth: 48.5m)',
      radarReflectionDensity: '14 confirmed points (Min required: 8 points)',
      environmentalConditions: 'Dry asphalt, 22°C ambient, 45,000 lux daylight, zero wiper activation',
      decisionVerdict: 'PASSED • No safety flag raised • Validated for ASIL-D trajectory merge'
    }
  }
};

/**
 * Master Governance Audit Matrix for Modal
 */
export const governanceAuditMatrixData = {
  title: 'L2+ Autonomous Systems Governance & Audit Matrix',
  version: 'Policy Rev. 2026.3 • ISO 26262 / ISO 21448 (SOTIF) / UNECE R157',
  activeRole: 'Product Manager (RBAC Tier 2)',
  authorityScope: 'Safety Tier 2 / Financial Cap: €500,000',
  matrices: [
    {
      domain: 'Functional Safety (ISO 26262)',
      scope: 'ASIL-B to ASIL-D Systems',
      pmAuthority: 'Approve non-critical deviations up to Tier 2; Dual-sign required for ASIL-D exceptions',
      coSigner: 'Lead Functional Safety Engineer (Dr. Marco V.)',
      status: 'Compliant'
    },
    {
      domain: 'Safety of the Intended Functionality (SOTIF / ISO 21448)',
      scope: 'Scenario Coverage & Unknown Hazardous Scenarios',
      pmAuthority: 'Accept synthetic scenario test coverage metrics above 90%',
      coSigner: 'Validation Lead (Stefan R.)',
      status: 'Active Review'
    },
    {
      domain: 'Automated Lane Keeping & Highway Pilot (UNECE R157)',
      scope: 'Driver Monitoring & Transition Demands',
      pmAuthority: 'Sign off commercial milestone gates up to €500k upon Balocco track sign-off',
      coSigner: 'Systems Engineering Director',
      status: 'Gate Scheduled'
    },
    {
      domain: 'AI Act & Model Transparency (EU AI Act Annex III)',
      scope: 'High-Risk AI System Logging & Bias Audits',
      pmAuthority: 'Full audit compliance sign-off for training datasets and inference passports',
      coSigner: 'Enterprise AI Governance Board',
      status: 'Audited'
    }
  ]
};
