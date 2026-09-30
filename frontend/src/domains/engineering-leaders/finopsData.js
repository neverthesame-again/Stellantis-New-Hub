/**
 * FinOps & Cost Governance Data Model
 * Persona: Alex — Chief AI Officer / Head of Software Engineering
 * Implements FR-401, FR-402, FR-403, FR-404, FR-405
 */

export const initialFinOpsData = {
  kpis: {
    mtdSpend: "$7,650",
    monthlyBudget: "$10,000",
    budgetUtilization: "76.5%",
    projectedEndMonthSpend: "$9,100",
    tokenVolume: "95M",
    inputTokens: "60M",
    outputTokens: "35M",
    costPer1MTokens: "$7.45",
    costPer1MBaseline: "$9.80",
    costPer1MDeltaPct: "-24.0%",
    cacheSavings: "$2,180",
    cacheHitRate: "38.6%",
    aiEfficiencyIndex: 88.5,
    efficiencyGrade: "A-",
    efficiencyDelta: "+4.2 pts",
    activeAlertsCount: 4,
    pendingOptimizationsCount: 3,
  },

  programs: ["All Programs", "QE", "AD", "AMS"],

  workspaces: [
    "All Workspaces",
    "Production Core",
    "Infotainment & Cockpit",
    "Powertrain ADAS",
    "Vehicle Health & Telematics",
    "DevOps & CI/CD Pipelines"
  ],

  programBreakdown: {
    QE: {
      name: "Quality Engineering (QE)",
      spend: "$3,500",
      budget: "$4,500",
      budgetUtilization: "77.8%",
      tokens: "44M",
      sharePct: 45.7,
      efficiencyIndex: 91.2,
      cacheHitRate: "42.1%",
      costPer1M: "$7.35",
      activeAlerts: 2
    },
    AD: {
      name: "Autonomous Driving & ADAS (AD)",
      spend: "$2,650",
      budget: "$3,500",
      budgetUtilization: "75.7%",
      tokens: "32M",
      sharePct: 34.6,
      efficiencyIndex: 86.8,
      cacheHitRate: "35.4%",
      costPer1M: "$7.65",
      activeAlerts: 1
    },
    AMS: {
      name: "Application Management Services (AMS)",
      spend: "$1,500",
      budget: "$2,000",
      budgetUtilization: "75.0%",
      tokens: "19M",
      sharePct: 19.7,
      efficiencyIndex: 84.5,
      cacheHitRate: "34.0%",
      costPer1M: "$7.30",
      activeAlerts: 1
    }
  },

  modelCostMix: [
    {
      id: "MOD-CLAUDE-SONNET",
      modelName: "Claude 3.5 Sonnet Enterprise",
      provider: "Anthropic / AWS Bedrock",
      deploymentType: "Dedicated Private Gateway",
      tokenUsage: "26M",
      inputTokens: "17M",
      outputTokens: "9M",
      cost: "$3,650",
      costSharePct: 47.7,
      costPer1M: "$14.04",
      latencyP95: "280ms",
      capabilityGroup: "Complex Architecture & Multi-Agent Logic",
      primaryAgents: ["Regression Suite Generation Agent", "Jira Flaky Test Remediation Agent"],
      drilldown: [
        { agent: "Regression Suite Generation Agent", program: "QE", tokens: "15M", cost: "$2,100", sharePct: 57.5 },
        { agent: "Jira Flaky Test Remediation Agent", program: "QE", tokens: "7.5M", cost: "$1,050", sharePct: 28.8 },
        { agent: "Architecture Compliance Auditor", program: "AD", tokens: "3.5M", cost: "$500", sharePct: 13.7 }
      ]
    },
    {
      id: "MOD-GPT-4O",
      modelName: "GPT-4o Enterprise",
      provider: "Azure OpenAI Stellantis Tenant",
      deploymentType: "Dedicated Sovereign Cloud",
      tokenUsage: "20M",
      inputTokens: "13M",
      outputTokens: "7M",
      cost: "$2,450",
      costSharePct: 32.0,
      costPer1M: "$12.25",
      latencyP95: "140ms",
      capabilityGroup: "Multimodal Telemetry & Code Review",
      primaryAgents: ["Static Code Analysis Daemon", "Telemetry Diagnostic Agent"],
      drilldown: [
        { agent: "Static Code Analysis Daemon", program: "QE", tokens: "10M", cost: "$1,250", sharePct: 51.0 },
        { agent: "Telemetry Diagnostic Agent", program: "AD", tokens: "6M", cost: "$750", sharePct: 30.6 },
        { agent: "AMS Ticket Resolver Agent", program: "AMS", tokens: "4M", cost: "$450", sharePct: 18.4 }
      ]
    },
    {
      id: "MOD-MISTRAL-LARGE",
      modelName: "Mistral Large 2 (Private Cloud)",
      provider: "Private Mistral / Turin Cluster",
      deploymentType: "On-Prem Sovereign Cluster",
      tokenUsage: "16M",
      inputTokens: "10M",
      outputTokens: "6M",
      cost: "$950",
      costSharePct: 12.4,
      costPer1M: "$5.94",
      latencyP95: "95ms",
      capabilityGroup: "Deep Reasoning & CAN Bus Log Analysis",
      primaryAgents: ["CAN Bus Telemetry Parser", "Sensor Anomaly Detector"],
      drilldown: [
        { agent: "CAN Bus Telemetry Parser", program: "AD", tokens: "9.5M", cost: "$550", sharePct: 57.9 },
        { agent: "Sensor Anomaly Detector", program: "AD", tokens: "6.5M", cost: "$400", sharePct: 42.1 }
      ]
    },
    {
      id: "MOD-DEEPSEEK-CODER",
      modelName: "DeepSeek Coder V2 (Turin Local)",
      provider: "Turin High Performance Datacenter",
      deploymentType: "On-Premises Core GPU Tier",
      tokenUsage: "33M",
      inputTokens: "17M",
      outputTokens: "16M",
      cost: "$600",
      costSharePct: 7.9,
      costPer1M: "$1.82",
      latencyP95: "45ms",
      capabilityGroup: "High-Frequency Code Completion & Unit Tests",
      primaryAgents: ["IDE Auto-Completion Agent", "Boilerplate Unit-Test Synthesizer"],
      drilldown: [
        { agent: "IDE Auto-Completion Agent", program: "QE", tokens: "21M", cost: "$380", sharePct: 63.3 },
        { agent: "Boilerplate Unit-Test Synthesizer", program: "QE", tokens: "12M", cost: "$220", sharePct: 36.7 }
      ]
    }
  ],

  agentCosts: [
    {
      id: "AGT-401",
      name: "Regression Suite Generation Agent",
      squad: "Cockpit UX Core",
      program: "QE",
      workspace: "Infotainment & Cockpit",
      primaryModel: "Claude 3.5 Sonnet Enterprise",
      tokensConsumed: "15M",
      monthlySpend: "$2,100",
      budgetCap: "$2,400",
      trendPct: "+14.2%",
      trendDirection: "up",
      efficiencyScore: 89,
      status: "Attention Required",
      statusBadge: "badge-high",
      cacheHitRate: "41.2%",
      costPerRun: "$0.28",
      activeAlertId: "ALT-CST-402"
    },
    {
      id: "AGT-402",
      name: "Static Code Analysis Daemon",
      squad: "CI/CD & DevOps Guild",
      program: "QE",
      workspace: "DevOps & CI/CD Pipelines",
      primaryModel: "GPT-4o Enterprise",
      tokensConsumed: "10M",
      monthlySpend: "$1,250",
      budgetCap: "$1,500",
      trendPct: "+6.8%",
      trendDirection: "up",
      efficiencyScore: 82,
      status: "Optimization Candidate",
      statusBadge: "badge-info",
      cacheHitRate: "34.5%",
      costPerRun: "$0.12",
      activeAlertId: "ALT-CST-403"
    },
    {
      id: "AGT-403",
      name: "Jira Flaky Test Remediation Agent",
      squad: "Powertrain Software QA",
      program: "QE",
      workspace: "Powertrain ADAS",
      primaryModel: "Claude 3.5 Sonnet Enterprise",
      tokensConsumed: "7.5M",
      monthlySpend: "$1,050",
      budgetCap: "$900",
      trendPct: "+28.5%",
      trendDirection: "up",
      efficiencyScore: 74,
      status: "Over Budget Alert",
      statusBadge: "badge-critical",
      cacheHitRate: "22.8%",
      costPerRun: "$0.42",
      activeAlertId: "ALT-CST-401"
    },
    {
      id: "AGT-404",
      name: "CAN Bus Telemetry Parser",
      squad: "Vehicle Core Platform",
      program: "AD",
      workspace: "Vehicle Health & Telematics",
      primaryModel: "Mistral Large 2 (Private Cloud)",
      tokensConsumed: "9.5M",
      monthlySpend: "$550",
      budgetCap: "$800",
      trendPct: "-4.2%",
      trendDirection: "down",
      efficiencyScore: 94,
      status: "Optimal",
      statusBadge: "badge-success",
      cacheHitRate: "48.2%",
      costPerRun: "$0.05",
      activeAlertId: null
    },
    {
      id: "AGT-405",
      name: "IDE Auto-Completion Agent",
      squad: "Global Engineering Productivity",
      program: "QE",
      workspace: "Production Core",
      primaryModel: "DeepSeek Coder V2 (Turin Local)",
      tokensConsumed: "21M",
      monthlySpend: "$380",
      budgetCap: "$600",
      trendPct: "-8.5%",
      trendDirection: "down",
      efficiencyScore: 96,
      status: "Highly Optimized",
      statusBadge: "badge-success",
      cacheHitRate: "54.1%",
      costPerRun: "$0.001",
      activeAlertId: null
    },
    {
      id: "AGT-406",
      name: "Telemetry Diagnostic Agent",
      squad: "Telematics Core",
      program: "AD",
      workspace: "Vehicle Health & Telematics",
      primaryModel: "GPT-4o Enterprise",
      tokensConsumed: "6M",
      monthlySpend: "$750",
      budgetCap: "$950",
      trendPct: "+3.1%",
      trendDirection: "stable",
      efficiencyScore: 87,
      status: "Optimal",
      statusBadge: "badge-success",
      cacheHitRate: "36.8%",
      costPerRun: "$0.09",
      activeAlertId: "ALT-CST-404"
    }
  ],

  costAlerts: [
    {
      id: "ALT-CST-401",
      agentName: "Jira Flaky Test Remediation Agent",
      workspace: "Powertrain ADAS",
      program: "QE",
      estimatedCostImpact: "+$280 / week",
      impactAmountNum: 280,
      severity: "Critical",
      severityBadge: "badge-critical",
      issueDescription: "Unbounded recursive loop on failing WebGL harness triggered 8k full-context Claude 3.5 invocations in 48 hours.",
      recommendedAction: "Apply retry circuit breaker (cap at 3 attempts) and migrate initial triage to Claude 3 Haiku / DeepSeek Coder.",
      status: "Active",
      detectedAt: "Sep 28, 2026 • 14:15 CET",
      acknowledgedBy: null,
      acknowledgedAt: null,
      closedAt: null,
      closedBy: null,
      resolutionNote: null
    },
    {
      id: "ALT-CST-402",
      agentName: "Regression Suite Generation Agent",
      workspace: "Infotainment & Cockpit",
      program: "QE",
      estimatedCostImpact: "+$190 / month",
      impactAmountNum: 190,
      severity: "High",
      severityBadge: "badge-high",
      issueDescription: "Dynamic timestamps prepended to system prompts invalidated prefix caching, dropping cache hit rate from 62% to 14%.",
      recommendedAction: "Standardize deterministic prompt prefix ordering to restore Anthropic prompt caching discount.",
      status: "Active",
      detectedAt: "Sep 27, 2026 • 09:40 CET",
      acknowledgedBy: null,
      acknowledgedAt: null,
      closedAt: null,
      closedBy: null,
      resolutionNote: null
    },
    {
      id: "ALT-CST-403",
      agentName: "Static Code Analysis Daemon",
      workspace: "DevOps & CI/CD Pipelines",
      program: "QE",
      estimatedCostImpact: "+$110 / month",
      impactAmountNum: 110,
      severity: "Medium",
      severityBadge: "badge-medium",
      issueDescription: "Over-provisioned frontier model: Using GPT-4o for syntax linting and PEP8 formatting where DeepSeek Coder V2 performs identically.",
      recommendedAction: "Right-size model routing rules to Turin On-Prem DeepSeek cluster for all AST-level linting steps.",
      status: "Active",
      detectedAt: "Sep 26, 2026 • 16:20 CET",
      acknowledgedBy: null,
      acknowledgedAt: null,
      closedAt: null,
      closedBy: null,
      resolutionNote: null
    },
    {
      id: "ALT-CST-404",
      agentName: "Telemetry Diagnostic Agent",
      workspace: "Vehicle Health & Telematics",
      program: "AD",
      estimatedCostImpact: "+$40 / month",
      impactAmountNum: 40,
      severity: "Low",
      severityBadge: "badge-info",
      issueDescription: "Raw uncompressed CAN trace dumps transmitted in JSON rather than compressed byte tokens.",
      recommendedAction: "Enable telemetry dictionary pre-compression filter to reduce input token size by 35%.",
      status: "Active",
      detectedAt: "Sep 25, 2026 • 11:05 CET",
      acknowledgedBy: null,
      acknowledgedAt: null,
      closedAt: null,
      closedBy: null,
      resolutionNote: null
    }
  ],

  alertAuditHistory: [
    {
      id: "ALT-CST-388",
      agentName: "Documentation Summarizer Bot",
      workspace: "Production Core",
      program: "AMS",
      estimatedCostImpact: "+$75 / month",
      severity: "Medium",
      actionTaken: "Switched model from GPT-4o to Mistral Nemo 12B; monthly cost reduced by 64%.",
      closedAt: "Sep 22, 2026 • 17:30 CET",
      closedBy: "Alex (CAIO)",
      auditRef: "AUD-FINOPS-2026-0922"
    },
    {
      id: "ALT-CST-381",
      agentName: "Jira Issue Auto-Tagger",
      workspace: "DevOps & CI/CD Pipelines",
      program: "QE",
      estimatedCostImpact: "+$150 / month",
      severity: "High",
      actionTaken: "Implemented token max_limit=800 and caching layer for static taxonomy tables.",
      closedAt: "Sep 18, 2026 • 10:15 CET",
      closedBy: "FinOps Automation Daemon",
      auditRef: "AUD-FINOPS-2026-0918"
    },
    {
      id: "ALT-CST-374",
      agentName: "Nightly Integration Test Generator",
      workspace: "Powertrain ADAS",
      program: "AD",
      estimatedCostImpact: "+$310 / month",
      severity: "Critical",
      actionTaken: "Constrained execution concurrency from 32 parallel agents to 8 staggered worker threads.",
      closedAt: "Sep 12, 2026 • 14:00 CET",
      closedBy: "Alex (CAIO)",
      auditRef: "AUD-FINOPS-2026-0912"
    }
  ],

  tokenAnalytics: {
    totalTokens: "95,000,000",
    totalTokensFormatted: "95M",
    inputTokens: "60M (63.2%)",
    outputTokens: "35M (36.8%)",
    cachedTokens: "36.7M (38.6% of Prompt Volume)",
    avgTokensPerRequest: 2840,
    avgPromptTokens: 2120,
    avgCompletionTokens: 720,
    peakHourlyTokens: "160k / hr @ 14:00 CET",
    monthlyTrends: [
      { month: "May", tokensNum: 52, tokensFormatted: "52M", spend: "$4,450", costPer1M: "$7.85", cacheHit: "24.5%" },
      { month: "Jun", tokensNum: 68, tokensFormatted: "68M", spend: "$5,820", costPer1M: "$7.92", cacheHit: "28.0%" },
      { month: "Jul", tokensNum: 78, tokensFormatted: "78M", spend: "$6,550", costPer1M: "$7.75", cacheHit: "32.4%" },
      { month: "Aug", tokensNum: 87, tokensFormatted: "87M", spend: "$7,150", costPer1M: "$7.60", cacheHit: "35.8%" },
      { month: "Sep (MTD)", tokensNum: 95, tokensFormatted: "95M", spend: "$7,650", costPer1M: "$7.45", cacheHit: "38.6%" }
    ],
    modalityBreakdown: [
      { modality: "Code & Automated Tests", sharePct: 44, tokens: "41.8M", color: "#3b82f6" },
      { modality: "Natural Language & Specifications", sharePct: 36, tokens: "34.2M", color: "#10b981" },
      { modality: "CAN Telemetry & Diagnostic Traces", sharePct: 20, tokens: "19.0M", color: "#f59e0b" }
    ],
    dailyBurnRates: [
      { day: "Mon", tokens: "3.4M", spend: "$275" },
      { day: "Tue", tokens: "3.9M", spend: "$315" },
      { day: "Wed", tokens: "4.3M", spend: "$350" },
      { day: "Thu", tokens: "4.1M", spend: "$330" },
      { day: "Fri", tokens: "3.7M", spend: "$300" },
      { day: "Sat", tokens: "1.1M", spend: "$90" },
      { day: "Sun", tokens: "0.9M", spend: "$70" }
    ]
  },

  costOptimizations: [
    {
      id: "OPT-01",
      category: "Prompt Caching",
      title: "Activate Anthropic Prompt Caching on Regression Suites",
      description: "Standardize deterministic prompt prefix across 4 QE test agents. Prefix caching reduces input token cost by 90% and cuts response latency by 42%.",
      potentialSavingsMonthly: "$165 / month",
      potentialSavingsYearly: "$1,980 / year",
      targetProgram: "QE",
      effort: "Low (API Configuration)",
      impact: "Zero regression accuracy drop • 42% latency cut",
      applied: false,
      badge: "badge-success"
    },
    {
      id: "OPT-02",
      category: "Model Right-Sizing",
      title: "Right-Size Static Linting to Turin On-Prem DeepSeek Coder V2",
      description: "Migrate repetitive syntax checks and boilerplate test stub generation from GPT-4o to self-hosted Turin GPU cluster. 100% data sovereignty.",
      potentialSavingsMonthly: "$240 / month",
      potentialSavingsYearly: "$2,880 / year",
      targetProgram: "QE & AD",
      effort: "Medium (Routing Rule Update)",
      impact: "Zero cloud egress • Equal AST parsing accuracy",
      applied: false,
      badge: "badge-info"
    },
    {
      id: "OPT-03",
      category: "Prompt Compression",
      title: "Trim Redundant Stack Frames in Bug Filing Prompts",
      description: "Apply semantic summarization and strip deep framework stack traces (>3 frames) before sending bug context to Claude 3.5 Sonnet.",
      potentialSavingsMonthly: "$95 / month",
      potentialSavingsYearly: "$1,140 / year",
      targetProgram: "QE",
      effort: "Low (Agent Prompt Filter)",
      impact: "24% smaller prompt payloads • Faster resolution",
      applied: false,
      badge: "badge-success"
    }
  ],

  efficiencyIndex: {
    overallScore: 88.5,
    grade: "A-",
    statusText: "Enterprise Optimal Operating Efficiency",
    subScores: [
      {
        name: "Prompt Cache Hit Efficiency",
        score: 86,
        target: 80,
        benchmark: "Industry median: 28%",
        status: "Leading",
        detail: "38.6% active cache hit rate saving $2,180 MTD"
      },
      {
        name: "Model Right-Sizing Index",
        score: 92,
        target: 85,
        benchmark: "Industry median: 65%",
        status: "Optimal",
        detail: "82% of squad workloads routed to lowest-cost capable model tier"
      },
      {
        name: "Token Wastage & Truncation Index",
        score: 89,
        target: 85,
        benchmark: "Industry median: 72%",
        status: "Optimal",
        detail: "Only 2.1% runaway generation or retry cancellations"
      },
      {
        name: "Value-to-Cost ROI Multiplier",
        score: 94,
        target: 80,
        benchmark: "Industry median: 2.4x",
        status: "Leading",
        detail: "3.8x ROI multiplier ($29k capacity returned on $7.6k spend)"
      }
    ],
    programBenchmarks: [
      {
        program: "Quality Engineering (QE)",
        score: 91.2,
        status: "Benchmark Leader",
        badge: "badge-success",
        highlight: "Highest caching adoption & fast automated test cycles"
      },
      {
        program: "Autonomous Driving & ADAS (AD)",
        score: 86.8,
        status: "Optimal Performance",
        badge: "badge-info",
        highlight: "Heavy telemetry ingestion balanced by on-prem Mistral cluster"
      },
      {
        program: "Application Management Services (AMS)",
        score: 84.5,
        status: "Optimization In-Progress",
        badge: "badge-medium",
        highlight: "Migration of legacy incident bots to modern LLM routes underway"
      }
    ]
  }
};

/**
 * Generates realistic real-time 4-second dynamic variations for FinOps
 * Keeps values within the reduced realistic scale ($10,000 budget, ~$7,620-$7,710 spend, ~94.5M-96.2M tokens)
 * Preserves user interactions (alerts acknowledged/resolved, applied optimizations)
 */
export function generateDynamicFinOpsData(prev = initialFinOpsData) {
  const now = Date.now();
  const spendOffset = Math.sin(now / 5000) * 38 + ((Math.random() - 0.5) * 16);
  const mtdSpendNum = Math.round(7650 + spendOffset);

  const tokenOffset = Math.cos(now / 6000) * 0.75 + ((Math.random() - 0.5) * 0.35);
  const tokenVolumeNum = +(95.0 + tokenOffset).toFixed(1);

  const budgetNum = 10000;
  const budgetUtilization = ((mtdSpendNum / budgetNum) * 100).toFixed(1) + "%";
  const projectedEndMonthSpend = "$" + Math.round(mtdSpendNum * 1.1895).toLocaleString();
  const costPer1MNum = (mtdSpendNum / tokenVolumeNum).toFixed(2);
  const costPer1MTokens = "$" + costPer1MNum;

  const inputTokensNum = +(tokenVolumeNum * 0.6316).toFixed(1);
  const outputTokensNum = +(tokenVolumeNum - inputTokensNum).toFixed(1);

  const cacheSavingsNum = Math.round(mtdSpendNum * 0.285);
  const cacheHitRateNum = (38.2 + (Math.sin(now / 7000) * 0.7) + (Math.random() * 0.2)).toFixed(1) + "%";
  const efficiencyIndexNum = +(88.3 + (Math.cos(now / 9000) * 0.4)).toFixed(1);

  // Program Breakdown (sums strictly to mtdSpendNum and tokenVolumeNum)
  const qeSpendNum = Math.round(mtdSpendNum * 0.4575);
  const qeTokensNum = +(tokenVolumeNum * 0.4632).toFixed(1);
  const qeCostPer1M = "$" + (qeSpendNum / qeTokensNum).toFixed(2);

  const adSpendNum = Math.round(mtdSpendNum * 0.3464);
  const adTokensNum = +(tokenVolumeNum * 0.3368).toFixed(1);
  const adCostPer1M = "$" + (adSpendNum / adTokensNum).toFixed(2);

  const amsSpendNum = mtdSpendNum - qeSpendNum - adSpendNum;
  const amsTokensNum = +(tokenVolumeNum - qeTokensNum - adTokensNum).toFixed(1);
  const amsCostPer1M = "$" + (amsSpendNum / amsTokensNum).toFixed(2);

  // Model Breakdown (sums strictly to mtdSpendNum and tokenVolumeNum)
  const claudeCostNum = Math.round(mtdSpendNum * 0.4771);
  const claudeTokensNum = +(tokenVolumeNum * 0.2737).toFixed(1);

  const gptCostNum = Math.round(mtdSpendNum * 0.3203);
  const gptTokensNum = +(tokenVolumeNum * 0.2105).toFixed(1);

  const mistralCostNum = Math.round(mtdSpendNum * 0.1242);
  const mistralTokensNum = +(tokenVolumeNum * 0.1684).toFixed(1);

  const deepseekCostNum = mtdSpendNum - claudeCostNum - gptCostNum - mistralCostNum;
  const deepseekTokensNum = +(tokenVolumeNum - claudeTokensNum - gptTokensNum - mistralTokensNum).toFixed(1);

  // Model drilldown mapping
  const updatedModelCostMix = (prev.modelCostMix || initialFinOpsData.modelCostMix).map(model => {
    if (model.id === "MOD-CLAUDE-SONNET") {
      const regCost = Math.round(claudeCostNum * 0.575);
      const flakyCost = Math.round(claudeCostNum * 0.288);
      const auditCost = claudeCostNum - regCost - flakyCost;
      return {
        ...model,
        tokenUsage: claudeTokensNum + "M",
        inputTokens: (claudeTokensNum * 0.654).toFixed(1) + "M",
        outputTokens: (claudeTokensNum * 0.346).toFixed(1) + "M",
        cost: "$" + claudeCostNum.toLocaleString(),
        costSharePct: +((claudeCostNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: "$" + (claudeCostNum / claudeTokensNum).toFixed(2),
        drilldown: [
          { agent: "Regression Suite Generation Agent", program: "QE", tokens: (claudeTokensNum * 0.577).toFixed(1) + "M", cost: "$" + regCost.toLocaleString(), sharePct: 57.5 },
          { agent: "Jira Flaky Test Remediation Agent", program: "QE", tokens: (claudeTokensNum * 0.288).toFixed(1) + "M", cost: "$" + flakyCost.toLocaleString(), sharePct: 28.8 },
          { agent: "Architecture Compliance Auditor", program: "AD", tokens: (claudeTokensNum * 0.135).toFixed(1) + "M", cost: "$" + auditCost.toLocaleString(), sharePct: 13.7 }
        ]
      };
    }
    if (model.id === "MOD-GPT-4O") {
      const staticCost = Math.round(gptCostNum * 0.510);
      const diagCost = Math.round(gptCostNum * 0.306);
      const ticketCost = gptCostNum - staticCost - diagCost;
      return {
        ...model,
        tokenUsage: gptTokensNum + "M",
        inputTokens: (gptTokensNum * 0.650).toFixed(1) + "M",
        outputTokens: (gptTokensNum * 0.350).toFixed(1) + "M",
        cost: "$" + gptCostNum.toLocaleString(),
        costSharePct: +((gptCostNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: "$" + (gptCostNum / gptTokensNum).toFixed(2),
        drilldown: [
          { agent: "Static Code Analysis Daemon", program: "QE", tokens: (gptTokensNum * 0.500).toFixed(1) + "M", cost: "$" + staticCost.toLocaleString(), sharePct: 51.0 },
          { agent: "Telemetry Diagnostic Agent", program: "AD", tokens: (gptTokensNum * 0.300).toFixed(1) + "M", cost: "$" + diagCost.toLocaleString(), sharePct: 30.6 },
          { agent: "AMS Ticket Resolver Agent", program: "AMS", tokens: (gptTokensNum * 0.200).toFixed(1) + "M", cost: "$" + ticketCost.toLocaleString(), sharePct: 18.4 }
        ]
      };
    }
    if (model.id === "MOD-MISTRAL-LARGE") {
      const canCost = Math.round(mistralCostNum * 0.579);
      const sensorCost = mistralCostNum - canCost;
      return {
        ...model,
        tokenUsage: mistralTokensNum + "M",
        inputTokens: (mistralTokensNum * 0.625).toFixed(1) + "M",
        outputTokens: (mistralTokensNum * 0.375).toFixed(1) + "M",
        cost: "$" + mistralCostNum.toLocaleString(),
        costSharePct: +((mistralCostNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: "$" + (mistralCostNum / mistralTokensNum).toFixed(2),
        drilldown: [
          { agent: "CAN Bus Telemetry Parser", program: "AD", tokens: (mistralTokensNum * 0.594).toFixed(1) + "M", cost: "$" + canCost.toLocaleString(), sharePct: 57.9 },
          { agent: "Sensor Anomaly Detector", program: "AD", tokens: (mistralTokensNum * 0.406).toFixed(1) + "M", cost: "$" + sensorCost.toLocaleString(), sharePct: 42.1 }
        ]
      };
    }
    if (model.id === "MOD-DEEPSEEK-CODER") {
      const ideCost = Math.round(deepseekCostNum * 0.633);
      const testCost = deepseekCostNum - ideCost;
      return {
        ...model,
        tokenUsage: deepseekTokensNum + "M",
        inputTokens: (deepseekTokensNum * 0.515).toFixed(1) + "M",
        outputTokens: (deepseekTokensNum * 0.485).toFixed(1) + "M",
        cost: "$" + deepseekCostNum.toLocaleString(),
        costSharePct: +((deepseekCostNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: "$" + (deepseekCostNum / deepseekTokensNum).toFixed(2),
        drilldown: [
          { agent: "IDE Auto-Completion Agent", program: "QE", tokens: (deepseekTokensNum * 0.636).toFixed(1) + "M", cost: "$" + ideCost.toLocaleString(), sharePct: 63.3 },
          { agent: "Boilerplate Unit-Test Synthesizer", program: "QE", tokens: (deepseekTokensNum * 0.364).toFixed(1) + "M", cost: "$" + testCost.toLocaleString(), sharePct: 36.7 }
        ]
      };
    }
    return model;
  });

  // Agent costs
  const updatedAgentCosts = (prev.agentCosts || initialFinOpsData.agentCosts).map(agent => {
    if (agent.id === "AGT-401") {
      return {
        ...agent,
        tokensConsumed: (claudeTokensNum * 0.577).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(claudeCostNum * 0.575).toLocaleString()
      };
    }
    if (agent.id === "AGT-402") {
      return {
        ...agent,
        tokensConsumed: (gptTokensNum * 0.500).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(gptCostNum * 0.510).toLocaleString()
      };
    }
    if (agent.id === "AGT-403") {
      return {
        ...agent,
        tokensConsumed: (claudeTokensNum * 0.288).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(claudeCostNum * 0.288).toLocaleString()
      };
    }
    if (agent.id === "AGT-404") {
      return {
        ...agent,
        tokensConsumed: (mistralTokensNum * 0.594).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(mistralCostNum * 0.579).toLocaleString()
      };
    }
    if (agent.id === "AGT-405") {
      return {
        ...agent,
        tokensConsumed: (deepseekTokensNum * 0.636).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(deepseekCostNum * 0.633).toLocaleString()
      };
    }
    if (agent.id === "AGT-406") {
      return {
        ...agent,
        tokensConsumed: (gptTokensNum * 0.300).toFixed(1) + "M",
        monthlySpend: "$" + Math.round(gptCostNum * 0.306).toLocaleString()
      };
    }
    return agent;
  });

  return {
    ...prev,
    kpis: {
      ...prev.kpis,
      mtdSpend: "$" + mtdSpendNum.toLocaleString(),
      budgetUtilization: budgetUtilization,
      projectedEndMonthSpend: projectedEndMonthSpend,
      tokenVolume: tokenVolumeNum.toFixed(1) + "M",
      inputTokens: inputTokensNum.toFixed(1) + "M",
      outputTokens: outputTokensNum.toFixed(1) + "M",
      costPer1MTokens: costPer1MTokens,
      costPer1MDeltaPct: (((+costPer1MNum - 9.80) / 9.80) * 100).toFixed(1) + "%",
      cacheSavings: "$" + cacheSavingsNum.toLocaleString(),
      cacheHitRate: cacheHitRateNum,
      aiEfficiencyIndex: efficiencyIndexNum
    },
    programBreakdown: {
      ...prev.programBreakdown,
      QE: {
        ...prev.programBreakdown.QE,
        spend: "$" + qeSpendNum.toLocaleString(),
        budgetUtilization: ((qeSpendNum / 4500) * 100).toFixed(1) + "%",
        tokens: qeTokensNum.toFixed(1) + "M",
        sharePct: +((qeSpendNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: qeCostPer1M
      },
      AD: {
        ...prev.programBreakdown.AD,
        spend: "$" + adSpendNum.toLocaleString(),
        budgetUtilization: ((adSpendNum / 3500) * 100).toFixed(1) + "%",
        tokens: adTokensNum.toFixed(1) + "M",
        sharePct: +((adSpendNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: adCostPer1M
      },
      AMS: {
        ...prev.programBreakdown.AMS,
        spend: "$" + amsSpendNum.toLocaleString(),
        budgetUtilization: ((amsSpendNum / 2000) * 100).toFixed(1) + "%",
        tokens: amsTokensNum.toFixed(1) + "M",
        sharePct: +((amsSpendNum / mtdSpendNum) * 100).toFixed(1),
        costPer1M: amsCostPer1M
      }
    },
    modelCostMix: updatedModelCostMix,
    agentCosts: updatedAgentCosts,
    tokenAnalytics: {
      ...prev.tokenAnalytics,
      totalTokensFormatted: tokenVolumeNum.toFixed(1) + "M",
      totalTokens: (tokenVolumeNum * 1000000).toLocaleString(),
      inputTokens: `${inputTokensNum}M (${((inputTokensNum / tokenVolumeNum) * 100).toFixed(1)}%)`,
      outputTokens: `${outputTokensNum}M (${((outputTokensNum / tokenVolumeNum) * 100).toFixed(1)}%)`,
      monthlyTrends: (prev.tokenAnalytics?.monthlyTrends || initialFinOpsData.tokenAnalytics.monthlyTrends).map(item => {
        if (item.month === "Sep (MTD)") {
          return {
            ...item,
            tokensNum: Math.round(tokenVolumeNum),
            tokensFormatted: tokenVolumeNum.toFixed(0) + "M",
            spend: "$" + mtdSpendNum.toLocaleString(),
            costPer1M: costPer1MTokens
          };
        }
        return item;
      })
    }
  };
}

/**
 * Helper for Box 7 (AI Cost & Model Consumption) dynamic updates
 */
export function generateDynamicAiCost(prevCost = {}) {
  const now = Date.now();
  const spendOffset = Math.sin(now / 5000) * 38 + ((Math.random() - 0.5) * 16);
  const mtdSpendNum = Math.round(7650 + spendOffset);

  const tokenOffset = Math.cos(now / 6000) * 0.75 + ((Math.random() - 0.5) * 0.35);
  const tokenVolumeNum = +(95.0 + tokenOffset).toFixed(1);

  const budgetNum = 10000;
  const budgetUtilization = ((mtdSpendNum / budgetNum) * 100).toFixed(1) + "%";
  const projectedEndMonthSpend = "$" + Math.round(mtdSpendNum * 1.1895).toLocaleString();

  const claudeCostNum = Math.round(mtdSpendNum * 0.4771);
  const claudeTokensNum = +(tokenVolumeNum * 0.2737).toFixed(1);

  const gptCostNum = Math.round(mtdSpendNum * 0.3203);
  const gptTokensNum = +(tokenVolumeNum * 0.2105).toFixed(1);

  const mistralCostNum = Math.round(mtdSpendNum * 0.1242);
  const mistralTokensNum = +(tokenVolumeNum * 0.1684).toFixed(1);

  const deepseekCostNum = mtdSpendNum - claudeCostNum - gptCostNum - mistralCostNum;
  const deepseekTokensNum = +(tokenVolumeNum - claudeTokensNum - gptTokensNum - mistralTokensNum).toFixed(1);

  return {
    ...prevCost,
    monthlyBudget: "$10,000",
    currentSpend: "$" + mtdSpendNum.toLocaleString(),
    budgetUtilization: budgetUtilization,
    projectedEndMonthSpend: projectedEndMonthSpend,
    costPerPullRequest: "$" + ((mtdSpendNum / (tokenVolumeNum * 1000)).toFixed(2)),
    totalTokensConsumedM: tokenVolumeNum.toFixed(1) + "M",
    modelBreakdown: [
      {
        modelName: "Claude 3.5 Sonnet Enterprise",
        provider: "Anthropic / AWS Bedrock",
        tokensConsumed: claudeTokensNum + "M",
        cost: "$" + claudeCostNum.toLocaleString(),
        sharePct: Math.round((claudeCostNum / mtdSpendNum) * 100),
        primaryUsage: "Architectural synthesis, complex refactoring, safety audit"
      },
      {
        modelName: "GPT-4o Enterprise",
        provider: "Azure OpenAI Stellantis Tenant",
        tokensConsumed: gptTokensNum + "M",
        cost: "$" + gptCostNum.toLocaleString(),
        sharePct: Math.round((gptCostNum / mtdSpendNum) * 100),
        primaryUsage: "Requirements generation, documentation, code review assistant"
      },
      {
        modelName: "Mistral Large 2 (Private Cloud)",
        provider: "Private Mistral / Turin On-Prem",
        tokensConsumed: mistralTokensNum + "M",
        cost: "$" + mistralCostNum.toLocaleString(),
        sharePct: Math.round((mistralCostNum / mtdSpendNum) * 100),
        primaryUsage: "Proprietary CAN telemetry parsing, internal API queries"
      },
      {
        modelName: "DeepSeek Coder / CodeLlama 70B",
        provider: "Self-Hosted GPU Cluster (Turin)",
        tokensConsumed: deepseekTokensNum + "M",
        cost: "$" + deepseekCostNum.toLocaleString(),
        sharePct: Math.round((deepseekCostNum / mtdSpendNum) * 100),
        primaryUsage: "Real-time IDE code completion, unit test boilerplates"
      }
    ]
  };
}

