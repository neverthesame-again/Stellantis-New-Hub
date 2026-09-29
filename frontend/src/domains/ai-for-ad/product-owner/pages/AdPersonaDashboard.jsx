import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Bot,
  Wrench,
  BookmarkCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  FileText,
  X,
  Eye,
  Briefcase,
  FolderGit2,
  GitMerge,
  ChevronDown
} from 'lucide-react';
import '../adPersonaDashboard.css';
import {
  personaContextData,
  drillDownLevelsData,
  governanceAuditMatrixData
} from '../adPersonaData';

export default function AdPersonaDashboard({ initialLevel, onNavigateToInbox, onNavigateToSubscriptions }) {
  // Context Selectors (Part A - Group 1)
  const [selectedBU, setSelectedBU] = useState('ai-for-ad');
  const [selectedPortfolio, setSelectedPortfolio] = useState('l2-plus');
  const [selectedProject, setSelectedProject] = useState('release-4-2');
  const [isPulsing, setIsPulsing] = useState(false);

  const selectedBUObj = personaContextData.businessUnits.find((bu) => bu.id === selectedBU) || personaContextData.businessUnits[0];
  const selectedPortfolioObj = personaContextData.portfolios.find((p) => p.id === selectedPortfolio) || personaContextData.portfolios[0];

  // Drill-Down Explorer (Part B)
  const [currentLevel, setCurrentLevel] = useState(initialLevel || 1); // 1 to 6

  // Sync initialLevel when passed dynamically (e.g. from Workflow Inbox deep link)
  useEffect(() => {
    if (initialLevel && initialLevel >= 1 && initialLevel <= 6) {
      setCurrentLevel(initialLevel);
    }
  }, [initialLevel]);

  // Modal 1: Governance Matrix Modal (Active)
  const [showGovMatrixModal, setShowGovMatrixModal] = useState(false);

  // Trigger recalculation pulse when selectors change
  const handleSelectorChange = (type, value) => {
    if (type === 'bu') setSelectedBU(value);
    if (type === 'portfolio') setSelectedPortfolio(value);
    if (type === 'project') setSelectedProject(value);

    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);
  };

  // Get active configuration based on selectedProject
  const activeConfig =
    personaContextData.projectConfigurations[selectedProject] ||
    personaContextData.projectConfigurations['release-4-2'];

  // Get data for current drill-down level
  const activeLevelData = drillDownLevelsData[`level${currentLevel}`] || drillDownLevelsData.level1;

  // Handle drill-down navigation
  const goToLevel = (lvl) => {
    if (lvl < 1 || lvl > 6) return;
    setCurrentLevel(lvl);
  };

  return (
    <div className="ad-persona-container">

      {/* ================================================================= */}
      {/* PART A (UPPER TIER): CONTEXT SELECTORS (GROUP 1)                  */}
      {/* ================================================================= */}
      <div className={`ad-context-bar ${isPulsing ? 'ad-pulse-active' : ''}`}>
        {/* User Role Context (Read-Only Badge) */}
        <div className="ad-context-role-badge">
          <Lock size={13} style={{ color: 'var(--stellantis-action, #0284c7)' }} />
          <span>{personaContextData.userRole.badgeLabel}</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>• Tier 2</span>
        </div>

        {/* Context Fields */}
        <div className="ad-context-dropdowns">
          {/* Business Unit (Static Value Pill) */}
          <div className="ad-context-field">
            <span className="ad-context-label">Business Unit:</span>
            <span className="ad-context-value-pill">
              {selectedBUObj.label}
            </span>
          </div>

          {/* Portfolio (Static Value Pill) */}
          <div className="ad-context-field">
            <span className="ad-context-label">Portfolio:</span>
            <span className="ad-context-value-pill">
              {selectedPortfolioObj.label}
            </span>
          </div>

          {/* Project Assignment (Interactive Selector with Chevron 'v') */}
          <div className="ad-context-field">
            <span className="ad-context-label">Project:</span>
            <div className="ad-context-select-wrapper">
              <select
                value={selectedProject}
                onChange={(e) => handleSelectorChange('project', e.target.value)}
                className="ad-context-select"
              >
                {personaContextData.projectAssignments.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="ad-context-select-chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PART A (UPPER TIER): 4 COMPUTED READ-OUT WIDGETS (4-IN-A-LINE)    */}
      {/* ================================================================= */}
      <div className={`ad-computed-grid ${isPulsing ? 'ad-pulse-active' : ''}`}>
        {/* WIDGET 1: Subscriptions Snapshot */}
        <div className="ad-computed-card">
          <div className="ad-computed-header">
            <div className="ad-computed-title-box">
              <div className="ad-computed-icon-box">
                <BookmarkCheck size={16} />
              </div>
              <span className="ad-computed-title">Subscriptions</span>
            </div>
            <span className="st-badge badge-info">
              {activeConfig.subscriptions.modelsCount + activeConfig.subscriptions.agentsCount + activeConfig.subscriptions.toolsCount} Active
            </span>
          </div>

          <div className="ad-computed-body">
            <div className="ad-computed-kpi">
              <span className="ad-kpi-num">
                {activeConfig.subscriptions.modelsCount + activeConfig.subscriptions.agentsCount + activeConfig.subscriptions.toolsCount}
              </span>
              <span className="ad-kpi-sub">Active Stack Assets</span>
            </div>

            {/* Segmented Micro Distribution Bar: Models / Agents / Tools */}
            <div className="ad-snap-bar" title={`${activeConfig.subscriptions.modelsCount} Models, ${activeConfig.subscriptions.agentsCount} Agents, ${activeConfig.subscriptions.toolsCount} Tools`}>
              <div
                className="ad-snap-seg"
                style={{
                  width: `${(activeConfig.subscriptions.modelsCount / (activeConfig.subscriptions.modelsCount + activeConfig.subscriptions.agentsCount + activeConfig.subscriptions.toolsCount)) * 100}%`,
                  background: '#0284c7'
                }}
              />
              <div
                className="ad-snap-seg"
                style={{
                  width: `${(activeConfig.subscriptions.agentsCount / (activeConfig.subscriptions.modelsCount + activeConfig.subscriptions.agentsCount + activeConfig.subscriptions.toolsCount)) * 100}%`,
                  background: '#8b5cf6'
                }}
              />
              <div
                className="ad-snap-seg"
                style={{
                  width: `${(activeConfig.subscriptions.toolsCount / (activeConfig.subscriptions.modelsCount + activeConfig.subscriptions.agentsCount + activeConfig.subscriptions.toolsCount)) * 100}%`,
                  background: '#10b981'
                }}
              />
            </div>

            <div className="ad-snap-pills-row">
              <span className="ad-snap-pill">
                <Cpu size={11} style={{ color: '#0284c7' }} />
                {activeConfig.subscriptions.modelsCount} Models
              </span>
              <span className="ad-snap-pill">
                <Bot size={11} style={{ color: '#8b5cf6' }} />
                {activeConfig.subscriptions.agentsCount} Agents
              </span>
              <span className="ad-snap-pill">
                <Wrench size={11} style={{ color: '#10b981' }} />
                {activeConfig.subscriptions.toolsCount} Tools
              </span>
            </div>

            <div className="ad-snap-context" title={`${activeConfig.subscriptions.models.join(', ')} & ${activeConfig.subscriptions.toolsCount} tools`}>
              {activeConfig.subscriptions.models.slice(0, 2).join(', ')} &amp; {activeConfig.subscriptions.toolsCount} tools
            </div>
          </div>

          <div className="ad-snap-action-wrapper">
            <button
              onClick={() => {
                if (onNavigateToSubscriptions) {
                  onNavigateToSubscriptions();
                } else {
                  showToast('Navigating to My Subscriptions Catalogue');
                }
              }}
              className="ad-snap-btn-pri"
            >
              <span>Manage Subscriptions</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* WIDGET 2: Approval Authority Limits */}
        <div className="ad-computed-card">
          <div className="ad-computed-header">
            <div className="ad-computed-title-box">
              <div className="ad-computed-icon-box" style={{ color: '#10b981' }}>
                <ShieldCheck size={16} />
              </div>
              <span className="ad-computed-title">Approval Limits</span>
            </div>
            <span className="st-badge badge-success">
              {activeConfig.authority.safetyTier}
            </span>
          </div>

          <div className="ad-computed-body">
            <div className="ad-computed-kpi">
              <span className="ad-kpi-num" style={{ color: 'var(--badge-success-text, #10b981)' }}>
                {activeConfig.authority.monetaryCeiling}
              </span>
              <span className="ad-kpi-sub">Financial Limit Cap</span>
            </div>

            {/* Segmented Micro Distribution Bar: 75% Approved / 25% Dual-Key Reserve */}
            <div className="ad-snap-bar" title="75% Discretionary Spend / 25% Dual-Key Sign-off Required">
              <div className="ad-snap-seg" style={{ width: '75%', background: '#10b981' }} />
              <div className="ad-snap-seg" style={{ width: '25%', background: '#f59e0b' }} />
            </div>

            <div className="ad-snap-pills-row">
              <span className="ad-snap-pill">
                <ShieldCheck size={11} style={{ color: '#10b981' }} />
                Tier 2 Gated
              </span>
              <span className="ad-snap-pill">
                <Lock size={11} style={{ color: '#f59e0b' }} />
                Dual-Key
              </span>
              <span className="ad-snap-pill">
                <CheckCircle2 size={11} style={{ color: '#0284c7' }} />
                ASIL-D
              </span>
            </div>

            <div className="ad-snap-context" title={`Co-Signer: ${activeConfig.authority.delegatedLead}`}>
              Co-Signer: <strong>{activeConfig.authority.delegatedLead}</strong>
            </div>
          </div>

          <div className="ad-snap-action-wrapper">
            <button
              onClick={() => setShowGovMatrixModal(true)}
              className="ad-snap-btn-sec"
            >
              <Eye size={13} />
              <span>Delegation Matrix</span>
            </button>
          </div>
        </div>

        {/* WIDGET 3: Active Workflow Tasks */}
        <div className="ad-computed-card">
          <div className="ad-computed-header">
            <div className="ad-computed-title-box">
              <div className="ad-computed-icon-box" style={{ color: '#ef4444' }}>
                <Activity size={16} />
              </div>
              <span className="ad-computed-title">Workflow Tasks</span>
            </div>
            <span className="st-badge badge-critical">
              {activeConfig.activeTasks.criticalCount} Critical
            </span>
          </div>

          <div className="ad-computed-body">
            <div className="ad-computed-kpi">
              <span className="ad-kpi-num">{activeConfig.activeTasks.totalOpen}</span>
              <span className="ad-kpi-sub">Decisions Pending</span>
            </div>

            {/* Segmented Micro Distribution Bar: Critical vs Standard */}
            <div className="ad-snap-bar" title={`${activeConfig.activeTasks.criticalCount} Critical, ${activeConfig.activeTasks.standardCount} Standard`}>
              <div
                className="ad-snap-seg"
                style={{
                  width: `${(activeConfig.activeTasks.criticalCount / activeConfig.activeTasks.totalOpen) * 100}%`,
                  background: '#ef4444'
                }}
              />
              <div
                className="ad-snap-seg"
                style={{
                  width: `${(activeConfig.activeTasks.standardCount / activeConfig.activeTasks.totalOpen) * 100}%`,
                  background: '#64748b'
                }}
              />
            </div>

            <div className="ad-snap-pills-row">
              <span className="ad-snap-pill" style={{ color: '#ef4444' }}>
                <AlertTriangle size={11} />
                {activeConfig.activeTasks.criticalCount} Critical
              </span>
              <span className="ad-snap-pill">
                <Clock size={11} />
                {activeConfig.activeTasks.standardCount} Standard
              </span>
              <span className="ad-snap-pill">
                <CheckCircle2 size={11} style={{ color: '#10b981' }} />
                Release 4.2
              </span>
            </div>

            <div
              className="ad-snap-context"
              title={activeConfig.activeTasks.criticalTasks[0]?.title || 'Release 4.2 readiness · Due today'}
            >
              {activeConfig.activeTasks.criticalTasks[0]?.title || 'Release 4.2 readiness · Due today'}
            </div>
          </div>

          <div className="ad-snap-action-wrapper">
            <button
              onClick={() => {
                if (onNavigateToInbox) {
                  onNavigateToInbox();
                } else {
                  showToast('Switching to Workflow Inbox pre-filtered to critical lane');
                }
              }}
              className="ad-snap-btn-pri"
            >
              <span>Open Workflow Inbox</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* WIDGET 4: Governance Responsibilities */}
        <div className="ad-computed-card">
          <div className="ad-computed-header">
            <div className="ad-computed-title-box">
              <div className="ad-computed-icon-box" style={{ color: '#8b5cf6' }}>
                <FileText size={16} />
              </div>
              <span className="ad-computed-title">Governance Audits</span>
            </div>
            <span className="st-badge badge-purple">
              {activeConfig.governance.length} Active Gates
            </span>
          </div>

          <div className="ad-computed-body">
            <div className="ad-computed-kpi">
              <span className="ad-kpi-num" style={{ color: '#8b5cf6' }}>{activeConfig.governance.length}</span>
              <span className="ad-kpi-sub">Compliance Gates Due</span>
            </div>

            {/* Segmented Micro Distribution Bar: Amber vs Emerald compliance gates */}
            <div className="ad-snap-bar" title="Compliance timeline distribution">
              <div className="ad-snap-seg" style={{ width: '40%', background: '#f59e0b' }} />
              <div className="ad-snap-seg" style={{ width: '60%', background: '#10b981' }} />
            </div>

            <div className="ad-snap-pills-row">
              {activeConfig.governance.map((item) => (
                <span key={item.id} className="ad-snap-pill">
                  <Clock size={11} style={{ color: item.urgency === 'amber' ? '#f59e0b' : '#10b981' }} />
                  {item.title.split(' ')[0]}: {item.countdownText.replace(' left', '')}
                </span>
              ))}
              <span className="ad-snap-pill">
                <CheckCircle2 size={11} style={{ color: '#8b5cf6' }} />
                UNECE R157
              </span>
            </div>

            <div className="ad-snap-context" title="ISO 26262 & UNECE R157 sign-off scheduled">
              ISO 26262 &amp; UNECE R157 sign-off scheduled
            </div>
          </div>

          <div className="ad-snap-action-wrapper">
            <button
              onClick={() => setShowGovMatrixModal(true)}
              className="ad-snap-btn-sec"
            >
              <ShieldAlert size={13} />
              <span>Governance Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PART B (LOWER TIER): 6-TIER OPERATIONAL DEPTH & DIAGNOSTIC LENS   */}
      {/* ================================================================= */}
      <div className="ad-drilldown-wrapper">
        {/* Section Header */}
        <div className="ad-drilldown-header">
          <div className="ad-drilldown-title-box">
            <div className="ad-computed-icon-box">
              <Layers size={18} />
            </div>
            <div>
              <div className="ad-drilldown-title">
                Operational Lineage &amp; Depth Navigator
              </div>
              <div className="ad-drilldown-subtitle">
                End-to-end indicators spanning Enterprise Portfolio to Live Execution
              </div>
            </div>
          </div>
          <span className="st-badge badge-info">
            Focus: Level {currentLevel} of 6 • {activeLevelData.shortTitle}
          </span>
        </div>

        {/* 6-Node Interactive Depth Pipeline (Zero-waste indicator pipeline replacing breadcrumbs) */}
        <div className="ad-depth-pipeline" role="tablist" aria-label="Operational Depth Levels">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const lvlData = drillDownLevelsData[`level${lvl}`];
            const isActive = currentLevel === lvl;
            const LevelIcon =
              lvl === 1 ? Briefcase :
              lvl === 2 ? FolderGit2 :
              lvl === 3 ? GitMerge :
              lvl === 4 ? Bot :
              lvl === 5 ? Cpu :
              Activity;

            return (
              <button
                key={lvl}
                onClick={() => goToLevel(lvl)}
                className={`ad-depth-node ${isActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isActive}
              >
                <div className="ad-depth-node-meta">
                  <span className="ad-depth-node-tag">
                    <LevelIcon size={12} />
                    L{lvl} {lvlData.layerTag}
                  </span>
                  {isActive && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--stellantis-action, #0284c7)' }} />
                  )}
                </div>
                <div className="ad-depth-node-title" title={lvlData.title}>
                  {lvlData.shortTitle}
                </div>
                <div className={`ad-depth-node-indicator indicator-${lvlData.indicatorType || 'neutral'}`}>
                  <span>●</span>
                  <span>{lvlData.shortIndicator}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Focused Diagnostic Lens */}
        <div className="ad-lens-stage">
          {/* Header & Step Stepper */}
          <div className="ad-lens-header">
            <div className="ad-lens-title-group">
              <div className="ad-lens-icon-box">
                {currentLevel === 1 && <Briefcase size={18} />}
                {currentLevel === 2 && <FolderGit2 size={18} />}
                {currentLevel === 3 && <GitMerge size={18} />}
                {currentLevel === 4 && <Bot size={18} />}
                {currentLevel === 5 && <Cpu size={18} />}
                {currentLevel === 6 && <Activity size={18} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {activeLevelData.title}
                  </h3>
                  <span className="st-badge badge-navy">
                    {activeLevelData.statusBadge}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                  {activeLevelData.subtitle}
                </p>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="ad-lens-controls">
              <button
                onClick={() => goToLevel(currentLevel - 1)}
                disabled={currentLevel === 1}
                className="ad-lens-step-btn"
                title="Navigate to previous operational layer"
              >
                <ArrowLeft size={13} />
                <span>Previous</span>
              </button>
              <button
                onClick={() => goToLevel(currentLevel + 1)}
                disabled={currentLevel === 6}
                className="ad-lens-step-btn"
                style={{
                  background: currentLevel < 6 ? 'var(--stellantis-action, #0284c7)' : undefined,
                  color: currentLevel < 6 ? '#ffffff' : undefined,
                  borderColor: currentLevel < 6 ? 'var(--stellantis-action, #0284c7)' : undefined
                }}
                title="Navigate to next operational layer"
              >
                <span>Next</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 4 Metric Tiles Grid */}
          <div className="ad-lens-metrics-grid">
            {activeLevelData.metrics.map((m, idx) => (
              <div key={idx} className="ad-lens-metric-card">
                <span className="ad-lens-metric-label">{m.label}</span>
                <span className={`ad-lens-metric-val ${m.type || ''}`}>{m.value}</span>
                <span className="ad-lens-metric-sub">{m.subtext || m.change}</span>
              </div>
            ))}
          </div>

          {/* Visual Diagnostics Stage (Level-Specific Dashboard Visuals) */}
          {/* Level 1: Portfolio Projects Breakdown */}
          {currentLevel === 1 && activeLevelData.portfolioProjects && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                PORTFOLIO ALLOCATION &amp; GOVERNANCE HEALTH:
              </div>
              <div className="ad-portfolio-bars">
                {activeLevelData.portfolioProjects.map((p, idx) => (
                  <div key={idx} className="ad-portfolio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{p.name}</strong>
                      <span className="st-badge badge-info" style={{ fontSize: '0.62rem' }}>{p.gate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Compliance: {p.compliance}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Budget Spent: {p.budget}</span>
                      <span className="st-badge badge-success" style={{ fontSize: '0.62rem' }}>Health {p.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 2: Workflows List */}
          {currentLevel === 2 && activeLevelData.workflowsList && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ACTIVE WORKFLOW ROSTER (RELEASE 4.2):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {activeLevelData.workflowsList.map((wf) => (
                  <div
                    key={wf.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: wf.isPrimary ? '2px solid var(--stellantis-action, #0284c7)' : '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{wf.id}</strong>
                      <span className={`st-badge ${wf.status === 'Active' ? 'badge-success' : 'badge-high'}`}>
                        {wf.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{wf.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pass: <strong>{wf.passRate}</strong> • SLA: <strong>{wf.sla}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Stream & Pipeline Flow */}
          {currentLevel === 3 && activeLevelData.streamArchitecture && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                PIPELINE EXECUTION TOPOLOGY &amp; STAGE LATENCY (50 Hz):
              </div>
              <div className="ad-pipeline-flow">
                {activeLevelData.streamArchitecture.map((step, idx) => (
                  <div key={idx} className="ad-pipeline-step">
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.74rem' }}>
                      {idx + 1}. {step.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>{step.detail}</div>
                    <div style={{ color: 'var(--stellantis-action, #0284c7)', fontWeight: 700, fontSize: '0.7rem', marginTop: '2px' }}>
                      Latency: {step.latency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 4: Agent Responsibilities */}
          {currentLevel === 4 && activeLevelData.agentTasks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                AUTONOMOUS AGENT AUDIT TASKS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6px' }}>
                {activeLevelData.agentTasks.map((task, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.74rem',
                      color: 'var(--text-primary)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 5: Model Specs */}
          {currentLevel === 5 && activeLevelData.modelSpecs && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                FOUNDATION MODEL PASSPORT &amp; CLEARANCE:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>ARCHITECTURE</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeLevelData.modelSpecs.architecture}</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>QUANTIZATION &amp; RUNTIME</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeLevelData.modelSpecs.quantization}</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONTEXT WINDOW</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeLevelData.modelSpecs.contextWindow}</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>SAFETY QUALIFICATION</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981' }}>{activeLevelData.modelSpecs.safetyClearance}</div>
                </div>
              </div>
            </div>
          )}

          {/* Level 6: Live Telemetry */}
          {currentLevel === 6 && activeLevelData.telemetryReadout && (
            <div className="ad-telemetry-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  REAL-TIME VERIFICATION TRACE ({activeLevelData.telemetryReadout.batchId})
                </div>
                <span className="st-badge badge-success">
                  {activeLevelData.telemetryReadout.decisionVerdict.split('•')[0]}
                </span>
              </div>

              <div className="ad-telemetry-grid">
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">TIMESTAMP</span>
                  <span className="ad-telemetry-val">{activeLevelData.telemetryReadout.timestamp}</span>
                </div>
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">VEHICLE SPEED</span>
                  <span className="ad-telemetry-val">{activeLevelData.telemetryReadout.vehicleSpeed}</span>
                </div>
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">DOPPLER VELOCITY ALIGNMENT</span>
                  <span className="ad-telemetry-val" style={{ color: '#10b981' }}>
                    {activeLevelData.telemetryReadout.dopplerVelocityAlignment}
                  </span>
                </div>
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">OPTICAL DISPARITY DEPTH</span>
                  <span className="ad-telemetry-val">{activeLevelData.telemetryReadout.opticalDisparityDepth}</span>
                </div>
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">RADAR REFLECTION DENSITY</span>
                  <span className="ad-telemetry-val" style={{ color: '#10b981' }}>
                    {activeLevelData.telemetryReadout.radarReflectionDensity}
                  </span>
                </div>
                <div className="ad-telemetry-item">
                  <span className="ad-telemetry-label">ENVIRONMENT</span>
                  <span className="ad-telemetry-val" style={{ fontSize: '0.72rem' }}>
                    Dry asphalt, 22°C ambient
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: GOVERNANCE AUDIT MATRIX MODAL                            */}
      {/* ================================================================= */}
      {showGovMatrixModal && (
        <div className="ad-modal-backdrop" onClick={() => setShowGovMatrixModal(false)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#10b981" />
                <div>
                  <div className="ad-modal-title">{governanceAuditMatrixData.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {governanceAuditMatrixData.version}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGovMatrixModal(false)}
                className="ad-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ad-modal-body">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="st-badge badge-purple">
                  Active Persona: {governanceAuditMatrixData.activeRole}
                </span>
                <span className="st-badge badge-info">
                  Scope: {governanceAuditMatrixData.authorityScope}
                </span>
              </div>

              <table className="ad-modal-table">
                <thead>
                  <tr>
                    <th>Governance Domain</th>
                    <th>Standard Scope</th>
                    <th>Product Manager Authority</th>
                    <th>Designated Co-Signer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {governanceAuditMatrixData.matrices.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{row.domain}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.scope}</td>
                      <td>{row.pmAuthority}</td>
                      <td style={{ fontWeight: 600 }}>{row.coSigner}</td>
                      <td>
                        <span className="st-badge badge-success">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ad-carve-out-alert">
                <strong>Safety Governance Carve-Out Rule:</strong> In accordance with Stellantis Corporate Safety Guideline ST-SAF-401, no ASIL-D critical deviation may be sanctioned unilaterally by Product Management without formal counter-signature from Systems Safety Engineering.
              </div>
            </div>

            <div className="ad-modal-footer">
              <button
                onClick={() => setShowGovMatrixModal(false)}
                className="ad-btn-pri"
              >
                <span>Export Audit Certificate</span>
              </button>
              <button
                onClick={() => setShowGovMatrixModal(false)}
                className="ad-btn-sec"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
