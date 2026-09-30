import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Cpu,
  ShieldAlert,
  Zap,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Filter,
  ArrowUpRight,
  ExternalLink,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  RefreshCw,
  Archive,
  Download,
  Activity,
  Award,
  Search
} from 'lucide-react';
import { initialFinOpsData } from '../finopsData.js';

export default function EngineeringFinOps() {
  const [data, setData] = useState(initialFinOpsData);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'alerts' | 'tokens' | 'optimizations' | 'efficiency'
  const [alertFilterTab, setAlertFilterTab] = useState('active'); // 'active' | 'history'

  // Dimensional Filters
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedWorkspace, setSelectedWorkspace] = useState('All Workspaces');
  const [searchQuery, setSearchQuery] = useState('');

  // Drilldown Modal
  const [selectedModelDrilldown, setSelectedModelDrilldown] = useState(null);
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionAction, setResolutionAction] = useState('Remediation Applied');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Agent Costs
  const filteredAgents = data.agentCosts.filter(agent => {
    const matchesProgram = selectedProgram === 'All Programs' || agent.program === selectedProgram;
    const matchesWorkspace = selectedWorkspace === 'All Workspaces' || agent.workspace === selectedWorkspace;
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.primaryModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.squad.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesWorkspace && matchesSearch;
  });

  // Filtered Alerts
  const activeAlerts = data.costAlerts.filter(alert => {
    const matchesProgram = selectedProgram === 'All Programs' || alert.program === selectedProgram;
    const matchesWorkspace = selectedWorkspace === 'All Workspaces' || alert.workspace === selectedWorkspace;
    return alert.status !== 'Resolved' && matchesProgram && matchesWorkspace;
  });

  // Action: Acknowledge Alert (FR-402)
  const handleAcknowledgeAlert = (alertId) => {
    setData(prev => ({
      ...prev,
      costAlerts: prev.costAlerts.map(a => 
        a.id === alertId 
          ? { ...a, status: 'Acknowledged', acknowledgedBy: 'Alex (CAIO)', acknowledgedAt: 'Just now' }
          : a
      ),
      kpis: {
        ...prev.kpis,
        activeAlertsCount: Math.max(0, prev.kpis.activeAlertsCount - 1)
      }
    }));
    showToast(`Alert ${alertId} acknowledged by Alex (CAIO).`);
  };

  // Action: Close / Resolve Alert (FR-402)
  const handleResolveAlertSubmit = () => {
    if (!resolvingAlert) return;
    const resolvedItem = resolvingAlert;

    setData(prev => {
      const updatedAlerts = prev.costAlerts.filter(a => a.id !== resolvedItem.id);
      const newAuditItem = {
        id: resolvedItem.id,
        agentName: resolvedItem.agentName,
        workspace: resolvedItem.workspace,
        program: resolvedItem.program,
        estimatedCostImpact: resolvedItem.estimatedCostImpact,
        severity: resolvedItem.severity,
        actionTaken: `${resolutionAction}: ${resolutionNote || resolvedItem.recommendedAction}`,
        closedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Just now',
        closedBy: 'Alex (Chief AI Officer)',
        auditRef: `AUD-FINOPS-${Date.now().toString().slice(-4)}`
      };

      return {
        ...prev,
        costAlerts: updatedAlerts,
        alertAuditHistory: [newAuditItem, ...prev.alertAuditHistory],
        kpis: {
          ...prev.kpis,
          activeAlertsCount: Math.max(0, prev.kpis.activeAlertsCount - 1)
        }
      };
    });

    showToast(`Alert ${resolvedItem.id} resolved & recorded to FinOps Audit History.`);
    setResolvingAlert(null);
    setResolutionNote('');
  };

  // Action: Apply Cost Optimization (FR-404)
  const handleApplyOptimization = (optId) => {
    setData(prev => {
      const updatedOpts = prev.costOptimizations.map(opt => {
        if (opt.id === optId) {
          return { ...opt, applied: true };
        }
        return opt;
      });

      return {
        ...prev,
        costOptimizations: updatedOpts,
        kpis: {
          ...prev.kpis,
          cacheSavings: "$41,270",
          cacheHitRate: "42.8%",
          aiEfficiencyIndex: 90.2,
          efficiencyGrade: "A",
          pendingOptimizationsCount: Math.max(0, prev.kpis.pendingOptimizationsCount - 1)
        }
      };
    });

    showToast(`Optimization applied! Cache savings simulated & AI Efficiency boosted to 90.2.`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--stellantis-navy, #0b1a30)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md, 8px)',
          boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.25))',
          border: '1px solid var(--stellantis-action, #0284c7)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1100,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* HEADER STRIP */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0e1e38 0%, #1e3a8a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(14, 30, 56, 0.2)'
          }}>
            <DollarSign size={24} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                FinOps and AI Cost
              </h2>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Real-time spend governance, token volume analytics, proactive anomaly alerts & automated right-sizing.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Portfolio Target Cap</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.kpis.monthlyBudget} / Month
            </div>
          </div>
          <span className="badge-success" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
            Active Fiscal Q3
          </span>
        </div>
      </div>

      {/* 6 TOP EXECUTIVE FINOPS KPI METRICS (FR-401) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
        gap: '12px'
      }}>
        {/* KPI 1: MTD Spend */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>MTD Spend</span>
            <DollarSign size={16} color="var(--stellantis-action)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data.kpis.mtdSpend}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Budget: {data.kpis.monthlyBudget}</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Proj: {data.kpis.projectedEndMonthSpend}</span>
          </div>
          <div style={{ height: '5px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: data.kpis.budgetUtilization, background: 'var(--stellantis-action)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* KPI 2: Token Volume */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Token Volume</span>
            <Cpu size={16} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data.kpis.tokenVolume}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>In: {data.kpis.inputTokens}</span>
            <span>Out: {data.kpis.outputTokens}</span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
            +12.1% MoM token scale
          </div>
        </div>

        {/* KPI 3: Budget Utilization */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Budget Utilization</span>
            <Activity size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>
            {data.kpis.budgetUtilization}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Threshold: 85.0%</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Safe Zone</span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
            $37,500 unallocated buffer
          </div>
        </div>

        {/* KPI 4: Cost per 1M Tokens */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Cost per 1M Tokens</span>
            <TrendingDown size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
            {data.kpis.costPer1MTokens}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Base: {data.kpis.costPer1MBaseline}</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{data.kpis.costPer1MDeltaPct}</span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--badge-success-text)' }}>
            ✓ Driven by Turin on-prem models
          </div>
        </div>

        {/* KPI 5: Cache Savings */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Cache Savings</span>
            <Zap size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f59e0b' }}>
            {data.kpis.cacheSavings}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Hit Rate: {data.kpis.cacheHitRate}</span>
            <span style={{ color: 'var(--stellantis-action)', fontWeight: 700 }}>KV-Prefix</span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
            Saved 571M prompt tokens
          </div>
        </div>

        {/* KPI 6: AI Efficiency Index */}
        <div className="st-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>AI Efficiency Index</span>
            <Award size={16} color="#8b5cf6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#8b5cf6' }}>
              {data.kpis.aiEfficiencyIndex}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
              {data.kpis.efficiencyGrade}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Scale: 0-100</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{data.kpis.efficiencyDelta}</span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
            Optimal compute matching
          </div>
        </div>
      </div>

      {/* FILTER & DIMENSIONAL SELECTOR BAR (FR-401) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Filter size={15} color="var(--stellantis-action)" />
            <span>Filter Costs By:</span>
          </div>

          {/* Program Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Program:</span>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {data.programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Workspace Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Workspace:</span>
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {data.workspaces.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search agent or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontSize: '0.75rem',
                padding: '5px 10px 5px 28px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                width: '180px'
              }}
            />
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '8px', top: '8px' }} />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedProgram !== 'All Programs' || selectedWorkspace !== 'All Workspaces' || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedProgram('All Programs');
              setSelectedWorkspace('All Workspaces');
              setSearchQuery('');
            }}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* FINOPS NAVIGATION SEGMENTED TABS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px',
        background: 'var(--bg-surface-secondary, #f8fafc)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg, 12px)',
        boxSizing: 'border-box'
      }}>
        {[
          { id: 'overview', label: 'AI Cost Dashboard & Model Mix', icon: BarChart3, badge: null },
          { id: 'alerts', label: 'Proactive Cost Alerts', icon: ShieldAlert, badge: activeAlerts.length > 0 ? `${activeAlerts.length}` : null },
          { id: 'tokens', label: 'Token Volume Analytics', icon: Cpu, badge: null },
          { id: 'optimizations', label: 'Cost Optimization Engine', icon: Sparkles, badge: data.kpis.pendingOptimizationsCount > 0 ? `${data.kpis.pendingOptimizationsCount}` : null },
          { id: 'efficiency', label: 'AI Efficiency Scorecard', icon: Award, badge: '88.5' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: isActive ? 'var(--stellantis-navy, #0b1a30)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(11, 26, 48, 0.2)' : 'none'
              }}
            >
              <Icon size={15} color={isActive ? '#38bdf8' : 'var(--text-secondary)'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#ef4444',
                  color: '#ffffff'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & MODEL COST MIX (FR-401)                 */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* PROGRAM CARDS (AD, AMS, QE) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {Object.entries(data.programBreakdown).map(([code, p]) => (
              <div
                key={code}
                className="st-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderTop: selectedProgram === code ? '3px solid var(--stellantis-action)' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                      PROGRAM • {code}
                    </span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {p.name}
                    </h4>
                  </div>
                  <span className="badge-navy" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                    {p.sharePct}% Spend
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Spend / Cap</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.spend}</div>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Tokens MTD</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{p.tokens}</div>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Efficiency</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>{p.efficiencyIndex}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <span>Cache Hit: <strong>{p.cacheHitRate}</strong></span>
                  <span>Cost/1M: <strong>{p.costPer1M}</strong></span>
                  <span style={{ color: p.activeAlerts > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                    {p.activeAlerts} {p.activeAlerts === 1 ? 'Alert' : 'Alerts'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* MODEL COST MIX TABLE (FR-401) */}
          <div className="st-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Model Cost Mix & Foundation Compute Allocation
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Click row to inspect Agent drill-down
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px' }}>Model Name & Provider</th>
                    <th style={{ padding: '8px 10px' }}>Deployment Type</th>
                    <th style={{ padding: '8px 10px' }}>Token Usage (In/Out)</th>
                    <th style={{ padding: '8px 10px' }}>Cost ($)</th>
                    <th style={{ padding: '8px 10px' }}>Cost Share (%)</th>
                    <th style={{ padding: '8px 10px' }}>Cost / 1M</th>
                    <th style={{ padding: '8px 10px' }}>P95 Latency</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Drill-down</th>
                  </tr>
                </thead>
                <tbody>
                  {data.modelCostMix.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedModelDrilldown(m)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{m.modelName}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.provider}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: m.deploymentType.includes('On-Prem') ? '#ecfdf5' : '#eff6ff',
                          color: m.deploymentType.includes('On-Prem') ? '#065f46' : '#1e40af'
                        }}>
                          {m.deploymentType}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 700 }}>{m.tokenUsage}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{m.inputTokens} in / {m.outputTokens} out</div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                        {m.cost}
                      </td>
                      <td style={{ padding: '10px', minWidth: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700 }}>{m.costSharePct}%</span>
                          <div style={{ height: '6px', flex: 1, background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${m.costSharePct}%`, background: 'var(--stellantis-action)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{m.costPer1M}</td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{m.latencyP95}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-subtle)',
                            color: 'var(--stellantis-action)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Agents <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AGENT COSTS AND CONSUMPTION TRENDS DRILLDOWN TABLE (FR-401) */}
          <div className="st-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Agent AI Spending & Consumption Trends
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Showing {filteredAgents.length} Active Autonomous Agents
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px' }}>Agent Name & Squad</th>
                    <th style={{ padding: '8px 10px' }}>Workspace</th>
                    <th style={{ padding: '8px 10px' }}>Primary Model</th>
                    <th style={{ padding: '8px 10px' }}>Monthly Tokens</th>
                    <th style={{ padding: '8px 10px' }}>Spend / Budget Cap</th>
                    <th style={{ padding: '8px 10px' }}>Trend (MoM)</th>
                    <th style={{ padding: '8px 10px' }}>Efficiency</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agt) => (
                    <tr
                      key={agt.id}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{agt.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{agt.id} • {agt.squad}</div>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                          {agt.workspace}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {agt.primaryModel.split(' ')[0]} {agt.primaryModel.split(' ')[1]}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>
                        {agt.tokensConsumed}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 800, color: agt.monthlySpend > agt.budgetCap ? '#ef4444' : 'var(--stellantis-action)' }}>
                          {agt.monthlySpend}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Cap: {agt.budgetCap}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: agt.trendDirection === 'up' ? '#ef4444' : '#10b981',
                          fontWeight: 700
                        }}>
                          {agt.trendDirection === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>{agt.trendPct}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          fontWeight: 800,
                          color: agt.efficiencyScore >= 90 ? '#10b981' : (agt.efficiencyScore >= 80 ? 'var(--stellantis-action)' : '#f59e0b')
                        }}>
                          {agt.efficiencyScore} / 100
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <span className={agt.statusBadge} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {agt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROACTIVE COST ALERTS (FR-402)                     */}
      {/* ========================================================= */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sub-Tabs: Active Alerts vs Audit History */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setAlertFilterTab('active')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: alertFilterTab === 'active' ? '1px solid var(--stellantis-action)' : '1px solid var(--border-color)',
                  background: alertFilterTab === 'active' ? 'var(--stellantis-navy)' : 'var(--bg-surface)',
                  color: alertFilterTab === 'active' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                Active Cost Alerts ({activeAlerts.length})
              </button>
              <button
                onClick={() => setAlertFilterTab('history')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: alertFilterTab === 'history' ? '1px solid var(--stellantis-action)' : '1px solid var(--border-color)',
                  background: alertFilterTab === 'history' ? 'var(--stellantis-navy)' : 'var(--bg-surface)',
                  color: alertFilterTab === 'history' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                Alert Audit History & Reporting ({data.alertAuditHistory.length})
              </button>
            </div>

            {alertFilterTab === 'history' && (
              <button
                onClick={() => showToast('Exported FinOps Alert Audit Log as CSV/PDF.')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                Export Audit Log (CSV)
              </button>
            )}
          </div>

          {/* ACTIVE ALERTS LIST */}
          {alertFilterTab === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeAlerts.length === 0 ? (
                <div className="st-card" style={{ padding: '36px', textAlign: 'center' }}>
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>All Clear! No Active Cost Alerts</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    All AI workloads and agents are operating within established financial variance thresholds.
                  </p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="st-card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderLeft: alert.severity === 'Critical' ? '4px solid #ef4444' : (alert.severity === 'High' ? '4px solid #f97316' : '4px solid #3b82f6')
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={alert.severityBadge} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          {alert.severity} SEVERITY
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {alert.id} • {alert.agentName}
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {alert.workspace} ({alert.program})
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Detected: {alert.detectedAt}</span>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.08)',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          Cost Impact: {alert.estimatedCostImpact}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      <strong>Root Cause:</strong> {alert.issueDescription}
                    </div>

                    <div style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                        <Sparkles size={16} color="var(--stellantis-action)" />
                        <span><strong>Recommended Action:</strong> {alert.recommendedAction}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {alert.status === 'Active' && (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-surface)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer'
                            }}
                          >
                            Acknowledge
                          </button>
                        )}
                        {alert.status === 'Acknowledged' && (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                            ✓ Acknowledged by Alex
                          </span>
                        )}
                        <button
                          onClick={() => setResolvingAlert(alert)}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '5px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'var(--stellantis-action, #0284c7)',
                            color: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          Resolve & Close →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ALERT AUDIT HISTORY & REPORTING (FR-402) */}
          {alertFilterTab === 'history' && (
            <div className="st-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Archive size={18} color="var(--stellantis-action)" />
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                    Cost Alert Audit Trail & Regulatory Reporting Ledger
                  </h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ISO 26262 & Enterprise Governance Logged
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 10px' }}>Audit Ref & Alert</th>
                      <th style={{ padding: '8px 10px' }}>Agent Name & Workspace</th>
                      <th style={{ padding: '8px 10px' }}>Cost Impact Mitigated</th>
                      <th style={{ padding: '8px 10px' }}>Action & Resolution Note</th>
                      <th style={{ padding: '8px 10px' }}>Closed Date</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Audited By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.alertAuditHistory.map((hist) => (
                      <tr key={hist.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--stellantis-action)' }}>{hist.auditRef}</span>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{hist.id}</div>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hist.agentName}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{hist.workspace}</div>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 800, color: '#10b981' }}>
                          {hist.estimatedCostImpact}
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                          {hist.actionTaken}
                        </td>
                        <td style={{ padding: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {hist.closedAt}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {hist.closedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TOKEN VOLUME ANALYTICS (FR-403)                    */}
      {/* ========================================================= */}
      {activeTab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 4 SUMMARY STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div className="st-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Tokens Consumed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                {data.tokenAnalytics.totalTokensFormatted}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {data.tokenAnalytics.totalTokens}
              </div>
            </div>

            <div className="st-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Average Tokens / Request</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--stellantis-action)', margin: '4px 0' }}>
                {data.tokenAnalytics.avgTokensPerRequest.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Prompt: {data.tokenAnalytics.avgPromptTokens} • Resp: {data.tokenAnalytics.avgCompletionTokens}
              </div>
            </div>

            <div className="st-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Cached Tokens</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
                {data.tokenAnalytics.cachedTokens.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {data.tokenAnalytics.cachedTokens.split('(')[1].replace(')', '')}
              </div>
            </div>

            <div className="st-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Peak Hourly Ingestion</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                2.4M / hr
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Peak occurs @ 14:00 CET (CI regression builds)
              </div>
            </div>
          </div>

          {/* MONTHLY USAGE TRENDS BAR CHART (FR-403) */}
          <div className="st-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Monthly Token Volume & Cost Trajectory
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Tracking token volume expansion against unit cost deflation
                </span>
              </div>
              <span className="badge-navy" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
                May — Sep 2026
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', alignItems: 'flex-end', height: '180px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              {data.tokenAnalytics.monthlyTrends.map((trend) => {
                const maxTokens = 1600;
                const barHeight = (trend.tokensNum / maxTokens) * 130;
                return (
                  <div key={trend.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>{trend.tokensFormatted}</div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--stellantis-action)', fontWeight: 700 }}>{trend.spend}</div>
                    <div style={{
                      width: '60%',
                      height: `${barHeight}px`,
                      background: 'linear-gradient(180deg, var(--stellantis-action, #0284c7) 0%, var(--stellantis-navy, #0b1a30) 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease'
                    }} />
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{trend.month}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Unit Cost / 1M Tokens: <strong>May $100.48 → Sep $96.28 (-4.2%)</strong></span>
              <span>Cache Hit Improvement: <strong>May 24.5% → Sep 38.6% (+14.1%)</strong></span>
            </div>
          </div>

          {/* MODALITY BREAKDOWN & DAILY BURN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            
            {/* Modality Split */}
            <div className="st-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px' }}>
                Token Ingestion by Data Modality
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.tokenAnalytics.modalityBreakdown.map((mod) => (
                  <div key={mod.modality}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{mod.modality}</span>
                      <span style={{ fontWeight: 800, color: mod.color }}>{mod.tokens} ({mod.sharePct}%)</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${mod.sharePct}%`, background: mod.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Burn Rate */}
            <div className="st-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px' }}>
                Weekly Daily Burn Rate (Tokens & Spend)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                {data.tokenAnalytics.dailyBurnRates.map((day) => (
                  <div key={day.day} style={{ background: 'var(--bg-subtle)', padding: '8px 4px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{day.day}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', margin: '3px 0' }}>{day.tokens}</div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--stellantis-action)', fontWeight: 700 }}>{day.spend}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                Weekday automated regression suites drive 88% of compute volume.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: COST OPTIMIZATION ENGINE (FR-404)                  */}
      {/* ========================================================= */}
      {activeTab === 'optimizations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid var(--stellantis-action)',
            borderRadius: 'var(--radius-md, 8px)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--stellantis-action)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Automated Cost Optimization & Right-Sizing Engine
                </h3>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Simulate prompt caching, prompt compression, and model right-sizing across squads.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Identified Annual Savings</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>+$103,200 / Year</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {data.costOptimizations.map((opt) => (
              <div
                key={opt.id}
                className="st-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  borderTop: opt.applied ? '3px solid #10b981' : '3px solid var(--stellantis-action)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                      {opt.category.toUpperCase()} • {opt.targetProgram}
                    </span>
                    <span className={opt.applied ? 'badge-success' : opt.badge} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {opt.applied ? 'APPLIED ✓' : opt.effort}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {opt.title}
                  </h4>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {opt.description}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.66rem' }}>Monthly Savings</span>
                    <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>{opt.potentialSavingsMonthly}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.66rem' }}>Annual Impact</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{opt.potentialSavingsYearly}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <strong>Operational Impact:</strong> {opt.impact}
                </div>

                <button
                  disabled={opt.applied}
                  onClick={() => handleApplyOptimization(opt.id)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: opt.applied ? '#10b981' : 'var(--stellantis-action, #0284c7)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: opt.applied ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {opt.applied ? (
                    <>
                      <Check size={15} /> Strategy Applied to Gateways
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} /> Apply Optimization Policy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: AI EFFICIENCY SCORECARD (FR-405)                   */}
      {/* ========================================================= */}
      {activeTab === 'efficiency' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TOP GAUGE & OVERVIEW */}
          <div className="st-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0e1e38 0%, #1e3a8a 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(14, 30, 56, 0.25)',
                  border: '3px solid #10b981'
                }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 900 }}>{data.efficiencyIndex.overallScore}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8' }}>GRADE {data.efficiencyIndex.grade}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action)', textTransform: 'uppercase' }}>
                    Consolidated Enterprise Score
                  </span>
                  <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    AI Cost & Compute Efficiency Index
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {data.efficiencyIndex.statusText} • Rated against Tier-1 Global Automotive benchmarks.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Baseline Target</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>80.0</div>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Variance Delta</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>+8.5 pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-INDEX PILLARS (FR-405) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {data.efficiencyIndex.subScores.map((sub, idx) => (
              <div key={idx} className="st-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sub.name}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: sub.score >= 90 ? '#10b981' : 'var(--stellantis-action)' }}>
                    {sub.score} / 100
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sub.score}%`, background: sub.score >= 90 ? '#10b981' : 'var(--stellantis-action)', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {sub.detail}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
                  {sub.benchmark}
                </div>
              </div>
            ))}
          </div>

          {/* CROSS-PROGRAM BENCHMARK COMPARISON */}
          <div className="st-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
              Program Efficiency Benchmarks (QE vs. AD vs. AMS)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {data.efficiencyIndex.programBenchmarks.map((prog, idx) => (
                <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{prog.program}</span>
                    <span className={prog.badge} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {prog.score} pts
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {prog.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: MODEL DRILL-DOWN INTO AGENTS (FR-401)            */}
      {/* ========================================================= */}
      {selectedModelDrilldown && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="st-card" style={{ width: '100%', maxWidth: '640px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                  FOUNDATION MODEL AGENT DRILL-DOWN
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedModelDrilldown.modelName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModelDrilldown(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', background: 'var(--bg-subtle)', padding: '10px', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Total Cost</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{selectedModelDrilldown.cost}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Tokens Consumed</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedModelDrilldown.tokenUsage}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Portfolio Share</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{selectedModelDrilldown.costSharePct}%</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Agents Consuming this Foundation Model:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedModelDrilldown.drilldown.map((ag, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{ag.agent}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Program: {ag.program} • {ag.tokens} Tokens</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--stellantis-action)' }}>{ag.cost}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{ag.sharePct}% of model spend</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedModelDrilldown(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--stellantis-navy)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Close Drill-Down
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RESOLVE & CLOSE COST ALERT (FR-402)              */}
      {/* ========================================================= */}
      {resolvingAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="st-card" style={{ width: '100%', maxWidth: '540px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ef4444' }}>
                  GOVERNANCE ACTION & CLOSURE
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Resolve Cost Alert: {resolvingAlert.id}
                </h3>
              </div>
              <button
                onClick={() => setResolvingAlert(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Agent: <strong>{resolvingAlert.agentName}</strong> ({resolvingAlert.workspace})
              <br />
              Cost Impact: <strong style={{ color: '#ef4444' }}>{resolvingAlert.estimatedCostImpact}</strong>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Resolution Action Type:
              </label>
              <select
                value={resolutionAction}
                onChange={(e) => setResolutionAction(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <option value="Remediation Applied">Remediation Applied (Code/Config update executed)</option>
                <option value="Model Right-Sized">Model Right-Sized (Switched to lower cost compute)</option>
                <option value="Budget Cap Enforced">Budget Cap Enforced (Hard quota applied to agent)</option>
                <option value="Circuit Breaker Activated">Circuit Breaker Activated (Loop throttled)</option>
                <option value="Exception Approved">Exception Approved (Business justification accepted)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Auditor Comments & Justification:
              </label>
              <textarea
                rows={3}
                placeholder="Enter audit notes for FinOps ledger..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setResolvingAlert(null)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResolveAlertSubmit}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--stellantis-action, #0284c7)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Confirm & Log to Audit Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
