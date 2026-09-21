/**
 * Mock Data for TAB 2 — Workflow Inbox (PRD §5.2)
 * Active Persona: Product Manager — AI for AD (Autonomous Driving)
 * Decision Cockpit: 9 PRD Items across 3 Decision Lanes
 */

export const INBOX_CATEGORIES = [
  { id: 'approval', label: 'Approvals', icon: 'CheckCircle2', count: 1, hasCritical: true },
  { id: 'review', label: 'Reviews', icon: 'Eye', count: 1, hasCritical: false },
  { id: 'exception', label: 'Exceptions', icon: 'AlertTriangle', count: 1, hasCritical: true },
  { id: 'recommendation', label: 'Recommendations', icon: 'Lightbulb', count: 1, hasCritical: false },
  { id: 'action', label: 'Assigned Actions', icon: 'Pin', count: 1, hasCritical: false },
  { id: 'escalation', label: 'Escalations', icon: 'AlertOctagon', count: 1, hasCritical: true },
  { id: 'governance', label: 'Governance Decisions', icon: 'Landmark', count: 1, hasCritical: false },
  { id: 'alert', label: 'System Alerts', icon: 'Bell', count: 1, hasCritical: false },
  { id: 'agent-output', label: 'Agent Outputs', icon: 'Bot', count: 1, hasCritical: false },
];

export const INBOX_ITEMS = [
  // =========================================================================
  // ITEM 1 · Approval · Critical Lane
  // =========================================================================
  {
    id: 'inbox-1',
    itemType: 'approval',
    typeLabel: 'Approval',
    lane: 'critical',
    title: 'Approve ASIL-D exception request — Radar-Vision Fusion timeout threshold',
    priority: 'Critical',
    riskLevel: 'High',
    priorityPill: 'Critical / High Risk',
    requestor: 'Systems Safety Engineering — M. Weber',
    requestorType: 'human',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Approve or reject a temporary ASIL-D timeout threshold exception (25ms → 35ms) for Balocco test track batch #71029.',
    dueDate: 'Today',
    dueBadgeType: 'critical',
    dueCountdownHours: 4,
    supportingEvidence: [
      { name: 'HIL Test Bench #4 Report — 96% Pass Rate', type: 'doc', format: 'PDF', size: '2.4 MB' },
      { name: 'Balocco Weather Log — Sensor Rig 3 telemetry', type: 'telemetry', format: 'CSV', size: '18 MB' },
      { name: 'ISO 26262 Part 4 Clause 7 Carve-Out Risk Analysis', type: 'compliance', format: 'PDF', size: '1.1 MB' }
    ],
    aiRecommendation: {
      action: 'Approve with 30-Day Monitoring Condition',
      rationale: 'Variance is within historical automotive tolerance (±4.2ms). Radar Doppler reflections remain consistent across all 14 frame points. Dual-key co-signature by Dr. Marco V. is pre-attached.',
      confidence: 0.94,
      model: 'Claude 3.5 Sonnet'
    },
    decisionHistory: [
      { date: 'Initial Submission', note: 'First submission by M. Weber — no prior rejection history on this parameter.' }
    ],
    auditTrail: [
      { timestamp: '2 days ago · 14:22 CET', actor: 'M. Weber (Systems Safety)', action: 'Exception ticket created following Balocco Track Bench #4 run' },
      { timestamp: 'Yesterday · 10:15 CET', actor: 'Dr. Marco V. (Safety Lead)', action: 'Preliminary safety review completed; counter-signature appended' },
      { timestamp: 'Today · 08:30 CET', actor: 'Workflow Engine', action: 'Routed to Product Manager inbox with Critical Gated priority' }
    ],
    actions: [
      { id: 'approve_gated', label: 'Approve Exception (Gated)', variant: 'primary-danger', requiresDualKey: true },
      { id: 'reject', label: 'Reject', variant: 'danger' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'delegate', label: 'Delegate', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 2 · Review · Standard Lane
  // =========================================================================
  {
    id: 'inbox-2',
    itemType: 'review',
    typeLabel: 'Review',
    lane: 'standard',
    title: 'Review AI-drafted requirement — Trajectory Planner edge-case handling',
    priority: 'Medium',
    riskLevel: 'Medium',
    priorityPill: 'Medium / Medium Risk',
    requestor: 'Requirements Engine (AI)',
    requestorType: 'agent',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Confirm wording as-is for Euro NCAP 2026 evasive maneuver compliance, or send back to Requirements Engine for revision.',
    dueDate: '2 days',
    dueBadgeType: 'neutral',
    dueCountdownHours: 48,
    supportingEvidence: [
      { name: 'Linked Specification Doc AD-108 Rev. 6', type: 'spec', format: 'DOCX', size: '840 KB' },
      { name: 'Euro NCAP 2026 Scenario Protocol v3.4', type: 'compliance', format: 'PDF', size: '3.2 MB' },
      { name: 'INVEST Quality Score Audit (91/100)', type: 'eval', format: 'JSON', size: '42 KB' }
    ],
    aiRecommendation: {
      action: 'Confirm Wording As-Is',
      rationale: 'Wording is unambiguous, satisfies Gherkin syntax rules, and passes all 6 INVEST criteria with 99.4% ISO 26262 traceability mapping.',
      confidence: 0.96,
      model: 'Requirements Review Agent'
    },
    decisionHistory: [
      { date: 'Initial Synthesis', note: 'First automated draft generated from Euro NCAP Protocol delta notes.' }
    ],
    auditTrail: [
      { timestamp: 'Today · 08:02 CET', actor: 'Requirements Engine (AI)', action: 'Automated requirement synthesis triggered from Jira Epic AD-108' },
      { timestamp: 'Today · 08:05 CET', actor: 'INVEST Auditor Bot', action: 'Passed automated quality gate with score 91/100; routed to PM' }
    ],
    actions: [
      { id: 'confirm_wording', label: 'Confirm Wording As-Is', variant: 'primary' },
      { id: 'send_back', label: 'Send Back for Revision', variant: 'secondary' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'delegate', label: 'Delegate', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 3 · Exception · Critical Lane
  // =========================================================================
  {
    id: 'inbox-3',
    itemType: 'exception',
    typeLabel: 'Exception',
    lane: 'critical',
    title: 'HIL Simulation Coverage below threshold — 86% vs. 90% required, Release 4.2',
    priority: 'Critical',
    riskLevel: 'High',
    priorityPill: 'Critical / High Risk',
    requestor: 'Release Readiness Monitor (System)',
    requestorType: 'system',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Accept the coverage exception with a 24h Balocco track mitigation plan, or block the Release Candidate 2 (RC2) milestone.',
    dueDate: 'Today',
    dueBadgeType: 'critical',
    dueCountdownHours: 6,
    supportingEvidence: [
      { name: 'HIL Coverage Gap Analysis & Uncovered Corner Cases', type: 'doc', format: 'PDF', size: '4.8 MB' },
      { name: 'Sprint 40-42 Coverage Progression Report (78% → 82% → 86%)', type: 'eval', format: 'HTML', size: '1.2 MB' },
      { name: 'Balocco Physical Track Test Reservation #BT-902', type: 'schedule', format: 'CAL', size: '15 KB' }
    ],
    aiRecommendation: {
      action: 'Conditional Accept with Mitigation',
      rationale: 'Remaining 4% coverage gap covers low-speed (<15 km/h) parking edge cases. Critical highway pilot boundaries (50-130 km/h) are 100% verified. Accepting unblocks RC2 without compromising safety.',
      confidence: 0.91,
      model: 'Release Readiness AI'
    },
    decisionHistory: [
      { date: 'Sprint 41 Review', note: 'Engineering team committed to reaching 90% in Sprint 42; closed at 86% due to hardware bench maintenance downtime.' }
    ],
    auditTrail: [
      { timestamp: 'Sprint 40', actor: 'HIL Daemon', action: 'Simulation coverage recorded at 78%' },
      { timestamp: 'Sprint 41', actor: 'HIL Daemon', action: 'Simulation coverage advanced to 82%' },
      { timestamp: 'Yesterday · 18:00 CET', actor: 'Release Readiness Monitor', action: 'Sprint 42 closed at 86% (4% below threshold); escalated to PM' }
    ],
    actions: [
      { id: 'accept_mitigation', label: 'Accept with Mitigation', variant: 'primary-warning' },
      { id: 'block_release', label: 'Block Release', variant: 'danger' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'escalate', label: 'Escalate to VP', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 4 · Recommendation · Standard Lane
  // =========================================================================
  {
    id: 'inbox-4',
    itemType: 'recommendation',
    typeLabel: 'Recommendation',
    lane: 'standard',
    title: 'Reprioritize backlog — move AD-108 Radar Fusion fix ahead of AD-115 Lane Keep Enhancement',
    priority: 'High',
    riskLevel: 'Low',
    priorityPill: 'High Priority / Low Risk',
    requestor: 'Backlog AI Engine',
    requestorType: 'agent',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Accept or reject the automated reprioritization of Sprint 43 backlog items in Jira.',
    dueDate: '3 days',
    dueBadgeType: 'neutral',
    dueCountdownHours: 72,
    supportingEvidence: [
      { name: 'Cross-Team Dependency Impact Analysis (Graph Viz)', type: 'graph', format: 'PNG', size: '640 KB' },
      { name: '€80,000 Milestone Value Pull-Forward Calculation', type: 'finance', format: 'XLSX', size: '120 KB' }
    ],
    aiRecommendation: {
      action: 'Accept Reprioritization',
      rationale: 'Unblocks 2 downstream teams (Perception and Safety Gatekeeper) 4 business days earlier, pulling forward €80,000 in milestone achievement revenue.',
      confidence: 0.95,
      model: 'Backlog AI Optimization Engine'
    },
    decisionHistory: [
      { date: 'Initial Computation', note: 'Calculated during automated overnight backlog dependency sweep.' }
    ],
    auditTrail: [
      { timestamp: 'Today · 06:14 CET', actor: 'Backlog AI Engine', action: 'Nightly dependency graph traversal detected critical path unblock opportunity' },
      { timestamp: 'Today · 06:15 CET', actor: 'Jira Cloud Bridge', action: 'Drafted Sprint 43 ranking proposal and routed to PM inbox' }
    ],
    actions: [
      { id: 'accept_reprioritize', label: 'Accept Reprioritization', variant: 'primary' },
      { id: 'reject', label: 'Reject', variant: 'secondary' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'delegate', label: 'Delegate', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 5 · Assigned Action · Standard Lane
  // =========================================================================
  {
    id: 'inbox-5',
    itemType: 'action',
    typeLabel: 'Assigned Action',
    lane: 'standard',
    title: 'Complete ASIL-D Compliance Review checklist',
    priority: 'High',
    riskLevel: 'Medium',
    priorityPill: 'High Priority / Medium Risk',
    requestor: 'Governance Office',
    requestorType: 'human',
    project: 'L2+ Autonomous Systems Portfolio (Portfolio-Wide)',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Complete, verify, and submit the 12-item quarterly ASIL-D compliance audit checklist.',
    dueDate: '5 days',
    dueBadgeType: 'neutral',
    dueCountdownHours: 120,
    supportingEvidence: [
      { name: 'Quarterly ASIL-D Compliance Review Template v2026.3', type: 'doc', format: 'PDF', size: '920 KB' },
      { name: 'Last Quarter (Q4) Signed Audit Submission Record', type: 'audit', format: 'PDF', size: '1.4 MB' },
      { name: 'Automated Telemetry Audit Pre-Fill Data (3 items)', type: 'telemetry', format: 'JSON', size: '54 KB' }
    ],
    aiRecommendation: {
      action: 'Complete & Submit Checklist',
      rationale: '3 of the 12 checklist items are already auto-verified via live platform telemetry. Review items 4 through 12 and sign off before the Friday cutoff.',
      confidence: 0.98,
      model: 'Governance Compliance Bot'
    },
    decisionHistory: [
      { date: '90 Days Ago', note: 'Q4 compliance review submitted on time with 100% sign-off.' }
    ],
    auditTrail: [
      { timestamp: '14 days ago', actor: 'Governance Office', action: 'Initial reminder dispatched to all Portfolio PMs' },
      { timestamp: '7 days ago', actor: 'Governance Office', action: 'Follow-up notice dispatched' },
      { timestamp: 'Yesterday · 09:00 CET', actor: 'Governance Office', action: 'Final 5-day warning escalation logged to Workflow Inbox' }
    ],
    actions: [
      { id: 'complete_checklist', label: 'Complete & Submit Checklist', variant: 'primary' },
      { id: 'delegate_safety', label: 'Delegate to Safety Lead', variant: 'secondary' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 6 · Escalation · Critical Lane
  // =========================================================================
  {
    id: 'inbox-6',
    itemType: 'escalation',
    typeLabel: 'Escalation',
    lane: 'critical',
    title: 'Supplier LiDAR SDK delay — needs PM decision on mitigation path',
    priority: 'Critical',
    riskLevel: 'High',
    priorityPill: 'Critical / High Risk',
    requestor: 'Dependency & Risk Engine',
    requestorType: 'agent',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Choose mitigation path: 1. Deploy Synthetic Emulator, 2. Accept 3-day schedule slip, 3. Escalate to Supplier Executive.',
    dueDate: 'Tomorrow',
    dueBadgeType: 'warning',
    dueCountdownHours: 24,
    supportingEvidence: [
      { name: 'Supplier Formal Delay Notification Letter (LiDAR v3.2)', type: 'letter', format: 'PDF', size: '320 KB' },
      { name: 'Epic Impact Analysis (2 Sprints Blocked: Perception & Planner)', type: 'doc', format: 'PDF', size: '1.8 MB' },
      { name: 'Synthetic Emulator Qualification Dossier (91.4% Fidelity)', type: 'compliance', format: 'PDF', size: '2.1 MB' }
    ],
    aiRecommendation: {
      action: 'Apply Synthetic Emulator Mitigation',
      rationale: 'Synthetic Emulator Agent achieves 91.4% hardware point-cloud fidelity, unblocking 14 perception engineers immediately and avoiding the 3-day milestone slip.',
      confidence: 0.92,
      model: 'Dependency & Risk AI Engine'
    },
    decisionHistory: [
      { date: 'Yesterday', note: 'Supplier notified engineering team of a 72-hour firmware flash delay.' }
    ],
    auditTrail: [
      { timestamp: 'Yesterday · 16:30 CET', actor: 'Supplier Interface Daemon', action: 'Supplier SDK release v3.2 delayed notification ingested' },
      { timestamp: 'Yesterday · 17:00 CET', actor: 'Dependency & Risk Engine', action: 'Computed 3-day schedule slip across 2 core epics' },
      { timestamp: 'Today · 09:30 CET', actor: 'Engineering Lead', action: 'Escalated mitigation choice to Product Manager inbox' }
    ],
    actions: [
      { id: 'choose_mitigation', label: 'Choose Mitigation Path', variant: 'primary-warning' },
      { id: 'escalate_supplier', label: 'Escalate to Supplier Exec', variant: 'secondary' },
      { id: 'request_evidence', label: 'Request More Evidence', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 7 · Governance Decision · Standard Lane
  // =========================================================================
  {
    id: 'inbox-7',
    itemType: 'governance',
    typeLabel: 'Governance Decision',
    lane: 'standard',
    title: 'Approve updated ASIL-D exception-handling policy for AI-generated code review',
    priority: 'High',
    riskLevel: 'Medium',
    priorityPill: 'High Priority / Medium Risk',
    requestor: 'Legal & Compliance',
    requestorType: 'human',
    project: 'L2+ Autonomous Systems Portfolio (Portfolio-Wide)',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Approve, reject, or request changes to the revised ASIL-D exception-handling policy draft (v2).',
    dueDate: '6 days',
    dueBadgeType: 'neutral',
    dueCountdownHours: 144,
    supportingEvidence: [
      { name: 'Policy Draft v2 (Revised Corporate Handbook Rev. 2026.3)', type: 'policy', format: 'PDF', size: '1.6 MB' },
      { name: 'Redline Comparison Matrix: Draft v1 vs. Draft v2', type: 'diff', format: 'PDF', size: '780 KB' },
      { name: 'ISO 26262 Part 6 Software Safety Clause Cross-Reference', type: 'compliance', format: 'PDF', size: '2.5 MB' }
    ],
    aiRecommendation: {
      action: 'Approve Policy Draft v2',
      rationale: 'Zero conflicts detected with existing ISO 26262 gating criteria. Revision addresses all 4 objections raised during the v1 rejection 30 days ago.',
      confidence: 0.97,
      model: 'Policy & Regulatory Alignment Engine'
    },
    decisionHistory: [
      { date: '30 Days Ago', note: 'Policy Draft v1 was rejected by PM Council due to overly restrictive dual-key requirements on low-risk unit tests.' }
    ],
    auditTrail: [
      { timestamp: '30 days ago', actor: 'PM Council', action: 'Draft v1 rejected with 4 revision requests' },
      { timestamp: '3 days ago', actor: 'Legal & Compliance', action: 'Draft v2 authored incorporating PM Council feedback' },
      { timestamp: 'Yesterday · 14:00 CET', actor: 'Governance Office', action: 'Routed to Product Manager for formal ratification' }
    ],
    actions: [
      { id: 'approve_policy', label: 'Approve Policy Draft', variant: 'primary' },
      { id: 'request_changes', label: 'Request Policy Changes', variant: 'secondary' },
      { id: 'reject', label: 'Reject', variant: 'danger' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 8 · System-Generated Alert · FYI Lane
  // =========================================================================
  {
    id: 'inbox-8',
    itemType: 'alert',
    typeLabel: 'System Alert',
    lane: 'fyi',
    title: 'Model drift detected — VisionTransformer v2, confidence trending down 3% this week',
    priority: 'Medium',
    riskLevel: 'Medium',
    priorityPill: 'Medium Priority / Monitoring Only',
    requestor: 'Monitoring System (MLOps)',
    requestorType: 'system',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'No immediate gate decision required. Awareness only; auto-escalates to Critical if drift passes -5.0%.',
    dueDate: 'Ongoing',
    dueBadgeType: 'info',
    dueCountdownHours: 999,
    supportingEvidence: [
      { name: '7-Day Confidence Drift Telemetry Trend (Balocco Rainy Conditions)', type: 'chart', format: 'JSON', size: '82 KB' },
      { name: 'Confusion Matrix & IoU Spread Comparison (v2.4.1 vs v2.4.0)', type: 'eval', format: 'HTML', size: '450 KB' }
    ],
    aiRecommendation: {
      action: 'Acknowledge & Continue Monitoring',
      rationale: 'Confidence trend remains within acceptable boundary (0.94 → 0.91). Model continues to comfortably exceed 0.85 pass threshold. No immediate retraining trigger.',
      confidence: 0.93,
      model: 'Model Telemetry Sentinel'
    },
    decisionHistory: [
      { date: 'Initial Baseline', note: 'Baseline established on Monday at 0.94 average IoU confidence.' }
    ],
    auditTrail: [
      { timestamp: 'Monday · 00:00 CET', actor: 'MLOps Telemetry', action: 'Weekly baseline established at 0.94 IoU' },
      { timestamp: 'Wednesday · 12:00 CET', actor: 'Monitoring System', action: 'First -1.5% drift detected during wet track testing' },
      { timestamp: 'Today · 06:00 CET', actor: 'Monitoring System', action: '-3.0% cumulative threshold crossed; automated FYI advisory logged' }
    ],
    actions: [
      { id: 'acknowledge', label: 'Acknowledge & Monitor', variant: 'primary-neutral' },
      { id: 'set_threshold', label: 'Set Custom Alert Threshold', variant: 'secondary' },
      { id: 'escalate_mlops', label: 'Escalate to MLOps', variant: 'secondary' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  },

  // =========================================================================
  // ITEM 9 · Agent-Generated Output · Standard Lane
  // =========================================================================
  {
    id: 'inbox-9',
    itemType: 'agent-output',
    typeLabel: 'Agent Output',
    lane: 'standard',
    title: 'Fusion Confidence Scorer Agent flagged Execution #AD-71029 as borderline (0.79–0.81 range)',
    priority: 'Medium',
    riskLevel: 'Medium',
    priorityPill: 'Medium Priority / Human-on-the-Loop',
    requestor: 'Fusion Confidence Scorer Agent',
    requestorType: 'agent',
    project: 'Release 4.2 Program',
    portfolio: 'L2+ Autonomous Systems Portfolio',
    requiredDecision: 'Confirm the agent’s Pass classification, or override to Fail for manual bench review.',
    dueDate: '2 days',
    dueBadgeType: 'neutral',
    dueCountdownHours: 48,
    supportingEvidence: [
      { name: 'Execution #AD-71029 Full Telemetry Trace (Identical to Level 6)', type: 'telemetry', format: 'LOG', size: '1.2 MB' },
      { name: 'Sensor Rig 3 Raw Frame Data (Maserati Grecale Prototype #12)', type: 'sensor', format: 'RAW', size: '45 MB' },
      { name: 'Doppler Velocity Alignment Log (0.02 m/s variance)', type: 'audit', format: 'CSV', size: '180 KB' }
    ],
    aiRecommendation: {
      action: 'Confirm Agent Pass Classification',
      rationale: 'Score of 0.81 is above minimum safety threshold (0.78). Disparity depth is verified at 48.2m against ground truth (48.5m). No anomaly pattern identified in Doppler radar return.',
      confidence: 0.95,
      model: 'Fusion Confidence Scorer Agent'
    },
    decisionHistory: [
      { date: 'Initial Run', note: 'Batch #71029 generated today at 09:14 CET on Balocco Test Track B.' }
    ],
    auditTrail: [
      { timestamp: 'Today · 09:14:22 CET', actor: 'Sensor Rig 3 (Vehicle 12)', action: 'Telemetry frame captured at 112.4 km/h' },
      { timestamp: 'Today · 09:14:22.842 CET', actor: 'Fusion Confidence Scorer', action: 'Borderline IoU confidence (0.81) flagged for human verification' },
      { timestamp: 'Today · 09:15:00 CET', actor: 'Workflow Engine', action: 'Routed to Product Manager inbox for final verification' }
    ],
    actions: [
      { id: 'confirm_pass', label: 'Confirm Agent Pass', variant: 'primary' },
      { id: 'override_fail', label: 'Override to Fail / Review', variant: 'danger' },
      { id: 'inspect_level6', label: 'Inspect in Dashboard Level 6', variant: 'primary-action' },
      { id: 'view_audit', label: 'View Audit Trail', variant: 'tertiary' }
    ]
  }
];
