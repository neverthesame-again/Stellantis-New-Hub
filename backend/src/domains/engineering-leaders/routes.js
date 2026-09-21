import express from "express";
import { engineeringDashboardData, engineeringWorkflowInbox, engineeringExperienceData } from "./mockData.js";

const router = express.Router();

/**
 * Domain: Engineering Leaders
 * Persona: Alex - Chief AI Officer / Head of Software Engineering
 * Endpoints:
 * - GET  /api/engineering/status
 * - GET  /api/engineering/dashboard
 * - POST /api/engineering/exceptions/:id/action
 * - GET  /api/engineering/workflows
 * - POST /api/engineering/workflows/:id/action
 * - GET  /api/engineering/experience
 * - POST /api/engineering/experience/models/:id/subscription
 * - POST /api/engineering/experience/models/onboard
 * - POST /api/engineering/experience/agents/:id/subscribe
 * - POST /api/engineering/experience/tools/:id/subscribe
 * - POST /api/engineering/experience/subscriptions/:id/action
 */

// In-memory state copies for interactive actions during server session
let currentDashboardData = JSON.parse(JSON.stringify(engineeringDashboardData));
let currentWorkflowItems = JSON.parse(JSON.stringify(engineeringWorkflowInbox));
let currentExperienceData = JSON.parse(JSON.stringify(engineeringExperienceData));

router.get("/status", (req, res) => {
  res.json({
    domain: "Engineering Leaders",
    persona: "Alex - Chief AI Officer",
    owner: "Alex",
    message: "Engineering Leaders API route operational.",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Full Executive Dashboard Data
router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    data: currentDashboardData
  });
});

// Interactive Governance Exception Decision Action
router.post("/exceptions/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, comments } = req.body;

  const exIndex = currentDashboardData.governanceExceptions.exceptionsList.findIndex(e => e.id === id);
  if (exIndex === -1) {
    return res.status(404).json({ success: false, message: `Exception ${id} not found.` });
  }

  const exception = currentDashboardData.governanceExceptions.exceptionsList[exIndex];
  exception.status = action === 'approve' ? 'Approved Exception' : (action === 'remediate' ? 'Remediation Enforced' : 'Dismissed');
  exception.actionRequired = `Actioned by CAIO: ${action.toUpperCase()}`;
  exception.actionedAt = new Date().toISOString();
  exception.comments = comments || 'No comments provided.';

  if (currentDashboardData.governanceExceptions.totalPendingExceptions > 0) {
    currentDashboardData.governanceExceptions.totalPendingExceptions -= 1;
  }

  res.json({
    success: true,
    message: `Governance exception ${id} updated to ${exception.status}`,
    data: exception
  });
});

// -------------------------------------------------------------
// Workflow Inbox Endpoints
// -------------------------------------------------------------

// GET /api/engineering/workflows (Optional filter by type or priority)
router.get("/workflows", (req, res) => {
  const { type, priority } = req.query;
  let results = [...currentWorkflowItems];

  if (type && type !== 'All') {
    results = results.filter(item => item.type.toLowerCase().includes(type.toLowerCase()));
  }

  if (priority && priority !== 'All') {
    results = results.filter(item => item.priority.toLowerCase() === priority.toLowerCase());
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// POST /api/engineering/workflows/:id/action (Approve / Reject / Escalate)
router.post("/workflows/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, comments } = req.body;

  const itemIndex = currentWorkflowItems.findIndex(i => i.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: `Workflow item ${id} not found.` });
  }

  const item = currentWorkflowItems[itemIndex];
  const newStatus = action === 'approve' ? 'Authorized' : (action === 'reject' ? 'Rejected' : 'Escalated');
  item.status = newStatus;
  item.actionedAt = new Date().toISOString();

  // Prepend to decision history
  item.decisionHistory.unshift({
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' CET',
    actor: 'Alex (Chief AI Officer)',
    action: `Decision: ${newStatus.toUpperCase()}`,
    comment: comments || `Actioned by Chief AI Officer (${action.toUpperCase()}).`
  });

  res.json({
    success: true,
    message: `Workflow item ${id} marked as ${newStatus}`,
    data: item
  });
});

// -------------------------------------------------------------
// 5. Common Persona Experience Endpoints (5.1 - 5.6)
// -------------------------------------------------------------

// GET /api/engineering/experience (Models, Agents, Tools, Subscriptions, DrillDown)
router.get("/experience", (req, res) => {
  res.json({
    success: true,
    data: currentExperienceData
  });
});

// POST /api/engineering/experience/models/:id/subscription (Toggle or update model subscription)
router.post("/experience/models/:id/subscription", (req, res) => {
  const { id } = req.params;
  const model = currentExperienceData.models.find(m => m.id === id);
  if (!model) {
    return res.status(404).json({ success: false, message: `Model ${id} not found.` });
  }

  model.subscribed = !model.subscribed;

  // Sync to mySubscriptions
  if (model.subscribed) {
    if (!currentExperienceData.mySubscriptions.some(s => s.entityName.includes(model.name))) {
      currentExperienceData.mySubscriptions.unshift({
        id: `SUB-${Date.now()}`,
        entityName: `${model.name} (${model.deploymentType.split(' ')[0]})`,
        type: "Model",
        level: "Portfolio level",
        monthlyUsage: "0 tokens (New)",
        costAllocation: model.costAllocation,
        grantedBy: "Alex (CAIO Self-Service)",
        renewalDate: "2027-03-31",
        status: "Active"
      });
    }
  } else {
    currentExperienceData.mySubscriptions = currentExperienceData.mySubscriptions.filter(
      s => !s.entityName.includes(model.name)
    );
  }

  res.json({
    success: true,
    message: `Model ${model.name} subscription set to ${model.subscribed}`,
    data: model,
    subscriptions: currentExperienceData.mySubscriptions
  });
});

// POST /api/engineering/experience/models/onboard (Request onboarding of new model)
router.post("/experience/models/onboard", (req, res) => {
  const { name, provider, capability, deploymentType, riskRating } = req.body;
  const newModel = {
    id: `MOD-ONB-${Date.now().toString().slice(-4)}`,
    name: name || "Custom Fine-Tuned Model",
    version: "v1.0-RC",
    provider: provider || "Enterprise On-Premises",
    capability: capability || "Domain Automotive AI",
    modality: "Text & Code",
    deploymentType: deploymentType || "Air-Gapped Private VPC",
    costPerMillionTokens: "$0.50 in / $1.00 out",
    latencyMs: 250,
    riskRating: riskRating || "Medium",
    contextWindow: "64k tokens",
    supportedUseCases: ["Experimental Validation"],
    benchmarkResults: { humanEval: "85.0%", sweBench: "35.0%", autosarCompliantRate: "92.0%", latencyP95: "280ms" },
    limitations: "Pending final security audit and ASIL-D certification.",
    approvedUseCases: "Sandbox development and pilot evaluation.",
    dataRestrictions: "Internal staging network only.",
    usagePolicies: "Sandbox tier approved by CAIO.",
    subscribed: true,
    monthlyConsumptionTokens: "0",
    costAllocation: "$1,500 / mo"
  };

  currentExperienceData.models.unshift(newModel);

  // Add to workflow inbox as a notification/approval item
  currentWorkflowItems.unshift({
    id: `ENG-WF-ONB-${Date.now().toString().slice(-4)}`,
    title: `Onboarding Clearance Request: ${newModel.name}`,
    type: "Model, agent, and tool subscription requests",
    priority: "P2",
    riskLevel: newModel.riskRating,
    requestor: "Alex (Chief AI Officer)",
    originatingSystem: "SEL Model Onboarding Portal",
    portfolio: "Autonomous Driving & ADAS",
    requiredDecision: `Authorize enterprise onboarding and sandbox cluster allocation for ${newModel.name}.`,
    dueDate: "Sep 20, 2026",
    status: "Approved",
    confidence: "96.4%",
    supportingEvidence: {
      metrics: "Initial benchmark results: 85.0% HumanEval pass rate; latency 250ms.",
      impact: "Provides squad access to specialized automotive fine-tuned weights.",
      riskAssessment: "Medium risk: isolated in private sandbox prior to production vehicle connection.",
      rollbackPlan: "Automatic teardown of sandbox container cluster if idle for 14 days."
    },
    aiRecommendation: "Approve onboarding with condition of 30-day red-teaming cycle.",
    decisionHistory: [
      { timestamp: "Just now", actor: "Alex (Chief AI Officer)", action: "Submitted Onboarding Request", comment: "Onboarding initiated via AI Experience Zone." }
    ],
    auditTrail: "ONBOARD-REQ-2026 // SANDBOX-ISOLATED // CAIO-FAST-TRACK"
  });

  res.json({
    success: true,
    message: `Model ${newModel.name} onboarded to catalogue.`,
    data: newModel
  });
});

// POST /api/engineering/experience/agents/:id/subscribe (Subscribe agent to project)
router.post("/experience/agents/:id/subscribe", (req, res) => {
  const { id } = req.params;
  const { projectName, subscribed } = req.body;
  const agent = currentExperienceData.agents.find(a => a.id === id);
  if (!agent) {
    return res.status(404).json({ success: false, message: `Agent ${id} not found.` });
  }

  if (typeof subscribed === 'boolean') {
    agent.subscribed = subscribed;
  } else {
    agent.subscribed = !agent.subscribed;
  }

  if (projectName) {
    agent.subscribedToProject = projectName;
  }

  res.json({
    success: true,
    message: `Agent ${agent.name} subscription updated to ${agent.subscribed}`,
    data: agent
  });
});

// POST /api/engineering/experience/tools/:id/subscribe (Subscribe tool)
router.post("/experience/tools/:id/subscribe", (req, res) => {
  const { id } = req.params;
  const tool = currentExperienceData.tools.find(t => t.id === id);
  if (!tool) {
    return res.status(404).json({ success: false, message: `Tool ${id} not found.` });
  }

  tool.subscribed = !tool.subscribed;

  res.json({
    success: true,
    message: `Tool ${tool.name} subscription updated to ${tool.subscribed}`,
    data: tool
  });
});

// POST /api/engineering/experience/subscriptions/:id/action (Cancel or Renew subscription)
router.post("/experience/subscriptions/:id/action", (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'renew' or 'cancel'

  const subIndex = currentExperienceData.mySubscriptions.findIndex(s => s.id === id);
  if (subIndex === -1) {
    return res.status(404).json({ success: false, message: `Subscription ${id} not found.` });
  }

  const sub = currentExperienceData.mySubscriptions[subIndex];
  if (action === 'cancel') {
    currentExperienceData.mySubscriptions.splice(subIndex, 1);
    return res.json({ success: true, message: `Subscription for ${sub.entityName} cancelled.` });
  } else {
    sub.status = 'Active';
    sub.renewalDate = '2027-12-31';
    return res.json({ success: true, message: `Subscription for ${sub.entityName} renewed.`, data: sub });
  }
});

// Reset data state endpoint for demos
router.post("/dashboard/reset", (req, res) => {
  currentDashboardData = JSON.parse(JSON.stringify(engineeringDashboardData));
  currentWorkflowItems = JSON.parse(JSON.stringify(engineeringWorkflowInbox));
  currentExperienceData = JSON.parse(JSON.stringify(engineeringExperienceData));
  res.json({ success: true, message: "Engineering Leaders data reset to defaults." });
});

export default router;


