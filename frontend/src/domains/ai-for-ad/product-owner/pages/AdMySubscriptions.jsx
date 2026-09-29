import React, { useState, useMemo } from 'react';
import {
  BookmarkCheck,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  Clock,
  Database,
  Lock,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  Plus,
  ChevronDown,
  Gauge,
  Cpu,
  Activity,
  Zap,
  RefreshCw,
  TrendingUp,
  Sliders,
  FolderGit2,
  Bell,
  BarChart3,
  Wrench,
  Bot
} from 'lucide-react';
import '../adMySubscriptions.css';

// 8 Categories specified in PRD §5.6
const CATEGORIES = [
  { id: 'all', label: 'All Subscriptions' },
  { id: 'Model', label: 'Models' },
  { id: 'Agent', label: 'Agents' },
  { id: 'Workflow', label: 'Workflows' },
  { id: 'AI Tool', label: 'AI Tools' },
  { id: 'Project', label: 'Projects' },
  { id: 'Notification', label: 'Notifications' },
  { id: 'Governance', label: 'Governance Policies' },
  { id: 'Dashboard', label: 'Reports & Dashboards' }
];

// 5 Inheritance Levels
const LEVELS = ['All Levels', 'Individual', 'Team', 'Project', 'Portfolio', 'Enterprise'];

// 20 Reused Ecosystem Subscriptions (Direct match to PRD checklist & Tabs 1–5)
const INITIAL_SUBSCRIPTIONS = [
  // 1. MODELS (3)
  {
    id: 'sub-mod-1',
    name: 'Claude Sonnet 5',
    category: 'Model',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Carl (Product Manager) Sandbox',
    quotaReadout: '62% of monthly token quota used',
    telemetry: '620,000 / 1,000,000 Tokens (EU Frankfurt)',
    status: 'Active • Renews in 18d',
    isExpiring: false,
    burnPct: 62,
    details: 'Primary foundation model for automotive requirement drafting and ISO 26262 verification test suites.'
  },
  {
    id: 'sub-mod-2',
    name: 'VisionTransformer v2',
    category: 'Model',
    level: 'Project',
    tagClass: 'ad-tag-project',
    scope: 'Release 4.2 Program',
    quotaReadout: '8,900 inference calls today',
    telemetry: 'Uncapped Edge Compute (NVIDIA DRIVE Orin)',
    status: 'Active • Perpetual License',
    isExpiring: false,
    burnPct: 59,
    details: 'Camera proposal detector running on-vehicle in proving ground test fleet.'
  },
  {
    id: 'sub-mod-3',
    name: 'Radar Fusion Model v3',
    category: 'Model',
    level: 'Project',
    tagClass: 'ad-tag-project',
    scope: 'Release 4.2 Program',
    quotaReadout: 'Continental ARS548 77GHz sync',
    telemetry: '14.2M sensor proposals processed / 24h',
    status: 'Active • Perpetual License',
    isExpiring: false,
    burnPct: 48,
    details: 'Continuous radar point cloud arbitration pipeline with 8ms deterministic loop.'
  },

  // 2. AGENTS (2)
  {
    id: 'sub-agt-1',
    name: 'Fusion Confidence Scorer Agent',
    category: 'Agent',
    level: 'Project',
    tagClass: 'ad-tag-project',
    scope: 'Release 4.2 Program',
    quotaReadout: '94% Precision • 1,240 runs today',
    telemetry: 'Autonomous Sentinel • 0 Fatal Errors',
    status: 'Active • Continuous HIL',
    isExpiring: false,
    burnPct: 72,
    details: 'Scores fused radar+camera object detections for statistical confidence.'
  },
  {
    id: 'sub-agt-2',
    name: 'Requirements Engine (AI)',
    category: 'Agent',
    level: 'Team',
    tagClass: 'ad-tag-team',
    scope: 'Product Management Team',
    quotaReadout: '88% PO acceptance rate this sprint',
    telemetry: '42 User Stories Refined • 14min mean turnaround',
    status: 'Active • Renews in 30d',
    isExpiring: false,
    burnPct: 40,
    details: 'Synthesizes customer & Euro NCAP specifications into structured user stories.'
  },

  // 3. WORKFLOWS (1)
  {
    id: 'sub-wf-1',
    name: 'Radar-Vision Fusion Workflow',
    category: 'Workflow',
    level: 'Project',
    tagClass: 'ad-tag-project',
    scope: 'Release 4.2 Program',
    quotaReadout: '96% pipeline success • 8.0ms budget',
    telemetry: 'Multi-Agent Orchestration • 0 Frame Drops (24h)',
    status: 'Active • Continuous',
    isExpiring: false,
    burnPct: 65,
    details: 'Multi-agent orchestration combining Continental radar point clouds with front camera object proposals.'
  },

  // 4. AI TOOLS (4)
  {
    id: 'sub-tool-1',
    name: 'CodePilot Pro',
    category: 'AI Tool',
    level: 'Team',
    tagClass: 'ad-tag-team',
    scope: 'Ops Engineering Squad',
    quotaReadout: '12 of 15 developer seats used',
    telemetry: 'Automated code completion & MISRA linter',
    status: 'Expires in 14 days',
    isExpiring: true,
    burnPct: 80,
    details: 'AI code completion and real-time MISRA C++ linting assistant.'
  },
  {
    id: 'sub-tool-2',
    name: 'HIL Test Orchestrator',
    category: 'AI Tool',
    level: 'Portfolio',
    tagClass: 'ad-tag-portfolio',
    scope: 'L2+ Autonomous Systems Portfolio',
    quotaReadout: 'Balocco Test Benches #1–#4',
    telemetry: '4 Hardware-in-the-Loop Rigs Connected',
    status: 'Active • Enterprise Site License',
    isExpiring: false,
    burnPct: 86,
    details: 'Hardware-in-the-loop test execution engine for automated Balocco simulation runs.'
  },
  {
    id: 'sub-tool-3',
    name: 'SecureScan AI',
    category: 'AI Tool',
    level: 'Portfolio',
    tagClass: 'ad-tag-portfolio',
    scope: 'L2+ Autonomous Systems Portfolio',
    quotaReadout: '71 engineering teams active',
    telemetry: 'ISO 26262 vulnerability scanner & dependency CVE auditor',
    status: 'Active • Annual Subscription',
    isExpiring: false,
    burnPct: 45,
    details: 'Continuous cybersecurity and ISO 26262 compliance vulnerability scanner.'
  },
  {
    id: 'sub-tool-4',
    name: 'ObservaAI',
    category: 'AI Tool',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Personal PM Watchdog (Carl)',
    quotaReadout: 'VisionTransformer v2 alert stream',
    telemetry: 'Real-time drift detection & Orin NPU latency telemetry',
    status: 'Active • Direct Hook',
    isExpiring: false,
    burnPct: 35,
    details: 'Personal observability watchdog alerting Carl to runtime drift on production models.'
  },

  // 5. PROJECTS (3)
  {
    id: 'sub-proj-1',
    name: 'Release 4.2 Program',
    category: 'Project',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Primary Engineering Program',
    quotaReadout: 'Assigned Lead Product Manager Role',
    telemetry: 'Active Sprint 43 • Target Readiness 91%',
    status: 'Active • In Sprint 43',
    isExpiring: false,
    burnPct: 91,
    details: 'Flagship commercial program for Level 2+ Highway Assist automated driving software.'
  },
  {
    id: 'sub-proj-2',
    name: 'Next-Gen Perception R&D',
    category: 'Project',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Advanced Exploratory Sandbox',
    quotaReadout: 'Assigned Exploratory PM Role',
    telemetry: 'Synthetic edge-case evaluation & LiDAR fusion tests',
    status: 'Active • Exploration Phase',
    isExpiring: false,
    burnPct: 25,
    details: 'Next-generation perception R&D incorporating high-resolution imaging radar.'
  },
  {
    id: 'sub-proj-3',
    name: 'Release 3.4 Maintenance',
    category: 'Project',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Sustaining Fleet Operations',
    quotaReadout: 'Assigned Maintenance PM Role',
    telemetry: '120,000 production vehicles supported OTA',
    status: 'Active • Patch Cycle',
    isExpiring: false,
    burnPct: 18,
    details: 'Sustaining engineering and OTA security patch pipeline for deployed fleet.'
  },

  // 6. NOTIFICATIONS (2)
  {
    id: 'sub-notif-1',
    name: 'Model Drift Alerts (VTv2)',
    category: 'Notification',
    level: 'Individual',
    tagClass: 'ad-tag-individual',
    scope: 'Direct Push Routing to Workflow Inbox',
    quotaReadout: 'High-priority IoU threshold drift',
    telemetry: 'Instant notification on -3.2% IoU drift spike',
    status: 'Active • Real-Time Hook',
    isExpiring: false,
    burnPct: 50,
    details: 'Immediate push notification routed to PM inbox whenever camera model precision drifts.'
  },
  {
    id: 'sub-notif-2',
    name: 'Release Readiness Daily Digest',
    category: 'Notification',
    level: 'Team',
    tagClass: 'ad-tag-team',
    scope: 'Product Management Team',
    quotaReadout: '08:00 CET Daily Automated Brief',
    telemetry: 'Summarizes HIL simulation passes & blocker PRs',
    status: 'Active • Daily Digest',
    isExpiring: false,
    burnPct: 100,
    details: 'Automated morning brief delivering executive status of Release 4.2 safety gates.'
  },

  // 7. GOVERNANCE POLICIES (2)
  {
    id: 'sub-gov-1',
    name: 'ASIL-D Compliance Review Policy',
    category: 'Governance',
    level: 'Portfolio',
    tagClass: 'ad-tag-portfolio',
    scope: 'L2+ Autonomous Systems Portfolio',
    quotaReadout: 'Mandatory Dual-Key Gate Enforced',
    telemetry: 'Requires Lead Safety Engineer co-signature (Dr. Marco V.)',
    status: 'Enforced • ISO 26262 Part 3',
    isExpiring: false,
    burnPct: 100,
    details: 'Safety governance policy preventing solo approval of ASIL-D exception tickets.'
  },
  {
    id: 'sub-gov-2',
    name: 'Global Data Residency Policy',
    category: 'Governance',
    level: 'Enterprise',
    tagClass: 'ad-tag-enterprise',
    scope: 'Stellantis Group-Wide Directive',
    quotaReadout: 'EU Frankfurt On-Prem Sovereign Boundary',
    telemetry: 'Prohibits confidential vehicle telemetry egress to public clouds',
    status: 'Enforced • Corporate AI Safety',
    isExpiring: false,
    burnPct: 100,
    details: 'Corporate directive governing sovereign AI execution on private clusters.'
  },

  // 8. REPORTS & DASHBOARDS (3)
  {
    id: 'sub-dash-1',
    name: 'Release Readiness Report',
    category: 'Dashboard',
    level: 'Project',
    tagClass: 'ad-tag-project',
    scope: 'Release 4.2 Program',
    quotaReadout: '86% HIL Coverage • 91% Go Probability',
    telemetry: 'Live automated synchronization with CI/CD and Balocco rig',
    status: 'Live Sync • Automated',
    isExpiring: false,
    burnPct: 91,
    details: 'Dynamic dashboard displaying software maturity, HIL test metrics, and bug trends.'
  },
  {
    id: 'sub-dash-2',
    name: 'Governance Compliance Dashboard',
    category: 'Dashboard',
    level: 'Portfolio',
    tagClass: 'ad-tag-portfolio',
    scope: 'L2+ Autonomous Systems Portfolio',
    quotaReadout: '87% Composite Compliance Score',
    telemetry: 'Weekly automated audit rollup across all 18 AD workstreams',
    status: 'Live Sync • Weekly',
    isExpiring: false,
    burnPct: 87,
    details: 'Executive compliance overview auditing ISO 26262, UNECE R157, and Stellantis standards.'
  },
  {
    id: 'sub-dash-3',
    name: 'AI Usage Reporting Dashboard',
    category: 'Dashboard',
    level: 'Enterprise',
    tagClass: 'ad-tag-enterprise',
    scope: 'Stellantis Central AI Office',
    quotaReadout: 'Group-wide compute telemetry',
    telemetry: 'Monthly token consumption, GPU cluster utilization, and cost quotas',
    status: 'Live Sync • Monthly',
    isExpiring: false,
    burnPct: 68,
    details: 'Enterprise-level cost accounting and token utilization analytics across all business units.'
  }
];

export default function AdMySubscriptions() {
  // Subscriptions Inventory State (supports live unsubscribe and renewal)
  const [subscriptionsList, setSubscriptionsList] = useState(INITIAL_SUBSCRIPTIONS);
  const [unsubscribedItem, setUnsubscribedItem] = useState(null);

  // Filters State
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [unsubModalItem, setUnsubModalItem] = useState(null);
  const [upgradeModalItem, setUpgradeModalItem] = useState(null);
  const [upgradeQuotaValue, setUpgradeQuotaValue] = useState('+50% Quota Allowance');
  const [renewModalItem, setRenewModalItem] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);
  const [toastUndoAction, setToastUndoAction] = useState(null);

  const showToast = (msg, undoFn = null) => {
    setToastMessage(msg);
    setToastUndoAction(undoFn ? () => undoFn : null);
    setTimeout(() => {
      setToastMessage(null);
      setToastUndoAction(null);
    }, 4500);
  };

  // Dynamic Summary Counts across the 5 Inheritance Levels
  const levelCounts = useMemo(() => {
    return {
      Individual: subscriptionsList.filter(s => s.level === 'Individual').length,
      Team: subscriptionsList.filter(s => s.level === 'Team').length,
      Project: subscriptionsList.filter(s => s.level === 'Project').length,
      Portfolio: subscriptionsList.filter(s => s.level === 'Portfolio').length,
      Enterprise: subscriptionsList.filter(s => s.level === 'Enterprise').length,
      Total: subscriptionsList.length
    };
  }, [subscriptionsList]);

  // Category counts (for filter chip badges)
  const categoryCounts = useMemo(() => {
    const counts = { all: subscriptionsList.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = subscriptionsList.filter(s => s.category === cat.id).length;
      }
    });
    return counts;
  }, [subscriptionsList]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptionsList.filter(sub => {
      // 1. Category Filter
      if (activeCategory !== 'all' && sub.category !== activeCategory) {
        return false;
      }
      // 2. Level Filter
      if (activeLevel !== 'All Levels' && sub.level !== activeLevel) {
        return false;
      }
      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = sub.name.toLowerCase().includes(q) ||
          sub.category.toLowerCase().includes(q) ||
          sub.scope.toLowerCase().includes(q) ||
          sub.quotaReadout.toLowerCase().includes(q) ||
          sub.telemetry.toLowerCase().includes(q) ||
          sub.level.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [subscriptionsList, activeCategory, activeLevel, searchQuery]);

  // Handle Unsubscribe Confirmation
  const handleConfirmUnsubscribe = () => {
    if (!unsubModalItem) return;
    const removedItem = unsubModalItem;
    setSubscriptionsList(prev => prev.filter(s => s.id !== removedItem.id));
    setUnsubscribedItem(removedItem);
    setUnsubModalItem(null);

    showToast(`Unsubscribed from ${removedItem.name}`, () => {
      // Undo callback
      setSubscriptionsList(prev => [removedItem, ...prev]);
      showToast(`Restored subscription to ${removedItem.name}`);
    });
  };

  // Handle Upgrade Submission
  const handleConfirmUpgrade = () => {
    if (!upgradeModalItem) return;
    showToast(`Upgrade request (${upgradeQuotaValue}) submitted for ${upgradeModalItem.name}. Dispatched to AI Governance Office.`);
    setUpgradeModalItem(null);
  };

  // Handle License Renewal (e.g. for CodePilot Pro)
  const handleConfirmRenew = () => {
    if (!renewModalItem) return;
    setSubscriptionsList(prev => prev.map(s => {
      if (s.id === renewModalItem.id) {
        return {
          ...s,
          isExpiring: false,
          status: 'Active • Renews in 365d'
        };
      }
      return s;
    }));
    showToast(`Subscription to ${renewModalItem.name} successfully renewed for 1 year.`);
    setRenewModalItem(null);
  };

  return (
    <div className="ad-subs-container">

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="ad-inbox-toast" style={{ bottom: '24px', right: '24px', zIndex: 2000 }}>
          <div className="ad-inbox-toast-dot" />
          <span>{toastMessage}</span>
          {toastUndoAction && (
            <button
              onClick={() => {
                toastUndoAction();
                setToastMessage(null);
              }}
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: '#3b82f6',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.72rem'
              }}
            >
              Undo
            </button>
          )}
          <button onClick={() => setToastMessage(null)} className="ad-inbox-toast-close">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="ad-subs-header-card">
        <div className="ad-subs-header-top">
          <div className="ad-subs-header-title-group">
            <div className="ad-subs-header-icon">
              <BookmarkCheck size={22} />
            </div>
            <div className="ad-subs-header-text">
              <h2>
                <span>My Subscriptions</span>
                <span className="st-badge badge-info" style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                  {subscriptionsList.length} Active Subscriptions
                </span>
              </h2>
              <p>Consolidated operational view of all models, agents, tools, projects, and governance policies granted across the 5-tier inheritance stack.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveLevel('All Levels');
              setSearchQuery('');
              showToast('Filters reset to view all active subscriptions');
            }}
            className="ad-btn-sub-action"
            style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={13} />
            <span>Reset View</span>
          </button>
        </div>

        {/* Top Summary Strip: Level Distribution */}
        <div className="ad-subs-summary-strip">
          <span className="ad-subs-summary-label">
            <Layers size={13} style={{ color: 'var(--text-muted)' }} />
            <span>Inheritance Distribution:</span>
          </span>
          <span className="ad-subs-summary-pill ad-tag-individual">
            Individual ({levelCounts.Individual})
          </span>
          <span className="ad-subs-summary-pill ad-tag-team">
            Team ({levelCounts.Team})
          </span>
          <span className="ad-subs-summary-pill ad-tag-project">
            Project ({levelCounts.Project})
          </span>
          <span className="ad-subs-summary-pill ad-tag-portfolio">
            Portfolio ({levelCounts.Portfolio})
          </span>
          <span className="ad-subs-summary-pill ad-tag-enterprise">
            Enterprise ({levelCounts.Enterprise})
          </span>
          <span style={{ marginLeft: 'auto', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            Total: {levelCounts.Total} Active
          </span>
        </div>
      </div>

      {/* Controls Bar: Category Chips, Level Filter & Search */}
      <div className="ad-subs-controls-bar">
        {/* Row 1: Category Filter Chips */}
        <div className="ad-subs-controls-row-1">
          <div className="ad-subs-category-track">
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`ad-subs-cat-chip ${isActive ? 'active' : ''}`}
                >
                  <span>{cat.label}</span>
                  <span className="ad-subs-cat-chip-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Level Toggle & Search Box */}
        <div className="ad-subs-controls-row-2">
          {/* Level Filter Buttons */}
          <div className="ad-subs-level-track">
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`ad-subs-level-btn ${activeLevel === lvl ? 'active' : ''}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="ad-subs-search-box">
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search subscriptions by title, scope, or quota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ad-subs-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Standardized Flat Card Grid (Equal Visual Weight) */}
      {filteredSubscriptions.length === 0 ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface-primary)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          <BookmarkCheck size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>No Subscriptions Match Criteria</h4>
          <p style={{ margin: '4px 0 16px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Try selecting a different Category, Inheritance Level, or clearing the search query.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveLevel('All Levels');
              setSearchQuery('');
            }}
            className="ad-btn-sub-upgrade"
          >
            Show All Subscriptions
          </button>
        </div>
      ) : (
        <div className="ad-subs-grid">
          {filteredSubscriptions.map(sub => (
            <div
              key={sub.id}
              className={`ad-sub-card ${sub.isExpiring ? 'expiring' : ''}`}
            >
              {/* Card Header with Standardized Color-Coded Corner Tag */}
              <div className="ad-sub-card-header">
                <div className="ad-sub-card-title-wrap">
                  <h3 className="ad-sub-card-title">{sub.name}</h3>
                  <div className="ad-sub-card-meta">
                    <span>Category: {sub.category}</span>
                  </div>
                </div>
                {/* Standardized Corner Tag */}
                <span className={`ad-corner-tag ${sub.tagClass}`}>
                  {sub.level}
                </span>
              </div>

              {/* Card Body Details */}
              <div className="ad-sub-card-body">
                <div className="ad-sub-body-line">
                  <span className="ad-sub-body-label">Scope:</span>
                  <span className="ad-sub-body-value">{sub.scope}</span>
                </div>
                <div className="ad-sub-body-line">
                  <span className="ad-sub-body-label">Quota:</span>
                  <span className="ad-sub-body-value" style={{ fontWeight: 600 }}>{sub.quotaReadout}</span>
                </div>
                <div className="ad-sub-body-line">
                  <span className="ad-sub-body-label">Telemetry:</span>
                  <span className="ad-sub-body-value" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.telemetry}</span>
                </div>
              </div>

              {/* Expiration & Status Line */}
              <div className="ad-sub-status-line">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {sub.isExpiring ? (
                    <span className="ad-sub-expiring-badge">
                      <Clock size={11} />
                      <span>{sub.status}</span>
                    </span>
                  ) : (
                    <span className="st-badge badge-success" style={{ fontSize: '0.65rem' }}>
                      {sub.status}
                    </span>
                  )}
                </div>

                {sub.burnPct !== null && (
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    Burn: {sub.burnPct}%
                  </span>
                )}
              </div>

              {/* Action Buttons Strip */}
              <div className="ad-sub-card-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setDrawerItem(sub)}
                    className="ad-btn-sub-action"
                    title="Inspect real-time telemetry usage"
                  >
                    View Usage
                  </button>

                  <button
                    onClick={() => setUpgradeModalItem(sub)}
                    className="ad-btn-sub-upgrade"
                    title="Request quota or seat upgrade"
                  >
                    Upgrade
                  </button>

                  {/* Renew action for expiring items */}
                  {sub.isExpiring && (
                    <button
                      onClick={() => setRenewModalItem(sub)}
                      className="ad-btn-sub-renew"
                      title="Renew license"
                    >
                      <RefreshCw size={11} />
                      <span>Renew</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setUnsubModalItem(sub)}
                  className="ad-btn-sub-unsub"
                  title="Unsubscribe from this entity"
                >
                  Unsubscribe
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================================================================= */}
      {/* REAL-TIME TELEMETRY & USAGE SLIDE-OVER DRAWER                     */}
      {/* ================================================================= */}
      {drawerItem && (
        <div className="ad-subs-drawer-backdrop" onClick={() => setDrawerItem(null)}>
          <div className="ad-subs-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ad-subs-drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className={`ad-corner-tag ${drawerItem.tagClass}`}>
                    {drawerItem.level} Scope
                  </span>
                  <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
                    {drawerItem.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {drawerItem.name}
                </h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
                  {drawerItem.scope}
                </div>
              </div>
              <button onClick={() => setDrawerItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ad-subs-drawer-body">
              {/* Description */}
              <div className="ad-subs-drawer-section">
                <span className="ad-subs-drawer-section-title">Subscription Overview</span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {drawerItem.details}
                </p>
              </div>

              {/* Monthly Quota Burn Gauge */}
              <div className="ad-subs-drawer-section">
                <span className="ad-subs-drawer-section-title">Active Quota Consumption</span>
                <div className="ad-subs-burn-gauge">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Monthly Token / Capacity Burn</strong>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: drawerItem.burnPct > 75 ? '#b45309' : '#1d4ed8' }}>
                      {drawerItem.burnPct}%
                    </span>
                  </div>
                  <div className="ad-subs-burn-bar-track">
                    <div
                      className="ad-subs-burn-bar-fill"
                      style={{
                        width: `${drawerItem.burnPct}%`,
                        background: drawerItem.burnPct > 75 ? '#f59e0b' : '#3b82f6'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {drawerItem.quotaReadout}
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="ad-subs-drawer-section">
                <span className="ad-subs-drawer-section-title">Telemetry &amp; Audit Trace</span>
                <div className="ad-subs-metric-grid">
                  <div className="ad-subs-metric-box">
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Status</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{drawerItem.status}</div>
                  </div>
                  <div className="ad-subs-metric-box">
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Inheritance Level</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{drawerItem.level} Tier</div>
                  </div>
                  <div className="ad-subs-metric-box" style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Real-Time Telemetry Stream</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                      {drawerItem.telemetry}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Strip inside Drawer */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => {
                    const item = drawerItem;
                    setDrawerItem(null);
                    setUpgradeModalItem(item);
                  }}
                  className="ad-btn-sub-upgrade"
                  style={{ flex: 1, padding: '8px 12px' }}
                >
                  Request Quota Upgrade
                </button>
                <button
                  onClick={() => {
                    const item = drawerItem;
                    setDrawerItem(null);
                    setUnsubModalItem(item);
                  }}
                  className="ad-btn-sub-action"
                  style={{ padding: '8px 12px', color: '#ef4444' }}
                >
                  Unsubscribe
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* UNSUBSCRIBE CONFIRMATION MODAL                                    */}
      {/* ================================================================= */}
      {unsubModalItem && (
        <div className="ad-subs-modal-backdrop" onClick={() => setUnsubModalItem(null)}>
          <div className="ad-subs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--badge-critical-bg)', color: 'var(--badge-critical-text)', border: '1px solid var(--badge-critical-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>Unsubscribe Confirmation</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{unsubModalItem.name}</div>
                </div>
              </div>
              <button onClick={() => setUnsubModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Are you sure you want to drop your subscription to <strong>{unsubModalItem.name}</strong> ({unsubModalItem.level} Scope)?
              </p>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--badge-critical-bg)', border: '1px solid var(--badge-critical-border)', color: 'var(--badge-critical-text)', fontSize: '0.72rem' }}>
                <strong>Revocation Notice:</strong> Dropping this subscription will revoke associated API credentials, mute telemetry alert hooks, and notify the responsible squad lead.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setUnsubModalItem(null)} className="ad-btn-sub-action">
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmUnsubscribe}
                className="ad-btn-sub-action"
                style={{ background: '#dc2626', color: '#ffffff', borderColor: '#b91c1c', fontWeight: 700 }}
              >
                Confirm Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* REQUEST UPGRADE / QUOTA ADJUSTMENT MODAL                          */}
      {/* ================================================================= */}
      {upgradeModalItem && (
        <div className="ad-subs-modal-backdrop" onClick={() => setUpgradeModalItem(null)}>
          <div className="ad-subs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--badge-info-bg)', color: 'var(--badge-info-text)', border: '1px solid var(--badge-info-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>Request Quota Upgrade</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{upgradeModalItem.name}</div>
                </div>
              </div>
              <button onClick={() => setUpgradeModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Submit a capacity adjustment request to the Stellantis AI Governance Office:
              </p>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Requested Quota Adjustment</label>
                <select
                  value={upgradeQuotaValue}
                  onChange={(e) => setUpgradeQuotaValue(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.75rem' }}
                >
                  <option value="+50% Quota Allowance">+50% Additional Capacity / Tokens</option>
                  <option value="+100% (2x Quota Double)">+100% Double Existing Quota</option>
                  <option value="+5 Additional Developer Seats">+5 Additional Team Seats (AI Tools)</option>
                  <option value="Dedicated VPC Cluster Compute">Upgrade to Dedicated VPC Cluster Instance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Engineering Justification</label>
                <input
                  type="text"
                  defaultValue="Required for Release 4.2 Proving Ground milestone test cycles."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-tertiary)', fontSize: '0.75rem' }}
                />
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Requests under €10k portfolio threshold are auto-routed to your Lead Autonomous Driving Architect.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setUpgradeModalItem(null)} className="ad-btn-sub-action">
                Cancel
              </button>
              <button onClick={handleConfirmUpgrade} className="ad-btn-sub-upgrade">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* RENEWAL CONFIRMATION MODAL                                        */}
      {/* ================================================================= */}
      {renewModalItem && (
        <div className="ad-subs-modal-backdrop" onClick={() => setRenewModalItem(null)}>
          <div className="ad-subs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--badge-high-bg)', color: 'var(--badge-high-text)', border: '1px solid var(--badge-high-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>Renew Subscription</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{renewModalItem.name}</div>
                </div>
              </div>
              <button onClick={() => setRenewModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Confirm annual renewal for <strong>{renewModalItem.name}</strong> ({renewModalItem.level} Scope).
              </p>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--badge-high-bg)', border: '1px solid var(--badge-high-border)', color: 'var(--badge-high-text)', fontSize: '0.72rem' }}>
                <strong>Renewal Term:</strong> Extends the 15-seat engineering tool license for an additional 12-month period funded by the L2+ Autonomous Systems Portfolio budget.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setRenewModalItem(null)} className="ad-btn-sub-action">
                Cancel
              </button>
              <button onClick={handleConfirmRenew} className="ad-btn-sub-renew">
                Confirm Renewal (+1 Year)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
