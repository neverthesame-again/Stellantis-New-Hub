# AI for AMS — Enhancement Requirements

**Status:** Draft for review
**Date:** 28 September 2026
**Based on:** the reference app (TCS AI Engineering Studio) and our current AMS screens

**Priority meaning:** P1 = must have · P2 = should have · P3 = nice to have

---

## 1. What we have now

Three screens: Dashboard (reports), Workflow Inbox (approvals), AI Experience Zone (catalogues of models, agents, tools, subscriptions, sandbox).

## 2. What is missing

We show what happened and what exists. We cannot **do** anything with an agent — no way to add one, run one, or see one working.

---

## 3. Requirements

### E1 · Platform Actions bar

**Seen in reference:** top of the AMS page — six buttons: New Workspace, Onboard Agent, Run Harness, Knowledge Fabric, Workflows, FinOps.

**User story:** As the Head of AMS, I want quick action buttons on my AMS screen, so I can start work without hunting through menus.

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | Show an action bar at the top of the AMS dashboard | P1 |
| FR-1.2 | Each button opens the matching screen in one click | P1 |
| FR-1.3 | Each button has a short line saying what it does | P2 |
| FR-1.4 | Hide buttons the user has no rights to | P3 |

**Done when:** all buttons are visible and each one opens the right screen.

---

### E2 · AMS scorecard

**Seen in reference:** a strip showing Agents 3 · Published 3 · Harness Runs 4 · Avg Quality 92% · Reuse 27 · Verified 3.

**User story:** As the Head of AMS, I want a small summary of my agents, so I know the health of my AMS setup at a glance.

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Show counts: total agents, published agents, runs, average quality, reuse, verified | P1 |
| FR-2.2 | Counts come from real data, not fixed numbers | P1 |
| FR-2.3 | Counts update after any agent is added, run or published | P1 |
| FR-2.4 | Clicking a count opens the list behind it | P2 |

**Done when:** adding or running an agent changes the numbers.

---

### E3 · Run an agent from the AMS screen

**Seen in reference:** a "Live Activity" box — pick an agent, type a task, press Execute. I ran it: the run count went 3 → 4 and the incident updated.

**User story:** As the Head of AMS, I want to run an AMS agent on a task from my own screen, so I get help without leaving the page.

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Dropdown to pick any published AMS agent | P1 |
| FR-3.2 | Text box to type the task | P1 |
| FR-3.3 | Execute button starts the run | P1 |
| FR-3.4 | Show progress while it runs, and the result when done | P1 |
| FR-3.5 | Each run is saved in a run history | P2 |
| FR-3.6 | Show the agent's skills and knowledge source count next to it | P3 |

**Done when:** a user can pick an agent, type a task, run it, and see the result.

---

### E4 · Live Incident War Room

**Seen in reference:** one open P1 incident with MTTR, confidence, impact and affected users, updating as work goes on.

**User story:** As the Head of AMS, I want to see the incident being worked right now, so I know the live position, not just yesterday's totals.

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | Show the active incident: number, title, severity, service, status | P1 |
| FR-4.2 | Show live figures: time to resolve so far, confidence, impact, users affected | P1 |
| FR-4.3 | Figures update as the incident moves on | P1 |
| FR-4.4 | Button to move the response to the next step | P2 |
| FR-4.5 | If more than one incident is open, let the user switch between them | P2 |
| FR-4.6 | Link from the incident to its knowledge page | P3 |

**Done when:** the screen shows a live incident and its numbers change as it progresses.

---

### E5 · Agent timeline, root cause and fix

**Seen in reference:** a timeline (alert → classified P1 → logs correlated → similar incident found → root cause → fix suggested), each line naming the agent that did it. Two panels below fill in with the root cause and the recommended fix.

**User story:** As the Head of AMS, I want to see what each agent did and what it found, so I can trust the result and act on it.

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Show a timeline: time, what happened, which agent did it | P1 |
| FR-5.2 | New steps appear as they happen | P1 |
| FR-5.3 | Show the root cause in plain words, with the evidence used | P1 |
| FR-5.4 | Show a clear recommended fix | P1 |
| FR-5.5 | Show similar past incidents with a match score and how they were fixed | P2 |
| FR-5.6 | Send the recommended fix to the Workflow Inbox for approval | P2 |

**Done when:** a user can read what happened, why, and what to do next.

---

### E6 · Add an agent (Onboarding)

**Seen in reference:** a form with name, family, project, team, owner, version, purpose; a choice of runtime (their platforms or an external one such as Python, Bedrock, Foundry, API); a connection test; then skills, knowledge sources and tools. The agent moves through nine stages: Registered → Runtime Connected → Skills & Knowledge → Tools Connected → Workflow Mapped → Evaluated → Governance Approved → Certified → Published.

**User story:** As an AMS lead, I want to register an agent my team built elsewhere, so it appears in the Hub and can be used and governed.

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | Form to register an agent: name, purpose, owner, team, project, version | P1 |
| FR-6.2 | Choose where the agent runs, and save its connection details | P1 |
| FR-6.3 | Test the connection and show pass or fail | P1 |
| FR-6.4 | Attach skills, knowledge sources and tools | P1 |
| FR-6.5 | Show the stage the agent has reached, and what is left | P1 |
| FR-6.6 | Only published agents appear in the catalogue and can be run | P1 |
| FR-6.7 | Reuse skills already certified by other teams | P2 |
| FR-6.8 | Save a part-finished registration and come back later | P2 |

**Done when:** a new agent can be added, connected, published, and then used.

---

### E7 · Harness run (10 steps)

**Seen in reference:** a run passes through ten steps, each with a time and a result line. Example from a real run: Context Assembly 800ms "collected 5 knowledge sources, 197 records"; Tool Routing 902ms "routed to 5 tools"; Evaluation 460ms "93% across 6 dimensions — PASS". Header shows Context Confidence 94%, Reuse Readiness 100%, Knowledge Coverage 83%.

**User story:** As the Head of AMS, I want to watch an agent run step by step, so I can see it working and check where it failed.

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | Run an agent through set steps, shown one by one | P1 |
| FR-7.2 | Each step shows its result and how long it took | P1 |
| FR-7.3 | Stop at the approval step when a human is needed | P1 |
| FR-7.4 | Failed steps are clearly marked with the reason | P1 |
| FR-7.5 | Keep a list of past runs with their status | P2 |
| FR-7.6 | Show confidence, reuse and knowledge coverage for the run | P2 |

**Done when:** a user can run an agent and follow every step to the end.

---

### E8 · Knowledge for AMS

**Seen in reference:** a map linking the incident → affected services → the change that caused it → logs and monitoring → known error note → a 92% similar past incident → the runbook → the agents using all of it. Each agent shows knowledge coverage (83%, 67%, 67%).

**User story:** As the Head of AMS, I want to see what an agent knows, so I can trust its answers.

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | Show the sources linked to each AMS agent | P1 |
| FR-8.2 | Show a knowledge coverage figure per agent | P2 |
| FR-8.3 | Show how an incident links to services, changes, logs and runbooks | P2 |
| FR-8.4 | Open any source from the incident | P2 |
| FR-8.5 | Link technical debt items to the incidents that caused them | P3 |

**Done when:** a user can see where an agent's answer comes from.

---

### E9 · Quality and governance of agents

**Seen in reference:** scores per agent on set measures, a pass mark of 85%, and a policy list (Responsible AI, PII, security, human approval, version control, audit trail) with an approval queue.

**User story:** As the Head of AMS, I want each agent scored and approved, so only safe agents run in production.

| ID | Requirement | Priority |
|---|---|---|
| FR-9.1 | Score each AMS agent on set measures | P2 |
| FR-9.2 | Set a pass mark; agents below it cannot be published | P2 |
| FR-9.3 | Show which policies each agent meets | P2 |
| FR-9.4 | Queue for approving agents, with approver name and date | P2 |
| FR-9.5 | Keep a history of changes to each agent | P3 |

**Done when:** an agent cannot be published without a score and an approval.

---

### E10 · AI cost (FinOps)

**Seen in reference:** spend to date, tokens used, budget, cost per million tokens, cache savings. Nine cost alerts naming the agent, the extra cost, what to avoid and how to fix it. Seven cost rules with scope (all / AD / AMS / QE), mode (monitor, recommend, enforce) and settings.

**User story:** As the Head of AMS, I want to see what our AI costs, so my savings figures are backed by real numbers.

| ID | Requirement | Priority |
|---|---|---|
| FR-10.1 | Show AMS spend, tokens used and budget left | P2 |
| FR-10.2 | Show cost per agent | P2 |
| FR-10.3 | Alert when an agent costs more than it should, with the reason and the fix | P2 |
| FR-10.4 | Switch cost saving rules on or off for AMS | P3 |
| FR-10.5 | Show a spend forecast for the month | P3 |

**Done when:** a user can see AMS AI spend and which agent is wasting money.

---

### E11 · Chained workflows

**Seen in reference:** a canvas to chain agents, plus ready-made flows including "AMS Incident Response Workflow" (3 agents, 3 links).

**User story:** As the Head of AMS, I want to chain agents into one flow, so a common incident is handled the same way every time.

| ID | Requirement | Priority |
|---|---|---|
| FR-11.1 | Chain agents into a flow, in order | P2 |
| FR-11.2 | Add an approval step between agents | P2 |
| FR-11.3 | Save a flow and run it again later | P2 |
| FR-11.4 | Provide ready-made AMS flows to start from | P3 |

**Done when:** a saved flow can be run on a new incident.

---

### E12 · Running agents view

**Seen in reference:** a live view with CPU, memory, throughput and error rate, plus per-agent readiness and run counts.

**User story:** As the Head of AMS, I want to see which agents are running now, so I can spot problems early.

| ID | Requirement | Priority |
|---|---|---|
| FR-12.1 | List published AMS agents with status and last run | P2 |
| FR-12.2 | Show failures and error rate | P2 |
| FR-12.3 | Pause or stop an agent | P3 |

**Done when:** a user can see live agent status and stop a bad one.

---

### E13 · Activity feed and links between screens

**Seen in reference:** a "Recent Platform Activity" list with time stamps, and links on every screen to the next step ("Run in Harness", "View incident in Knowledge Fabric").

**User story:** As the Head of AMS, I want to see recent activity and jump between screens, so the Hub feels like one tool.

| ID | Requirement | Priority |
|---|---|---|
| FR-13.1 | Show recent AMS activity with date and time | P2 |
| FR-13.2 | Agent cards have a "Run" link | P2 |
| FR-13.3 | Incidents link to their knowledge page | P2 |
| FR-13.4 | After a run, offer the next steps (score, cost, approval) | P3 |

**Done when:** a user can move between related screens without going back to the menu.

---

## 4. Bugs to fix first

| ID | Problem | Priority |
|---|---|---|
| BUG-1 | Approving an inbox item does not reduce the count (stays 7 in the list and the sidebar) | P1 |
| BUG-2 | "Simulate Fix" opens the Model Catalogue instead of the Sandbox | P1 |
| BUG-3 | "Review in Inbox" opens the list but does not open the right item | P2 |
| BUG-4 | Sidebar counts are fixed numbers, not live data | P2 |
| BUG-5 | If the backend is off, screens show sample data with no warning | P2 |
| BUG-6 | Inbox decisions do not change anything on the dashboard | P2 |
| BUG-7 | Greeting always says "Good morning" | P3 |

---

## 5. Suggested order

| Phase | Work |
|---|---|
| 1 | Bugs 1–3 |
| 2 | E1, E2, E3 (action bar, scorecard, run an agent) |
| 3 | E4, E5 (war room, timeline and root cause) |
| 4 | E6, E7 (add agents, harness run) |
| 5 | E8–E13 (knowledge, quality, cost, flows, runtime, links) |

---

## 6. Questions for you

1. Should AMS staff be able to **add agents** themselves, or is the catalogue controlled centrally?
2. Is **AI cost** (E10) for the Head of AMS, or only for the Engineering leader?
3. Do we need **workspaces/projects** like the reference app, or is domain and role enough?
4. Should approved inbox items **leave the list** or move to a "done" tab?
5. Do we want the **12-step guided flow** the reference app shows on every page?
