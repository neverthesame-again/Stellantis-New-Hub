# DEVELOPER & AGENT GUIDE
## AI-Native Engineering Operating Model Hub — Stellantis POC

> ⚠️ **MANDATORY FIRST READ FOR ALL DEVELOPERS AND AI AGENTS**
> Any developer or AI agent contributing to this repository **MUST** read and internalize this document before writing, modifying, or generating any code. Failure to follow these guidelines will cause merge conflicts, domain boundary violations, and architectural regressions.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Product Name** | AI-Native Engineering Operating Model Hub |
| **Type** | Proof of Concept (POC) — Multi-Persona React + Node.js Application |
| **Repository** | `Stellantis-New-Hub` |
| **Primary Users** | Tony (AMS), Alex (Engineering Leaders), Product Owner (AD) |
| **Tech Stack** | React 19 + Vite 8 (Frontend) / Node.js + Express (Backend) |
| **Design System** | Stellantis Midnight Navy (`#0e1e38`) — Dark-first design |

---

## 2. Repository Folder Architecture

```
Stellantis-New-Hub/
├── README.md
├── DEVELOPER_AND_AGENT_GUIDE.md       ← YOU ARE HERE
├── frontend/                          ← React + Vite SPA
│   ├── public/
│   │   └── stellantis-logo.png        ← Official Stellantis logo
│   └── src/
│       ├── main.jsx                   ← React entry point
│       ├── App.jsx                    ← Root: domain routing & layout shell
│       ├── index.css                  ← 🔑 DESIGN SYSTEM (global tokens & utilities)
│       ├── core/                      ← SHARED SHELL — edit only by consensus
│       │   ├── Header.jsx             ← Top bar (logo, theme, user profile)
│       │   ├── WorkspaceBar.jsx       ← Domain & Role dropdowns
│       │   ├── PersonaHero.jsx        ← Persona context banner & KPIs
│       │   ├── NavigationTabs.jsx     ← Overview / Workflow Inbox / AI Experience Zone
│       │   └── FloatingNexus.jsx      ← SEL Nexus drawer + AI Assistant
│       ├── domains/
│       │   ├── ai-for-ams/            ← [VISHNU] Application Management Services — Tony
│       │   │   ├── mockData.js        ← Frontend local fallback mock data
│       │   │   └── pages/
│       │   │       ├── AmsDashboard.jsx
│       │   │       ├── WorkflowInbox.jsx
│       │   │       └── ExperienceZone.jsx
│       │   ├── engineering-leaders/   ← [SREEJA] Engineering Leaders — Alex
│       │   │   └── index.jsx
│       │   └── ai-for-ad/             ← [LAVANYA] AI for AD — Product Owner
│       │       └── index.jsx
│       └── shared/                    ← Reusable atoms (future use)
└── backend/                           ← Node.js / Express Mock API
    ├── package.json
    ├── server.js                      ← Central hub mounting domain routers
    └── src/
        └── domains/
            ├── ai-for-ams/
            │   ├── mockData.js        ← Single source of truth for AMS data
            │   └── routes.js          ← Express router for /api/ams/*
            ├── engineering-leaders/
            │   └── routes.js          ← Express router for /api/engineering/*
            └── ai-for-ad/
                └── routes.js          ← Express router for /api/ad/*
```

---

## 3. Developer Domain Ownership — Zero Merge Conflict Rules

> **This is the most critical section. Strict isolation prevents ALL merge conflicts.**

| Domain | Assigned Developer | Persona | Frontend Directory | Backend Directory |
|--------|-------------------|---------|-------------------|-------------------|
| AI for AMS | **Vishnu** | Tony — Head of AMS | `frontend/src/domains/ai-for-ams/` | `backend/src/domains/ai-for-ams/` |
| Engineering Leaders | **Sreeja** | Alex — Chief AI Officer | `frontend/src/domains/engineering-leaders/` | `backend/src/domains/engineering-leaders/` |
| AI for AD | **Lavanya** | Product Owner | `frontend/src/domains/ai-for-ad/` | `backend/src/domains/ai-for-ad/` |

### Rules:
1. **Never create files outside your domain directory** without team consensus.
2. **Never modify `core/` files** (Header, WorkspaceBar, NavigationTabs, FloatingNexus, App.jsx, index.css) without team alignment. These are **shared shell files** owned by the team lead.
3. **Never import from another developer's domain folder.** Each domain is fully self-contained.
4. Your domain `index.jsx` is the **single public mount point** that `App.jsx` will call.
5. Backend routes under your domain are accessed via your API prefix (`/api/ams`, `/api/engineering`, `/api/ad`). Never mount routes under another prefix.

---

## 4. Design System — Stellantis Midnight Navy

> All developers and AI agents must follow this design system **exactly**. Do not introduce arbitrary inline colour values.

### 4.1 Canonical Colour Tokens (defined in `index.css`)

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| `--stellantis-navy` | `#0e1e38` | `#0e1e38` | Primary brand, headers, active tabs, CTAs |
| `--stellantis-navy-mid` | `#1a3a6e` | `#1a3a6e` | Hover states, links, secondary actions |
| `--stellantis-action` | `#0284c7` | `#0284c7` | Operational action, live status indicators |
| `--bg-app` | `#f0f4fa` | `#060d1c` | Page background |
| `--bg-surface` | `#ffffff` | `#0d1a30` | Card / panel background |
| `--border-color` | `#d8e3f7` | `#1d3460` | Default borders |
| `--text-primary` | `#0e1e38` | `#e8f0ff` | Headings and body |
| `--text-muted` | `#6a85b0` | `#6a85b0` | Secondary labels |

### 4.2 Header — Always Dark Navy
The `Header.jsx` component is **permanently dark navy** (`#0e1e38`) regardless of the current theme. The theme toggle only affects the canvas below the header.

### 4.3 Active State Rules
- **Active navigation tabs**: Background `#0e1e38`, text `#ffffff`
- **Primary buttons (`.st-btn-primary`)**: Background `#0e1e38`, hover `#1a3a6e`
- **Action buttons (`.st-btn-action`)**: Background `#0284c7` (operational actions only)
- **Approve buttons**: Use `#10b981` (success green — reserved for approvals/success states)

### 4.4 Badge Colour Semantics
| Class | Meaning | Use Case |
|-------|---------|----------|
| `.badge-critical` | Crimson red | P1 incidents, Critical risk |
| `.badge-high` | Amber | P2 incidents, High risk |
| `.badge-success` | Emerald green | Resolved, Approved, Optimal |
| `.badge-info` | Stellantis blue | Informational, Subscribed |
| `.badge-purple` | Purple | AI/Agent labels, Use Cases |
| `.badge-navy` | Dark navy | Domain tags, Governance |

### 4.5 Typography
- Body: `'Inter'` (weights: 400, 500, 600, 700)
- Display headings: `'Outfit'` (weights: 600, 700, 800)
- Monospace: browser default (used in audit trails and permission strings)

---

## 5. UI Layout Principles

### 5.1 Page Layout
```
[Header — 60px, always #0e1e38]
[main.content — max-width: 1480px, padding: 0 28px 80px]
  [WorkspaceBar — 1 row, sticky context, domain/role dropdowns]
  [PersonaHero — context banner + KPI row]
  [NavigationTabs — pill tabs: Overview / Workflow Inbox / AI Experience Zone]
  [Active Page Content — 3-column grid for Dashboard, master-detail for Inbox]
[Floating: SEL Nexus tab (right edge) + AI Assistant button (bottom right)]
[Footer — 1 row, centered]
```

### 5.2 Dashboard Layout (3-Column Grid)
```
┌──────────────────┬──────────────────┬──────────────────┐
│  Incidents &     │  Problem-to-     │  App Stability   │
│  Severity        │  Change Pipeline │  & SLA           │
│  Triage          │                  │  Performance     │
└──────────────────┴──────────────────┴──────────────────┘
```
Use: `display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px`

### 5.3 Workflow Inbox Layout (Master-Detail)
```
┌─────────────────────┬──────────────────────────────────┐
│  Items List (left)  │  Detailed Decision Pane (right)  │
│  380px max          │  Flex 1                          │
│  Scrollable         │  AI Rec, Evidence, Actions       │
└─────────────────────┴──────────────────────────────────┘
```
Use: `display: grid; grid-template-columns: 1fr 1.3fr; gap: 20px`

### 5.4 Experience Zone Layout
- Sub-tabs: `5.3 Model Catalogue | 5.4 Agent & Workflows | 5.5 AI Tools | 5.6 My Subscriptions | Sandbox`
- Cards: `display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px`
- Subscriptions: Full-width table with sticky header

---

## 6. API Contracts

### 6.1 Backend Base URL
```
http://localhost:5000
```

### 6.2 AMS Domain Endpoints (Vishnu)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ams/dashboard` | Returns full dashboard data (persona, stats, clusters, pipeline, stability) |
| `GET` | `/api/ams/workflows` | Returns workflow inbox items. Query: `?type=&priority=` |
| `POST` | `/api/ams/workflows/:id/action` | Approve/reject/escalate a workflow item. Body: `{ action, comments }` |
| `GET` | `/api/ams/experience` | Returns models, agents, tools, subscriptions |
| `POST` | `/api/ams/experience/simulate` | Runs agentic simulation. Body: `{ scenario }` |

### 6.3 Engineering Leaders Endpoints (Sreeja)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/engineering/status` | Health check — returns domain status |
| `GET` | `/api/engineering/dashboard` | *(To be implemented)* |
| `GET` | `/api/engineering/workflows` | *(To be implemented)* |

### 6.4 AI for AD Endpoints (Lavanya)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ad/status` | Health check — returns domain status |
| `GET` | `/api/ad/dashboard` | *(To be implemented)* |
| `GET` | `/api/ad/workflows` | *(To be implemented)* |

### 6.5 Health & Hub Metadata
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns hub status + all registered domain paths |

---

## 7. Data Model Reference

### 7.1 Dashboard Data Shape (AI for AMS)
```js
{
  persona: { name, title, role, domain, platform, shift, shiftProgress, slaHealth, aiResolutionRate },
  overviewStats: { p1Blocked, p2InReview, p3InProgress, p4Backlog, mttd, mttr, costSavedYtd, ... },
  recurringClusters: [{ id, title, affectedService, portfolio, frequency, impactLevel, rootCauseSummary, aiRecommendation, riskScore }],
  problemToChangePipeline: [{ id, clusterId, service, recurringIncidents, convertedToChange, changeId, targetSprint }],
  applicationStability: [{ name, uptime, sla, status, incidents30d }]
}
```

### 7.2 Workflow Item Shape
```js
{
  id: 'WF-INB-101',
  title: '...',
  type: 'Automation Approvals',         // Used for filter categorisation
  priority: 'P1',                        // P1 | P2 | P3 | P4
  riskLevel: 'Critical',                 // Critical | High | Elevated | Low
  requestor: '...',
  originatingSystem: '...',
  project: '...',
  portfolio: '...',
  requiredDecision: '...',
  dueDate: '...',
  status: 'Pending Action',              // Pending Action | Pending Review | Approved | Rejected | Escalated
  confidence: '94.8%',
  supportingEvidence: { metrics, impact, pastExecutions, rollbackPlan },
  aiRecommendation: '...',
  decisionHistory: [{ timestamp, actor, action }],
  auditTrail: '...'
}
```

### 7.3 Experience Zone Data Shape
```js
{
  models: [{ id, name, provider, modality, deploymentType, costTier, latency, riskRating, supportedUseCases, benchmarkScore, dataRestrictions, subscribed }],
  agents: [{ id, name, owner, autonomyLevel, lifecycleStage, riskRating, domain, technology, purpose, metrics, permissions, status }],
  tools: [{ id, name, category, approvedProjects, licensing, securityClassification, supportOwner, adoptionRate, status }],
  mySubscriptions: [{ id, entityName, type, level, status, renewalDate, monthlyUsage, costAllocation }]
}
```

---

## 8. Persona Reference

| Persona | Name | Domain | Developer | Key Objectives |
|---------|------|--------|-----------|----------------|
| Head of AMS | Tony | AI for AMS | Vishnu | Incident management, SLA, Problem-to-Change, Automation |
| Chief AI Officer | Alex | Engineering Leaders | Sreeja | AI governance, model adoption, architecture, SDLC |
| Product Owner | — | AI for AD | Lavanya | Epic management, backlog AI, sprint capacity, scope risks |

---

## 9. Running the Application

### Start Backend (Port 5000)
```powershell
cd backend
npm start
# OR with watch mode:
npm run dev
```

### Start Frontend (Port 5173)
```powershell
cd frontend
npm run dev
```

### Production Build (Frontend)
```powershell
cd frontend
npm run build
```

### Verify Backend is Healthy
```
GET http://localhost:5000/api/health
```

---

## 10. Git Workflow — Merge Conflict Prevention

### 10.1 Branch Strategy
Each developer works in their domain branch:
- `feat/vishnu-ams-*` — AI for AMS features
- `feat/sreeja-engleaders-*` — Engineering Leaders features
- `feat/lavanya-ai-for-ad-*` — AI for AD features
- `main` — Stable integrated branch; merge via PR only

### 10.2 File Ownership Map
```
File/Directory                          Owner
----------------------------------------------
frontend/src/core/*                     Team Lead (consensus required)
frontend/src/index.css                  Team Lead (consensus required)
frontend/src/App.jsx                    Team Lead (consensus required)
frontend/src/domains/ai-for-ams/*       Vishnu
frontend/src/domains/engineering-leaders/* Sreeja
frontend/src/domains/ai-for-ad/*        Lavanya
backend/src/domains/ai-for-ams/*        Vishnu
backend/src/domains/engineering-leaders/* Sreeja
backend/src/domains/ai-for-ad/*         Lavanya
backend/server.js                       Team Lead (consensus required)
DEVELOPER_AND_AGENT_GUIDE.md            Team Lead (consensus required)
```

### 10.3 Pull Request Rules
1. Self-review all changed files before raising a PR.
2. No PR should touch files outside the developer's own domain.
3. `main` merges require at minimum 1 review from another team member.
4. Run `npm run build` in `frontend/` locally and verify it passes before raising a PR.

---

## 11. AI Agent Instructions

> If you are an AI agent contributing to this repository, follow these rules without exception.

### 11.1 Before Making Any Change
1. Read this guide from top to bottom.
2. Identify which domain the requested change belongs to.
3. Verify the file paths match the domain ownership map in Section 10.2.
4. Never create files in a different domain's directory.

### 11.2 Design & Styling Rules for AI Agents
- **Always use CSS variables** from `index.css`. Never hardcode arbitrary hex colours.
- Use `#0e1e38` for the header, active states, primary CTAs — not any other shade of blue.
- Use `#0284c7` only for operational action buttons (Simulate, Live AI, streaming indicators).
- Use `#10b981` only for success states (Approved, Resolved, Live Engine status dot).
- Use badge classes (`.badge-critical`, `.badge-success`, etc.) instead of inline background colours.
- Never introduce external CSS libraries (Tailwind, Bootstrap, Chakra, MUI) without explicit instruction.

### 11.3 Data Rules for AI Agents
- The single source of truth for AMS mock data is `backend/src/domains/ai-for-ams/mockData.js`.
- The frontend local fallback data is `frontend/src/domains/ai-for-ams/mockData.js` (duplicate for offline use).
- Never duplicate data from one domain into another domain's files.
- When generating new mock data, follow the existing data shapes exactly (see Section 7).

### 11.4 Component Rules for AI Agents
- All new page components must import from `../mockData.js` (relative to `pages/`).
- Components must attempt to `fetch` from backend and fall back to local mock data gracefully.
- All interactive elements must have unique, descriptive `id` attributes.
- Never use `alert()` in production path — use in-component notification state instead.
- Use `className="animate-fade-in"` on top-level rendered elements for consistent entrance animations.

---

## 12. POC Scope Boundaries

### What's Intentionally Mocked
- All backend data is mock/synthetic (no real Stellantis systems are connected)
- AI recommendations are pre-scripted (no live LLM calls)
- The SEL Nexus AI Assistant uses scripted response logic
- The Sandbox Simulation uses a pre-defined 5-step trace

### What's Production-Grade in This POC
- Folder structure and merge isolation strategy
- Data model design and API contract design
- UI/UX design system and component architecture
- Workflow approval state machine
- Domain isolation and persona-based authorization pattern

---

## 13. Contact & Ownership

| Role | Name | Domain |
|------|------|--------|
| Lead / AMS Domain | Vishnu | AI for AMS — Tony (Head of AMS) |
| Engineering Leaders Domain | Sreeja | Engineering Leaders — Alex (Chief AI Officer) |
| AI for AD Domain | Lavanya | AI for AD — Product Owner |

---

*Last Updated: September 2026 | Stellantis AI-Native Engineering Operating Model Hub POC*
