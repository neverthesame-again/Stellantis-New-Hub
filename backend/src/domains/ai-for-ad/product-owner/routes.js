import express from "express";
import { adDashboardData } from "./mockData.js";

const router = express.Router();

// In-memory state for interactive mock workflows
let currentDashboardData = JSON.parse(JSON.stringify(adDashboardData));

/**
 * GET /api/ad/status
 * Health check endpoint for AD domain
 */
router.get("/status", (req, res) => {
  res.json({
    domain: "AI for AD",
    persona: "Carl Weber - Product Owner",
    owner: "Product Owner",
    message: "AI for AD API route registered and active.",
    status: "healthy"
  });
});

/**
 * GET /api/ad/dashboard
 * Returns complete 8-card dashboard dataset
 */
router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    data: currentDashboardData
  });
});

/**
 * POST /api/ad/simulate-release
 * Simulates waiver of HIL 90% threshold for Balocco track test
 */
router.post("/simulate-release", (req, res) => {
  const { grantWaiver, injectSyntheticData } = req.body;

  let simulatedScore = 91;
  if (grantWaiver) simulatedScore += 3;
  if (injectSyntheticData) simulatedScore += 2;

  currentDashboardData.releaseReadiness.overallScore = simulatedScore;
  currentDashboardData.releaseReadiness.status = simulatedScore >= 95 ? "Full Go (Simulated)" : "Conditional Go";
  currentDashboardData.releaseReadiness.statusType = simulatedScore >= 95 ? "success" : "high";

  res.json({
    success: true,
    simulatedScore,
    status: currentDashboardData.releaseReadiness.status,
    message: `Release simulated with score ${simulatedScore}% (${currentDashboardData.releaseReadiness.status})`
  });
});

/**
 * POST /api/ad/auto-enhance-backlog
 * Enhances US-389 with missing rain condition edge case
 */
router.post("/auto-enhance-backlog", (req, res) => {
  currentDashboardData.requirementQuality.storyDoctor.enhanced = true;
  currentDashboardData.requirementQuality.investScore = 97;
  currentDashboardData.requirementQuality.status = "INVEST: 97/100 (Enhanced)";

  res.json({
    success: true,
    investScore: 97,
    enhancedStory: currentDashboardData.requirementQuality.storyDoctor.targetStory,
    message: "US-389 successfully enhanced with Given-When-Then rain scenario."
  });
});

/**
 * POST /api/ad/apply-mitigation
 * Toggles synthetic emulator mitigation for supplier delay
 */
router.post("/apply-mitigation", (req, res) => {
  const currentlyApplied = currentDashboardData.dependencyRisk.mitigationApplied;
  currentDashboardData.dependencyRisk.mitigationApplied = !currentlyApplied;
  currentDashboardData.dependencyRisk.blockerActive = currentlyApplied;

  const nodeStatus = !currentlyApplied ? "Mitigated (Synthetic Stream)" : "Blocked";
  const nodeColor = !currentlyApplied ? "#10b981" : "#ef4444";

  currentDashboardData.dependencyRisk.nodes[2].status = nodeStatus;
  currentDashboardData.dependencyRisk.nodes[2].color = nodeColor;

  res.json({
    success: true,
    mitigationApplied: currentDashboardData.dependencyRisk.mitigationApplied,
    message: !currentlyApplied
      ? "Synthetic LiDAR Emulator active: Physical hardware delay bypassed."
      : "Mitigation detached: Physical hardware blocker reinstated."
  });
});

export default router;
