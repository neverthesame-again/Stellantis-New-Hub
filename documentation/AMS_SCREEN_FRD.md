# AI for AMS — Screen Flow, Findings & Feature Requirement Document

> **Status:** Draft for review — nothing here is approved or implemented yet
> **Scope:** The **AI for AMS** domain only (Head of AMS persona)
> **Date:** 28 September 2026
> **Sources:** (1) walkthrough of our AI Hub AMS screens running locally, (2) walkthrough of the reference platform *TCS AI Engineering Studio / Horizon* at `tcscostai.github.io/aiengineering-`

---

## 1. Purpose

This document describes **how the AMS screen works today**, lists **defects and gaps observed during the walkthrough**, and proposes a **feature backlog** for the next phase of AMS development.

It is written to be verified first. It deliberately contains **no implementation detail** — no file names, no technical design, no effort estimates. Those follow once the content here is agreed.

---

## 2. Current AMS flow (as-is)

### 2.1 Entry

```
Login (domain = AI for AMS, role = Head of AMS)
        │
        ▼
Persona banner  →  AMS-OPS · shift · shift progress · SLA health 99.1% · AI resolution 78%
        │
        ▼
Left sidebar  ─────────────────────────────────────────────
   Workspace   : Domain selector · Role selector
   Navigate    : Dashboard · Workflow Inbox (7) · AI Experience Zone
                     └─ Model Catalogue · Agent & Workflows
                        AI Tools Catalogue · My Subscriptions
                        Sandbox Simulation
```

All navigation happens in the sidebar; the pages themselves have no tab bars.

### 2.2 Screen 1 — Dashboard (read-only reporting)

Nine panels, all reporting aggregates:

| Panel | Content |
|---|---|
| Incident volume & severity | P1–P4 counts with SLA targets; auto-resolved count; breach count |
| Mean time to detect & resolve | MTTD 4.2m and MTTR 18.5m against baseline and target |
| Recurring incident clusters | 4 clusters, each with occurrences, affected service and the AI action taken |
| Problem-to-change conversion | Problem records converted into change requests, with target sprint and ROI |
| Automation & AI resolution rate | Deflection, runbook success, human escalation |
| Technical-debt backlog | 4 debt items with story points, owning squad and status |
| Application stability | Per-service uptime against SLA, with 30-day incident counts |
| SLA performance | Attainment per priority, breaches, error budget remaining |
| Productivity & cost reduction | Cost saved YTD, capacity reclaimed, cost per ticket, ROI |

Only two interactive controls exist on this screen: **Review in Inbox** and **Simulate Fix** (three of each, on the problem-to-change cards).

### 2.3 Screen 2 — Workflow Inbox (the only decision surface)

Seven action items across seven types: automation approvals, problem records requiring review, brownfield pipeline initiation, incident pattern recommendations, high-risk remediation, production governance exceptions, feature change requests.

Each item carries: originating agent, source system, project/portfolio, required decision, SLA countdown, AI confidence, and a detail pane with the decision history. Actions available: **Approve & Execute**, **Reject**, **Escalate to CAIO**.

### 2.4 Screen 3 — AI Experience Zone (catalogue)

| Sub-page | Content |
|---|---|
| Model Catalogue | 12 models, facet filters (capability, deployment, cost tier, provider), risk rating, subscribe/unsubscribe, side-by-side comparison, request new model onboarding |
| Agent & Workflows | Registered agents and agentic workflows |
| AI Tools Catalogue | Tools by engineering discipline |
| My Subscriptions | What this persona is subscribed to, and at which grant level |
| Sandbox Simulation | Isolated digital-twin simulation run |

### 2.5 Flow summary

```
  Dashboard              Workflow Inbox            Experience Zone
  (what happened)   →    (decide on it)      →     (what AI assets exist)
      │                       │                          │
      └─── Review in Inbox ───┘                          │
      └─── Simulate Fix ──────────────────────────────────┘
```

**Observation on the flow as a whole:** the three screens are largely independent. Decisions taken in the inbox do not change the dashboard, and the Experience Zone is a catalogue that is not connected to any incident or decision. There is no screen that shows a live, in-progress incident.

---

## 3. Findings (defects & gaps)

Priority: **P1** = blocks or misleads the user · **P2** = clearly wrong or incomplete · **P3** = polish

| ID | Pri | Type | Where noticed | What happens now | What is expected |
|---|---|---|---|---|---|
| AMS-01 | P1 | Bug | Workflow Inbox + sidebar | Approving **WF-INB-101** sets the item to "Approved", but the header still reads **ACTION ITEMS (7)** and the sidebar badge still reads **7** | Counts drop as items are actioned, so the queue reflects work done |
| AMS-02 | P1 | Bug | Dashboard → problem-to-change cards | **Simulate Fix** opens the AI Experience Zone on the **Model Catalogue**, not on **Sandbox Simulation**, so the simulation never opens | The button opens the sandbox, pre-loaded with the problem record it was clicked from |
| AMS-03 | P2 | Bug | Dashboard → problem-to-change cards | **Review in Inbox** opens the inbox list but does not select or filter to the related record; the user has to find it | The related item opens directly |
| AMS-04 | P2 | Gap | Sidebar | The inbox badge (7) and the sub-page badges are fixed numbers, unrelated to live data | Counts are derived from actual data |
| AMS-05 | P2 | Gap | All three screens | If the backend is not running, every screen silently falls back to local sample data with no indication on screen | The user can tell whether figures are live, and sees a clear message when they are not |
| AMS-06 | P2 | Gap | Dashboard ↔ Workflow Inbox | Approving a runbook or remediation changes nothing on the dashboard (automation rate, cluster status, problem records all stay the same) | A decision visibly moves the numbers it should affect |
| AMS-07 | P3 | Bug | Persona banner | The greeting is always **"Good morning"**, whatever the time of day | The greeting matches the time, or is dropped |
| AMS-08 | P3 | UX | Sidebar | Clicking **AI Experience Zone** while already on it collapses its sub-page list, which reads as the pages having disappeared | Collapsing is deliberate and obvious, or only via the chevron |
| AMS-09 | P3 | UX | Workflow Inbox | Actioned items stay in the main list with no separation between open and closed work | Open items are separated from completed ones, with history retained |
| AMS-10 | P3 | UX | Dashboard | Cluster cards state an "AI Action" that was taken, but there is no way to see the run, its evidence or its outcome | Each stated AI action is traceable to what actually ran |

---

## 4. Feature backlog

Each feature: what it is, where it was noticed in the reference platform, what it would show, and why it matters here.

### 4.1 Priority 1 — make AMS operational, not just reportorial

---

#### F-01 · Live Incident War Room

**Noticed in:** reference platform → *AMS Engineering* module → "Active Incident War Room".
There it shows one live P1 (`INC-2024-9102`, Benefits Inquiry API) with MTTR 3 min, confidence 66%, impact High, 1,247 affected users.

**Description.** A single screen for the incident currently being worked, replacing the need to infer state from aggregates.

**What it would contain**
- Incident identity: number, title, severity, affected service, status, opened time
- Live metrics: MTTR so far, confidence, business impact, affected users
- The incident's current stage in the response lifecycle
- The set of agents engaged on it

**Why it matters.** Our dashboard answers "how did last week go?". Nothing answers "what is happening right now?", which is the core question for a Head of AMS. We already hold the underlying material (clusters, problem records, severity, SLA), so this is a presentation and state gap rather than a data gap.

---

#### F-02 · Agent Collaboration Timeline

**Noticed in:** same module, under the war room — a timestamped trail (alert triggered → classified P1 → log correlation across 12 services → historical match found → root cause identified → change recommendation generated), each step attributed to the agent that performed it.

**Description.** A chronological record of what each agent did on an incident, filling in as the response progresses.

**What it would contain**
- One row per step: time, what happened, which agent did it
- Steps appearing progressively rather than all at once
- A visible "in progress" state so the user knows work is ongoing

**Why it matters.** It makes autonomous work legible. Today the dashboard asserts "AI Action: dynamic partition rebalance agent triggered" with no way to see whether it ran, when, or with what result (see AMS-10).

---

#### F-03 · Root Cause & Recommendation with Evidence

**Noticed in:** reference platform → war room panels "Root cause (step 5+)" and "Remediation (step 6)", which stay empty until the response advances and then fill with a stated cause and a recommended action.

**Description.** For each incident, the diagnosed root cause, the evidence behind it, and a concrete recommended remediation the user can act on.

**What it would contain**
- Stated root cause in plain language
- The evidence it rests on (telemetry, logs, change records, known errors)
- A specific recommendation (for example "roll back release X, apply fix Y")
- A decision the user can take on that recommendation, routed to the existing inbox

**Why it matters.** This is the missing link between our dashboard (a cluster exists) and our inbox (approve something). Right now the reasoning between the two is invisible.

---

#### F-04 · Similar-Incident Matching

**Noticed in:** reference platform → war room timeline ("Historical match: INC-2023-4521, 92% similarity") and again in the knowledge graph as a `similar_to` link.

**Description.** For the incident in hand, surface past incidents that resemble it and how they were resolved.

**What it would contain**
- Matched incidents with a similarity score
- What the resolution was, and whether it worked
- The runbook or known-error article that applied

**Why it matters.** Our recurring-cluster data (14 occurrences in 7 days, 19 in 5 days) is exactly this signal, but is presented only as a count. This turns it into reuse.

---

#### F-05 · Agent Onboarding (register an existing agent)

**Noticed in:** reference platform → *Agent Onboarding Studio*, which registers agents built elsewhere (AWS Bedrock, Azure AI Foundry, Python service, container, API endpoint) against a category (AD / AMS / QE) and a workspace.

**Description.** A route for an AMS agent to enter the platform, instead of the catalogue being a fixed list.

**What it would contain**
- Registration capturing purpose, owner, skills, knowledge sources, tools
- The runtime it connects to, and a connection status
- Which portfolio or service it serves

**Why it matters.** Our Agent Catalogue can only be browsed. Nothing can be added to it, so it reads as a brochure rather than an inventory.

---

#### F-06 · Agent Lifecycle States

**Noticed in:** reference platform → onboarding and governance modules, where every agent carries a state (Draft → Configured → Evaluated → Certified → Published) and publishing is what makes it appear elsewhere.

**Description.** An explicit lifecycle for AMS agents, with publishing as the gate.

**What it would contain**
- The stage each agent has reached, shown as a pipeline
- What is required to move to the next stage
- Only published agents appearing in catalogues and operational views

**Why it matters.** Our catalogue shows a "Risk Rating" with nothing behind it. A lifecycle gives that rating a basis and gives governance something to govern.

---

#### F-07 · Agent Runtime View

**Noticed in:** reference platform → *Agent Runtime*: CPU 56%, memory 85%, throughput 1,440/min, error rate 0.02%, plus per-agent readiness, skills, tools and reuse count.

**Description.** An operational view of which AMS agents are actually running.

**What it would contain**
- Per-agent status, last run, invocation volume, failures
- Platform-level health indicators
- A way to pause or retire a misbehaving agent

**Why it matters.** We show what is *available* to subscribe to, never what is *running*. For an operations persona that is the wrong half.

---

### 4.2 Priority 2 — operating discipline

---

#### F-08 · Harness Run (execution pipeline)

**Noticed in:** reference platform → *AI Harness Engineering*, where a run passes through ten stages: context assembly → prompt build → memory retrieval → tool routing → workflow routing → agent collaboration → evaluation → policy enforcement → observability → human approval. It also offers three entry points (run a single agent, use a template, build from scratch) and a log of recent runs.

**Description.** The ability to actually run an AMS agent against a task and watch it execute, rather than only reading about it.

**What it would contain**
- Pick an agent, give it a task (for example "analyse INC-…"), run it
- Live stage-by-stage progress with a run log
- A pause at the human-approval stage, feeding our existing inbox
- A history of past runs and their outcomes

**Why it matters.** Our Sandbox Simulation is the closest existing thing and is the natural place for it. It also makes AMS-10 answerable, and gives **Simulate Fix** (AMS-02) somewhere real to land.

---

#### F-09 · Knowledge Fabric for AMS

**Noticed in:** reference platform → *Knowledge Fabric*, showing an AMS graph of 14 nodes and 19 edges linking the ITSM incident → affected configuration items → the change record that caused it → Splunk and Dynatrace telemetry → known-error article → a 92%-similar past incident → the applicable runbook → the agents bound to all of it. It also shows memory counters and per-agent **knowledge coverage** (83%, 67%, 67%).

**Description.** A connected view of the knowledge an AMS agent draws on, and how well covered it is.

**What it would contain**
- A graph of incidents, services, changes, telemetry, runbooks and known errors
- Which agents are bound to which knowledge sources
- A coverage indicator per agent
- Link-through from an incident to its knowledge context

**Why it matters.** It is what makes F-03 and F-04 trustworthy — the root cause becomes traceable to sources rather than asserted. Our technical-debt backlog is a natural second layer on the same graph.

---

#### F-10 · Evaluation of AMS agents

**Noticed in:** reference platform → *Evaluation Center*: per-agent scores across dimensions (groundedness, hallucination, security, cost, latency, plus AMS-specific incident accuracy, RCA quality, knowledge quality), a platform pass threshold of 85%, and rule violations called out.

**Description.** A quality score per AMS agent, on stated dimensions, with a pass mark.

**What it would contain**
- Dimension scores per agent and an aggregate
- A configurable threshold that gates certification
- Visible violations when an agent falls short
- Re-evaluation after changes

**Why it matters.** Gives our "Risk Rating" and "GOV-901 pre-validated" badges something real behind them.

---

#### F-11 · Governance & audit for agents

**Noticed in:** reference platform → *Governance Center*: a policy matrix (Responsible AI, PII protection, security, human approval, version control, audit trail) with coverage percentages, named guardrails, an approval queue and a per-agent governance record.

**Description.** Governance of the agents themselves, distinct from our existing per-item approvals.

**What it would contain**
- Policy matrix with coverage per policy
- Named guardrails and which agents satisfy them
- An approval queue for agents awaiting certification
- An audit trail of changes to an agent over time

**Why it matters.** Our inbox governs individual decisions well. Nothing governs the agents making them.

---

#### F-12 · FinOps for AI spend

**Noticed in:** reference platform → *FinOps Center*: month-to-date spend, token volume, budget consumed against cap, cost per million tokens, cache savings, an efficiency index, burn and forecast, spend split by domain (AMS $52.34 / 192.9M tokens), model cost mix, **9 cost alerts** naming agents causing avoidable spend with explicit "do not" guidance, and **7 prompt rules** (caching, compression, model downgrade routing, context caps).

**Description.** Visibility and control of what our AI actually costs to run.

**What it would contain**
- Spend, tokens, budget and forecast for the AMS domain
- Cost per agent, with cache effectiveness
- Alerts naming the agents wasting money and why
- Optimisation levers the user can switch on

**Why it matters.** We report **cost per ticket** ($9.20, down from $42.00), which is the business-value side. We report nothing on what the AI itself consumes, so the saving is unverifiable.

---

#### F-13 · Multi-agent workflow composition

**Noticed in:** reference platform → *AI Harness* → *Agent Workflow Composer* and *Workflow Library*, with pre-built templates (Prior Auth, claims, incident response) and exportable definitions.

**Description.** Chain AMS agents into a repeatable response flow — for example triage → RCA → change impact → runbook execution.

**What it would contain**
- A canvas for chaining agents, with approval gates between steps
- A library of saved and pre-built flows
- Reuse of a flow across incidents of the same pattern

**Why it matters.** Our Agent Catalogue already lists "agentic workflows" as a type, but there is no way to see or compose one.

---

### 4.3 Priority 3 — reuse, cohesion and value

---

#### F-14 · Cross-screen links

**Noticed in:** reference platform throughout — "Run in Harness" on every agent card, "View ServiceNow incident in Knowledge Fabric" at the foot of the war room, "Next steps after a run → Evaluation / FinOps / Governance".

**Description.** Every screen points to the sensible next screen, with context carried across.

**Why it matters.** Our screens are islands, which is the root of AMS-02, AMS-03 and AMS-06. This is the cheapest single change that would make the product feel like one system.

---

#### F-15 · Guided flow / progress path

**Noticed in:** reference platform → a persistent **Enterprise Flow** strip across every page: "Step 1 of 12: Create workspace", with **Continue**, **Jump to next gap** and **All steps**, grouped as Setup → Onboard → Engineering → Operations.

**Description.** A guided path showing where the user is in the overall journey and what is unfinished.

**Why it matters.** Strong for demonstrations, because it gives a viewer a narrative instead of a set of screens. Worth confirming whether we want this for AMS or only at platform level.

---

#### F-16 · Workspaces / initiatives

**Noticed in:** reference platform — everything is scoped to a named initiative (e.g. "Prior Authorization Automation") and to platform planes (Ignio for AMS, ARE for AIOps), with a per-workspace scorecard: Agents 3 · Published 3 · Harness runs 3 · Avg quality 92% · Reuse 27 · Verified 3.

**Description.** A project-level container tying AMS agents and work to a business goal.

**Why it matters.** Our domains are personas only. Nothing connects AMS activity to a named programme, which makes the ROI figures hard to attribute.

---

#### F-17 · Reusable skills library

**Noticed in:** reference platform → onboarding → **Enterprise Skill Library**: 8 certified skills, each showing the agent it came from and how often it has been reused.

**Description.** Skills as reusable building blocks shared across agents, below the level of a whole agent.

**Why it matters.** It is the mechanism that makes their reuse counts meaningful. We have no equivalent layer.

---

#### F-18 · Marketplace / publish for reuse

**Noticed in:** reference platform → *Agent Marketplace*, where certified agents are published for other teams to deploy, with reuse counts carried through.

**Description.** Publish proven AMS agents for other domains to adopt.

**Why it matters.** It is the payoff for the domain isolation we already maintain, and turns AMS from a consumer into a contributor.

---

#### F-19 · Continuous learning loop

**Noticed in:** reference platform → *Continuous Learning* module.

**Description.** Capture feedback on agent output and show accuracy trending over time.

**Why it matters.** Our automation and deflection rates are static figures. Feedback is what would make them move for a reason.

---

#### F-20 · Integration status panel

**Noticed in:** reference platform → source systems named throughout the knowledge graph (ServiceNow ITSM 42.8k records, CMDB, Splunk 12.4k, Dynatrace 890) with record counts and last sync time.

**Description.** A visible panel of connected systems, their health and last sync.

**Why it matters.** Our data already references Datadog, PagerDuty, ServiceNow, Jira and Kubernetes as originating systems, but their status is never shown, so the user cannot tell what is connected.

---

## 5. Suggested sequence

| Phase | Contents | Rationale |
|---|---|---|
| Phase 0 | AMS-01, AMS-02, AMS-03 | Defects users hit immediately on the current screens |
| Phase 1 | F-01, F-02, F-03, F-04 | Makes AMS operational; reuses data we already hold |
| Phase 2 | F-05, F-06, F-07, F-08 | The agent lifecycle that gives the catalogue meaning |
| Phase 3 | F-09, F-10, F-11, F-12, F-13 | Operating discipline: knowledge, quality, governance, cost |
| Phase 4 | F-14 to F-20, remaining P3 findings | Cohesion, reuse and value reporting |

---

## 6. Deliberately not proposed

- **Copying the reference dashboard metrics.** Our AMS dashboard is materially stronger than theirs (MTTD/MTTR against baseline, SLA attainment with error budget, cost per ticket, application stability). No change proposed.
- **Reverse engineering / legacy code scanning.** Present in the reference platform (COBOL scan, dependency graph, migration blueprint). Out of scope unless AMS is meant to cover legacy modernisation — noting that our inbox already contains a "brownfield pipeline initiation" item, which suggests the question is open.

---

## 7. Open questions for review

1. Is the AMS persona expected to **act on live incidents** in the Hub, or only to review and approve after the fact? F-01 to F-04 assume the former.
2. Should AMS agents be **registered in the Hub** (F-05), or does the catalogue stay curated centrally?
3. Is **AI cost visibility** (F-12) in scope for the Head of AMS, or does it belong to the Engineering leader persona?
4. Do we want the **guided flow** (F-15) and **workspaces** (F-16) at AMS level, or only platform-wide?
5. Is **legacy modernisation** part of AMS scope (see section 6)?
6. For the inbox, should actioned items **leave the queue** or move to a completed view (AMS-09)?
