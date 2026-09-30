/**
 * Simple Mock Data for 8.4 Risk and Governance
 * Persona: Alex — Chief AI Officer
 */

export const simpleGovernanceData = {
  kpis: {
    policyExceptions: 3,
    highRiskAssets: 4,
    recertificationStatus: "94%",
    humanOverrideRate: "4.2%",
    securityFindings: 2,
    unapprovedUsage: 1,
  },

  // 1. Policy Exceptions & Unapproved Asset Usage
  policyExceptions: [
    {
      id: "EXC-101",
      title: "Public LLM Direct Invocation",
      asset: "Unapproved Public API",
      type: "Unapproved Asset Usage",
      severity: "High",
      squad: "Cockpit UX",
      status: "Blocked by Guardrail",
      date: "Sep 28, 2026"
    },
    {
      id: "EXC-102",
      title: "Model Output Safety Bypass",
      asset: "Flaky Test Agent",
      type: "Policy Exception",
      severity: "Medium",
      squad: "Powertrain QA",
      status: "Under Review",
      date: "Sep 26, 2026"
    },
    {
      id: "EXC-103",
      title: "PII Redaction Lag in Logs",
      asset: "Telemetry Diagnostic Agent",
      type: "Policy Exception",
      severity: "Low",
      squad: "Telematics Core",
      status: "Remediated",
      date: "Sep 24, 2026"
    }
  ],

  // 2. High-Risk Assets in Use & Recertification Status
  highRiskAssets: [
    {
      id: "ASSET-01",
      name: "Autonomous Emergency Braking (AEB) Vision Agent",
      type: "Agent",
      riskLevel: "EU AI Act: High-Risk",
      recertificationDueDate: "Oct 15, 2026",
      recertStatus: "Due in 16 Days",
      owner: "Safety Guild"
    },
    {
      id: "ASSET-02",
      name: "Claude 3.5 Sonnet Enterprise",
      type: "Foundation Model",
      riskLevel: "Tier-1 Production",
      recertificationDueDate: "Nov 30, 2026",
      recertStatus: "Certified",
      owner: "AI CoE"
    },
    {
      id: "ASSET-03",
      name: "CAN-Bus Powertrain Anomaly Detector",
      type: "Agent",
      riskLevel: "ISO 26262 ASIL-B",
      recertificationDueDate: "Dec 10, 2026",
      recertStatus: "Certified",
      owner: "Powertrain Team"
    },
    {
      id: "ASSET-04",
      name: "DeepSeek Coder V2 (Turin Local)",
      type: "Foundation Model",
      riskLevel: "On-Premises Core",
      recertificationDueDate: "Jan 15, 2027",
      recertStatus: "Certified",
      owner: "DevOps Infrastructure"
    }
  ],

  // 3. Model, Agent, and Workflow Incidents
  incidents: [
    {
      id: "INC-301",
      title: "Agent Infinite Retry Loop",
      target: "Jira Flaky Test Agent",
      category: "Agent Incident",
      severity: "High",
      status: "Resolved",
      impact: "Throttled API quota for 20 mins; circuit breaker applied.",
      time: "2 hours ago"
    },
    {
      id: "INC-302",
      title: "Model Output Distribution Drift",
      target: "Mistral Large 2 (CAN Telemetry)",
      category: "Model Incident",
      severity: "Medium",
      status: "Monitoring",
      impact: "Confidence score dropped 3.1% on new firmware CAN frame format.",
      time: "Yesterday"
    },
    {
      id: "INC-303",
      title: "CI/CD Test Synthesis Workflow Timeout",
      target: "Nightly Regression Workflow",
      category: "Workflow Incident",
      severity: "Low",
      status: "Mitigated",
      impact: "Job took 45m instead of 15m due to queue congestion.",
      time: "3 days ago"
    }
  ],

  // 4. Human Override & Security Findings Details
  securityAndOverrides: {
    humanOverrideRate: "4.2%",
    totalDecisions: 1240,
    overridesCount: 52,
    overrideReasonTop: "Manual safety validation on brake sensor thresholds",
    securityFindings: [
      { id: "SEC-01", title: "Prompt Injection Filter Hit", severity: "Medium", status: "Auto-Neutralized" },
      { id: "SEC-02", title: "Outdated Token Dependency CVE-2026", severity: "Low", status: "Patch Scheduled" }
    ]
  }
};
