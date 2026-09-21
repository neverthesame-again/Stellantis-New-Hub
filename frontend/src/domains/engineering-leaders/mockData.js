/**
 * Frontend Local Fallback Mock Data for Engineering Leaders Domain
 * Persona: Alex — Chief AI Officer / Head of Software Engineering
 * Single source of truth duplicate for offline resilience
 */

export const engineeringDashboardData = {
  persona: {
    name: "Alex",
    title: "Chief AI Officer & Head of Software Engineering",
    role: "Chief AI Officer",
    domain: "Engineering leaders",
    platform: "ENG-LEAD",
    shift: "Global Strategy | Active",
    shiftProgress: "85%",
    statusText: "Enterprise Engineering Core • 18 Model Subscriptions • 6 Architecture Reviews in Flight"
  },

  // Primary Strategic Objectives for Alex
  primaryObjectives: [
    {
      id: "OBJ-01",
      title: "Monitor Engineering Performance",
      description: "Continuously assess squad velocity, DORA stability metrics, and quality gates across 5 global software portfolios.",
      progress: 92,
      status: "Optimal",
      statusBadge: "badge-success",
      owner: "Global Engineering PMO"
    },
    {
      id: "OBJ-02",
      title: "Track AI Adoption & Productivity",
      description: "Scale autonomous engineering agent adoption from L1 copilot assistance to L2/L3 multi-agent generation across 48 squads.",
      progress: 84,
      status: "Accelerating",
      statusBadge: "badge-info",
      owner: "AI Center of Excellence"
    },
    {
      id: "OBJ-03",
      title: "Mitigate Delivery, Quality & Compliance Risks",
      description: "Identify and resolve ISO 26262, ASPICE, cybersecurity, and open-source license drift before production release candidate freezes.",
      progress: 78,
      status: "Attention Required",
      statusBadge: "badge-high",
      owner: "Engineering Governance & Safety"
    },
    {
      id: "OBJ-04",
      title: "Approve Strategic AI Investments & Model Changes",
      description: "Direct capital expenditure for private cloud compute clusters, foundation model licensing tiers, and operating model evolution.",
      progress: 89,
      status: "On Target",
      statusBadge: "badge-success",
      owner: "Chief AI Officer Cabinet"
    }
  ],

  // 1. Portfolio Health
  portfolioHealth: {
    overallHealthScore: "91.4%",
    statusSummary: {
      healthy: 4,
      warning: 1,
      critical: 0,
      totalPortfolios: 5
    },
    activeSquads: 48,
    totalEngineers: 640,
    portfolios: [
      {
        id: "PORT-AD",
        name: "Autonomous Driving & ADAS",
        lead: "Dr. H. Becker",
        healthScore: 94,
        status: "Healthy",
        statusBadge: "badge-success",
        squadsCount: 14,
        budgetAdherence: "98.2%",
        doraRating: "Elite",
        topRisk: "Sim-to-real sensor calibration latency",
        aiAdoptionRate: "88%"
      },
      {
        id: "PORT-CONN",
        name: "Connected Vehicle & Cloud Platform",
        lead: "M. Rossi",
        healthScore: 92,
        status: "Healthy",
        statusBadge: "badge-success",
        squadsCount: 12,
        budgetAdherence: "96.5%",
        doraRating: "High",
        topRisk: "Kafka multi-region failover sync",
        aiAdoptionRate: "86%"
      },
      {
        id: "PORT-COCKPIT",
        name: "Infotainment & Digital Cockpit",
        lead: "C. Dupont",
        healthScore: 82,
        status: "Warning",
        statusBadge: "badge-high",
        squadsCount: 9,
        budgetAdherence: "91.0%",
        doraRating: "Medium",
        topRisk: "Android Automotive memory leak under thermal stress",
        aiAdoptionRate: "76%"
      },
      {
        id: "PORT-PROP",
        name: "Software-Defined Propulsion & Battery",
        lead: "A. Moretti",
        healthScore: 95,
        status: "Healthy",
        statusBadge: "badge-success",
        squadsCount: 8,
        budgetAdherence: "99.1%",
        doraRating: "Elite",
        topRisk: "BMS firmware real-time CAN determinism",
        aiAdoptionRate: "91%"
      },
      {
        id: "PORT-ENT",
        name: "Enterprise IT & Core Services",
        lead: "S. Patel",
        healthScore: 89,
        status: "Healthy",
        statusBadge: "badge-success",
        squadsCount: 5,
        budgetAdherence: "94.8%",
        doraRating: "High",
        topRisk: "Legacy SAP OData modernization migration",
        aiAdoptionRate: "79%"
      }
    ]
  },

  // 2. Project Delivery Status
  projectDelivery: {
    onTrackRate: "88%",
    totalActiveProjects: 16,
    projects: [
      {
        id: "PRJ-01",
        name: "STLA SmartCockpit Gen3 Architecture",
        portfolio: "Infotainment & Digital Cockpit",
        phase: "Sprint Execution",
        progress: 74,
        targetRelease: "Q4 2026",
        velocity: "+18% vs plan",
        status: "On Track",
        statusBadge: "badge-success",
        leadSquad: "Cockpit UX Core",
        keyMilestone: "Hardware-in-the-Loop Audio HAL Validation"
      },
      {
        id: "PRJ-02",
        name: "Autonomous Valet Parking (AVP) L3",
        portfolio: "Autonomous Driving & ADAS",
        phase: "Safety Validation",
        progress: 88,
        targetRelease: "Q1 2027",
        velocity: "Nominal",
        status: "On Track",
        statusBadge: "badge-success",
        leadSquad: "ADAS Perception Alpha",
        keyMilestone: "ASIL-D Hazard Analysis Sign-off"
      },
      {
        id: "PRJ-03",
        name: "Battery Telematics & Degradation Digital Twin",
        portfolio: "Software-Defined Propulsion & Battery",
        phase: "Beta Field Pilot",
        progress: 92,
        targetRelease: "Q4 2026",
        velocity: "+24% vs plan",
        status: "Ahead of Schedule",
        statusBadge: "badge-info",
        leadSquad: "BMS Cloud Telemetry",
        keyMilestone: "Live Fleet Anomaly Detection Model Active"
      },
      {
        id: "PRJ-04",
        name: "Global Vehicle Cloud Data Mesh",
        portfolio: "Connected Vehicle & Cloud Platform",
        phase: "Scale & Hardening",
        progress: 68,
        targetRelease: "Q1 2027",
        velocity: "-8% vs plan",
        status: "Attention Required",
        statusBadge: "badge-high",
        leadSquad: "Cloud Ingestion Core",
        keyMilestone: "Multi-Zone GDPR Data Sovereign Partitioning"
      },
      {
        id: "PRJ-05",
        name: "AUTOSAR Adaptive OS Migration",
        portfolio: "Enterprise IT & Core Services",
        phase: "Architecture Spike",
        progress: 45,
        targetRelease: "Q2 2027",
        velocity: "Nominal",
        status: "On Track",
        statusBadge: "badge-success",
        leadSquad: "Embedded Core Systems",
        keyMilestone: "POSIX-Compliant Real-Time Kernel Benchmarking"
      }
    ]
  },

  // 3. AI Adoption & Autonomy-Level Distribution
  aiAdoptionAndAutonomy: {
    overallAdoptionRate: "84.2%",
    aiAssistedCommits: "68.7%",
    autonomousPrGenerationRate: "34.1%",
    totalActiveSeats: 580,
    autonomyDistribution: [
      {
        level: "Level 0",
        name: "Manual Engineering",
        percentage: 8,
        description: "Zero AI tooling. Pure manual coding, unit testing, and peer reviews.",
        squadsCount: 4,
        color: "#6a85b0"
      },
      {
        level: "Level 1",
        name: "AI-Assisted Copilot",
        percentage: 42,
        description: "In-IDE autocomplete, inline code explanation, test boilerplate generation.",
        squadsCount: 20,
        color: "#3b82f6"
      },
      {
        level: "Level 2",
        name: "Collaborative Agent Generation",
        percentage: 32,
        description: "Automated PR synthesis, schema-to-API generators, architectural linting.",
        squadsCount: 15,
        color: "#8b5cf6"
      },
      {
        level: "Level 3",
        name: "Autonomous Multi-Agent Swarms",
        percentage: 15,
        description: "End-to-end bug fix agent swarms, automated migration pipelines, RCA agents.",
        squadsCount: 7,
        color: "#0284c7"
      },
      {
        level: "Level 4",
        name: "Self-Governing Engineering",
        percentage: 3,
        description: "Continuous self-healing microservices, dynamic architecture refactoring.",
        squadsCount: 2,
        color: "#10b981"
      }
    ],
    adoptionByDomain: [
      { domain: "Propulsion & Battery", adoption: 91, avgAutonomy: "Level 2.4" },
      { domain: "Autonomous Driving", adoption: 88, avgAutonomy: "Level 2.2" },
      { domain: "Connected Cloud", adoption: 86, avgAutonomy: "Level 2.1" },
      { domain: "Enterprise Core", adoption: 79, avgAutonomy: "Level 1.8" },
      { domain: "Digital Cockpit", adoption: 76, avgAutonomy: "Level 1.7" }
    ]
  },

  // 4. Engineering Productivity
  engineeringProductivity: {
    doraLevel: "Elite / High",
    metrics: [
      {
        label: "Lead Time for Changes",
        value: "3.2 days",
        baseline: "7.8 days",
        improvement: "-59% faster",
        trend: "positive",
        subtext: "Commit to production deployment pipeline"
      },
      {
        label: "Deployment Frequency",
        value: "18.4 / day",
        baseline: "5.8 / day",
        improvement: "+3.1x cadence",
        trend: "positive",
        subtext: "Continuous automated staging releases"
      },
      {
        label: "Pull Request Turnaround",
        value: "4.6 hrs",
        baseline: "28.5 hrs",
        improvement: "-84% wait time",
        trend: "positive",
        subtext: "Automated review gates + AI summary"
      },
      {
        label: "Developer Hours Saved (YTD)",
        value: "14,280 hrs",
        baseline: "Target: 12,000",
        improvement: "+19% over target",
        trend: "positive",
        subtext: "Reinvested in feature innovation"
      }
    ],
    developerSatisfactionScore: "4.7 / 5.0",
    squadVelocityBoost: "+38% story points delivered per sprint"
  },

  // 5. Quality and Defect Trends
  qualityAndDefects: {
    defectEscapeRate: "0.82%",
    defectEscapeTarget: "< 1.50%",
    automatedTestCoverage: "89.4%",
    securityGatePassRate: "98.7%",
    vulnerabilitiesAutoRemediated: "94.2%",
    defectVolumeBySeverity: {
      p1Critical: 2,
      p2Major: 9,
      p3Minor: 31,
      p4Low: 18
    },
    defectTrendOverSprints: [
      { sprint: "Sprint 38", escapedDefects: 14, density: "1.42 / KLOC" },
      { sprint: "Sprint 39", escapedDefects: 11, density: "1.18 / KLOC" },
      { sprint: "Sprint 40", escapedDefects: 8, density: "0.94 / KLOC" },
      { sprint: "Sprint 41", escapedDefects: 6, density: "0.86 / KLOC" },
      { sprint: "Sprint 42", escapedDefects: 4, density: "0.82 / KLOC" }
    ],
    qualityPillars: [
      { name: "Unit & Integration Test Coverage", score: "89.4%", target: "85%", status: "Optimal" },
      { name: "SAST & Secret Scanning Hygiene", score: "99.8%", target: "99%", status: "Optimal" },
      { name: "ASPICE Level 3 Process Compliance", score: "96.4%", target: "95%", status: "Compliant" },
      { name: "ISO 26262 ASIL-D Traceability", score: "98.1%", target: "98%", status: "Compliant" }
    ]
  },

  // 6. Release Frequency and Cycle Time
  releaseFrequencyAndCycleTime: {
    totalReleasesYtd: 412,
    meanTimeToDeploy: "14.2 mins",
    changeFailureRate: "1.38%",
    changeFailureBaseline: "4.80%",
    rollbackRate: "0.29%",
    upcomingReleases: [
      {
        id: "REL-2026-42.1",
        name: "STLA OS Core Hotfix v4.2.1",
        tier: "Tier-1 Vehicle OS",
        targetDate: "Tomorrow, 02:00 UTC",
        risk: "Low",
        riskBadge: "badge-success",
        stabilityScore: "99.4%",
        automatedTestsPassed: "4,120 / 4,120"
      },
      {
        id: "REL-2026-43.0",
        name: "Fleet Telematics Edge Aggregator v2.4",
        tier: "Tier-2 Cloud Services",
        targetDate: "Sep 20, 2026",
        risk: "Low",
        riskBadge: "badge-success",
        stabilityScore: "98.8%",
        automatedTestsPassed: "2,840 / 2,840"
      },
      {
        id: "REL-2026-44.0",
        name: "Autonomous Drive Vision Sensor HAL v3.0",
        tier: "Tier-1 ASIL-D",
        targetDate: "Oct 02, 2026",
        risk: "Medium",
        riskBadge: "badge-high",
        stabilityScore: "97.2%",
        automatedTestsPassed: "8,950 / 9,010"
      }
    ]
  },

  // 7. AI Cost and Model Consumption
  aiCostAndConsumption: {
    monthlyBudget: "$180,000",
    currentSpend: "$142,500",
    budgetUtilization: "79.2%",
    projectedEndMonthSpend: "$168,000",
    costPerPullRequest: "$1.42",
    costPerPrBaseline: "$3.80",
    tokenCacheHitRate: "36.4%",
    totalTokensConsumedM: "1,480M",
    modelBreakdown: [
      {
        modelName: "Claude 3.5 Sonnet Enterprise",
        provider: "Anthropic / AWS Bedrock",
        tokensConsumed: "420M",
        cost: "$68,400",
        sharePct: 48,
        primaryUsage: "Architectural synthesis, complex refactoring, safety audit"
      },
      {
        modelName: "GPT-4o Enterprise",
        provider: "Azure OpenAI Stellantis Tenant",
        tokensConsumed: "310M",
        cost: "$45,200",
        sharePct: 32,
        primaryUsage: "Requirements generation, documentation, code review assistant"
      },
      {
        modelName: "Mistral Large 2 (Private Cloud)",
        provider: "Private Mistral / Turin On-Prem",
        tokensConsumed: "240M",
        cost: "$17,400",
        sharePct: 12,
        primaryUsage: "Proprietary CAN telemetry parsing, internal API queries"
      },
      {
        modelName: "DeepSeek Coder / CodeLlama 70B",
        provider: "Self-Hosted GPU Cluster (Turin)",
        tokensConsumed: "510M",
        cost: "$11,500",
        sharePct: 8,
        primaryUsage: "Real-time IDE code completion, unit test boilerplates"
      }
    ]
  },

  // 8. Governance Exceptions
  governanceExceptions: {
    totalPendingExceptions: 4,
    highRiskCount: 2,
    complianceScore: "96.4%",
    exceptionsList: [
      {
        id: "GOV-EX-891",
        title: "Unapproved Public LLM API Invocation Attempt",
        squad: "Cockpit UX Core",
        system: "External Network Egress Gateway",
        severity: "Critical",
        severityBadge: "badge-critical",
        status: "Blocked by Guardrail",
        actionRequired: "Review Security Incident",
        description: "Developer attempted direct unencrypted prompt transmission to public OpenAI endpoint bypassing enterprise NeMo guardrail.",
        timestamp: "Today, 14:22 CET",
        risk: "Potential Intellectual Property Leaks"
      },
      {
        id: "GOV-EX-892",
        title: "GPLv3 Code Snippet Ingestion in Production Microservice",
        squad: "Connected Ingestion Alpha",
        system: "SonarQube & FOSS Guardrail",
        severity: "High",
        severityBadge: "badge-high",
        status: "Pending CAIO Review",
        actionRequired: "Enforce Clean-Room Rewrite",
        description: "AI code generator hallucinated a 45-line GPLv3 licensed routine into proprietary telemetry sync package.",
        timestamp: "Yesterday, 17:05 CET",
        risk: "Copyright Contamination & Legal Exposure"
      },
      {
        id: "GOV-EX-893",
        title: "PII Telemetry Drift in Test Dataset Generator",
        squad: "Fleet Data Mesh",
        system: "Data Sovereign Privacy Gate",
        severity: "Medium",
        severityBadge: "badge-high",
        status: "Mitigation Proposed",
        actionRequired: "Approve Synthetic Masking Filter",
        description: "Synthetic test data generator ingested pseudo-anonymized chassis VIN numbers exceeding GDPR test compliance.",
        timestamp: "Sep 11, 2026",
        risk: "Regulatory Privacy Non-Compliance"
      },
      {
        id: "GOV-EX-894",
        title: "Model Drift Threshold Exceeded on Battery Degradation Predictor",
        squad: "BMS Cloud Telemetry",
        system: "MLOps Evident Monitoring",
        severity: "Medium",
        severityBadge: "badge-info",
        status: "Auto-Retraining Queued",
        actionRequired: "Acknowledge Model Retrain",
        description: "Prediction error drift increased by 4.2% on winter cold-soak battery test cycle data. Auto-retrain pipeline triggered.",
        timestamp: "Sep 10, 2026",
        risk: "Accuracy Degradation on Cell SOH"
      }
    ]
  },

  // 9. Business Outcomes and Benefits Realization
  businessOutcomes: {
    ytdCostSavingsRealized: "$3,850,000",
    annualSavingsTarget: "$5,000,000",
    savingsAchievementPct: "77.0%",
    fteCapacityReturned: "42.5 FTE",
    timeToMarketAcceleration: "-3.5 Months",
    overallAiRoiMultiplier: "4.8x",
    sustainableCodeIndex: "94.2 / 100",
    strategicValuePillars: [
      {
        pillar: "Engineering Speed & Agility",
        metric: "3.5 Months Faster",
        detail: "Reduced feature lead time across ADAS and SmartCockpit platforms."
      },
      {
        pillar: "Direct Operational Savings",
        metric: "$3.85M Saved YTD",
        detail: "Measured through automated PR reviews, test synthesis, and triage."
      },
      {
        pillar: "Talent Empowerment",
        metric: "+42.5 FTE Reinvested",
        detail: "Eliminated repetitive maintenance toil; repurposed engineers to core vehicle IP."
      },
      {
        pillar: "Software Quality & Reliability",
        metric: "-42% Defect Density",
        detail: "Measurable reduction in post-production vehicle firmware patch campaigns."
      }
    ]
  }
};

/**
 * Workflow Inbox Items for Engineering Leaders
 * Persona: Alex — Chief AI Officer
 * Categories:
 * 1. New project approvals
 * 2. Model, agent, and tool subscription requests
 * 3. Governance exceptions
 * 4. High-risk deployment approvals
 * 5. Productivity benefit reviews
 * 6. Escalations from projects
 * 7. Portfolio-level recommendations
 */
export const engineeringWorkflowInbox = [
  {
    id: "ENG-WF-01",
    title: "STLA Large Platform SDV Middleware Architecture Phase 2",
    type: "New project approvals",
    priority: "P1",
    riskLevel: "High",
    requestor: "Dr. H. Becker (VP ADAS & Platform Engineering)",
    originatingSystem: "Enterprise Architecture Review Board (EARB)",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Approve initial capital expenditure ($1.4M) and architectural blueprint for POSIX microkernel migration.",
    dueDate: "Tomorrow, 17:00 CET",
    status: "Pending Action",
    confidence: "95.8%",
    supportingEvidence: {
      metrics: "35% reduction in cross-ECU latency; ASPICE Level 3 compliance framework ready.",
      impact: "Enables unified OTA middleware stack across 3 vehicle manufacturing assembly plants.",
      riskAssessment: "Medium risk of legacy AUTOSAR classic driver binding delays during pilot phase.",
      rollbackPlan: "Fallback to dual-stack abstraction layer if real-time CAN determinism drops below 99.9%."
    },
    aiRecommendation: "Approve architecture blueprint with condition that safety milestone artifacts are signed off by sprint 44.",
    decisionHistory: [
      { timestamp: "Sep 12, 10:15 CET", actor: "Dr. H. Becker", action: "Submitted Architecture Charter", comment: "Ready for CAIO sign-off." },
      { timestamp: "Sep 12, 14:30 CET", actor: "Enterprise Architecture Agent", action: "Synthesized Blueprint & Risk Matrix", comment: "Automated gate check: 14/14 criteria met." }
    ],
    auditTrail: "EARB-STLA-2026-0891 // SHA-256: 4f8b91c... // ISO-26262-READY"
  },
  {
    id: "ENG-WF-02",
    title: "Enterprise Claude 3.5 Sonnet Tier-4 Cluster Allocation",
    type: "Model, agent, and tool subscription requests",
    priority: "P2",
    riskLevel: "Medium",
    requestor: "Cockpit UX Core Lead (C. Dupont)",
    originatingSystem: "SEL Nexus AI Subscription Manager",
    portfolio: "Infotainment & Digital Cockpit",
    requiredDecision: "Authorize expansion of AWS Bedrock private provisioned throughput (+150M tokens/mo; $24,500/quarter).",
    dueDate: "Sep 15, 2026",
    status: "Pending Action",
    confidence: "94.2%",
    supportingEvidence: {
      metrics: "Current token utilization at 89% capacity; prompt cache hit rate at 38%.",
      impact: "Prevents rate-limiting bottlenecks for 18 cockpit software engineers during Sprint 43 refactoring.",
      riskAssessment: "Low risk. Compute costs remain comfortably within portfolio allocated Q3 budget envelope.",
      rollbackPlan: "Automatic scale-down to on-demand burst tier if token consumption falls below 60% for 2 consecutive weeks."
    },
    aiRecommendation: "Approve subscription quota expansion. Projected engineering velocity dividend is 480 hours/month.",
    decisionHistory: [
      { timestamp: "Sep 11, 09:40 CET", actor: "C. Dupont", action: "Submitted Token Quota Request", comment: "Cockpit refactor requires higher throughput." },
      { timestamp: "Sep 11, 11:20 CET", actor: "FinOps AI Agent", action: "Budget Verification Completed", comment: "Portfolio has $37,500 remaining Q3 contingency." }
    ],
    auditTrail: "SUB-BEDROCK-7712 // AWS-TURIN-TENANT // CAIO-APPROVAL-REQUIRED"
  },
  {
    id: "ENG-WF-03",
    title: "NeMo Guardrail Override Request: Proprietary CAN Bus Telemetry Tokenizer",
    type: "Governance exceptions",
    priority: "P1",
    riskLevel: "Critical",
    requestor: "BMS Firmware AI Taskforce (A. Moretti)",
    originatingSystem: "Enterprise Data Sovereign & Privacy Gateway",
    portfolio: "Software-Defined Propulsion & Battery",
    requiredDecision: "Review waiver to bypass public cloud guardrail for local on-prem Turin GPU inference on raw CAN payload logs.",
    dueDate: "Today, 18:00 CET",
    status: "Pending Action",
    confidence: "97.1%",
    supportingEvidence: {
      metrics: "Zero PII detected; raw hexadecimal frame data contains proprietary battery thermal curves.",
      impact: "Enables training of edge anomaly detection model on real vehicle test track telemetry.",
      riskAssessment: "Critical severity if routed to external cloud; fully neutralized if pinned to Turin air-gapped cluster.",
      rollbackPlan: "Strict egress gateway packet rejection rule active. Immediate network termination on IP leak attempt."
    },
    aiRecommendation: "Conditional Approval: Grant temporary 30-day waiver locked strictly to VPC Turin Host Group B.",
    decisionHistory: [
      { timestamp: "Sep 13, 08:30 CET", actor: "NeMo Guardrail Engine", action: "Blocked Outbound Tokenization", comment: "Detected non-standard hex payload signature." },
      { timestamp: "Sep 13, 09:15 CET", actor: "A. Moretti", action: "Appealed for Waiver", comment: "Data is purely electrical sensor telemetry, no driver data." }
    ],
    auditTrail: "GOV-WAIVER-2026-CAN // AIRGAP-TURIN-NODE4 // NEMO-AUDIT-ACTIVE"
  },
  {
    id: "ENG-WF-04",
    title: "Autonomous Drive Vision Sensor HAL v3.0 Production Candidate",
    type: "High-risk deployment approvals",
    priority: "P1",
    riskLevel: "Critical",
    requestor: "Perception Release Engineering Squad",
    originatingSystem: "Continuous Delivery & Safety Pipeline (HIL-Gated)",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Sign off on over-the-air (OTA) staged canary firmware deployment to 500 test fleet vehicles.",
    dueDate: "Tomorrow, 12:00 CET",
    status: "Pending Action",
    confidence: "98.4%",
    supportingEvidence: {
      metrics: "Automated test suite passed 8,950 / 9,010 test cases; 0 critical safety regressions.",
      impact: "Improves night-time pedestrian bounding box recall by +12.4% under rainy weather conditions.",
      riskAssessment: "Tier-1 ASIL-D safety-critical software. High blast radius if firmware flash fails.",
      rollbackPlan: "Dual-bank A/B memory partition fallback; instant automatic reversion on watchdog reset within 200ms."
    },
    aiRecommendation: "Approve Canary Phase 1 deployment. 48-hour shadow simulation demonstrated 99.8% bounding box stability.",
    decisionHistory: [
      { timestamp: "Sep 12, 16:00 CET", actor: "HIL Automated Test Cluster", action: "Verification Matrix Generated", comment: "Passed 8,950 test assertions." },
      { timestamp: "Sep 13, 07:45 CET", actor: "Safety Certifier Agent", action: "Signed Off ASIL-D Compliance", comment: "Ready for Executive CAIO release authorization." }
    ],
    auditTrail: "OTA-CANARY-STLA-44.0 // ASIL-D-CERT // A/B-PARTITION-SECURE"
  },
  {
    id: "ENG-WF-05",
    title: "Q3 AI Engineering Assistant Productivity Realization Audit",
    type: "Productivity benefit reviews",
    priority: "P2",
    riskLevel: "Low",
    requestor: "Global Engineering PMO & FinOps",
    originatingSystem: "Jira & GitHub Enterprise Metric Aggregator",
    portfolio: "Enterprise IT & Core Services",
    requiredDecision: "Certify $1.2M validated operational savings and 4,800 developer hours returned from autonomous PR generation.",
    dueDate: "Sep 18, 2026",
    status: "Pending Action",
    confidence: "99.0%",
    supportingEvidence: {
      metrics: "14 pilot engineering squads achieved +38% average sprint velocity; PR cycle time down from 28h to 4.6h.",
      impact: "Enables business case justification to expand autonomous coding agents to 20 additional software squads in Q4.",
      riskAssessment: "Zero operational delivery risk; financial variance within 3.2% of baseline projections.",
      rollbackPlan: "N/A — Retrospective governance audit and validation milestone."
    },
    aiRecommendation: "Endorse audit results. Telemetry data cross-checked against SonarQube quality gates and Jira sprint burn-downs.",
    decisionHistory: [
      { timestamp: "Sep 10, 14:00 CET", actor: "Engineering Analytics Engine", action: "Compiled Q3 Telemetry", comment: "Telemetry covers 48 squads, 640 engineers." },
      { timestamp: "Sep 11, 16:30 CET", actor: "Lead FinOps Auditor", action: "Submitted for CAIO Endorsement", comment: "ROI calculations audited and reconciled." }
    ],
    auditTrail: "AUDIT-ROI-Q3-2026 // DORA-ELITE-VERIFIED // SPRINT-ANALYTICS-OK"
  },
  {
    id: "ENG-WF-06",
    title: "Memory Leak Deadlock Escalation: Android Automotive Audio HAL",
    type: "Escalations from projects",
    priority: "P1",
    riskLevel: "High",
    requestor: "Lead Systems Architect (Infotainment Cockpit)",
    originatingSystem: "Jira Critical Defect Escalation Pipeline",
    portfolio: "Infotainment & Digital Cockpit",
    requiredDecision: "Authorize cross-portfolio SWAT assignment of 2 senior embedded kernel engineers to resolve thermal crash.",
    dueDate: "Today, 20:00 CET",
    status: "Pending Action",
    confidence: "96.5%",
    supportingEvidence: {
      metrics: "Memory heap grows 45MB/hour under continuous high-temperature stress tests until watchdog reboot.",
      impact: "Vehicle production software freeze occurs in 12 days; currently blocks Q4 vehicle homologation sign-off.",
      riskAssessment: "High risk of schedule delay for STLA SmartCockpit Gen3 start of production (SOP).",
      rollbackPlan: "Revert to legacy audio HAL v2.8 temporarily if patch cannot be stabilized within 72 hours."
    },
    aiRecommendation: "Approve engineer reassignment immediately. Recommended engineers: J. Laurent (ADAS) and P. Schmidt (Propulsion).",
    decisionHistory: [
      { timestamp: "Sep 13, 11:10 CET", actor: "Automated Soak Test Bench", action: "Logged Fatal Kernel Panic", comment: "Out of memory in audio server thread pool." },
      { timestamp: "Sep 13, 13:00 CET", actor: "Cockpit Lead Architect", action: "Triggered Executive Escalation", comment: "Internal squad lacks low-level JNI kernel bandwidth." }
    ],
    auditTrail: "ESC-JIRA-COCKPIT-9821 // CRITICAL-PATH-BLOCKER // CAIO-SWAT-DISPATCH"
  },
  {
    id: "ENG-WF-07",
    title: "Cross-Portfolio Deprecation of Legacy Code Llama 13B in Favor of DeepSeek 70B",
    type: "Portfolio-level recommendations",
    priority: "P2",
    riskLevel: "Medium",
    requestor: "Chief AI Architect Office",
    originatingSystem: "Enterprise Model Governance & Lifecycle Console",
    portfolio: "Connected Vehicle & Cloud Platform",
    requiredDecision: "Approve scheduled deprecation timeline and decommission roadmap for legacy 13B model endpoints by Oct 15.",
    dueDate: "Sep 22, 2026",
    status: "Pending Action",
    confidence: "98.2%",
    supportingEvidence: {
      metrics: "DeepSeek 70B on Turin GPU cluster delivers 91.4% pass@1 coding accuracy vs 72.1% on legacy 13B; 40% lower latency.",
      impact: "Reduces on-prem GPU cluster operational overhead by $18,000/quarter while boosting developer code quality.",
      riskAssessment: "Low risk. Backward compatibility proxy tested across 120 internal microservice repositories.",
      rollbackPlan: "Containerized 13B images retained in cold artifact storage for 90 days in case of emergency rollback."
    },
    aiRecommendation: "Approve deprecation roadmap. Recommend automated migration script rollout during sprint 43 maintenance window.",
    decisionHistory: [
      { timestamp: "Sep 09, 10:00 CET", actor: "AI Architecture Board", action: "Published Benchmark Report", comment: "DeepSeek 70B significantly outperforms legacy 13B baseline." },
      { timestamp: "Sep 11, 15:45 CET", actor: "Chief Architect Office", action: "Submitted Transition Plan", comment: "Ready for Executive CAIO ratification." }
    ],
    auditTrail: "REC-MODEL-DEP-077 // TURIN-GPU-OPTIMIZED // PASS@1-BENCHMARK-91.4"
  }
];

export const engineeringExperienceData = {
  // 5.3 Model Catalogue
  models: [
    {
      id: "MOD-01",
      name: "Claude 3.5 Sonnet",
      version: "2024-Q3 Enterprise",
      provider: "Anthropic / AWS Bedrock",
      capability: "Complex Code Synthesis & Architecture Blueprinting",
      modality: "Multimodal (Code, Text, Diagrams)",
      deploymentType: "Private VPC (AWS Turin Region)",
      costPerMillionTokens: "$3.00 in / $15.00 out",
      latencyMs: 380,
      riskRating: "Low",
      contextWindow: "200k tokens",
      supportedUseCases: ["SDV Microkernel Code", "Architecture Synthesis", "EARB Blueprint Review"],
      benchmarkResults: {
        humanEval: "92.0%",
        sweBench: "49.0%",
        autosarCompliantRate: "98.4%",
        latencyP95: "410ms"
      },
      limitations: "Requires private VPC endpoint; strict prohibition on raw customer PII payloads without anonymization gateway.",
      approvedUseCases: "POSIX microkernel migration, enterprise architectural refactoring, ADAS simulation orchestration.",
      dataRestrictions: "EU Sovereign Data Boundary; encrypted at rest via KMS customer-managed keys (CMK).",
      usagePolicies: "Enterprise Tier-4 Approved. Automatic rate-limiting at 150M tokens/month.",
      subscribed: true,
      monthlyConsumptionTokens: "84,500,000",
      costAllocation: "$12,400 / mo"
    },
    {
      id: "MOD-02",
      name: "DeepSeek-Coder-V2 236B",
      version: "v2.5 Release",
      provider: "DeepSeek / On-Prem Turin Cluster",
      capability: "High-Performance C++ & Rust AUTOSAR Synthesis",
      modality: "Text & Code",
      deploymentType: "Air-Gapped On-Premises (Turin H100 Node 01-08)",
      costPerMillionTokens: "$0.14 in / $0.28 out",
      latencyMs: 185,
      riskRating: "Low",
      contextWindow: "128k tokens",
      supportedUseCases: ["AUTOSAR Adaptive C++", "HAL Driver Code", "CAN Bus Firmware"],
      benchmarkResults: {
        humanEval: "90.2%",
        sweBench: "43.5%",
        autosarCompliantRate: "99.1%",
        latencyP95: "210ms"
      },
      limitations: "Dedicated H100 GPU cluster allocation required; cannot be exposed to external internet endpoints.",
      approvedUseCases: "ASIL-D embedded controller software, real-time CAN bus telemetry parsing, radar DSP algorithms.",
      dataRestrictions: "Zero external transmission. Local air-gapped Turin data center only.",
      usagePolicies: "Approved for all powertrain, braking, and steering embedded firmware squads.",
      subscribed: true,
      monthlyConsumptionTokens: "142,000,000",
      costAllocation: "$3,800 / mo (Infrastructure amortized)"
    },
    {
      id: "MOD-03",
      name: "Llama 3.3 70B Instruct",
      version: "Meta v3.3",
      provider: "Meta / Self-Hosted Turin Cluster",
      capability: "Diagnostic Reasoning & ECU Troubleshooting",
      modality: "Text & Code",
      deploymentType: "Air-Gapped On-Premises (Turin Node 09-12)",
      costPerMillionTokens: "$0.20 in / $0.40 out",
      latencyMs: 160,
      riskRating: "Low",
      contextWindow: "128k tokens",
      supportedUseCases: ["ECU Diagnostics", "HIL Test Synthesis", "Jira Defect Triaging"],
      benchmarkResults: {
        humanEval: "86.5%",
        sweBench: "38.2%",
        autosarCompliantRate: "96.7%",
        latencyP95: "190ms"
      },
      limitations: "Lower multi-lingual documentation comprehension than Claude 3.5.",
      approvedUseCases: "Automated HIL regression log analysis, vehicle crash recorder decoding.",
      dataRestrictions: "Restricted to internal Stellantis engineering networks.",
      usagePolicies: "Floating license pool across all European vehicle plant engineering hubs.",
      subscribed: true,
      monthlyConsumptionTokens: "68,200,000",
      costAllocation: "$2,200 / mo"
    },
    {
      id: "MOD-04",
      name: "OpenAI GPT-4o (Stellantis Private Tenant)",
      version: "2024-08-06 Dedicated",
      provider: "OpenAI / Microsoft Azure FedRAMP",
      capability: "Multimodal Vision & Driver Monitoring Validation",
      modality: "Multimodal (Vision, Audio, Code, Text)",
      deploymentType: "Dedicated Azure Government Tenant (Frankfurt)",
      costPerMillionTokens: "$5.00 in / $15.00 out",
      latencyMs: 520,
      riskRating: "Medium",
      contextWindow: "128k tokens",
      supportedUseCases: ["Cabin Camera Video QA", "Instrument Cluster UX", "Voice Assistant Synthesis"],
      benchmarkResults: {
        humanEval: "90.2%",
        sweBench: "45.0%",
        autosarCompliantRate: "94.5%",
        latencyP95: "580ms"
      },
      limitations: "Higher inference latency; egress bandwidth caps apply to large camera video streams.",
      approvedUseCases: "Cockpit UX prototyping, synthetic dataset generation for driver drowsiness cameras.",
      dataRestrictions: "Customer facial recordings must be anonymized before ingestion.",
      usagePolicies: "Requires Chief AI Officer pre-authorization for batches exceeding 50GB.",
      subscribed: false,
      monthlyConsumptionTokens: "18,400,000",
      costAllocation: "$8,900 / mo"
    },
    {
      id: "MOD-05",
      name: "Mistral Large 2",
      version: "2407 EU Enterprise",
      provider: "Mistral AI / OVHcloud EU",
      capability: "Multi-jurisdiction Homologation & Regulatory Compliance",
      modality: "Text & Code (Multilingual)",
      deploymentType: "EU Sovereign Cloud (Paris Data Center)",
      costPerMillionTokens: "$2.00 in / $6.00 out",
      latencyMs: 310,
      riskRating: "Low",
      contextWindow: "128k tokens",
      supportedUseCases: ["UNECE R155/R156 Compliance", "ISO 26262 Evidence Generation", "EU AI Act Audit"],
      benchmarkResults: {
        humanEval: "88.0%",
        sweBench: "41.2%",
        autosarCompliantRate: "97.2%",
        latencyP95: "340ms"
      },
      limitations: "Slightly slower token generation on deeply nested C++ templates.",
      approvedUseCases: "Autonomous Driving homologation filing in France, Germany, and Italy.",
      dataRestrictions: "Guaranteed 100% EU territorial sovereignty under GDPR Article 44.",
      usagePolicies: "Mandatory model for all Legal, Compliance, and Vehicle Homologation workflows.",
      subscribed: true,
      monthlyConsumptionTokens: "32,100,000",
      costAllocation: "$4,500 / mo"
    },
    {
      id: "MOD-06",
      name: "Code Llama 70B Python",
      version: "v1.0 Fine-Tuned",
      provider: "Meta / AWS Dedicated Instance",
      capability: "Python Fleet Telemetry ETL & Battery Thermal Analytics",
      modality: "Code & Text",
      deploymentType: "AWS Dedicated EC2 Cluster",
      costPerMillionTokens: "$0.80 in / $1.60 out",
      latencyMs: 440,
      riskRating: "Medium",
      contextWindow: "100k tokens",
      supportedUseCases: ["Battery Telemetry ETL", "Data Pipeline Automation"],
      benchmarkResults: {
        humanEval: "81.2%",
        sweBench: "32.0%",
        autosarCompliantRate: "89.0%",
        latencyP95: "490ms"
      },
      limitations: "Scheduled for deprecation by Q4 in favor of DeepSeek 70B on-prem.",
      approvedUseCases: "Propulsion legacy script maintenance and battery test bench telemetry ingestion.",
      dataRestrictions: "No live production vehicle telematics without token masking.",
      usagePolicies: "Maintenance mode; no new production projects may onboard this model.",
      subscribed: false,
      monthlyConsumptionTokens: "12,300,000",
      costAllocation: "$1,800 / mo"
    },
    {
      id: "MOD-07",
      name: "StarCoder2 15B (Embedded C)",
      version: "Stellantis Quantized INT8",
      provider: "BigCode / Micro-Edge Node",
      capability: "Ultra-Low Latency Embedded POSIX C Code Completion",
      modality: "Code",
      deploymentType: "Local Micro-Edge & Developer Workstations",
      costPerMillionTokens: "$0.05 in / $0.10 out",
      latencyMs: 95,
      riskRating: "Low",
      contextWindow: "16k tokens",
      supportedUseCases: ["IDE Inline Completion", "RTOS Driver Stubs", "Memory-Constrained Microcontrollers"],
      benchmarkResults: {
        humanEval: "75.4%",
        sweBench: "26.8%",
        autosarCompliantRate: "95.2%",
        latencyP95: "110ms"
      },
      limitations: "Small context window (16k); not suitable for multi-file architectural refactoring.",
      approvedUseCases: "Local offline IDE code auto-complete on engineer laptops.",
      dataRestrictions: "Completely offline capable; zero data telemetry exfiltration.",
      usagePolicies: "Unlimited developer seat distribution across all software engineering centers.",
      subscribed: true,
      monthlyConsumptionTokens: "210,000,000",
      costAllocation: "$950 / mo"
    },
    {
      id: "MOD-08",
      name: "Qwen 2.5 72B Instruct",
      version: "Alibaba Enterprise v2.5",
      provider: "Alibaba / Isolated Sandbox",
      capability: "Multilingual Cockpit Assistant & APAC Voice AI",
      modality: "Multimodal (Text, Audio, Code)",
      deploymentType: "Experimental Sandbox (Isolated VPC)",
      costPerMillionTokens: "$0.35 in / $0.70 out",
      latencyMs: 290,
      riskRating: "High",
      contextWindow: "128k tokens",
      supportedUseCases: ["APAC Cockpit Voice AI", "Mandarin/Japanese Speech Synthesis"],
      benchmarkResults: {
        humanEval: "86.1%",
        sweBench: "37.4%",
        autosarCompliantRate: "91.8%",
        latencyP95: "320ms"
      },
      limitations: "Pending final security audit for Tier-1 safety gateway integration.",
      approvedUseCases: "Pre-market evaluation for APAC SmartCockpit vehicle line.",
      dataRestrictions: "Isolated VPC; zero connection to production CAN bus networks.",
      usagePolicies: "Experimental status; requires CAIO authorization for flight tests.",
      subscribed: false,
      monthlyConsumptionTokens: "4,200,000",
      costAllocation: "$620 / mo"
    }
  ],

  // 5.4 Agent and Agentic Workflow Catalogue
  agents: [
    {
      id: "AGT-01",
      name: "STLA-EARB Architecture Blueprint Synthesizer",
      lifecycleStage: "Active",
      domain: "Enterprise Software Architecture",
      projectType: "STLA Large Platform SDV",
      autonomyLevel: "L3 Semi-Autonomous",
      riskRating: "Medium",
      technology: "LangGraph + Claude 3.5 Sonnet",
      businessFunction: "Platform Architectural Governance",
      purpose: "Automates synthesis of POSIX microkernel blueprints and checks cross-ECU latency constraints against ASPICE standards.",
      owner: "Dr. H. Becker (VP ADAS & Platform Engineering)",
      inputs: "Software Architecture Description (SAD), ARXML Interface Specs, Jira Epics",
      outputs: "Formal EARB Architecture Charter, Latency Budgets, Interface Contracts",
      tools: ["Enterprise Architect API", "Clang AST Parser", "Jira API", "Latency Simulator"],
      modelDependencies: ["Claude 3.5 Sonnet", "DeepSeek-Coder-V2"],
      permissions: ["EARB Repository Write", "Jira Architecture Project Admin", "VPC Turin Compute"],
      evaluationResults: "99.1% Pass Rate across 4,210 architectural gate checks; 0 safety regression escapes.",
      executionMetrics: {
        totalRuns: 4210,
        successRate: "99.1%",
        avgDuration: "1.8s",
        costPerRun: "$0.0032"
      },
      subscribedToProject: "STLA Large SDV Platform Phase 2"
    },
    {
      id: "AGT-02",
      name: "ASIL-D Automated Safety Certifier & Gatekeeper",
      lifecycleStage: "Active",
      domain: "Autonomous Driving & ADAS",
      projectType: "Vision Sensor HAL & Highway Pilot",
      autonomyLevel: "L3 Semi-Autonomous",
      riskRating: "Critical",
      technology: "Semantic Kernel + DeepSeek-Coder-V2",
      businessFunction: "Functional Safety & Regulatory Compliance",
      purpose: "Validates all OTA canary pull requests against ISO-26262 ASIL-D test suites, watchdog timing matrices, and memory bounds.",
      owner: "Functional Safety Office (M. Rossi)",
      inputs: "C++ Pull Request Diff, Vector CANoe Test Trace, HIL Telemetry Logs",
      outputs: "Cryptographic Safety Certificate, ASIL-D Audit Hash, Merge Clearance",
      tools: ["Vector CANoe HIL Interface", "SonarQube ASIL Rulebook", "GitLab CI Pipeline Triggers"],
      modelDependencies: ["DeepSeek-Coder-V2", "Mistral Large 2"],
      permissions: ["Production OTA Canary Trigger", "GitHub Enterprise Protected Branch Bypass"],
      evaluationResults: "99.8% Accuracy on 18,400 HIL test matrices; blocked 14 latent memory panics before flash.",
      executionMetrics: {
        totalRuns: 18400,
        successRate: "99.8%",
        avgDuration: "4.2s",
        costPerRun: "$0.0048"
      },
      subscribedToProject: "Autonomous Driving Tier-1 Perception"
    },
    {
      id: "AGT-03",
      name: "AUTOSAR Adaptive C++ Code Generator",
      lifecycleStage: "Active",
      domain: "Embedded Vehicle Systems",
      projectType: "Propulsion & SmartCockpit ECU",
      autonomyLevel: "L2 Copilot",
      riskRating: "Low",
      technology: "DeepSeek-Coder-V2 + Clang AST Rewriter",
      businessFunction: "Embedded Software Engineering",
      purpose: "Generates MISRA-C++ compliant service skeletons and serialization code from ARXML model definitions.",
      owner: "Core Platform Engineering (J. Moreau)",
      inputs: "ARXML Schema v4.4, Service Interface Contract, C++ Component Template",
      outputs: "MISRA-compliant C++17 Header/Source Files, GoogleTest Harnesses",
      tools: ["Clang-Tidy MISRA Linter", "ARXML Parser", "CMake Build Generator"],
      modelDependencies: ["DeepSeek-Coder-V2"],
      permissions: ["Code Repository Pull Request Creation"],
      evaluationResults: "94.6% First-Pass Compilation Rate across 42,900 component generations.",
      executionMetrics: {
        totalRuns: 42900,
        successRate: "94.6%",
        avgDuration: "0.9s",
        costPerRun: "$0.0011"
      },
      subscribedToProject: "Battery Management Firmware Gen4"
    },
    {
      id: "AGT-04",
      name: "HIL Test Suite Autonomous Healer",
      lifecycleStage: "Active",
      domain: "Verification & Quality Engineering",
      projectType: "Vehicle Test Bench Automation",
      autonomyLevel: "L3 Semi-Autonomous",
      riskRating: "Medium",
      technology: "AutoGen + OpenAI GPT-4o",
      businessFunction: "Test Automation & SOAK Engineering",
      purpose: "Detects flaky hardware-in-the-loop (HIL) test assertions caused by CAN bus clock drift and dynamically patches timing assertions.",
      owner: "Validation Operations Squad (L. Varga)",
      inputs: "Vector CANoe Test Bench Logs, Oscilloscope Digital Traces, Flaky Test Flag",
      outputs: "Remediated PyTest/CAPL Test Scripts, Jitter Analysis Report",
      tools: ["CAPL Script Engine", "Vector dSPACE Simulator", "PyTest Runner"],
      modelDependencies: ["OpenAI GPT-4o", "Llama 3.3 70B"],
      permissions: ["HIL Cluster Test Suite Update", "dSPACE Real-time Controller"],
      evaluationResults: "96.2% Flaky Test Healing Success across 8,150 automated nightly soak runs.",
      executionMetrics: {
        totalRuns: 8150,
        successRate: "96.2%",
        avgDuration: "3.5s",
        costPerRun: "$0.0055"
      },
      subscribedToProject: "Autonomous Driving Validation Fleet"
    },
    {
      id: "AGT-05",
      name: "OTA Canary Blast Radius Analyzer",
      lifecycleStage: "Experimental",
      domain: "Release & Cloud Fleet Engineering",
      projectType: "STLA Connected Cloud Platform",
      autonomyLevel: "L4 Autonomous",
      riskRating: "High",
      technology: "CrewAI + Mistral Large 2",
      businessFunction: "Continuous Deployment & Over-the-Air Release",
      purpose: "Autonomously observes real-time vehicle telemetry across canary vehicle batches and halts rollouts on anomaly detection.",
      owner: "Cloud Platform Release Management (S. Weber)",
      inputs: "Kafka Telemetry Stream (Speed, Battery Voltage, Steering Angle, Error DTCs)",
      outputs: "Canary Rollout Decision (Proceed / Abort / Rollback), Executive RCA Alert",
      tools: ["Kafka Telemetry Consumer", "OTA Firmware Fleet Manager", "Slack/Teams Webhook"],
      modelDependencies: ["Mistral Large 2", "Claude 3.5 Sonnet"],
      permissions: ["OTA Staged Rollout Admin", "Fleet Telemetry Ingestion"],
      evaluationResults: "91.5% Anomaly Catch Rate in shadow simulation over 640 staged rollouts.",
      executionMetrics: {
        totalRuns: 640,
        successRate: "91.5%",
        avgDuration: "5.4s",
        costPerRun: "$0.0082"
      },
      subscribedToProject: "STLA Global Fleet Telematics Hub"
    },
    {
      id: "AGT-06",
      name: "Legacy Fortran/Simulink Powertrain Transpiler",
      lifecycleStage: "Experimental",
      domain: "Modernization & Technical Debt",
      projectType: "Hybrid Powertrain Calibration",
      autonomyLevel: "L2 Copilot",
      riskRating: "Medium",
      technology: "Code Llama 70B + Clang Static Analyzer",
      businessFunction: "Legacy Code Migration",
      purpose: "Converts legacy powertrain physical engine models into modern POSIX-compliant modular C++ classes.",
      owner: "Propulsion SWAT Modernization (G. Ferrari)",
      inputs: "Legacy Fortran 90 Routines, Simulink Math Matrices",
      outputs: "Modern C++20 Math Library, Unit Tests with 100% Numerical Parity",
      tools: ["Clang Analyzer", "Fortran Parser", "Floating-Point Parity Checker"],
      modelDependencies: ["Code Llama 70B", "DeepSeek-Coder-V2"],
      permissions: ["Propulsion Subversion/Git Migration Mirror"],
      evaluationResults: "88.4% Numerical Precision Parity across 310 migrated thermodynamic routines.",
      executionMetrics: {
        totalRuns: 310,
        successRate: "88.4%",
        avgDuration: "6.8s",
        costPerRun: "$0.0094"
      },
      subscribedToProject: "Propulsion SDV Transition"
    },
    {
      id: "AGT-07",
      name: "Unsanitized Telemetry Public Cloud Scraper",
      lifecycleStage: "Suspended",
      domain: "Fleet Data Engineering",
      projectType: "Cross-Fleet Telemetry Aggregation",
      autonomyLevel: "L1 Copilot",
      riskRating: "Critical",
      technology: "Custom Python + Public Llama Endpoint",
      businessFunction: "Fleet Data Scraping",
      purpose: "Aggregated raw chassis CAN frames to public cloud storage without NeMo Sovereign Tokenizer anonymization.",
      owner: "SecOps Compliance Committee",
      inputs: "Raw Vehicle CAN Bus Bus Dumps",
      outputs: "Unmasked AWS S3 Data Lake Buckets",
      tools: ["AWS S3 Uploader", "Raw CAN Streamer"],
      modelDependencies: ["Unapproved Public Endpoint"],
      permissions: ["REVOKED BY CHIEF AI OFFICER (Policy #GOV-901)"],
      evaluationResults: "Suspended: Flagged for high-risk egress violation during sprint 41 security audit.",
      executionMetrics: {
        totalRuns: 120,
        successRate: "0.0% (Suspended)",
        avgDuration: "N/A",
        costPerRun: "$0.00"
      },
      subscribedToProject: "None (Revoked)"
    },
    {
      id: "AGT-08",
      name: "Classic AUTOSAR XML Parser v1.2",
      lifecycleStage: "Retired",
      domain: "Legacy Tooling",
      projectType: "Legacy STLA Platform Pre-SDV",
      autonomyLevel: "L1 Copilot",
      riskRating: "Low",
      technology: "Python 3.8 + Local Regex Rulebook",
      businessFunction: "Legacy ARXML Ingestion",
      purpose: "Extracted ECU port configurations from legacy AUTOSAR 3.x XML files.",
      owner: "Archived Systems Team",
      inputs: "AUTOSAR 3.2 XML Files",
      outputs: "Static Header Files",
      tools: ["Python ElementTree"],
      modelDependencies: ["None (Rule-based)"],
      permissions: ["Read-only Archive Access"],
      evaluationResults: "Retired: Superseded by STLA-EARB Architecture Blueprint Synthesizer (AGT-01).",
      executionMetrics: {
        totalRuns: 24000,
        successRate: "99.0% (Historic)",
        avgDuration: "0.4s",
        costPerRun: "$0.00"
      },
      subscribedToProject: "Archived Platform STLA-2022"
    }
  ],

  // 5.5 AI Tools Catalogue (10 Disciplines)
  tools: [
    {
      id: "TOOL-01",
      name: "GitHub Copilot Enterprise for Automotive",
      category: "Coding assistants",
      description: "AI-powered paired programming extension fine-tuned on Stellantis POSIX SDV libraries and MISRA-C++ coding guidelines.",
      useCases: ["Real-time code synthesis", "Unit test scaffolding", "C++17/20 modernization"],
      integrationRequirements: "VS Code / CLion plugin; Stellantis Okta SSO authentication; Private VPC egress proxy.",
      licensingInfo: "Enterprise Tier ($39/user/month); 1,200 active enterprise seats allocated.",
      approvedProjectTypes: ["All Software-Defined Vehicle (SDV) Core Repositories"],
      securityClassification: "Confidential",
      dataHandlingRestrictions: "Zero data retention policy enabled; code telemetry never utilized for public foundational model training.",
      supportOwner: "Engineering Excellence & Tooling Squad (E. Blanc)",
      subscriptionProcess: "Self-service instantaneous approval for engineering grades L3 and above.",
      usageMetrics: {
        activeUsers: 940,
        adoptionRate: "89.4%",
        monthlySuggestionsAccepted: "348,000",
        hoursSavedMonthly: "4,600 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-02",
      name: "Vector CANoe AI Test Executor",
      category: "Testing tools",
      description: "Automated simulation environment for ECU network testing and synthetic hardware fault injection with AI test assertion generation.",
      useCases: ["Hardware-in-the-Loop (HIL) automation", "Flaky test diagnosis", "Real-time CAN FD/Ethernet bus fuzzing"],
      integrationRequirements: "Vector VN8900 Network Interface, dSPACE Scalexio Rack, Python Vector API.",
      licensingInfo: "Floating concurrent license pool (48 hardware dongles + cloud soft-licenses).",
      approvedProjectTypes: ["ADAS & Autonomous Driving", "Powertrain & Battery Management", "Chassis Dynamics"],
      securityClassification: "Restricted",
      dataHandlingRestrictions: "Strictly confined to physical lab test bench networks; no cloud data exfiltration.",
      supportOwner: "HIL Validation Operations (K. Schneider)",
      subscriptionProcess: "Manager approval + physical lab safety clearance required.",
      usageMetrics: {
        activeUsers: 140,
        adoptionRate: "94.2%",
        monthlyRuns: "18,400 test batches",
        hoursSavedMonthly: "1,850 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-03",
      name: "Enterprise Architect AI Model Synthesizer",
      category: "Architecture tools",
      description: "SysML v2 and UML architectural modeling suite with automated interface synthesis and cross-ECU bandwidth budgeting.",
      useCases: ["SysML v2 system modeling", "ASPICE Level 3 traceability", "Microkernel communication graph validation"],
      integrationRequirements: "Sparx Systems Enterprise Architect 16, Jira Enterprise Connector, Git LFS.",
      licensingInfo: "Corporate Site License (unlimited internal developers).",
      approvedProjectTypes: ["All Platform Architecture and System Engineering Charters"],
      securityClassification: "Confidential",
      dataHandlingRestrictions: "Encrypted on internal Bitbucket/GitLab servers.",
      supportOwner: "Enterprise Architecture Review Board (Dr. H. Becker)",
      subscriptionProcess: "Instant self-service subscription for software architects.",
      usageMetrics: {
        activeUsers: 85,
        adoptionRate: "81.0%",
        monthlyDiagramsSynthesized: "1,240",
        hoursSavedMonthly: "920 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-04",
      name: "GitLab CI/CD Autonomous Pipeline Healer",
      category: "DevOps tools",
      description: "AI agent that analyzes failed build logs in GitLab runners, detects compile errors or missing toolchains, and generates merge fixes.",
      useCases: ["Automated compiler fix suggestions", "Docker runner cache optimization", "Flaky CI pipeline rerun triage"],
      integrationRequirements: "GitLab Dedicated Enterprise Runner Fleet; Kubernetes cluster integration.",
      licensingInfo: "GitLab Ultimate Enterprise license included.",
      approvedProjectTypes: ["All GitLab repositories across all software domains"],
      securityClassification: "Internal",
      dataHandlingRestrictions: "Pipeline logs processed exclusively on on-prem Turin inference cluster.",
      supportOwner: "Platform DevOps & Release Operations (D. Rossi)",
      subscriptionProcess: "Default-on for all repositories with CI/CD enabled.",
      usageMetrics: {
        activeUsers: 620,
        adoptionRate: "96.5%",
        monthlyFixesApplied: "4,120",
        hoursSavedMonthly: "1,400 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-05",
      name: "Dynatrace Davis AI Telemetry Observer",
      category: "Observability tools",
      description: "Causal AI observability platform detecting distributed trace latency spikes, microservice deadlocks, and CAN gateway throughput issues.",
      useCases: ["Distributed trace root cause analysis", "ECU gateway memory leak detection", "Cloud-to-vehicle latency tracking"],
      integrationRequirements: "Dynatrace OneAgent on QNX/Linux vehicle instances; AWS CloudWatch telemetry forwarder.",
      licensingInfo: "Enterprise DPS (Digital Performance Spend) model.",
      approvedProjectTypes: ["Connected Vehicle Services", "Infotainment Backend", "OTA Fleet Services"],
      securityClassification: "Restricted",
      dataHandlingRestrictions: "Masks driver GPS coordinates and VIN identifiers before aggregation.",
      supportOwner: "Cloud Platform Observability Squad (M. Leroux)",
      subscriptionProcess: "Role-based authorization via Azure AD security group.",
      usageMetrics: {
        activeUsers: 210,
        adoptionRate: "88.0%",
        monthlyIncidentsDiagnosed: "890",
        hoursSavedMonthly: "2,100 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-06",
      name: "Apache Spark + Databricks AI Lakehouse Optimizer",
      category: "Data engineering tools",
      description: "Automated ETL cluster optimizer that uses ML to tune shuffle partitions, memory allocation, and Delta Lake compaction for fleet logs.",
      useCases: ["Fleet sensor data ETL", "Battery degradation model training data prep", "Kafka event streaming optimization"],
      integrationRequirements: "Databricks on AWS Turin; Delta Lake 3.0; Apache Kafka enterprise connectors.",
      licensingInfo: "Databricks Premium DBU compute consumption pool.",
      approvedProjectTypes: ["Big Data & Telematics Pipelines", "Battery & Propulsion AI"],
      securityClassification: "Restricted",
      dataHandlingRestrictions: "Zero external storage; encrypted at rest with AWS KMS customer keys.",
      supportOwner: "Enterprise Data Platform (V. Sharma)",
      subscriptionProcess: "Requires Data Governance Officer sign-off.",
      usageMetrics: {
        activeUsers: 115,
        adoptionRate: "76.4%",
        monthlyTerabytesProcessed: "420 TB",
        hoursSavedMonthly: "840 hrs"
      },
      subscribed: false
    },
    {
      id: "TOOL-07",
      name: "AWS Mainframe & Microkernel Modernizer",
      category: "Modernization tools",
      description: "Autonomous code modernization engine for decompiling and transforming legacy monolithic software into containerized microservices.",
      useCases: ["Monolithic legacy C to microkernel POSIX translation", "Technical debt analysis", "Dependency decoupling"],
      integrationRequirements: "AWS Migration Hub; SonarQube Enterprise; Clang modernizer plugin.",
      licensingInfo: "AWS Enterprise Agreement compute credits.",
      approvedProjectTypes: ["Chassis & Propulsion Modernization SWAT Projects"],
      securityClassification: "Confidential",
      dataHandlingRestrictions: "Executed within private VPC subnet with zero public internet egress.",
      supportOwner: "Engineering Modernization Lead (P. Novak)",
      subscriptionProcess: "Project-level approval by Chief AI Officer.",
      usageMetrics: {
        activeUsers: 45,
        adoptionRate: "68.0%",
        monthlyLinesRefactored: "185,000 LoC",
        hoursSavedMonthly: "1,120 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-08",
      name: "Confluence & DOORS NextGen AI Knowledge Bridge",
      category: "Documentation and knowledge tools",
      description: "RAG-powered engineering search and bidirectional documentation synchronizer between IBM DOORS NextGen requirements and Confluence.",
      useCases: ["Regulatory requirement traceability", "Auto-generating architecture specs from code", "Engineering QA chatbot"],
      integrationRequirements: "IBM DOORS NextGen REST API; Atlassian Confluence Enterprise; Qdrant Vector DB.",
      licensingInfo: "Corporate Enterprise License.",
      approvedProjectTypes: ["All Stellantis Engineering Portfolios"],
      securityClassification: "Internal",
      dataHandlingRestrictions: "Strict role-based document access control; respect project ACLs in vector search.",
      supportOwner: "Knowledge Management & PMO (S. Fontana)",
      subscriptionProcess: "Available to all Stellantis engineering employees by default.",
      usageMetrics: {
        activeUsers: 1450,
        adoptionRate: "92.0%",
        monthlyQueriesAnswered: "68,000",
        hoursSavedMonthly: "3,800 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-09",
      name: "Snyk & NeMo Guardrail Automotive Shield",
      category: "Security and compliance tools",
      description: "Real-time static code security analysis and AI model output guardrail engine specifically tuned for ISO 21434 and UNECE R155.",
      useCases: ["CAN payload buffer overflow prevention", "Open source license compliance", "AI prompt injection & jailbreak blocking"],
      integrationRequirements: "GitLab/GitHub PR checks; NeMo Guardrail proxy; Snyk Container Scanner.",
      licensingInfo: "Enterprise Security Bundle ($28,000/quarter).",
      approvedProjectTypes: ["Mandatory for all connected and safety-critical vehicle software"],
      securityClassification: "Restricted",
      dataHandlingRestrictions: "All scan metadata retained in EU sovereign jurisdiction.",
      supportOwner: "Chief Information Security Office (CISO Automotive Squad)",
      subscriptionProcess: "Mandatory automated enrollment on all active production repositories.",
      usageMetrics: {
        activeUsers: 880,
        adoptionRate: "98.8%",
        monthlyVulnerabilitiesBlocked: "1,420",
        hoursSavedMonthly: "2,900 hrs"
      },
      subscribed: true
    },
    {
      id: "TOOL-10",
      name: "Jira Product Discovery AI Prioritization Assistant",
      category: "Product-management tools",
      description: "Predictive feature ranking and engineering cost estimation engine that correlates customer voice telemetry with sprint capacity.",
      useCases: ["Automated user story acceptance criteria generation", "Feature ROI forecasting", "Cross-team dependency resolution"],
      integrationRequirements: "Atlassian Jira Product Discovery; Salesforce CRM feedback API; GitLab Issue Board.",
      licensingInfo: "Atlassian Jira Enterprise Tier.",
      approvedProjectTypes: ["Infotainment & Digital Cockpit", "Connected Mobility Services", "ADAS Product Lines"],
      securityClassification: "Internal",
      dataHandlingRestrictions: "Customer comments stripped of personal identifiers before ML clustering.",
      supportOwner: "Product Management Operations (T. De Vries)",
      subscriptionProcess: "Self-service for Product Owners, Technical PMs, and Engineering Leads.",
      usageMetrics: {
        activeUsers: 195,
        adoptionRate: "83.5%",
        monthlyStoriesAnalyzed: "2,400",
        hoursSavedMonthly: "1,250 hrs"
      },
      subscribed: true
    }
  ],

  // 5.6 My Subscriptions (Consolidated view across 5 levels and 8 entity types)
  mySubscriptions: [
    {
      id: "SUB-01",
      entityName: "Claude 3.5 Sonnet Tier-4 Cluster",
      type: "Model",
      level: "Portfolio level",
      monthlyUsage: "84.5M / 150M tokens (56%)",
      costAllocation: "$12,400 / mo",
      grantedBy: "Alex (CAIO Executive Approval)",
      renewalDate: "2026-12-31",
      status: "Active"
    },
    {
      id: "SUB-02",
      entityName: "DeepSeek-Coder-V2 236B On-Prem",
      type: "Model",
      level: "Enterprise level",
      monthlyUsage: "142.0M tokens (Unlimited on-prem)",
      costAllocation: "$3,800 / mo",
      grantedBy: "Enterprise Architecture Board",
      renewalDate: "2027-06-30",
      status: "Active"
    },
    {
      id: "SUB-03",
      entityName: "STLA-EARB Architecture Blueprint Synthesizer",
      type: "Agent",
      level: "Portfolio level",
      monthlyUsage: "4,210 execution runs",
      costAllocation: "$340 / mo",
      grantedBy: "Dr. H. Becker (VP ADAS)",
      renewalDate: "2026-11-15",
      status: "Active"
    },
    {
      id: "SUB-04",
      entityName: "ASIL-D Automated Safety Certifier",
      type: "Agent",
      level: "Enterprise level",
      monthlyUsage: "18,400 validation gates",
      costAllocation: "$890 / mo",
      grantedBy: "Functional Safety Office",
      renewalDate: "2027-01-31",
      status: "Active"
    },
    {
      id: "SUB-05",
      entityName: "HIL Flaky Test Healing Agentic Workflow",
      type: "Agentic workflow",
      level: "Project level",
      monthlyUsage: "8,150 automated soak runs",
      costAllocation: "$450 / mo",
      grantedBy: "Validation Operations Lead",
      renewalDate: "2026-10-31",
      status: "Active"
    },
    {
      id: "SUB-06",
      entityName: "GitHub Copilot Enterprise for Automotive",
      type: "AI tool",
      level: "Enterprise level",
      monthlyUsage: "940 active engineering seats",
      costAllocation: "$36,660 / mo",
      grantedBy: "Alex (Chief AI Officer)",
      renewalDate: "2026-12-31",
      status: "Active"
    },
    {
      id: "SUB-07",
      entityName: "Vector CANoe AI Test Executor",
      type: "AI tool",
      level: "Team level",
      monthlyUsage: "48 concurrent lab dongles",
      costAllocation: "$14,200 / mo",
      grantedBy: "HIL Validation Operations",
      renewalDate: "2026-11-30",
      status: "Active"
    },
    {
      id: "SUB-08",
      entityName: "STLA Large Platform SDV Middleware Phase 2",
      type: "Project",
      level: "Portfolio level",
      monthlyUsage: "38 active engineering squads",
      costAllocation: "CAPEX $1.4M Program",
      grantedBy: "Executive Strategy Board",
      renewalDate: "2027-09-30",
      status: "Active"
    },
    {
      id: "SUB-09",
      entityName: "Critical Homologation & Safety OTA Alerts",
      type: "Notifications",
      level: "Individual level",
      monthlyUsage: "18 priority alerts / month",
      costAllocation: "$0 (Platform Included)",
      grantedBy: "Automated CAIO Profile Policy",
      renewalDate: "Indefinite",
      status: "Active"
    },
    {
      id: "SUB-10",
      entityName: "ISO-26262 & UNECE R155 Automotive Governance Policy",
      type: "Governance policy",
      level: "Enterprise level",
      monthlyUsage: "Enforced across 142 repositories",
      costAllocation: "$0 (Regulatory Compliance)",
      grantedBy: "Corporate Governance Committee",
      renewalDate: "2027-12-31",
      status: "Active"
    },
    {
      id: "SUB-11",
      entityName: "Executive CAIO DORA & Productivity Master Dashboard",
      type: "Reports and dashboards",
      level: "Individual level",
      monthlyUsage: "Live real-time telemetry feed",
      costAllocation: "$0 (Executive Portal)",
      grantedBy: "Alex (Head of Software Engineering)",
      renewalDate: "Indefinite",
      status: "Active"
    },
    {
      id: "SUB-12",
      entityName: "Mistral Large 2 EU Sovereign Endpoint",
      type: "Model",
      level: "Portfolio level",
      monthlyUsage: "32.1M / 50M tokens (64%)",
      costAllocation: "$4,500 / mo",
      grantedBy: "EU Data Sovereignty Officer",
      renewalDate: "2026-10-15",
      status: "Pending Renewal"
    },
    {
      id: "SUB-13",
      entityName: "Dynatrace Davis AI Telemetry Observer",
      type: "AI tool",
      level: "Portfolio level",
      monthlyUsage: "210 active monitoring hosts",
      costAllocation: "$6,800 / mo",
      grantedBy: "Cloud Platform Lead",
      renewalDate: "2026-09-30",
      status: "Expiring Soon"
    },
    {
      id: "SUB-14",
      entityName: "Legacy Code Llama 70B Python Dedicated Instance",
      type: "Model",
      level: "Project level",
      monthlyUsage: "12.3M tokens (Scheduled Deprecation)",
      costAllocation: "$1,800 / mo",
      grantedBy: "Propulsion SWAT",
      renewalDate: "2026-10-01",
      status: "Expiring Soon"
    }
  ],

  // 5.1 Persona Drill-Down Explorer Hierarchy:
  // Portfolio -> Project -> Workflow -> Agent -> Model -> Execution Details
  drillDownTree: [
    {
      level: 1,
      type: "Portfolio",
      id: "PORT-ADAS",
      name: "Autonomous Driving & ADAS",
      head: "Dr. H. Becker",
      status: "Optimal",
      healthScore: "94%",
      budgetBurn: "74.2%",
      projects: [
        {
          level: 2,
          type: "Project",
          id: "PRJ-STLA-LARGE",
          name: "STLA Large Platform SDV Middleware Phase 2",
          stage: "Sprint 43 (Canary Staging)",
          lead: "C. Dupont",
          milestone: "92% On-Track",
          workflows: [
            {
              level: 3,
              type: "Workflow",
              id: "WF-CANARY-OTA",
              name: "ASIL-D Staged OTA Canary Release Workflow",
              trigger: "HIL Automated Gate Trigger",
              frequency: "Daily Staged",
              agents: [
                {
                  level: 4,
                  type: "Agent",
                  id: "AGT-02",
                  name: "ASIL-D Automated Safety Certifier & Gatekeeper",
                  autonomy: "L3 Semi-Autonomous",
                  evaluationPassRate: "99.8%",
                  models: [
                    {
                      level: 5,
                      type: "Model",
                      id: "MOD-02",
                      name: "DeepSeek-Coder-V2 236B (Turin Air-Gap)",
                      latency: "185ms",
                      costPerRun: "$0.0048",
                      execution: {
                        level: 6,
                        type: "Execution Trace",
                        runId: "RUN-20260913-ASIL-D-0914",
                        timestamp: "2026-09-13T17:42:10Z",
                        duration: "4.12s",
                        status: "PASSED_ASIL_D_GATE",
                        auditHash: "SHA-256: 4f8b91c78e3290da238bfa791e8470a82c610931",
                        tokensConsumed: 3840,
                        complianceProof: "ISO-26262 Part 6 Clause 8 Verified // 14/14 Safety Invariants Maintained",
                        logSnippet: "17:42:06.120 [INIT] Ingesting HAL Vision v3.0 diff\n17:42:07.450 [STATIC] MISRA-C++:2023 rule check: 0 violations\n17:42:08.980 [HIL] Running 500ms watchdog timing simulation\n17:42:10.110 [SIGN] Generated ECDSA Safety Clearance Token"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          level: 2,
          type: "Project",
          id: "PRJ-VISION-HAL",
          name: "Vision Sensor HAL v3.0 Homologation",
          stage: "Validation Phase",
          lead: "M. Rossi",
          milestone: "88% On-Track",
          workflows: [
            {
              level: 3,
              type: "Workflow",
              id: "WF-VISION-BENCH",
              name: "Synthetic Rain & Fog Camera Simulation",
              trigger: "GitLab Merge Request",
              frequency: "Continuous",
              agents: [
                {
                  level: 4,
                  type: "Agent",
                  id: "AGT-04",
                  name: "HIL Test Suite Autonomous Healer",
                  autonomy: "L3 Semi-Autonomous",
                  evaluationPassRate: "96.2%",
                  models: [
                    {
                      level: 5,
                      type: "Model",
                      id: "MOD-04",
                      name: "OpenAI GPT-4o Dedicated Azure Tenant",
                      latency: "520ms",
                      costPerRun: "$0.0055",
                      execution: {
                        level: 6,
                        type: "Execution Trace",
                        runId: "RUN-20260913-VISION-4481",
                        timestamp: "2026-09-13T16:15:22Z",
                        duration: "3.48s",
                        status: "AUTO_HEALED_TIMING_JITTER",
                        auditHash: "SHA-256: a1b2c3d4e5f67890123456789abcdef012345678",
                        tokensConsumed: 4120,
                        complianceProof: "dSPACE HIL Assertions Re-synchronized to 100Hz Frame Clock",
                        logSnippet: "16:15:19.010 [WARN] Camera frame timeout at t=42.1s (+8ms jitter)\n16:15:20.440 [AI_HEAL] Adjusted dSPACE capture threshold to 58ms\n16:15:22.480 [SUCCESS] Test batch verified with 0 dropped frames"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      level: 1,
      type: "Portfolio",
      id: "PORT-COCKPIT",
      name: "Infotainment & Digital Cockpit",
      head: "J. Moreau",
      status: "Attention",
      healthScore: "88%",
      budgetBurn: "82.1%",
      projects: [
        {
          level: 2,
          type: "Project",
          id: "PRJ-SMARTCOCKPIT-G3",
          name: "STLA SmartCockpit Gen3 Android Automotive",
          stage: "Sprint 42 (Pre-homologation)",
          lead: "C. Dupont",
          milestone: "84% In-Progress",
          workflows: [
            {
              level: 3,
              type: "Workflow",
              id: "WF-AUDIO-HAL",
              name: "Audio Server JNI Memory Profiling Workflow",
              trigger: "Crash Anomaly Escalation",
              frequency: "Ad-hoc / Continuous",
              agents: [
                {
                  level: 4,
                  type: "Agent",
                  id: "AGT-01",
                  name: "STLA-EARB Architecture Blueprint Synthesizer",
                  autonomy: "L3 Semi-Autonomous",
                  evaluationPassRate: "99.1%",
                  models: [
                    {
                      level: 5,
                      type: "Model",
                      id: "MOD-01",
                      name: "Claude 3.5 Sonnet (AWS Bedrock Turin)",
                      latency: "380ms",
                      costPerRun: "$0.0032",
                      execution: {
                        level: 6,
                        type: "Execution Trace",
                        runId: "RUN-20260913-AUDIO-MEM-9921",
                        timestamp: "2026-09-13T15:20:04Z",
                        duration: "2.10s",
                        status: "ROOT_CAUSE_ISOLATED",
                        auditHash: "SHA-256: 778899aabbccddeeff00112233445566778899aa",
                        tokensConsumed: 2950,
                        complianceProof: "Audio HAL v2.8 Fallback Plan Synthesized with 0 Audio Glitch",
                        logSnippet: "15:20:02.100 [SCAN] Analyzing native C++ heap dump (45MB/h leak)\n15:20:03.250 [ISOLATE] Circular reference identified in AudioPolicyService callback\n15:20:04.200 [ADVICE] Dispatched 2 SWAT engineers (J. Laurent & P. Schmidt)"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      level: 1,
      type: "Portfolio",
      id: "PORT-PROPULSION",
      name: "Software-Defined Propulsion & Battery",
      head: "A. Moretti",
      status: "Optimal",
      healthScore: "92%",
      budgetBurn: "68.5%",
      projects: [
        {
          level: 2,
          type: "Project",
          id: "PRJ-BMS-GEN4",
          name: "Battery Management System Gen4 Air-Gap Pilot",
          stage: "Test Track Validation",
          lead: "A. Moretti",
          milestone: "95% On-Track",
          workflows: [
            {
              level: 3,
              type: "Workflow",
              id: "WF-CAN-LOG-AI",
              name: "Turin Air-Gapped CAN Frame Ingestion",
              trigger: "NeMo Sovereign Gate",
              frequency: "Hourly Batch",
              agents: [
                {
                  level: 4,
                  type: "Agent",
                  id: "AGT-03",
                  name: "AUTOSAR Adaptive C++ Code Generator",
                  autonomy: "L2 Copilot",
                  evaluationPassRate: "94.6%",
                  models: [
                    {
                      level: 5,
                      type: "Model",
                      id: "MOD-02",
                      name: "DeepSeek-Coder-V2 236B",
                      latency: "185ms",
                      costPerRun: "$0.0011",
                      execution: {
                        level: 6,
                        type: "Execution Trace",
                        runId: "RUN-20260913-BMS-CAN-1002",
                        timestamp: "2026-09-13T14:02:18Z",
                        duration: "1.22s",
                        status: "AIR_GAP_VERIFIED",
                        auditHash: "SHA-256: 3344556677889900aabbccddeeff112233445566",
                        tokensConsumed: 1850,
                        complianceProof: "Zero Public Egress // Pinned to Turin Node 04",
                        logSnippet: "14:02:17.000 [GUARD] Checking outbound network routing\n14:02:17.400 [AIRGAP] Confirmed packet strictly routed to 10.240.12.4 (Turin Node)\n14:02:18.220 [EXEC] Decoded 4,800 cell thermal telemetry frames without error"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      level: 1,
      type: "Portfolio",
      id: "PORT-CLOUD",
      name: "Connected Vehicle & Cloud Platform",
      head: "S. Weber",
      status: "Optimal",
      healthScore: "96%",
      budgetBurn: "71.0%",
      projects: [
        {
          level: 2,
          type: "Project",
          id: "PRJ-CLOUD-FLEET",
          name: "STLA Global Telematics Cloud Platform",
          stage: "Production Active",
          lead: "M. Leroux",
          milestone: "98% On-Track",
          workflows: [
            {
              level: 3,
              type: "Workflow",
              id: "WF-FLEET-CANARY",
              name: "Global Fleet OTA Canary Deployment",
              trigger: "Continuous Delivery Gate",
              frequency: "Bi-weekly",
              agents: [
                {
                  level: 4,
                  type: "Agent",
                  id: "AGT-05",
                  name: "OTA Canary Blast Radius Analyzer",
                  autonomy: "L4 Autonomous",
                  evaluationPassRate: "91.5%",
                  models: [
                    {
                      level: 5,
                      type: "Model",
                      id: "MOD-05",
                      name: "Mistral Large 2 (EU Sovereign Cloud)",
                      latency: "310ms",
                      costPerRun: "$0.0082",
                      execution: {
                        level: 6,
                        type: "Execution Trace",
                        runId: "RUN-20260913-FLEET-CANARY-882",
                        timestamp: "2026-09-13T13:45:00Z",
                        duration: "5.10s",
                        status: "CANARY_HEALTH_CONFIRMED",
                        auditHash: "SHA-256: 99887766554433221100ffeeddccbbaa99887766",
                        tokensConsumed: 5200,
                        complianceProof: "500 Test Vehicles Ingested with Zero ASIL Fault Codes",
                        logSnippet: "13:44:55.100 [CANARY] Ingested 150,000 DTC error buffers\n13:44:58.200 [ANALYZE] 0 critical safety regressions across 500 test fleet units\n13:45:00.100 [CLEAR] Clearance granted for Stage 2 Canary Expansion (+2,500 units)"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

/**
 * PRD §5.1 — Persona Dashboard Context Data
 * Persona: Alex — Chief AI Officer & Head of Software Engineering
 */
export const engineeringPersonaContextData = {
  userRole: {
    title: "Chief AI Officer & Head of Software Engineering",
    rbacTier: "RBAC Tier 1 (Enterprise Executive Authority • €1.5M CapEx Ceiling)",
    badgeLabel: "Role: Chief AI Officer",
    isReadOnly: true
  },
  businessUnits: [
    { id: "sdv-eng", label: "SDV & Enterprise Engineering" },
    { id: "ai-for-ad", label: "AI for AD" },
    { id: "ai-for-ams", label: "AI for AMS" }
  ],
  portfolios: [
    { id: "adas", label: "Autonomous Driving & ADAS" },
    { id: "connected-cloud", label: "Connected Vehicle & Cloud Platform" },
    { id: "cockpit", label: "Infotainment & Digital Cockpit" },
    { id: "propulsion", label: "Software-Defined Propulsion & Battery" }
  ],
  projectAssignments: [
    { id: "stla-large", label: "STLA Large SDV Platform Phase 2" },
    { id: "maserati-adas", label: "Maserati GranTurismo Folgore ADAS v3.4" },
    { id: "ram-towing", label: "Ram 1500 REV Autonomous Towing" },
    { id: "jeep-recon", label: "Jeep Recon Trail-Rated Offroad Autonomy" }
  ],
  projectConfigurations: {
    "stla-large": {
      subscriptions: {
        modelsCount: 8,
        agentsCount: 8,
        toolsCount: 10,
        models: ["Claude 3.5 Sonnet", "DeepSeek-Coder-V2", "Llama 3.3 70B"],
        agents: ["AUTOSAR C++ Agent", "Canary Blast Radius Agent"],
        tools: ["GitHub Enterprise", "Tekton CI", "SonarQube", "Snyk DeepCode"]
      },
      authority: {
        safetyTier: "Enterprise Tier 1 Gated",
        monetaryCeiling: "€1,500,000",
        carveOutNotice: "Dual-Key sign-off required with VP of Vehicle Safety for ASIL-D production deployment.",
        delegatedLead: "Dr. H. Becker (Lead Functional Safety Architect)"
      },
      activeTasks: {
        totalOpen: 8,
        criticalCount: 3,
        standardCount: 5,
        criticalTasks: [
          {
            id: "task-1",
            title: "AUTOSAR C++ Adaptive memory safety exception · Due in 2h",
            deadline: "Due in 2h",
            tier: "Critical Safety Gate",
            originator: "Static Verification Engine"
          },
          {
            id: "task-2",
            title: "OTA Canary Blast Radius safety gate review · Due in 6h",
            deadline: "Due in 6h",
            tier: "Production OTA Gate",
            originator: "Tekton Canary Orchestrator"
          },
          {
            id: "task-3",
            title: "Orin NPU TensorRT int8 quantization drift alert",
            deadline: "Due in 18h",
            tier: "Model Watchdog Alert",
            originator: "Nvidia Triton Watchdog"
          }
        ]
      },
      governance: [
        {
          id: "gov-1",
          title: "ISO 26262 Part 6 Safety Gate",
          countdownText: "4 days left",
          urgency: "amber",
          standard: "ISO 26262 Part 6 Software Safety",
          verified: false
        },
        {
          id: "gov-2",
          title: "EU AI Act High-Risk Tier Sign-off",
          countdownText: "9 days left",
          urgency: "emerald",
          standard: "EU AI Act Annex III Safety Systems",
          verified: false
        },
        {
          id: "gov-3",
          title: "ASPICE Level 3 Process Audit",
          countdownText: "14 days left",
          urgency: "emerald",
          standard: "ASPICE SWE.1-SWE.6",
          verified: true
        }
      ]
    },
    "maserati-adas": {
      subscriptions: {
        modelsCount: 6,
        agentsCount: 6,
        toolsCount: 8,
        models: ["Claude 3.5 Sonnet", "Mistral Large 2"],
        agents: ["Sensor Fusion Validation Agent"],
        tools: ["dSPACE TargetLink", "Vector CANoe", "Snyk"]
      },
      authority: {
        safetyTier: "Premium Luxury ASIL-D",
        monetaryCeiling: "€2,000,000",
        carveOutNotice: "Autonomous track test sign-off required by Head of Vehicle Dynamics.",
        delegatedLead: "G. Rossi (Lead Vehicle Dynamics Lead)"
      },
      activeTasks: {
        totalOpen: 5,
        criticalCount: 2,
        standardCount: 3,
        criticalTasks: [
          {
            id: "task-mas1",
            title: "LiDAR Driver latency variance on track bench",
            deadline: "Due Today",
            tier: "Hardware Sensor Gate",
            originator: "Track Telemetry Logger"
          }
        ]
      },
      governance: [
        {
          id: "gov-mas1",
          title: "UNECE R157 Automated Lane Keeping",
          countdownText: "6 days left",
          urgency: "amber",
          standard: "UNECE R157 ALKS Sign-off",
          verified: false
        }
      ]
    },
    "ram-towing": {
      subscriptions: {
        modelsCount: 5,
        agentsCount: 5,
        toolsCount: 7,
        models: ["Llama 3.3 70B", "GPT-4o Enterprise"],
        agents: ["Autonomous Towing Trajectory Agent"],
        tools: ["MathWorks Simulink", "GitLab CI"]
      },
      authority: {
        safetyTier: "Commercial Vehicle Tier 1",
        monetaryCeiling: "€1,200,000",
        carveOutNotice: "Heavy trailer dynamic stability gate co-sign required.",
        delegatedLead: "T. Johnson (Towing Dynamics Chief)"
      },
      activeTasks: {
        totalOpen: 4,
        criticalCount: 1,
        standardCount: 3,
        criticalTasks: [
          {
            id: "task-ram1",
            title: "Hitch angle sensor noise filtering threshold check",
            deadline: "Due in 1d",
            tier: "Sensor Calibration Gate",
            originator: "BMS Telemetry Ingest"
          }
        ]
      },
      governance: [
        {
          id: "gov-ram1",
          title: "FMVSS 126 Electronic Stability Control",
          countdownText: "11 days left",
          urgency: "emerald",
          standard: "NHTSA FMVSS 126",
          verified: true
        }
      ]
    },
    "jeep-recon": {
      subscriptions: {
        modelsCount: 7,
        agentsCount: 6,
        toolsCount: 9,
        models: ["Claude 3.5 Sonnet", "DeepSeek-Coder-V2", "StarCoder2"],
        agents: ["Offroad Terrain Classification Agent"],
        tools: ["Nvidia Omniverse", "AirSim Automotive", "Docker"]
      },
      authority: {
        safetyTier: "Offroad Autonomy Tier 1",
        monetaryCeiling: "€1,000,000",
        carveOutNotice: "Terrain traversal safety envelope validation required.",
        delegatedLead: "M. O'Connor (Trail-Rated Systems Lead)"
      },
      activeTasks: {
        totalOpen: 6,
        criticalCount: 2,
        standardCount: 4,
        criticalTasks: [
          {
            id: "task-jeep1",
            title: "Water fording depth sonar camera sync calibration",
            deadline: "Due in 8h",
            tier: "Perception Sensor Gate",
            originator: "HIL Bench 4"
          }
        ]
      },
      governance: [
        {
          id: "gov-jeep1",
          title: "Trail-Rated Autonomy Level 2 Sign-off",
          countdownText: "8 days left",
          urgency: "amber",
          standard: "Stellantis Trail Safety Standard 4.2",
          verified: false
        }
      ]
    }
  }
};

/**
 * PRD §5.1 — 6-Level Operational Depth & Lineage Navigator Data
 */
export const engineeringDrillDownLevelsData = {
  level1: {
    level: 1,
    id: "portfolio",
    layerTag: "PORTFOLIO",
    shortTitle: "Enterprise Portfolios",
    shortIndicator: "94.2% Governance Health",
    indicatorType: "success",
    title: "Enterprise Software & Platform Portfolios (4 Active)",
    subtitle: "Global Multi-Portfolio Engineering Overview • Stellantis Platform Hub",
    statusBadge: "Tier 1 Enterprise Gate",
    metrics: [
      { label: "Governance Compliance", value: "94.2%", change: "▲ +2.4pts vs Q2", type: "success" },
      { label: "Active Squads", value: "48 Squads", subtext: "640 engineers globally", type: "neutral" },
      { label: "Compute Infrastructure", value: "64x H100 Nodes", subtext: "88% GPU utilization (Turin)", type: "neutral" },
      { label: "Annual AI CapEx", value: "€4.2M", subtext: "62% consumed (€2.60M spend)", type: "warning" }
    ],
    portfolioProjects: [
      { name: "Autonomous Driving & ADAS (Lead: Dr. H. Becker)", health: "94%", gate: "RC2 Freeze", compliance: "96%", budget: "68%", isPrimary: true },
      { name: "Connected Vehicle & Cloud Platform (Lead: M. Rossi)", health: "92%", gate: "Stable Wave 3", compliance: "94%", budget: "71%" },
      { name: "Infotainment & Digital Cockpit (Lead: C. Dupont)", health: "89%", gate: "Sprint 24 Integration", compliance: "91%", budget: "78%" },
      { name: "Software-Defined Propulsion & Battery (Lead: A. Moretti)", health: "95%", gate: "Validation Gate 4", compliance: "97%", budget: "58%" }
    ]
  },
  level2: {
    level: 2,
    id: "project",
    layerTag: "PROJECT",
    shortTitle: "STLA Large Phase 2",
    shortIndicator: "Gate RC-1 · 4 Workflows",
    indicatorType: "neutral",
    title: "STLA Large SDV Platform Phase 2 Program",
    subtitle: "Core Microkernel & Autonomous Architecture Gate • Sprints 24–26",
    statusBadge: "Gate: RC-1 Freeze",
    metrics: [
      { label: "Program Milestone", value: "On Track (94%)", subtext: "Target freeze date Oct 14, 2026", type: "success" },
      { label: "Safety Integrity", value: "ASIL-D Cleared", subtext: "Zero unresolved Sev-1 safety bugs", type: "success" },
      { label: "Active Workflows", value: "4 Workflows", subtext: "Canary, Traceability, HIL, Build", type: "neutral" },
      { label: "Top Program Risk", value: "Audio HAL Leak", subtext: "Mitigated by SWAT patch candidate", type: "warning" }
    ],
    workflowsList: [
      { id: "WF-CANARY-OTA", name: "Canary Deployment & Fleet OTA Validation", status: "Active", isPrimary: true, passRate: "98.2%", sla: "99.9%" },
      { id: "WF-AUTOSAR-TRACE", name: "AUTOSAR Adaptive & MISRA C++ Compliance", status: "Active", passRate: "99.4%", sla: "99.8%" },
      { id: "WF-HIL-SIM-FUSION", name: "Sensor Fusion Hardware-In-The-Loop Bench", status: "Active", passRate: "96.5%", sla: "98.5%" },
      { id: "WF-AUDIO-HAL-SWAT", name: "Audio HAL Memory Jitter SWAT Verification", status: "In Review", passRate: "91.0%", sla: "95.0%" }
    ]
  },
  level3: {
    level: 3,
    id: "workflow",
    layerTag: "WORKFLOW",
    shortTitle: "Canary OTA Pipeline",
    shortIndicator: "50 Hz Loop · 4 Stages",
    indicatorType: "success",
    title: "Canary Deployment & Fleet OTA Safety Pipeline (WF-CANARY-OTA)",
    subtitle: "Real-Time Continuous Verification Loop • Automated Rollback Engine",
    statusBadge: "P95 SLA: 420ms",
    metrics: [
      { label: "Pipeline Cadence", value: "Bi-Weekly / On-Demand", subtext: "Continuous automated triggers", type: "neutral" },
      { label: "Test Target Count", value: "500 Test Vehicles", subtext: "Expanded to 2,500 after gate", type: "neutral" },
      { label: "Pass Rate SLA", value: "98.2%", subtext: "Threshold >= 96.0%", type: "success" },
      { label: "Avg Stage Latency", value: "310ms", subtext: "Target <= 500ms", type: "success" }
    ],
    streamArchitecture: [
      { name: "DTC Telemetry Ingestion", detail: "Ingest 150k DTC error frames via MQTT/Kafka", latency: "42ms" },
      { name: "Canary Blast Radius Analysis", detail: "Agent evaluates ECU memory stability and bus jitter", latency: "120ms" },
      { name: "ISO 26262 Gate Verification", detail: "Check ASIL safety invariants against safety case", latency: "65ms" },
      { name: "OTA Stage 2 Sign-off", detail: "Authorize staged over-the-air rollout to fleet", latency: "83ms" }
    ]
  },
  level4: {
    level: 4,
    id: "agent",
    layerTag: "AGENT",
    shortTitle: "OTA Canary Agent",
    shortIndicator: "L4 Autonomy · 91.5% Conf",
    indicatorType: "success",
    title: "OTA Canary Blast Radius Analyzer (AGT-05)",
    subtitle: "Autonomous Safety Evaluation Agent • Automotive High-Assurance Runtime",
    statusBadge: "Autonomy: L4",
    metrics: [
      { label: "Autonomy Level", value: "L4 Autonomous", subtext: "Supervised human veto capability", type: "neutral" },
      { label: "Decision Accuracy", value: "96.2%", subtext: "Audited across 120 canary runs", type: "success" },
      { label: "Human Escalation Rate", value: "4.8%", subtext: "Target <= 8.0%", type: "success" },
      { label: "P95 Inference Time", value: "310ms", subtext: "Hosted on EU Sovereign Mistral", type: "neutral" }
    ],
    agentTasks: [
      "Automated ingestion and verification of 150,000 DTC fault buffers per cycle",
      "Continuous monitoring of CAN/Ethernet bus message timing variance against ASIL-D threshold",
      "Cross-correlation of vehicle crash recorder buffer with active firmware flash hash",
      "Automatic trigger of rollback orchestration script upon any Sev-1 ECU exception"
    ]
  },
  level5: {
    level: 5,
    id: "model",
    layerTag: "MODEL",
    shortTitle: "Mistral Large 2",
    shortIndicator: "EU Sovereign · 128k ctx",
    indicatorType: "neutral",
    title: "Mistral Large 2 Automotive (MOD-05)",
    subtitle: "Enterprise Foundation Model • EU Sovereign Cloud Deployment (Paris / Turin VPC)",
    statusBadge: "Clearance: ASIL-D Qualified",
    metrics: [
      { label: "Model Modality", value: "Text & Structured Code", subtext: "Fine-tuned for AUTOSAR Adaptive", type: "neutral" },
      { label: "Context Window", value: "128k tokens", subtext: "Full ECU telemetry stack capture", type: "neutral" },
      { label: "Token Cost", value: "$2.00 in / $6.00 out", subtext: "Enterprise dedicated discount", type: "neutral" },
      { label: "Safety Benchmark", value: "94.8% Pass", subtext: "MISRA C++ and ISO 26262 compliance", type: "success" }
    ],
    modelSpecs: {
      architecture: "Dense Decoder-only Transformer (123B Parameters)",
      quantization: "FP8 Native Inference / TensorRT-LLM Engine",
      contextWindow: "128,000 Tokens (Bidirectional Attention)",
      safetyClearance: "ISO 26262 Part 6 Tool Qualification Tool-Conf-3 Certified"
    }
  },
  level6: {
    level: 6,
    id: "execution",
    layerTag: "EXECUTION",
    shortTitle: "Trace RUN-882",
    shortIndicator: "Canary Health Confirmed",
    indicatorType: "success",
    title: "Live Execution Trace: RUN-20260913-FLEET-CANARY-882",
    subtitle: "Atomic Verification Trace & Cryptographic Audit Proof • Stellantis Sovereign VPC",
    statusBadge: "Status: VERIFIED",
    metrics: [
      { label: "Run Execution Time", value: "5.10s", subtext: "4 stages executed sequentially", type: "success" },
      { label: "Tokens Consumed", value: "5,200 tokens", subtext: "$0.0082 execution cost", type: "neutral" },
      { label: "Safety Verdict", value: "CANARY_HEALTH_CONFIRMED", subtext: "0 ASIL fault codes detected", type: "success" },
      { label: "Audit Signature", value: "SHA-256 Validated", subtext: "Pinned to immutable audit ledger", type: "neutral" }
    ],
    telemetryReadout: {
      batchId: "BATCH-STLA-OTA-4491",
      timestamp: "2026-09-13 13:45:00 CET",
      fleetUnitsTested: "500 Test Vehicles (Active)",
      dtcBufferCount: "150,000 Messages Parsed",
      criticalRegressions: "0 Regressions (Passed)",
      clearanceProof: "Stage 2 Canary Expansion (+2,500 units) Authorized",
      logSnippet: "13:44:55.100 [CANARY] Ingested 150,000 DTC error buffers\n13:44:58.200 [ANALYZE] 0 critical safety regressions across 500 test fleet units\n13:45:00.100 [CLEAR] Clearance granted for Stage 2 Canary Expansion (+2,500 units)"
    }
  }
};

/**
 * PRD §5.2 — Workflow Inbox Decision Items (Dedicated to Experience Zone)
 * Tailored for Alex (Chief AI Officer / Head of Software Engineering)
 * Across 9 PRD §5.2 categories
 */
export const engineering52InboxItems = [
  {
    id: "inbox-52-1",
    category: "Approvals",
    categoryLabel: "Approvals",
    title: "ISO 26262 ASIL-D Co-Signature Approval: STLA Large Microkernel",
    urgencyLane: "critical",
    priority: "Critical",
    riskLevel: "ASIL-D",
    requestor: "Dr. H. Becker (Lead Safety Architect)",
    originatingSystem: "Enterprise Architecture Board",
    project: "STLA Large SDV Platform Phase 2",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Dual-key executive authorization required to freeze AUTOSAR Adaptive OS microkernel before Stage 2 OTA fleet release.",
    dueDate: "Due Today · 17:00 CET",
    supportingEvidence: {
      summary: "MISRA C++ 2023 compliance report achieved 99.4% pass. 12 formal verification proofs completed with zero unbounded loops.",
      metricHighlight: "99.4% MISRA Compliance",
      codeSnippet: "autosar::adaptive::os::FreezeKernelState(STLA_KERNEL_V4_2, CRYPTO_SIGN_KEY);",
      auditHash: "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    actions: [
      { id: "approve_gated", label: "Co-Sign & Authorize (Dual-Key)", type: "primary" },
      { id: "request_evidence", label: "Request Safety Evidence", type: "secondary" },
      { id: "delegate", label: "Delegate to Safety Lead", type: "secondary" },
      { id: "view_audit", label: "View Audit Trail", type: "tertiary" }
    ]
  },
  {
    id: "inbox-52-2",
    category: "Reviews",
    categoryLabel: "Reviews",
    title: "Architecture RFC Review: POSIX Microkernel Transition Blueprint",
    urgencyLane: "standard",
    priority: "High",
    riskLevel: "Medium",
    requestor: "Software Architecture Working Group",
    originatingSystem: "Jira / Confluence Bridge",
    project: "STLA Large SDV Platform Phase 2",
    portfolio: "Software-Defined Vehicle (SDV)",
    requiredDecision: "Review and approve architectural migration from monolithic Linux kernel to isolated QNX/POSIX microkernel partitions.",
    dueDate: "Due in 2 days",
    supportingEvidence: {
      summary: "Eliminates cross-process memory corruption risk in ADAS camera pipeline. Inter-process communication latency bench verified at 12us.",
      metricHighlight: "IPC Latency: 12 microseconds",
      codeSnippet: "qnx_channel_create(IPC_CHANNEL_ADAS_VISION, RESTRICTED_SANDBOX);",
      auditHash: "SHA256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
    },
    actions: [
      { id: "confirm_rfc", label: "Approve RFC Architecture", type: "primary" },
      { id: "send_back", label: "Send Back with Revision Notes", type: "secondary" },
      { id: "request_evidence", label: "Request Benchmark Data", type: "secondary" },
      { id: "view_audit", label: "View RFC History", type: "tertiary" }
    ]
  },
  {
    id: "inbox-52-3",
    category: "Exceptions",
    categoryLabel: "Exceptions",
    title: "Audio HAL C++ Heap Memory Leak Exception Gate",
    urgencyLane: "critical",
    priority: "Critical",
    riskLevel: "High",
    requestor: "SWAT Memory Analysis Squad",
    originatingSystem: "Tekton Nightly Valgrind Pipeline",
    project: "Maserati GranTurismo Folgore Cockpit",
    portfolio: "Infotainment & Digital Cockpit",
    requiredDecision: "Authorize a 48-hour exception waiver for 45MB/h heap leak in AudioPolicyService to avoid blocking vehicle assembly test track.",
    dueDate: "Due in 2 hours",
    supportingEvidence: {
      summary: "Root cause isolated to circular reference in AudioPolicyService callback. SWAT engineer J. Laurent has patch ready for next nightly build.",
      metricHighlight: "Leak Rate: 45MB/h (Swat Patch Ready)",
      codeSnippet: "valgrind --tool=memcheck --leak-check=full /usr/bin/audiopolicyservice",
      auditHash: "SHA256: 778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566"
    },
    actions: [
      { id: "accept_exception", label: "Grant 48h Exception Waiver", type: "primary" },
      { id: "block_release", label: "Block Assembly Gate", type: "danger" },
      { id: "delegate", label: "Delegate to SWAT Lead", type: "secondary" },
      { id: "view_audit", label: "Inspect Valgrind Trace", type: "tertiary" }
    ]
  },
  {
    id: "inbox-52-4",
    category: "Recommendations",
    categoryLabel: "Recommendations",
    title: "GPU Cluster Partitioning: Turin H100 Node Reallocation",
    urgencyLane: "standard",
    priority: "Medium",
    riskLevel: "Low",
    requestor: "AI Infrastructure Operations",
    originatingSystem: "Kubernetes Slurm Cluster Monitor",
    project: "Platform Core Compute Infrastructure",
    portfolio: "Connected Vehicle & Cloud Platform",
    requiredDecision: "Approve dynamic reallocation of 16x H100 nodes from batch training to real-time ADAS simulation to alleviate queue bottleneck.",
    dueDate: "Due in 3 days",
    supportingEvidence: {
      summary: "Sim-to-real job wait time increased from 15m to 4.2 hours. Reallocating partition reduces queue latency by 72% with zero cost impact.",
      metricHighlight: "-72% Simulation Wait Time",
      codeSnippet: "scontrol update partition=adas_sim nodes=turin-h100-[01-16] state=RESUME",
      auditHash: "SHA256: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    actions: [
      { id: "approve_compute", label: "Approve H100 Reallocation", type: "primary" },
      { id: "keep_quota", label: "Maintain Current Quota", type: "secondary" },
      { id: "request_evidence", label: "Request Slurm Telemetry", type: "secondary" }
    ]
  },
  {
    id: "inbox-52-5",
    category: "Assigned actions",
    categoryLabel: "Assigned actions",
    title: "Quarterly ASPICE SWE.1–SWE.6 Process Compliance Audit Sign-off",
    urgencyLane: "standard",
    priority: "High",
    riskLevel: "Medium",
    requestor: "Global Quality & Process Directorate",
    originatingSystem: "Enterprise Process Governance",
    project: "Global Software Operating Model",
    portfolio: "Engineering Governance",
    requiredDecision: "Executive CAIO validation and sign-off of 48 squads' bidirectional traceability matrices between requirements and test results.",
    dueDate: "Due in 5 days",
    supportingEvidence: {
      summary: "ASPICE Level 3 audit verified by TÜV Nord. 98.4% bidirectional link integrity across Jira and Jama requirements systems.",
      metricHighlight: "98.4% Traceability Score (ASPICE Level 3)",
      codeSnippet: "aspice_audit --project=ALL_SDV --scope=SWE1_SWE6 --generate-certificate",
      auditHash: "SHA256: fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321"
    },
    actions: [
      { id: "complete_audit", label: "Sign-off ASPICE Certification", type: "primary" },
      { id: "delegate", label: "Assign to QA Lead", type: "secondary" },
      { id: "request_evidence", label: "Inspect TÜV Findings", type: "secondary" }
    ]
  },
  {
    id: "inbox-52-6",
    category: "Escalations",
    categoryLabel: "Escalations",
    title: "Tier-1 LiDAR Driver Latency Drift Escalation",
    urgencyLane: "critical",
    priority: "Critical",
    riskLevel: "High",
    requestor: "Sensor Perception Squad",
    originatingSystem: "Vehicle Test Track Telemetry",
    project: "Maserati GranTurismo Folgore ADAS v3.4",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Approve temporary fallback to synthetic emulator while supplier delivers ISO 26262 qualified firmware revision.",
    dueDate: "Due Today · 18:30 CET",
    supportingEvidence: {
      summary: "Hardware bench shows 68ms jitter under high-density ambient reflection. Synthetic emulator provides zero-delay mock feed for track tests.",
      metricHighlight: "Jitter: 68ms (Threshold <= 25ms)",
      codeSnippet: "set_sensor_source(LIDAR_FRONT, SOURCE_SYNTHETIC_HIL_EMULATOR);",
      auditHash: "SHA256: 4455667788990011223344556677889900112233445566778899001122334455"
    },
    actions: [
      { id: "accept_mitigation", label: "Activate Synthetic Emulator", type: "primary" },
      { id: "schedule_review", label: "Schedule Supplier Executive Call", type: "secondary" },
      { id: "delegate", label: "Delegate to Sensor Lead", type: "secondary" }
    ]
  },
  {
    id: "inbox-52-7",
    category: "Governance decisions",
    categoryLabel: "Governance decisions",
    title: "EU AI Act High-Risk Pre-Assessment Sign-off: Automated Valet Parking",
    urgencyLane: "standard",
    priority: "High",
    riskLevel: "Medium",
    requestor: "Legal & AI Regulatory Affairs Board",
    originatingSystem: "Enterprise Compliance Ledger",
    project: "Autonomous Parking Pilot (Jeep Recon)",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Approve and seal the Technical Documentation File conforming to EU AI Act Annex III for safety-critical automated parking.",
    dueDate: "Due in 4 days",
    supportingEvidence: {
      summary: "Human-in-the-loop oversight mechanisms, model logging protocols, and data bias mitigation audits satisfy all CE marking pre-requisites.",
      metricHighlight: "Annex III Conformity: 100% Complete",
      codeSnippet: "eu_ai_act_compliance_sign(DOSSIER_AVP_2026, SIGNER_ALEX_CAIO);",
      auditHash: "SHA256: 9900112233445566778899001122334455667788990011223344556677889900"
    },
    actions: [
      { id: "sign_off", label: "Seal Conformity Dossier", type: "primary" },
      { id: "request_evidence", label: "Request Full Dossier PDF", type: "secondary" },
      { id: "delegate", label: "Delegate to Legal Counsel", type: "secondary" }
    ]
  },
  {
    id: "inbox-52-8",
    category: "System-generated alerts",
    categoryLabel: "System-generated alerts",
    title: "Orin NPU TensorRT Int8 Quantization Drift Alert",
    urgencyLane: "standard",
    priority: "Medium",
    riskLevel: "Medium",
    requestor: "Nvidia Triton Watchdog Engine",
    originatingSystem: "Model Inference Telemetry",
    project: "STLA Large SDV Platform Phase 2",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: "Acknowledge 2.8% bounding box regression on nighttime pedestrian detection or trigger automated calibration pipeline.",
    dueDate: "Due in 18 hours",
    supportingEvidence: {
      summary: "Quantization noise in TensorRT Int8 kernel caused minor drift on extreme low-light test set. Recalibration pipeline ready on Node 08.",
      metricHighlight: "Drift: -2.8% Precision (Low-Light)",
      codeSnippet: "triton_watchdog --model=adas_pedestrian_int8 --check-drift --tolerance=2.0",
      auditHash: "SHA256: aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
    },
    actions: [
      { id: "retrain", label: "Trigger Recalibration Pipeline", type: "primary" },
      { id: "ack_mute", label: "Acknowledge & Mute 24h", type: "secondary" },
      { id: "view_audit", label: "Inspect Quantization Matrix", type: "tertiary" }
    ]
  },
  {
    id: "inbox-52-9",
    category: "Agent-generated outputs requiring validation",
    categoryLabel: "Agent outputs validation",
    title: "Synthetic CAN Bus Stress Test Scenarios Validation",
    urgencyLane: "fyi",
    priority: "Low",
    riskLevel: "Low",
    requestor: "Synthetic Test Scenario Agent (AGT-08)",
    originatingSystem: "Agent Mesh Runtime",
    project: "Battery Management System Gen4 Air-Gap Pilot",
    portfolio: "Software-Defined Propulsion & Battery",
    requiredDecision: "Validate 12 synthetic corner-case edge scenarios (cell thermal runaway under 120kW fast-charge) before flashing HIL test bench.",
    dueDate: "Due in 2 days",
    supportingEvidence: {
      summary: "Agent synthesized 12 extreme thermal gradient profiles derived from 1.2M fleet miles. Validated against physical cell physics model.",
      metricHighlight: "12 Edge Cases Synthesized (Physics-Verified)",
      codeSnippet: "agent_mesh_validate(AGT_08, CAN_SCENARIO_SET_419, TARGET_HIL_BENCH);",
      auditHash: "SHA256: 11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff"
    },
    actions: [
      { id: "approve_scenarios", label: "Approve & Flash HIL Bench", type: "primary" },
      { id: "request_evidence", label: "View Generated Curves", type: "secondary" },
      { id: "delegate", label: "Assign to Battery Squad", type: "secondary" }
    ]
  }
];

/**
 * Governance Audit Matrix Data for Modal
 */
export const engineeringGovernanceMatrixData = {
  title: "Stellantis Enterprise AI Governance & Engineering Matrix",
  version: "v4.2-CAIO-SDV • Active Enterprise Standards",
  gates: [
    {
      id: "GATE-01",
      name: "ISO 26262 Part 6: Software Safety Lifecycle",
      level: "ASIL-D Mandatory",
      owner: "Alex (CAIO) & Lead Safety Architect",
      status: "Verified Cleared",
      coverage: "100%",
      nextReview: "2026-10-14"
    },
    {
      id: "GATE-02",
      name: "EU AI Act Annex III High-Risk Pre-Assessment",
      level: "Tier-1 Regulatory",
      owner: "Legal & AI Regulatory Affairs",
      status: "Dossier in Review",
      coverage: "92%",
      nextReview: "2026-09-22"
    },
    {
      id: "GATE-03",
      name: "ASPICE Level 3 Process Capability (SWE.1-6)",
      level: "Automotive SPICE",
      owner: "Global Quality Directorate",
      status: "Certified",
      coverage: "98.4%",
      nextReview: "2026-11-30"
    },
    {
      id: "GATE-04",
      name: "ISO 21434 Vehicle Cybersecurity Engineering",
      level: "Cybersecurity Gate",
      owner: "Infra SecOps & Vehicle Cyber Lead",
      status: "TARA Assessed",
      coverage: "96%",
      nextReview: "2026-10-01"
    },
    {
      id: "GATE-05",
      name: "UNECE R157 Automated Lane Keeping / Safety Invariants",
      level: "Type Approval",
      owner: "Autonomous Driving & ADAS PMO",
      status: "Track Cleared",
      coverage: "95%",
      nextReview: "2026-10-20"
    }
  ]
};
