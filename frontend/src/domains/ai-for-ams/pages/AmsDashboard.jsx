import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  Layers, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  RefreshCw,
  GitPullRequest,
  CheckCircle,
  ExternalLink,
  Activity,
  DollarSign,
  Cpu,
  BarChart3,
  Wrench,
  ShieldCheck,
  Target,
  FileCode,
  TrendingUp
} from 'lucide-react';
import { amsDashboardData } from '../mockData.js';

export default function AmsDashboard({ onNavigateToInbox, onNavigateToExperience }) {
  const [data, setData] = useState(amsDashboardData);
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Fetch from backend if available, fallback to mock data
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ams/dashboard`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => {
        console.log('Backend not reached, using local mock data', err);
      });
  }, []);

  const stats = data.overviewStats || {};
  const sla = data.slaPerformance || {
    target: "99.0%",
    actual: "99.2%",
    errorBudgetRemaining: "84%",
    tiers: [
      { tier: "P1 (< 15m)", target: "99.5%", actual: "100%", breaches: 0, status: "Met" },
      { tier: "P2 (< 45m)", target: "98.0%", actual: "98.4%", breaches: 0, status: "Met" },
      { tier: "P3 (< 4h)", target: "95.0%", actual: "96.2%", breaches: 1, status: "Met" },
      { tier: "P4 (< 24h)", target: "95.0%", actual: "99.8%", breaches: 0, status: "Met" }
    ]
  };
  const techDebt = data.technicalDebtBacklog || {
    totalItems: 4,
    totalStoryPoints: 15,
    estCostOfInaction: "$85K / quarter in operational toil",
    items: []
  };
  const productivity = data.productivityAndCostReduction || {
    costSavedYtd: stats.costSavedYtd || "$412,500",
    projectedAnnualSavings: "$850,000",
    engineeringHoursSaved: stats.engineeringHoursSaved || "1,240 hrs",
    fteCapacityReturned: "7.8 FTE software engineering velocity",
    ticketDeflectionRate: "62%",
    costPerTicket: "$9.20",
    baselineCostPerTicket: "$42.00",
    roiMultiplier: "4.6x"
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 3-COLUMN EXECUTIVE DASHBOARD GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>

        {/* ========================================================= */}
        {/* COLUMN 1: INCIDENTS, MTTD/MTTR & RECURRING CLUSTERS       */}
        {/* ========================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Incident Volume and Severity */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={17} color="#ef4444" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Incident Volume and Severity
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}>
                {stats.totalIncidentsToday || 49} Today • 142 WTD
              </span>
            </div>

            {/* 4-Box Severity Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 6px',
                borderTop: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{stats.p1Blocked ?? 2}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Critical P1</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>SLA &lt;15m</div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 6px',
                borderTop: '3px solid #f59e0b'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{stats.p2InReview ?? 5}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Major P2</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>SLA &lt;45m</div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 6px',
                borderTop: '3px solid #3b82f6'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6' }}>{stats.p3InProgress ?? 14}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Moderate P3</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>SLA &lt;4h</div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 6px',
                borderTop: '3px solid #64748b'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.p4Backlog ?? 28}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Minor P4</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>SLA &lt;24h</div>
              </div>
            </div>

            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              <span>Autonomous Triage Active: <strong>38 Auto-Resolved</strong></span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>0 P1/P2 Breaches</span>
            </div>
          </div>

          {/* 2. Mean Time to Detect and Resolve */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={17} color="#3b82f6" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Mean Time to Detect and Resolve
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981'
              }}>
                AI Accelerated
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {/* MTTD */}
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Mean Time to Detect (MTTD)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.mttd?.current || '4.2m'}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                    {stats.mttd?.reduction || '83.8% faster'}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Baseline: 26.0m • Target: &lt;5.0m
                </div>
              </div>

              {/* MTTR */}
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Mean Time to Resolve (MTTR)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.mttr?.current || '18.5m'}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                    {stats.mttr?.reduction || '83.5% faster'}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Baseline: 112.0m • Target: &lt;30.0m
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: '4px' }}>
              Autonomous telemetry anomaly detection reduced triage delay by <strong>93.5 mins</strong> per incident.
            </div>
          </div>

          {/* 3. Recurring Incident Clusters */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={17} color="var(--stellantis-accent)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Recurring Incident Clusters
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}>
                {data.recurringClusters?.length || 4} Clusters Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(data.recurringClusters || []).map((cluster) => (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    borderLeft: cluster.impactLevel === 'Critical' ? '4px solid #ef4444' : cluster.impactLevel === 'High' ? '4px solid #f59e0b' : '4px solid #3b82f6'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--stellantis-accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {cluster.id}: {cluster.title}
                    </span>
                    <span className={`st-badge ${cluster.impactLevel === 'Critical' ? 'badge-critical' : cluster.impactLevel === 'High' ? 'badge-high' : 'badge-info'}`}>
                      {cluster.impactLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {cluster.affectedService} • {cluster.frequency}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '6px 8px', borderRadius: '4px' }}>
                    <strong>AI Action:</strong> {cluster.aiRecommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: PROBLEM CONVERSION, TECH DEBT & AUTOMATION RATE */}
        {/* ========================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 4. Problem-to-change conversion */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitPullRequest size={17} color="var(--stellantis-accent)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Problem-to-change conversion
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--badge-success-bg)',
                border: '1px solid var(--badge-success-border)',
                color: 'var(--badge-success-text)'
              }}>
                {stats.problemToChangeRate || '64.3%'} Converted
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Autonomous pipeline converting recurring AMS incidents directly into engineered Jira stories for Engineering and Product dev sprints.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(data.problemToChangePipeline || []).map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GitPullRequest size={14} color="var(--stellantis-accent)" />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{item.id}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({item.recurringIncidents} events)</span>
                    </div>
                    <span className={`st-badge ${item.convertedToChange ? 'badge-success' : 'badge-high'}`}>
                      {item.convertedToChange ? item.changeId : 'Awaiting Review'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Service: <strong>{item.service}</strong>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Target: <strong>{item.targetSprint}</strong> • ROI: {item.roiImpact}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
                    <button
                      onClick={onNavigateToInbox}
                      className="st-btn st-btn-outline"
                      style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                    >
                      Review in Inbox
                    </button>
                    <button
                      onClick={onNavigateToExperience}
                      className="st-btn st-btn-primary"
                      style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                    >
                      Simulate Fix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Automation and AI resolution rate */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={17} color="#10b981" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Automation and AI resolution rate
                </h3>
              </div>
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981'
              }}>
                {data.persona?.aiResolutionRate || '78.4%'}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Autonomous Runbook Execution</span>
                <strong>38 of 49 Incidents Today</strong>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: data.persona?.aiResolutionRate || '78.4%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '5px' }} />
              </div>
            </div>

            {/* Breakdown Sub-metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>91.2%</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Runbook Success</div>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3b82f6' }}>62.0%</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Ticket Deflection</div>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>21.6%</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Human Escalation</div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              Self-healing orchestrator autonomously executed 42 container restarts and cache re-indexing workflows with zero manual touch.
            </div>
          </div>

          {/* 8. Technical-debt backlog */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={17} color="#f59e0b" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Technical-debt backlog
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b'
              }}>
                {techDebt.totalItems || 4} Items • {techDebt.totalStoryPoints || 15} SP
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Persistent incident clusters synthesized into prioritized engineering debt items to permanently eradicate root causes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(techDebt.items || []).map((td) => (
                <div
                  key={td.id}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      {td.id}: {td.title}
                    </span>
                    <span className={`st-badge ${td.priority === 'High' ? 'badge-high' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                      {td.storyPoints} SP • {td.priority}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Assigned: <strong>{td.targetSquad}</strong></span>
                    <span style={{ color: 'var(--stellantis-accent)', fontWeight: 600 }}>{td.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: '4px' }}>
              Est. Cost of Inaction: <strong>{techDebt.estCostOfInaction}</strong> avoided through proactive sprint injection.
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: STABILITY, SLA & PRODUCTIVITY / COST REDUCTION  */}
        {/* ========================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 6. Application stability */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={17} color="#10b981" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  Application stability
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981'
              }}>
                {stats.stabilityScore || '99.85%'} Platform Score
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Live health telemetry &amp; 30-day incident stability across Stellantis Tier-1 enterprise platforms.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(data.applicationStability || []).map((app, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Target SLA: {app.sla} • 30d Incidents: {app.incidents30d}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: app.status === 'Warning' ? '#f59e0b' : '#10b981' }}>
                      {app.uptime}
                    </div>
                    <span className={`st-badge ${app.status === 'Warning' ? 'badge-high' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. SLA performance */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={17} color="#3b82f6" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  SLA performance
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--badge-info-bg)',
                border: '1px solid var(--badge-info-border)',
                color: 'var(--badge-info-text)'
              }}>
                {sla.actual || '99.2%'} Actual (Target: {sla.target || '99.0%'})
              </span>
            </div>

            {/* SLA breakdown table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(sla.tiers || []).map((tier, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {tier.tier}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Target: {tier.target}</span>
                    <span style={{ fontWeight: 800, color: tier.status === 'Met' ? '#10b981' : '#f59e0b' }}>
                      {tier.actual}
                    </span>
                    <span className={`st-badge ${tier.breaches === 0 ? 'badge-success' : 'badge-high'}`} style={{ fontSize: '0.62rem' }}>
                      {tier.breaches === 0 ? '0 Breaches' : `${tier.breaches} Breach`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}>
              <span>Monthly Error Budget Remaining:</span>
              <strong style={{ color: '#10b981', fontSize: '0.8rem' }}>{sla.errorBudgetRemaining || '84%'} Intact</strong>
            </div>
          </div>

          {/* 9. AMS productivity and cost reduction */}
          <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={17} color="#10b981" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  AMS productivity and cost reduction
                </h3>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981'
              }}>
                {productivity.roiMultiplier || '4.6x'} ROI
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cost Saved YTD</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {productivity.costSavedYtd}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '2px' }}>
                  Target $850K Annualized
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacity Reclaimed</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {productivity.engineeringHoursSaved}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Engineering Triage Toil
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cost Per Ticket</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {productivity.costPerTicket}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                    (was {productivity.baselineCostPerTicket})
                  </span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Deflection Rate</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {productivity.ticketDeflectionRate}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                    predictive
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              Equivalent to <strong>{productivity.fteCapacityReturned}</strong> returned to product innovation sprints.
            </div>
          </div>

        </div>

      </div>

      {/* Selected Cluster Drill-Down Modal */}
      {selectedCluster && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '20px'
        }}>
          <div className="st-card animate-fade-in" style={{ maxWidth: '620px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={22} color="#ef4444" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedCluster.id}: {selectedCluster.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="st-btn st-btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Service & Portfolio</span>
                  <strong>{selectedCluster.affectedService}</strong> ({selectedCluster.portfolio})
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Frequency & Impact</span>
                  <strong>{selectedCluster.frequency}</strong> • <span style={{ color: '#ef4444' }}>{selectedCluster.impactLevel}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Root Cause Synthesis:</strong>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedCluster.rootCauseSummary}</p>
              </div>

              <div style={{ background: 'var(--badge-info-bg)', padding: '12px', borderRadius: '6px', color: 'var(--badge-info-text)' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Recommended Agentic Action:</strong>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{selectedCluster.aiRecommendation}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Problem Ticket: <strong>{selectedCluster.problemTicketCreated || 'PRB-4092'}</strong> • Linked CR: <strong>{selectedCluster.changeRequestLinked || 'CR-8921'}</strong>
                </div>
                <button
                  onClick={() => {
                    setSelectedCluster(null);
                    onNavigateToInbox();
                  }}
                  className="st-btn st-btn-primary"
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  Approve in Workflow Inbox
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
