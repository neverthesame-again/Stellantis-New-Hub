import React, { useState } from 'react';
import {
  Bot,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  Sliders,
  X,
  Cpu,
  Wrench,
  FileCode,
  Check,
  Info,
  ExternalLink
} from 'lucide-react';
import { engineeringExperienceData } from '../mockData.js';

/**
 * PRD §5.4 — Agent and Agentic Workflow Catalogue
 * Automotive Autonomous Agents across 4 Lifecycle States (Active, Experimental, Suspended, Retired) & L1-L4 Autonomy
 */
export default function EngineeringAgentCatalogue({ agents = [], onSubscribeAgent, onInspectTrace, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [agentLifecycleFilter, setAgentLifecycleFilter] = useState('All');
  const [agentAutonomyFilter, setAgentAutonomyFilter] = useState('All');
  const [subscribeAgentModal, setSubscribeAgentModal] = useState(null);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [selectedProjectForAgent, setSelectedProjectForAgent] = useState('STLA Large SDV Platform Phase 2');
  const [subscribedMap, setSubscribedMap] = useState({});

  const isAgentSubscribed = (agent) => {
    if (!agent) return false;
    if (subscribedMap[agent.id] !== undefined) {
      return subscribedMap[agent.id];
    }
    return Boolean(agent.subscribed);
  };

  const handleToggleSubscribe = (agent, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!agent) return;

    const currentStatus = isAgentSubscribed(agent);
    const nextStatus = !currentStatus;

    setSubscribedMap(prev => ({
      ...prev,
      [agent.id]: nextStatus
    }));

    const targetProject = agent.subscribedToProject || selectedProjectForAgent || 'STLA Large SDV Platform Phase 2';
    if (onSubscribeAgent) {
      onSubscribeAgent(agent.id, targetProject, nextStatus);
    }

    if (showToast) {
      if (nextStatus) {
        showToast(`Subscribed "${agent.name}" to ${targetProject}`);
      } else {
        showToast(`Unsubscribed "${agent.name}"`);
      }
    }
  };

  // Guarantee fallback to mockData if agents prop is empty or loading
  const agentsList = (agents && agents.length > 0) ? agents : (engineeringExperienceData?.agents || []);

  const filteredAgents = agentsList.filter(a => {
    const stage = a.lifecycleStage || a.lifecycleStatus || 'Active';
    const autonomy = a.autonomyLevel || 'L2';
    const name = (a.name || '').toLowerCase();
    const purpose = (a.purpose || a.role || a.businessFunction || '').toLowerCase();
    const domain = (a.domain || a.targetDiscipline || '').toLowerCase();
    const technology = (a.technology || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) ||
      purpose.includes(query) ||
      domain.includes(query) ||
      technology.includes(query);

    const matchesLifecycle = agentLifecycleFilter === 'All' || stage.toLowerCase() === agentLifecycleFilter.toLowerCase();
    const matchesAutonomy = agentAutonomyFilter === 'All' || autonomy.toLowerCase().includes(agentAutonomyFilter.toLowerCase());
    return matchesSearch && matchesLifecycle && matchesAutonomy;
  });

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (subscribeAgentModal) {
      setSubscribedMap(prev => ({
        ...prev,
        [subscribeAgentModal.id]: true
      }));
      if (onSubscribeAgent) {
        onSubscribeAgent(subscribeAgentModal.id, selectedProjectForAgent, true);
      }
      if (showToast) showToast(`Agent "${subscribeAgentModal?.name}" subscribed to ${selectedProjectForAgent}!`);
    }
    setSubscribeAgentModal(null);
  };

  const activeCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Active').length;
  const experimentalCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Experimental').length;
  const suspendedCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Suspended').length;
  const retiredCount = agentsList.filter(a => (a.lifecycleStage || a.lifecycleStatus) === 'Retired').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Info Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} color="var(--stellantis-action, #0284c7)" />
            <span>Agent and Agentic Workflow Catalogue</span>
            <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
              {agentsList.length} Autonomous Agents Registered
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Autonomous automotive agentic workflows spanning enterprise software architecture, ASIL-D safety gating, AUTOSAR generation, and canary validation.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="st-badge badge-success" style={{ fontSize: '0.72rem' }}>
            {activeCount} Active
          </span>
          <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
            {experimentalCount} Experimental
          </span>
          <span className="st-badge badge-warning" style={{ fontSize: '0.72rem' }}>
            {suspendedCount} Suspended
          </span>
          <span className="st-badge badge-neutral" style={{ fontSize: '0.72rem' }}>
            {retiredCount} Retired
          </span>
          <span className="st-badge badge-purple" style={{ fontSize: '0.72rem' }}>
            {agentsList.filter(a => isAgentSubscribed(a)).length} Subscribed
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search agents by name, domain, capability, technology, foundation model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={agentLifecycleFilter}
            onChange={(e) => setAgentLifecycleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <option value="All">All Lifecycle Stages ({agentsList.length})</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Experimental">Experimental ({experimentalCount})</option>
            <option value="Suspended">Suspended ({suspendedCount})</option>
            <option value="Retired">Retired ({retiredCount})</option>
          </select>

          <select
            value={agentAutonomyFilter}
            onChange={(e) => setAgentAutonomyFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <option value="All">All Autonomy Levels</option>
            <option value="L1">L1 Copilot / Supervised</option>
            <option value="L2">L2 Semi-Autonomous</option>
            <option value="L3">L3 Conditional Autonomy</option>
            <option value="L4">L4 High Autonomy</option>
          </select>
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredAgents.map((agent) => {
          const stage = agent.lifecycleStage || agent.lifecycleStatus || 'Active';
          const autonomy = agent.autonomyLevel || 'L2 Copilot';
          const successRate = agent.executionMetrics?.successRate || agent.evaluationMetrics?.taskSuccessRate || '98.5%';
          const totalRuns = agent.executionMetrics?.totalRuns || 4200;
          const avgDuration = agent.executionMetrics?.avgDuration || '1.2s';
          const domainName = agent.domain || agent.targetDiscipline || 'Software Engineering';
          const description = agent.purpose || agent.role || agent.businessFunction || 'Automates automotive SDV workflows';
          const modelsList = Array.isArray(agent.modelDependencies) ? agent.modelDependencies.join(', ') : (agent.primaryFoundationModel || 'Claude 3.5 Sonnet / DeepSeek');
          const subscribedProject = agent.subscribedToProject || (Array.isArray(agent.subscribedProjects) ? agent.subscribedProjects.join(', ') : 'STLA Large SDV Platform Phase 2');
          const isSubscribed = isAgentSubscribed(agent);

          return (
            <div
              key={agent.id}
              className="st-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: stage === 'Active' ? '4px solid #10b981' :
                  (stage === 'Experimental' ? '4px solid #0284c7' :
                  (stage === 'Suspended' ? '4px solid #f59e0b' : '4px solid #64748b'))
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action, #0284c7)' }}>{agent.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {domainName}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                    {agent.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {agent.technology || agent.projectType || 'LangGraph / Agent Mesh'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`st-badge ${
                    stage === 'Active' ? 'badge-success' :
                    (stage === 'Experimental' ? 'badge-info' :
                    (stage === 'Suspended' ? 'badge-warning' : 'badge-neutral'))
                  }`}>
                    {stage}
                  </span>
                  <span className="st-badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {autonomy}
                  </span>
                </div>
              </div>

              {/* Purpose / Role */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {description}
              </div>

              {/* Performance Metrics Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                padding: '8px 12px',
                background: 'var(--bg-subtle, rgba(0,0,0,0.02))',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.72rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>SUCCESS RATE</span>
                  <strong style={{ color: '#10b981' }}>{successRate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>TOTAL RUNS</span>
                  <strong style={{ color: '#0284c7' }}>{totalRuns}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>LATENCY</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{avgDuration}</strong>
                </div>
              </div>

              {/* Dependencies Snippets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>Foundation Models: <strong style={{ color: 'var(--text-primary)' }}>{modelsList}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span>Subscribed Project:</span>
                  <strong style={{ color: isSubscribed ? '#10b981' : 'var(--text-primary)' }}>{subscribedProject}</strong>
                  {isSubscribed && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                      Active
                    </span>
                  )}
                </div>
                {agent.tools && (
                  <div>Integrated Tools: <strong style={{ color: 'var(--text-primary)' }}>{Array.isArray(agent.tools) ? agent.tools.join(' • ') : agent.tools}</strong></div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', marginTop: 'auto', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedAgentDetails(agent)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Info size={11} />
                    <span>Charter</span>
                  </button>

                  <button
                    onClick={() => onInspectTrace && onInspectTrace()}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--stellantis-action, #0284c7)',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>L6 Trace</span>
                    <ArrowRight size={11} />
                  </button>
                </div>

                <button
                  onClick={(e) => handleToggleSubscribe(agent, e)}
                  style={{
                    background: isSubscribed ? 'var(--badge-success-bg, #ecfdf5)' : 'var(--stellantis-action, #0284c7)',
                    color: isSubscribed ? '#10b981' : '#ffffff',
                    border: isSubscribed ? '1px solid #10b981' : 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title={isSubscribed ? "Click to unsubscribe" : "Click to subscribe"}
                >
                  {isSubscribed ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Charter & Specification Modal */}
      {selectedAgentDetails && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedAgentDetails(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">{selectedAgentDetails.name}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {selectedAgentDetails.id} • {selectedAgentDetails.domain} • {selectedAgentDetails.autonomyLevel}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAgentDetails(null)} className="ad-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="ad-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h5 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                  Purpose & Business Function
                </h5>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {selectedAgentDetails.purpose || selectedAgentDetails.businessFunction}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>INPUT CONTRACTS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedAgentDetails.inputs || 'Automotive PRD, ARXML schema, C++ Pull Requests'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>OUTPUT ARTIFACTS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedAgentDetails.outputs || 'EARB Architecture Charter, ASIL Audit Certificate'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>INTEGRATED TOOLS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {Array.isArray(selectedAgentDetails.tools) ? selectedAgentDetails.tools.join(', ') : selectedAgentDetails.tools}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>FOUNDATION MODEL DEPENDENCIES</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {Array.isArray(selectedAgentDetails.modelDependencies) ? selectedAgentDetails.modelDependencies.join(', ') : selectedAgentDetails.modelDependencies}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>EVALUATION & BENCHMARKS</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedAgentDetails.evaluationResults || '99.1% Pass Rate across 4,200 gate checks.'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGENT OWNER</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    {selectedAgentDetails.owner || 'AI Center of Excellence'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>RISK CLASSIFICATION</div>
                  <div style={{ fontSize: '0.76rem', color: selectedAgentDetails.riskRating === 'Critical' ? '#ef4444' : 'var(--text-primary)' }}>
                    {selectedAgentDetails.riskRating || 'Medium'}
                  </div>
                </div>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedAgentDetails(null)}
                className="st-btn st-btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleSubscribe(selectedAgentDetails);
                  setSelectedAgentDetails(null);
                }}
                style={{
                  background: isAgentSubscribed(selectedAgentDetails) ? 'var(--badge-success-bg, #ecfdf5)' : 'var(--stellantis-action, #0284c7)',
                  color: isAgentSubscribed(selectedAgentDetails) ? '#10b981' : '#ffffff',
                  border: isAgentSubscribed(selectedAgentDetails) ? '1px solid #10b981' : 'none',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAgentSubscribed(selectedAgentDetails) ? <CheckCircle2 size={13} /> : <Plus size={13} />}
                <span>{isAgentSubscribed(selectedAgentDetails) ? 'Subscribed' : 'Subscribe to Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Agent Modal */}
      {subscribeAgentModal && (
        <div className="ad-modal-backdrop" onClick={() => setSubscribeAgentModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">Subscribe Agent to Project</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{subscribeAgentModal.name} ({subscribeAgentModal.id})</div>
                </div>
              </div>
              <button onClick={() => setSubscribeAgentModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubscribeSubmit}>
              <div className="ad-modal-body">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Engineering Project:</label>
                  <select
                    value={selectedProjectForAgent}
                    onChange={(e) => setSelectedProjectForAgent(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="STLA Large SDV Platform Phase 2">STLA Large SDV Platform Phase 2</option>
                    <option value="Maserati GranTurismo Folgore ADAS v3.4">Maserati GranTurismo Folgore ADAS v3.4</option>
                    <option value="Ram 1500 REV Autonomous Towing">Ram 1500 REV Autonomous Towing</option>
                    <option value="Jeep Recon Trail-Rated Offroad Autonomy">Jeep Recon Trail-Rated Offroad Autonomy</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Execution Permission Tier:</label>
                  <select
                    defaultValue="Project Level"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="Project Level">Project Level (Authorized for squad pipelines)</option>
                    <option value="Team Level">Team Level (Restricted to exploratory squads)</option>
                    <option value="Portfolio Level">Portfolio Level (Enterprise Multi-Project Allocation)</option>
                  </select>
                </div>
              </div>

              <div className="ad-modal-footer">
                <button type="button" onClick={() => setSubscribeAgentModal(null)} className="st-btn st-btn-secondary">Cancel</button>
                <button type="submit" className="st-btn st-btn-primary">Confirm Project Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
