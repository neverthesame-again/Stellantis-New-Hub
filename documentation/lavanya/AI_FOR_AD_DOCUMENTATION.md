# AI for AD (Automated Driving) — Comprehensive Documentation & Change Log

> **Domain:** AI for AD (Autonomous Driving / Automated Development)  
> **Active Persona:** Product Owner (Carl Weber)  
> **Platform Code:** `AD-PO`  
> **Project Scope:** Release 4.2 Program (ASIL-D Level 2+) • Sprint 42  
> **Repository:** `Stellantis-New-Hub`  
> **Status:** Production-Ready | Verified Build (0 Errors)

---

## 1. Executive Summary

This document serves as the official reference and change log for the **AI for AD** domain within the Stellantis AI-Native Engineering Operating Model Hub. 

The AI for AD domain provides a specialized, autonomous delivery and requirements management cockpit tailored for automotive systems engineering under ISO 26262 and ASPICE compliance. It features:
1. **Product Owner Decision Cockpit**: 8 modular dashboard cards providing real-time telemetry across roadmaps, backlog health, delivery velocity, and dependency risks.
2. **Human-in-the-Loop Workflow Inbox**: Streamlined triage console across 3 decision lanes (Critical, Standard, FYI) managing 9 gated operational items.
3. **Autonomous Delivery Experience Zone**: Catalogues spanning Foundation Models, Autonomous Agent Workflows, 10 Automotive AI Tool Categories, and Active Subscriptions.
4. **SEL Nexus Automation Suite**: Integrated invocation pipeline supporting Green Field requirements synthesis and Brownfield PRD-driven autonomous execution with live status tracking.
5. **Scalable Multi-Role Architecture**: Modular directory structure cleanly isolating Product Owner implementations while providing seamless plug-and-play routing for future engineering roles (Lead Architect, Safety Engineer, Software Engineer).

---

## 2. Common Space (Shared Shell) Modifications

To integrate AI for AD while adhering to the **Zero Merge Conflicts Architecture**, changes in shared "common space" files were strictly controlled, scoped, and documented below.

### 2.1 Summary Table of Common Space Changes

| File Path | Component Area | What Changed | Why It Changed (Rationale) | Impact on Other Domains |
| :--- | :--- | :--- | :--- | :--- |
| `frontend/src/core/WorkspaceBar.jsx` | Core Navigation | Updated `DOMAIN_PERSONA_MAP['AI for AD']` dictionary entry. | Injected real-time PRD mock data: active platform (`AD-PO`), shift (`Release 4.2 Program \| Sprint 42`), shift progress (`88% Readiness`), concise chips (`3 Critical Gated`, `Release 4.2 Program`, `20 Subscriptions Active`), and KPIs (`RELEASE READINESS: 88%`, `SAFETY COMPLIANCE: 96.4%`). | **Zero impact**: `AI for AMS` and `Engineering leaders` blocks remain completely untouched. |
| `frontend/src/core/PersonaHero.jsx` | Core Header | Redesigned header banner layout to a 2-tier right-aligned structure. | Prevents right-edge overflow on standard laptops (1024px–1366px). Sits Title & Subtitle on left; Row 1 has `Platform \| Shift \| Shift Progress \|`, and Row 2 has the 3 info chips horizontally directly beneath. | **Universal Enhancement**: Applied cleanly across all 3 domains, standardizing header responsiveness. |
| `frontend/src/App.jsx` | Main Application | 1. Passed `selectedRole={selectedRole}` to `<AiForAdDomain />`.<br>2. Synced inbox badge count to `9`. | 1. Enables multi-role routing within AI for AD when roles switch.<br>2. Aligns notification badge with the 9 active decision tickets in `adPmWorkflowData.js`. | **Zero impact**: Domain boundary isolation preserves AMS and Engineering Leaders routing. |
| `frontend/vite.config.js` | Build Toolchain | 1. Added reverse proxy for `/api/automation-agents` to `https://sel-nexus.com`.<br>2. Added `resolve.extensions`. | 1. Eliminates CORS restrictions when invoking Brownfield pipeline APIs.<br>2. Ensures seamless resolution for extensionless JSX imports. | **Zero negative impact**: Facilitates unified enterprise API routing. |
| `frontend/src/core/FloatingNexus.jsx` | Core Shell | File deleted upon user instruction. | Deactivated floating widget code that was superseded by the in-card SEL Nexus button and modal suite. | **Zero impact**: Zero remaining imports across the codebase. |
| `backend/server.js` | Backend API Root | Mounted `adRouter` at `/api/ad`. | Exposes REST endpoints for AI for AD dashboard data, release simulations, and backlog auto-enhancement. | **Zero impact**: Mounted independently alongside `/api/ams` and `/api/engineering`. |

---

## 3. Detailed Breakdown of Common Space Changes

### 3.1 `frontend/src/core/WorkspaceBar.jsx`
* **Changes**:
  - Replaced legacy placeholder metrics with live mock data aligned with `adPersonaData.js` and `adPmWorkflowData.js`.
  - Updated info chips to concise labels that fit standard viewports without horizontal clipping:
    - 🔴 `3 Critical Gated` (Urgent decision lane items)
    - 🟣 `Release 4.2 Program` (Active vehicle program scope)
    - 🟢 `20 Subscriptions Active` (Active model, agent, and tool seats)
  - Synced high-level KPIs: `RELEASE READINESS: 88%` and `SAFETY COMPLIANCE: 96.4%`.
* **Rationale**:
  - The previous chip labels (`Sprint 42 — Backlog Refinement`, `8 User Stories In Progress`, `3 Epics Active`) were excessively verbose, causing right-edge badges to be pushed offscreen.
  - The updated schema connects directly to the Product Owner's active sprint context.

### 3.2 `frontend/src/core/PersonaHero.jsx`
* **Changes**:
  - Refactored the top banner card from a single wide horizontal row into a structured 2-tier right-aligned stack:
    - **Top Line (Left)**: Domain and Role title with clean, un-broken subtitle.
    - **Top Line (Right)**: `PLATFORM` | `SHIFT` | `SHIFT PROGRESS` | (with vertical dividers).
    - **Bottom Line (Right)**: The 3 contextual status badges aligned horizontally directly underneath the metadata row.
* **Rationale**:
  - On displays between 1024px and 1366px, having Title + Subtitle + 3 Metadata columns + 3 Chips on a single horizontal row demanded over 1,250px of horizontal width, forcing chips to wrap unpredictably or clip past the viewport edge.
  - The 2-tier layout reduces required width to ~800px, ensuring pixel-perfect display on all screens while preserving visual hierarchy.

### 3.3 `frontend/src/App.jsx`
* **Changes**:
  - Updated `<AiForAdDomain activeTab={activeTab} onTabChange={setActiveTab} selectedRole={selectedRole} />` to pass the active role.
  - Updated `inboxCount` logic from `12` to `9` for `AI for AD` to match the 9 PRD items in `adPmWorkflowData.js`.
* **Rationale**:
  - Ensures the domain entry point is aware of role transitions (Product Owner vs. future roles).
  - Eliminates count discrepancies between the navigation tab badge and the inbox category cards.

### 3.4 `frontend/vite.config.js`
* **Changes**:
  - Added proxy configuration:
    ```javascript
    '/api/automation-agents': {
      target: 'https://sel-nexus.com',
      changeOrigin: true,
      secure: false
    }
    ```
  - Added explicit extension resolution: `extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`.
* **Rationale**:
  - The Brownfield Automation Pipeline submits multipart form data to `https://sel-nexus.com/api/automation-agents/external/start`. The proxy prevents browser CORS violations during development and deployment.

---

## 4. AI for AD Architecture Restructuring

### 4.1 Multi-Role Architectural Vision
Historically, all files for the Product Owner role were placed directly inside `frontend/src/domains/ai-for-ad/`. As the Stellantis operating model expands, `AI for AD` will incorporate additional engineering roles (e.g., **Lead Architect**, **System Safety Engineer**, **Embedded Software Engineer**).

To prevent technical debt and merge conflicts, the domain was restructured into role-specific subfolders.

### 4.2 Frontend File Organization

```
frontend/src/domains/ai-for-ad/
├── index.jsx                         # Multi-Role Domain Dispatcher
├── product-owner/                    # Dedicated Product Owner Role Directory
│   ├── index.jsx                     # ProductOwnerRole tab entry
│   ├── pages/                        # 9 Product Owner Views
│   │   ├── AdDashboard.jsx           # 8-Card Situational Awareness Dashboard
│   │   ├── AdWorkflowInbox.jsx       # Decision Cockpit (Approvals, Reviews)
│   │   ├── AdExperienceZone.jsx      # Experience Zone Shell with Sub-Tabs
│   │   ├── AdPersonaDashboard.jsx    # Autonomous Driving Persona Operations
│   │   ├── AdPmWorkflowInbox.jsx     # PM Decision Stream & Urgency Lanes
│   │   ├── AdModelCatalogue.jsx      # Automotive Foundation Models
│   │   ├── AdAgentWorkflowCatalogue.jsx # 8 Foundation Autonomous Agents
│   │   ├── AdAiToolsCatalogue.jsx    # 10 Automotive Engineering Tool Categories
│   │   └── AdMySubscriptions.jsx     # Enterprise Subscription Manager
│   ├── components/dashboard/         # 10 Dashboard Cards & Interactive Modals
│   │   ├── BacklogHealthCard.jsx
│   │   ├── BusinessValueCard.jsx
│   │   ├── DeliveryMetricsCard.jsx
│   │   ├── DependencyRiskCard.jsx
│   │   ├── FeatureStatusCard.jsx
│   │   ├── ReleaseReadinessCard.jsx
│   │   ├── ReleaseSimulationModal.jsx
│   │   ├── RequirementQualityCard.jsx
│   │   ├── RoadmapHorizonCard.jsx
│   │   └── StoryDoctorModal.jsx
│   ├── adAgentCatalogue.css          # Styling for Agent Catalogue
│   ├── adAiToolsCatalogue.css        # Styling for Tools Catalogue & Nexus Glow Button
│   ├── adDashboard.css               # Styling for PO Dashboard
│   ├── adModelCatalogue.css          # Styling for Foundation Model Catalogue
│   ├── adMySubscriptions.css         # Styling for Subscriptions View
│   ├── adPersonaDashboard.css        # Styling for Persona Operations
│   ├── adPmWorkflowInbox.css         # Styling for Workflow Decision Cockpit
│   ├── adWorkflowInbox.css           # Styling for Legacy Inbox
│   ├── adPersonaData.js              # Persona & Operational Telemetry Dataset
│   ├── adPmWorkflowData.js           # 9 PRD Decision Items across 3 Lanes
│   └── mockData.js                   # 8 Dashboard Cards Single Source of Truth
└── sel-nexus-implementation/         # SEL Nexus Integration Module
    ├── BrownfieldModal.jsx           # PRD Upload & Pipeline Trigger Form Modal
    ├── SelNexusModal.jsx             # Green Field / Brownfield Option Selector
    ├── SelNexusFlow.jsx              # Orchestrator & Transition Coordinator
    ├── index.js                      # Clean Module Exports
    └── selNexus.css                  # High-Contrast Corporate Modal Styling
```

### 4.3 Backend File Organization

```
backend/src/domains/ai-for-ad/
├── routes.js                         # AI for AD Domain Router (delegator)
└── product-owner/                    # Product Owner Backend Subfolder
    ├── routes.js                     # REST Endpoints for PO Operations
    └── mockData.js                   # PO Backend Single Source of Truth
```

* **Backward Compatibility**: `backend/src/domains/ai-for-ad/routes.js` mounts `productOwnerRouter` at both `/api/ad/*` and `/api/ad/product-owner/*`. All existing frontend API calls (`/api/ad/dashboard`, `/api/ad/simulate-release`, `/api/ad/auto-enhance-backlog`, `/api/ad/apply-mitigation`) continue to work seamlessly with zero changes needed.

---

## 5. SEL Nexus Automation Suite Details

### 5.1 Trigger Button
- Embedded in [`AdAiToolsCatalogue.jsx`](file:///c:/Users/2862390/Desktop/PoC/10.Stellantis/Stellantis-New/Stellantis-New-Hub/frontend/src/domains/ai-for-ad/product-owner/pages/AdAiToolsCatalogue.jsx) inside the AI Tool Engineering Capability header card.
- Features a glowing ambient border animation (`nexusFlowRotate` 2.2s infinite rotation) with high contrast in both light and dark modes.

### 5.2 Two-Stage Modal Flow
1. **Stage 1 — Option Selector (`SelNexusModal.jsx`)**:
   - **Green Field**: Launches `https://sel-nexus.com/agents/automation/brd` in a new secure browser tab (`_blank`, `noopener,noreferrer`).
   - **Application Enhancements (Brownfield)**: Transitions the view to Stage 2.
2. **Stage 2 — Brownfield Pipeline Trigger (`BrownfieldModal.jsx`)**:
   - **Randomized Pipeline Identifier**: Auto-generates names (e.g. `brownfield_4821`).
   - **Form Fields**: Pipeline Name, Feature Description (without AI enhance tag), and Drag-and-Drop PRD Upload (`.pdf`, `.docx`, `.md`, `.txt`).
   - **Submission**: Sends a multipart/form-data POST request to `/api/automation-agents/external/start`.
   - **URL Normalization**: Translates raw AWS App Runner endpoints (`https://xxx.awsapprunner.com`) to `https://sel-nexus.com`.
   - **Automatic Redirection**: Opens live execution tracking in a new tab upon successful API response, displays a success banner with direct link, and provides a Done confirmation button.

---

## 6. Chronological Log of Changes

### Phase 1: Core Navigation & Clean Mock Data
- Removed dropdown icons where inappropriate and standardized ChevronDown indicators.
- Ensured all personal names (`Lavanya`, `Vishnu`, `Sreeja`) were completely scrubbed across all mock data, component templates, and documentation.
- Formatted workflow inbox sub-tabs to fill container width with clean rectangular borders matching the Stellantis design system.

### Phase 2: SEL Nexus Button & Modal Flow
- Implemented `SelNexusModal.jsx`, `BrownfieldModal.jsx`, `SelNexusFlow.jsx`, and `selNexus.css`.
- Added glowing border animation in `adAiToolsCatalogue.css`.
- Fixed click handlers ensuring seamless modal transitions and error-free API submissions.

### Phase 3: Domain Restructuring (Product Owner Isolation)
- Created `product-owner/` directories in both frontend and backend.
- Migrated all 9 PO pages, 10 dashboard cards, 8 CSS stylesheets, and 3 mock data files into `frontend/src/domains/ai-for-ad/product-owner/`.
- Migrated backend routes and mock data into `backend/src/domains/ai-for-ad/product-owner/`.
- Configured domain routers (`index.jsx` in frontend, `routes.js` in backend) to dispatch based on role, providing clean scalability for future roles.

### Phase 4: Hero Banner Sync & Universal Alignment Polish
- Synced `DOMAIN_PERSONA_MAP['AI for AD']` with live mock data.
- Refactored `PersonaHero.jsx` to a 2-tier right-aligned header layout.
- Verified that all badges stay completely inside card boundaries without clipping or wrapping awkwardly.
- Applied alignment universally across all roles for visual harmony.
- Cleaned up obsolete `FloatingNexus.jsx`.

---

## 7. Git Push Readiness & Verification Checklist

| Verification Step | Command / Check | Result | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Production Build** | `npm run build` (in `frontend/`) | 1,909 modules transformed, 0 errors, 0 warnings (822ms) | ✅ PASS |
| **Backend Server Import** | `node -e "import('./server.js')"` | Server loads successfully, routes registered cleanly | ✅ PASS |
| **Personal Name Scrubbing** | Regex search for `Lavanya\|Vishnu\|Sreeja` | 0 instances in source code or datasets | ✅ PASS |
| **Dead Code Cleanup** | Removed `FloatingNexus.jsx` | 0 dangling imports or broken references | ✅ PASS |
| **Dark Mode Compliance** | Tested `[data-theme="dark"]` styles | High contrast across cards, modals, and badges | ✅ PASS |

### Ready for Git Commit & Push
All code changes are complete, isolated, and verified error-free. You can safely stage and push the changes:
```bash
git add .
git commit -m "feat(ad): complete AI for AD product-owner modular restructuring, hero banner alignment, and documentation"
git push origin main
```
