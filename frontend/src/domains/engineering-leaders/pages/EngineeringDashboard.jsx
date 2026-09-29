import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Cpu,
  Layers,
  GitPullRequest,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Zap,
  Target,
  BarChart3,
  Users,
  ExternalLink,
  X,
  Award,
  Check,
  Filter,
  Compass,
  Sparkles,
  Server,
  FileText,
  Briefcase
} from 'lucide-react';
import { engineeringDashboardData } from '../mockData.js';

export default function EngineeringDashboard() {
  const [data, setData] = useState(engineeringDashboardData);
  const [loading, setLoading] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('ALL');
  const [selectedException, setSelectedException] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [activeAutonomyTab, setActiveAutonomyTab] = useState(null);

  // Fetch from backend API if available, fallback gracefully to mockData
  const fetchData = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/dashboard`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => {
        console.log('Backend not reachable, using local mock data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Governance Exception Decision Action
  const handleExceptionAction = (actionType) => {
    if (!selectedException) return;

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/exceptions/${selectedException.id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: actionType,
        comments: actionComment || `Actioned by Alex (${actionType.toUpperCase()})`
      })
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          showToast(`Governance Action recorded: Exception ${selectedException.id} marked as ${json.data.status}.`);
          fetchData();
        } else {
          updateLocalException(actionType);
        }
      })
      .catch(() => {
        updateLocalException(actionType);
      })
      .finally(() => {
        setSelectedException(null);
        setActionComment('');
      });
  };

  const updateLocalException = (actionType) => {
    const updatedList = data.governanceExceptions.exceptionsList.map(item => {
      if (item.id === selectedException.id) {
        return {
          ...item,
          status: actionType === 'approve' ? 'Approved Exception' : 'Remediation Enforced',
          actionRequired: `Actioned by CAIO: ${actionType.toUpperCase()}`
        };
      }
      return item;
    });
    setData({
      ...data,
      governanceExceptions: {
        ...data.governanceExceptions,
        totalPendingExceptions: Math.max(0, data.governanceExceptions.totalPendingExceptions - 1),
        exceptionsList: updatedList
      }
    });
    showToast(`Governance Action recorded: Exception ${selectedException.id} updated.`);
  };

  const portfolios = data.portfolioHealth?.portfolios || [];
  const filteredPortfolios = selectedPortfolio === 'ALL'
    ? portfolios
    : portfolios.filter(p => p.id === selectedPortfolio);

  const projects = data.projectDelivery?.projects || [];
  const autonomy = data.aiAdoptionAndAutonomy || {};
  const productivity = data.engineeringProductivity || {};
  const quality = data.qualityAndDefects || {};
  const releases = data.releaseFrequencyAndCycleTime || {};
  const cost = data.aiCostAndConsumption || {};
  const governance = data.governanceExceptions || {};
  const outcomes = data.businessOutcomes || {};
  const objectives = data.primaryObjectives || [];

  // Uniform equal-size card styling for 3x3 layout
  const equalCardStyle = {
    padding: '20px',
    height: '520px',
    minHeight: '520px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '12px'
  };

  const cardScrollAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingRight: '4px'
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--stellantis-navy)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--stellantis-action)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* STRATEGIC CONTROL & TELEMETRY BAR */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            Enterprise Engineering Operating Model • Live Governance Telemetry
          </span>
          <span className="badge-navy" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
            Alex • Chief AI Officer
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRIMARY STRATEGIC OBJECTIVES BANNER (Alex's 4 Mandates)  */}
      {/* ========================================================= */}
      <div className="st-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--stellantis-action)" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0 }}>
              Primary Strategic Objectives — Chief AI Officer Mandate
            </h3>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Board Governance & Operating Model Targets
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px'
        }}>
          {objectives.map((obj) => (
            <div
              key={obj.id}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                    {obj.id}
                  </span>
                  <span className={obj.statusBadge} style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    {obj.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {obj.title}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  {obj.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px', color: 'var(--text-secondary)' }}>
                  <span>Target Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{obj.progress}%</span>
                </div>
                <div style={{ height: '5px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${obj.progress}%`,
                      background: obj.progress > 85 ? '#10b981' : 'var(--stellantis-action)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 9 EQUAL-SIZED BOXES: 3x3 HARMONIOUS MATRIX GRID          */}
      {/* ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>

        {/* --------------------------------------------------------- */}
        {/* BOX 1: PORTFOLIO HEALTH                                   */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  1. Portfolio Health
                </h3>
              </div>
              <span className="badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                Score: {data.portfolioHealth?.overallHealthScore}
              </span>
            </div>

            {/* Top Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Healthy</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>{data.portfolioHealth?.statusSummary?.healthy}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Warning</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>{data.portfolioHealth?.statusSummary?.warning}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Squads</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{data.portfolioHealth?.activeSquads}</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setSelectedPortfolio('ALL')}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: selectedPortfolio === 'ALL' ? 'var(--stellantis-navy)' : 'var(--bg-subtle)',
                  color: selectedPortfolio === 'ALL' ? '#ffffff' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              {portfolios.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPortfolio(p.id)}
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    background: selectedPortfolio === p.id ? 'var(--stellantis-navy)' : 'var(--bg-subtle)',
                    color: selectedPortfolio === p.id ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div style={cardScrollAreaStyle}>
            {filteredPortfolios.map((port) => (
              <div
                key={port.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{port.name}</span>
                  <span className={port.statusBadge} style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                    {port.healthScore}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>{port.lead}</span>
                  <span>{port.squadsCount} Squads • {port.doraRating}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  <strong>Risk:</strong> {port.topRisk}
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Total Engineers: <strong>{data.portfolioHealth?.totalEngineers}</strong></span>
            <span>Budget Adherence: <strong>97.2%</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 2: PROJECT DELIVERY STATUS                            */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#8b5cf6" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  2. Project Delivery Status
                </h3>
              </div>
              <span className="badge-purple" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {data.projectDelivery?.onTrackRate} On Track
              </span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span>Total Active Programs: <strong>{data.projectDelivery?.totalActiveProjects}</strong></span>
              <span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Velocity: +16% YoY</span>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div style={cardScrollAreaStyle}>
            {projects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{proj.name}</span>
                  <span className={proj.statusBadge} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                    {proj.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>{proj.portfolio.split('&')[0]}</span>
                  <span>Target: {proj.targetRelease}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    <span>{proj.phase}</span>
                    <span style={{ fontWeight: 700 }}>{proj.progress}%</span>
                  </div>
                  <div style={{ height: '5px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${proj.progress}%`, background: proj.status === 'Attention Required' ? '#f59e0b' : 'var(--stellantis-action)', borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                  Milestone: {proj.keyMilestone}
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Milestone Confidence: <strong>94%</strong></span>
            <span>Release Window: <strong>Q4 2026 - Q2 2027</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 3: AI ADOPTION & AUTONOMY DISTRIBUTION                */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  3. AI Adoption & Autonomy
                </h3>
              </div>
              <span className="badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {autonomy.overallAdoptionRate} Adoption
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '6px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>AI-Assisted Commits</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{autonomy.aiAssistedCommits}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Autonomous PRs</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#8b5cf6' }}>{autonomy.autonomousPrGenerationRate}</div>
              </div>
            </div>

            {/* Progress Stack Bar */}
            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '6px 0' }}>
              {autonomy.autonomyDistribution?.map((lvl, idx) => (
                <div key={idx} title={`${lvl.level}: ${lvl.percentage}%`} style={{ width: `${lvl.percentage}%`, background: lvl.color }} />
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div style={cardScrollAreaStyle}>
            {autonomy.autonomyDistribution?.map((lvl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveAutonomyTab(activeAutonomyTab === lvl.level ? null : lvl.level)}
                style={{
                  background: activeAutonomyTab === lvl.level ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 9px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: lvl.color }} />
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {lvl.level} • {lvl.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: lvl.color }}>
                    {lvl.percentage}% ({lvl.squadsCount} sq)
                  </span>
                </div>
                {activeAutonomyTab === lvl.level && (
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '4px 0 0 13px', lineHeight: 1.3 }}>
                    {lvl.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Active Seats: <strong>{autonomy.totalActiveSeats}</strong></span>
            <span>Target Autonomy: <strong>L2.5 by 2027</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 4: ENGINEERING PRODUCTIVITY                           */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  4. Engineering Productivity
                </h3>
              </div>
              <span className="badge-navy" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                DORA: {productivity.doraLevel}
              </span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span>Developer Happiness: <strong>{productivity.developerSatisfactionScore}</strong></span>
              <span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Velocity: {productivity.squadVelocityBoost?.split(' ')[0]}</span>
            </div>
          </div>

          {/* Productivity 2x2 Metric Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', flex: 1, alignItems: 'center' }}>
            {productivity.metrics?.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0' }}>
                    {m.value}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', color: 'var(--badge-success-text)', fontWeight: 700 }}>
                    <TrendingUp size={12} />
                    <span>{m.improvement}</span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {m.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Review Wait Reduction: <strong>-84%</strong></span>
            <span>Benchmark: <strong>Elite Tier</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 5: QUALITY AND DEFECT TRENDS                          */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  5. Quality & Defect Trends
                </h3>
              </div>
              <span className="badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                Escape: {quality.defectEscapeRate}
              </span>
            </div>

            {/* Severity Breakdown Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '5px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: '#ef4444', fontWeight: 700 }}>P1 Crit</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quality.defectVolumeBySeverity?.p1Critical}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '5px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 700 }}>P2 Maj</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quality.defectVolumeBySeverity?.p2Major}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '5px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: '#3b82f6', fontWeight: 700 }}>P3 Min</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quality.defectVolumeBySeverity?.p3Minor}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '5px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>P4 Low</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quality.defectVolumeBySeverity?.p4Low}</div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area: Quality Pillars & Sprints */}
          <div style={cardScrollAreaStyle}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Compliance & Testing Gates</div>
            {quality.qualityPillars?.map((pil, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{pil.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--stellantis-action)' }}>{pil.score}</span>
              </div>
            ))}

            <div style={{ marginTop: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Sprint Trend</div>
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'space-between' }}>
              {quality.defectTrendOverSprints?.map((sp, idx) => (
                <div key={idx} style={{ flex: 1, background: 'var(--bg-subtle)', padding: '4px', borderRadius: '3px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{sp.sprint.replace('Sprint ', 'S')}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sp.escapedDefects}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Auto-Remediated: <strong>{quality.vulnerabilitiesAutoRemediated}</strong></span>
            <span>Target: <strong>&lt; 1.50%</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 6: RELEASE FREQUENCY AND CYCLE TIME                   */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  6. Release Frequency & Cycle
                </h3>
              </div>
              <span className="badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                CFR: {releases.changeFailureRate}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '6px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Releases YTD</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{releases.totalReleasesYtd}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>MTTD</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{releases.meanTimeToDeploy}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Rollback</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>{releases.rollbackRate}</div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area: Upcoming Releases */}
          <div style={cardScrollAreaStyle}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Upcoming Vehicle Releases</div>
            {releases.upcomingReleases?.map((rel) => (
              <div
                key={rel.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{rel.name}</span>
                  <span className={rel.riskBadge} style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '6px', fontWeight: 700 }}>
                    {rel.risk}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <span>{rel.tier}</span>
                  <span>{rel.targetDate}</span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--badge-success-text)' }}>
                  ✓ {rel.automatedTestsPassed} Tests • Stability {rel.stabilityScore}
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Staging Automation: <strong>100%</strong></span>
            <span>Zero-Downtime Deploy: <strong>Enabled</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 7: AI COST AND MODEL CONSUMPTION                      */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--stellantis-action)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  7. AI Cost & Consumption
                </h3>
              </div>
              <span className="badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {cost.budgetUtilization} Used
              </span>
            </div>

            {/* Budget Bar */}
            <div style={{ background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Spend: <strong>{cost.currentSpend}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Budget: {cost.monthlyBudget}</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: cost.budgetUtilization, background: 'var(--stellantis-action)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>

          {/* Scrollable Content Area: Models Breakdown */}
          <div style={cardScrollAreaStyle}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Token Consumption by Model</div>
            {cost.modelBreakdown?.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 9px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-primary)' }}>{m.modelName.split(' ')[0]} {m.modelName.split(' ')[1]}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{m.cost} ({m.sharePct}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                  <span>{m.provider.split('/')[0]}</span>
                  <span>{m.tokensConsumed}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Cost / PR: <strong>{cost.costPerPullRequest}</strong></span>
            <span>Cache Hit: <strong>{cost.tokenCacheHitRate}</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 8: GOVERNANCE EXCEPTIONS                              */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#ef4444" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  8. Governance Exceptions
                </h3>
              </div>
              <span className="badge-critical" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {governance.totalPendingExceptions} Pending
              </span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span>Governance Health: <strong>{governance.complianceScore}</strong></span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>High Risk: {governance.highRiskCount}</span>
            </div>
          </div>

          {/* Scrollable Content Area: Exceptions List */}
          <div style={cardScrollAreaStyle}>
            {governance.exceptionsList?.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedException(ex)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px',
                  cursor: 'pointer',
                  borderLeft: ex.severity === 'Critical' ? '3px solid #ef4444' : '3px solid #f59e0b',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{ex.id} • {ex.squad}</span>
                  <span className={ex.severityBadge} style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '6px', fontWeight: 700 }}>{ex.severity}</span>
                </div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ex.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                  <span>{ex.status}</span>
                  <span style={{ fontWeight: 700, color: '#0284c7' }}>Review →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Sign-Off: <strong>Chief AI Officer</strong></span>
            <span>NeMo Guardrails: <strong>Active</strong></span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* BOX 9: BUSINESS OUTCOMES AND BENEFITS REALIZATION        */}
        {/* --------------------------------------------------------- */}
        <div className="st-card" style={equalCardStyle}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#10b981" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
                  9. Business Outcomes
                </h3>
              </div>
              <span className="badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {outcomes.overallAiRoiMultiplier} ROI
              </span>
            </div>

            {/* Savings Big Number */}
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>YTD Cost Savings Realized</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>
                {outcomes.ytdCostSavingsRealized}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                <span>Target: {outcomes.annualSavingsTarget}</span>
                <span style={{ fontWeight: 700, color: 'var(--stellantis-action)' }}>{outcomes.savingsAchievementPct}</span>
              </div>
              <div style={{ height: '5px', width: '100%', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: outcomes.savingsAchievementPct, background: '#10b981', borderRadius: '3px' }} />
              </div>
            </div>
          </div>

          {/* Scrollable Content Area: Value Pillars */}
          <div style={cardScrollAreaStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Capacity Returned</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{outcomes.fteCapacityReturned}</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Time to Market</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{outcomes.timeToMarketAcceleration}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
              {outcomes.strategicValuePillars?.map((p, idx) => (
                <div key={idx} style={{ fontSize: '0.68rem', padding: '3px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{p.pillar}:</strong> <span style={{ color: 'var(--stellantis-action)' }}>{p.metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equal Footer */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Sustainable Code: <strong>{outcomes.sustainableCodeIndex}</strong></span>
            <span>Annual Target: <strong>$5.0M</strong></span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL: GOVERNANCE EXCEPTION DECISION DIALOG              */}
      {/* ========================================================= */}
      {selectedException && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(14, 30, 56, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="st-card" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Chief AI Officer Governance Review
                </h3>
              </div>
              <button
                onClick={() => setSelectedException(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                {selectedException.id}
              </span>
              <span className={selectedException.severityBadge} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {selectedException.severity} Severity
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Squad: <strong>{selectedException.squad}</strong>
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {selectedException.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {selectedException.description}
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
              <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: '3px' }}>
                Identified Risk Exposure:
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                {selectedException.risk}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                System: {selectedException.system} • {selectedException.timestamp}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Executive Directives & Decision Comments
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                placeholder="Enter formal architecture waiver instructions or remediation guidelines..."
                style={{
                  width: '100%',
                  minHeight: '75px',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setSelectedException(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleExceptionAction('remediate')}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Enforce Remediation
              </button>
              <button
                onClick={() => handleExceptionAction('approve')}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Approve Waiver
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
