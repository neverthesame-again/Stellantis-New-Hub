import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Users,
  ExternalLink,
  Lock,
  Layers,
  FileCode,
  Terminal,
  Activity,
  Database,
  GitFork,
  BookOpen,
  Kanban,
  X,
  Clock,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { engineeringExperienceData } from '../mockData.js';

/**
 * PRD §5.5 — AI Tools Catalogue
 * 10 Engineering Lifecycle Disciplines with Security, Compliance, & Adoption Metrics
 */
export default function EngineeringToolsCatalogue({ tools = [], onToggleSubscribeTool, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedToolDetails, setSelectedToolDetails] = useState(null);

  // Guarantee fallback to mockData if tools prop is empty or loading
  const toolsList = (tools && tools.length > 0) ? tools : (engineeringExperienceData?.tools || []);

  const disciplines = [
    { id: 'All', label: 'All 10 Disciplines', icon: Wrench },
    { id: 'Coding assistants', label: 'Coding Assistants', icon: FileCode },
    { id: 'Testing tools', label: 'Testing Tools', icon: CheckCircle2 },
    { id: 'Architecture tools', label: 'Architecture Tools', icon: Layers },
    { id: 'DevOps tools', label: 'DevOps Tools', icon: Terminal },
    { id: 'Observability tools', label: 'Observability Tools', icon: Activity },
    { id: 'Data engineering tools', label: 'Data Engineering Tools', icon: Database },
    { id: 'Modernization tools', label: 'Modernization Tools', icon: GitFork },
    { id: 'Documentation and knowledge tools', label: 'Documentation & Knowledge', icon: BookOpen },
    { id: 'Security and compliance tools', label: 'Security & Compliance', icon: Lock },
    { id: 'Product-management tools', label: 'Product Management', icon: Kanban }
  ];

  const filteredTools = toolsList.filter(t => {
    const name = (t.name || '').toLowerCase();
    const category = (t.category || '').toLowerCase();
    const provider = (t.supportOwner || t.provider || '').toLowerCase();
    const description = (t.description || '').toLowerCase();
    const useCases = Array.isArray(t.useCases) ? t.useCases.join(' ').toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) ||
      category.includes(query) ||
      provider.includes(query) ||
      description.includes(query) ||
      useCases.includes(query);

    const matchesCategory = selectedDiscipline === 'All' || category.includes(selectedDiscipline.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const totalSubscribed = toolsList.filter(t => t.subscribed).length;

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
            <Wrench size={18} color="var(--stellantis-action, #0284c7)" />
            <span>AI Tools Catalogue</span>
            <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
              {toolsList.length} Tools Across 10 Disciplines
            </span>
            <span className="st-badge badge-success" style={{ fontSize: '0.65rem' }}>
              {totalSubscribed} Active Subscriptions
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Enterprise catalog of approved engineering AI tools, coding assistants, HIL testing frameworks, and architecture modeling suites.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED HOURS SAVED</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>18,400+ hrs / mo</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>ENGINEERING SQUADS COVERED</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--stellantis-action, #0284c7)' }}>48 / 48 Squads</div>
          </div>
        </div>
      </div>

      {/* Discipline Quick Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {disciplines.map(d => {
          const isSelected = selectedDiscipline === d.id;
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDiscipline(d.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1px solid var(--stellantis-action, #0284c7)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--stellantis-action, #0284c7)' : 'var(--bg-surface)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={12} />
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search tools across 10 engineering disciplines (Copilot, CANoe, Dynatrace, Snyk...)"
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
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredTools.length}</strong> of <strong>{toolsList.length}</strong> tools
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredTools.map((tool) => {
          const activeUsers = tool.usageMetrics?.activeUsers || tool.adoptionMetrics?.activeSquads || 120;
          const adoptionRate = tool.usageMetrics?.adoptionRate || tool.adoptionMetrics?.adoptionPercentage || '85%';
          const hoursSaved = tool.usageMetrics?.hoursSavedMonthly || '1,200 hrs';
          const description = tool.description || tool.primaryUseCases || 'Enterprise AI engineering capability.';
          const licensing = tool.licensingInfo || tool.licensingModel || tool.costAllocation || 'Corporate Site License';
          const integration = tool.integrationRequirements || tool.integrationCapabilities || 'Standard Enterprise REST / CLI';
          const security = tool.securityClassification || 'Confidential';

          return (
            <div
              key={tool.id}
              className="st-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: tool.subscribed ? '3px solid #10b981' : '3px solid var(--border-color)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action, #0284c7)' }}>{tool.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {tool.category}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                    {tool.name}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Owner: {tool.supportOwner || 'Engineering Tooling Operations'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`st-badge ${security === 'Confidential' ? 'badge-info' : (security === 'Restricted' ? 'badge-warning' : 'badge-neutral')}`} style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={11} /> {security}
                  </span>
                  {tool.subscribed && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.62rem' }}>
                      Subscribed
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {description}
              </div>

              {/* Use Cases Tags */}
              {Array.isArray(tool.useCases) && tool.useCases.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {tool.useCases.slice(0, 3).map((uc, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-surface-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              )}

              {/* Adoption & Usage Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'var(--bg-surface-secondary)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>ACTIVE USERS</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeUsers}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>ADOPTION</span>
                  <strong style={{ color: '#10b981' }}>{adoptionRate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>HOURS SAVED</span>
                  <strong style={{ color: 'var(--stellantis-action, #0284c7)' }}>{hoursSaved}</strong>
                </div>
              </div>

              {/* Integration Snippet */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={12} color="var(--text-muted)" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Integration: <strong style={{ color: 'var(--text-primary)' }}>{integration}</strong>
                </span>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <button
                  onClick={() => setSelectedToolDetails(tool)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--stellantis-action, #0284c7)',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Info size={12} />
                  <span>View Specifications</span>
                </button>

                <button
                  onClick={() => {
                    if (onToggleSubscribeTool) onToggleSubscribeTool(tool.id);
                    if (showToast) showToast(`Tool "${tool.name}" subscription status updated.`);
                  }}
                  style={{
                    background: tool.subscribed ? 'var(--badge-success-bg, #ecfdf5)' : 'var(--stellantis-action, #0284c7)',
                    color: tool.subscribed ? '#10b981' : '#ffffff',
                    border: tool.subscribed ? '1px solid #10b981' : 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {tool.subscribed ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                  <span>{tool.subscribed ? 'Subscribed' : 'Request Access'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tool Details Modal */}
      {selectedToolDetails && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedToolDetails(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} color="var(--stellantis-action, #0284c7)" />
                <div>
                  <span className="ad-modal-title">{selectedToolDetails.name}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {selectedToolDetails.id} • {selectedToolDetails.category}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedToolDetails(null)} className="ad-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="ad-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h5 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                  Overview & Capability
                </h5>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {selectedToolDetails.description}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                  Primary Engineering Use Cases
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(selectedToolDetails.useCases || []).map((uc, i) => (
                    <li key={i}>{uc}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>INTEGRATION REQUIREMENTS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedToolDetails.integrationRequirements || 'Standard CLI / IDE plugin'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>LICENSING MODEL</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedToolDetails.licensingInfo || 'Enterprise Corporate License'}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATA HANDLING & SOVEREIGN RESTRICTIONS</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedToolDetails.dataHandlingRestrictions || 'Processed inside Stellantis sovereign data boundary; zero external training.'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>SUPPORT OWNER</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    {selectedToolDetails.supportOwner || 'Engineering Tooling Squad'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>SUBSCRIPTION PROCESS</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    {selectedToolDetails.subscriptionProcess || 'Instant self-service subscription for L3+ engineering grades.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedToolDetails(null)}
                className="st-btn st-btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onToggleSubscribeTool) onToggleSubscribeTool(selectedToolDetails.id);
                  if (showToast) showToast(`Tool "${selectedToolDetails.name}" subscription status updated.`);
                  setSelectedToolDetails(null);
                }}
                className="st-btn st-btn-primary"
              >
                {selectedToolDetails.subscribed ? 'Unsubscribe' : 'Confirm Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
