/**
 * Mock Data: AI for AD (Automated Development)
 * Domain: AI for AD
 * Persona: Product Owner (Autonomous Driving)
 * Single Source of Truth for AD Dashboard, Workflow Inbox, and Experience Zone.
 */

export const adDashboardData = {
  persona: {
    name: "Carl Weber",
    title: "Product Owner • AI for AD",
    domain: "AI for AD",
    platform: "AD-PO",
    shift: "Sprint 42 Backlog Refinement | Active",
    shiftProgress: "42%",
    epicReadiness: "92%",
    sprintCapacity: "88%",
    engineStatus: "LIVE"
  },

  // CARD 1: PRODUCT ROADMAP HORIZON
  roadmapHorizon: {
    status: "On Track (94% AI Confidence)",
    statusType: "success",
    activeSwimlane: "All",
    horizons: [
      {
        id: "now",
        title: "NOW (Sprints 42–43)",
        subtitle: "Active Sprint Commitments",
        items: [
          {
            id: "AD-104",
            title: "4D Radar-Vision Fusion Clustering",
            swimlane: "L2+ Perception",
            confidence: 4, // 4-bar confidence
            status: "In Progress",
            badgeClass: "badge-info",
            hasRiskRibbon: false
          },
          {
            id: "AD-108",
            title: "Highway Trajectory Planner (LiDAR Dependency)",
            swimlane: "Sensor Fusion",
            confidence: 2, // At risk
            status: "At Risk",
            badgeClass: "badge-high",
            hasRiskRibbon: true,
            riskDescription: "Propagates risk to Sprint 43 Path Planning"
          },
          {
            id: "AD-110",
            title: "ASIL-D Fail-Operational Braking Supervisor",
            swimlane: "Safety Control",
            confidence: 4,
            status: "Validated",
            badgeClass: "badge-success",
            hasRiskRibbon: false
          }
        ]
      },
      {
        id: "next",
        title: "NEXT (Q4 2026)",
        subtitle: "Euro NCAP 2026 Track Certification",
        items: [
          {
            id: "AD-201",
            title: "Vision Transformer v2 (BEV Fusion)",
            swimlane: "L2+ Perception",
            confidence: 3,
            status: "Refinement",
            badgeClass: "badge-purple",
            hasRiskRibbon: false
          },
          {
            id: "AD-204",
            title: "Continental ARS548 HD Radar Integration",
            swimlane: "Sensor Fusion",
            confidence: 3,
            status: "Sprint 44 Validation",
            badgeClass: "badge-info",
            hasRiskRibbon: false
          },
          {
            id: "AD-208",
            title: "Dual-Channel Steer-by-Wire Redundancy",
            swimlane: "Safety Control",
            confidence: 4,
            status: "Validation",
            badgeClass: "badge-success",
            hasRiskRibbon: false
          }
        ]
      },
      {
        id: "later",
        title: "LATER (2027 Scale)",
        subtitle: "L3 Hands-Off Highway Pilot",
        items: [
          {
            id: "AD-308",
            title: "4D Occupancy Grid & Neural Path Prediction",
            swimlane: "L2+ Perception",
            confidence: 3,
            status: "Architecture",
            badgeClass: "badge-navy",
            hasRiskRibbon: false
          },
          {
            id: "AD-305",
            title: "All-Weather Solid-State LiDAR Clustering",
            swimlane: "Sensor Fusion",
            confidence: 2,
            status: "Scale Phase",
            badgeClass: "badge-navy",
            hasRiskRibbon: false
          },
          {
            id: "AD-301",
            title: "STLA AutoDrive L3 Hands-Off Highway Pilot",
            swimlane: "Safety Control",
            confidence: 2,
            status: "R&D Architecture",
            badgeClass: "badge-navy",
            hasRiskRibbon: false
          }
        ]
      }
    ]
  },

  // CARD 2: BACKLOG HEALTH
  backlogHealth: {
    status: "Backlog Flow: Healthy",
    statusType: "success",
    funnel: [
      { stage: "RAW", count: 14, conversionRate: "85%", avgAgingDays: "1.2d", desc: "Raw Ingested Specs" },
      { stage: "DRAFT", count: 8, conversionRate: "78%", avgAgingDays: "2.4d", desc: "AI Synthesized Stories" },
      { stage: "GHERKIN", count: 18, conversionRate: "92%", avgAgingDays: "0.8d", desc: "Given-When-Then AC" },
      { stage: "READY", count: 28, storyPoints: 92, conversionRate: "100%", avgAgingDays: "0.3d", desc: "Ready for Sprint Pull" }
    ],
    unrefinedCount: 4,
    unrefinedNote: "4 unrefined stories remaining in Sprint 43 hopper"
  },

  // CARD 3: FEATURE STATUS
  featureStatus: {
    status: "Sprint 42: Active",
    statusType: "info",
    committedStoryPoints: 64,
    burnedStoryPoints: 42,
    completionForecast: "Thu Oct 16 – Mon Oct 20 (94% Conf)",
    epics: [
      {
        id: "AD-104",
        title: "Radar-Vision Fusion Clustering",
        progress: 78,
        spentSp: 18,
        totalSp: 22,
        status: "Optimal",
        badgeClass: "badge-success",
        lead: "Perception Core Team",
        trend: "▲ +12% this sprint"
      },
      {
        id: "AD-108",
        title: "Highway Trajectory Planner",
        progress: 45,
        spentSp: 14,
        totalSp: 30,
        status: "At Risk",
        badgeClass: "badge-high",
        lead: "Trajectory Planning Group",
        trend: "Delayed 3d (LiDAR SDK)"
      },
      {
        id: "AD-112",
        title: "Low-Light Pedestrian Detection",
        progress: 92,
        spentSp: 24,
        totalSp: 26,
        status: "Verification",
        badgeClass: "badge-info",
        lead: "Vision AI Team",
        trend: "Ready for HIL bench"
      }
    ]
  },

  // CARD 4: BUSINESS VALUE REALIZATION
  businessValue: {
    status: "+32% Ahead of Plan",
    statusType: "success",
    realizedValueEur: 940000,
    targetValueEur: 1480000,
    progressPercentage: 63.5,
    scheduleVariance: "+32% Ahead of Plan",
    paceCurve: [
      { week: "W1", planned: 80, actual: 95 },
      { week: "W2", planned: 170, actual: 210 },
      { week: "W3", planned: 290, actual: 360 },
      { week: "W4", planned: 420, actual: 520 },
      { week: "W5", planned: 580, actual: 710 },
      { week: "W6", planned: 760, actual: 940 }
    ],
    cycleTime: {
      medianDrop: "21.0d → 6.4d",
      percentageDrop: "-69.5%",
      distribution: [
        { bucket: "< 3 days", percentage: 42, count: 28, color: "#10b981" },
        { bucket: "3–7 days", percentage: 38, count: 25, color: "#3b82f6" },
        { bucket: "7–14 days", percentage: 14, count: 9, color: "#f59e0b" },
        { bucket: "> 14 days", percentage: 6, count: 4, color: "#ef4444" }
      ]
    }
  },

  // CARD 5: RELEASE READINESS
  releaseReadiness: {
    status: "Conditional Go",
    statusType: "high",
    candidateTag: "RC_v3.4.0-rc2_EuroNCAP",
    overallScore: 91,
    progressionBars: [
      { day: "D-4", score: 76 },
      { day: "D-3", score: 81 },
      { day: "D-2", score: 85 },
      { day: "D-1", score: 88 },
      { day: "Today", score: 91 }
    ],
    checklist: [
      {
        id: "asil-d",
        name: "ASIL-D Safety Verification",
        status: "PASS",
        badgeClass: "badge-success",
        details: "Deterministic braking trajectory verified in Balocco loop",
        isPass: true
      },
      {
        id: "hil-coverage",
        name: "HIL Simulation Test Coverage",
        status: "86% / 90% Threshold",
        badgeClass: "badge-high",
        details: "Amber alert — Nightly regression rerun scheduled for 16:00 CET",
        isPass: false
      },
      {
        id: "orin-latency",
        name: "NVIDIA DRIVE Orin SoC Latency",
        status: "11.4ms / 15.0ms Budget",
        badgeClass: "badge-success",
        details: "TensorRT INT8 optimized runtime headroom confirmed",
        isPass: true
      },
      {
        id: "fleet-km",
        name: "Virtual Fleet Kilometers",
        status: "12,400 km Verified",
        badgeClass: "badge-success",
        details: "Synthetic sensor injection passing zero-collision gates",
        isPass: true
      }
    ]
  },

  // CARD 6: REQUIREMENT QUALITY & AI STORY DOCTOR
  requirementQuality: {
    status: "INVEST: 93/100",
    statusType: "success",
    investScore: 93,
    indices: [
      { name: "CLARITY", score: 94, delta: "▲3.2%", bars: [2, 3, 4, 4, 5] },
      { name: "COMPLETENESS", score: 91, delta: "▲2.8%", bars: [2, 3, 3, 4, 5] },
      { name: "TESTABILITY", score: 96, delta: "▲4.1%", bars: [2, 3, 4, 5, 5] }
    ],
    activityFeed: [
      { id: "US-389", title: "US-389: Low-friction ABS edge cases", status: "PO Accepted", badgeType: "success" },
      { id: "US-402", title: "US-402: Camera spray occlusion AC", status: "PO Accepted", badgeType: "success" },
      { id: "US-377", title: "US-377: Pre-fill braking redundancy", status: "Modified & Approved", badgeType: "info" }
    ],
    storyDoctor: {
      alertTitle: "Missing Edge-Case Scenario in US-389",
      targetStory: "US-389: Low-Friction ABS Trigger under Rain Conditions",
      epicId: "AD-104",
      issueDescription: "Given-When-Then criteria omits camera lens glare under torrential rain conditions (>25mm/h).",
      suggestedGherkin: "Given vehicle speed is between 60-100 km/h\nAnd precipitation sensor reads >25mm/h\nWhen camera confidence drops below 0.60\nThen system must fall back to Continental ARS548 radar track within 80ms\nAnd suppress premature emergency braking false alarms.",
      enhanced: false
    }
  },

  // CARD 7: DEPENDENCY & RISK STATUS
  dependencyRisk: {
    blockerActive: true,
    blockerCount: 1,
    mitigationApplied: false,
    nodes: [
      { id: "camera", label: "Camera Driver (v2.1)", status: "Operational", color: "#10b981" },
      { id: "fusion", label: "Radar Fusion (AD-104)", status: "Active", color: "#3b82f6" },
      { id: "planning", label: "Path Planning (AD-108)", status: "Blocked", color: "#ef4444" }
    ],
    blocker: {
      title: "Supplier LiDAR SDK Driver Delay",
      supplier: "Tier-1 Perception Hardware Partner",
      delayDays: 3,
      impact: "Blocks physical HIL bench testing on Rig 2 for AD-108 Trajectory Planner",
      mitigationAction: "Balocco Proving Ground Synthetic LiDAR Ray-Tracing Stream"
    }
  },

  // CARD 8: AI-ASSISTED DELIVERY METRICS
  deliveryMetrics: {
    status: "Efficiency: High",
    statusType: "success",
    kpis: [
      { label: "Velocity Multiplier", value: "+3.8x", sub: "vs manual baseline", color: "#3b82f6" },
      { label: "Hours Saved", value: "482h", sub: "Sprints 40–42", color: "#10b981" },
      { label: "PO Acceptance Rate", value: "94.2%", sub: "Accepted without rewrite", color: "#8b5cf6" },
      { label: "Automated Gherkin AC", value: "86%", sub: "INVEST compliant", color: "#0284c7" }
    ],
    accelerationBreakdown: {
      aiSynthesized: 68,
      humanAuthored: 24,
      hybridRefined: 8
    },
    draftingTimeDrop: {
      before: "3.8 hours",
      after: "14 minutes",
      reduction: "-94%"
    },
    governanceLog: [
      { id: "LOG-409", action: "PO Accepted Gherkin Acceptance Criteria", userStory: "US-402", time: "10:14 CET", actor: "Carl Weber (PO)" },
      { id: "LOG-408", action: "AI Split Epic into 6 Child Stories", userStory: "AD-104", time: "09:30 CET", actor: "Requirements Engine" },
      { id: "LOG-407", action: "PO Overrode Confidence Weighting Threshold", userStory: "US-381", time: "Yesterday", actor: "Carl Weber (PO)" }
    ]
  }
};
