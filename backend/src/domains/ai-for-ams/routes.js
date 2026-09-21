import express from "express";
import { amsDashboardData, amsWorkflowInbox, amsExperienceData } from "./mockData.js";

const router = express.Router();

// In-memory state for mock updates during runtime
let currentWorkflows = JSON.parse(JSON.stringify(amsWorkflowInbox));
let currentExperience = JSON.parse(JSON.stringify(amsExperienceData));
let currentDashboard = JSON.parse(JSON.stringify(amsDashboardData));

// GET /api/ams/dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    data: currentDashboard
  });
});

// GET /api/ams/workflows
router.get("/workflows", (req, res) => {
  const { type, priority } = req.query;
  let filtered = [...currentWorkflows];
  if (type && type !== "All") {
    filtered = filtered.filter(item => item.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (priority && priority !== "All") {
    filtered = filtered.filter(item => item.priority === priority);
  }
  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

// POST /api/ams/workflows/:id/action
router.post("/workflows/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, comments } = req.body;
  
  const itemIndex = currentWorkflows.findIndex(w => w.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: "Workflow item not found" });
  }

  const item = currentWorkflows[itemIndex];
  item.status = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Escalated";
  item.decisionHistory.unshift({
    timestamp: "Just now",
    actor: "Tony / Head of AMS",
    action: `Action: ${action.toUpperCase()} - ${comments || "Action authorized via AMS Hub"}`
  });

  res.json({
    success: true,
    message: `Workflow ${id} successfully marked as ${item.status}`,
    data: item
  });
});

// GET /api/ams/experience
router.get("/experience", (req, res) => {
  res.json({
    success: true,
    data: currentExperience
  });
});

// POST /api/ams/experience/simulate
router.post("/experience/simulate", (req, res) => {
  const { scenario } = req.body;
  // Simulates a live agentic auto-triage stream
  const simulationResult = {
    scenario: scenario || "Kafka Partition Storm & Auto-Scale",
    steps: [
      "Telemetry Ingestion Anomaly Detected: Dynatrace Davis AI flagged partition 4 consumer lag",
      "RCA Synthesizer Correlated Logs: Isolated consumer group thread stall; root cause matched Pattern #881",
      "Safety & Governance Guardrail Verified: Policy #GOV-901 checked: Non-destructive scale pre-approved",
      "Kubernetes Operator Executed Pod Scale: Consumer pods scaled from 6 to 12. Partition rebalanced",
      "Post-Remediation Verification Passed: Lag reduced to 1,240 messages (< 10k threshold). SLA preserved"
    ],
    outcome: "Incident prevented before customer impact. MTTD: 0.4s | MTTR: 4.8s",
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: simulationResult,
    simulation: simulationResult
  });
});

// POST /api/ams/experience/models/:id/subscription
router.post("/experience/models/:id/subscription", (req, res) => {
  const { id } = req.params;
  const model = currentExperience.models.find(m => m.id === id);
  if (!model) {
    return res.status(404).json({ success: false, message: "Model not found" });
  }
  model.subscribed = !model.subscribed;
  res.json({
    success: true,
    message: `Model ${id} subscription status updated to ${model.subscribed}`,
    data: model
  });
});

export default router;
