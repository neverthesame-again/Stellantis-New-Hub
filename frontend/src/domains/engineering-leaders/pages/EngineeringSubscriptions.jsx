import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Bot,
  Wrench,
  Layers,
  FileText,
  Bell,
  BarChart3,
  FolderGit2
} from 'lucide-react';

/**
 * PRD §5.6 — My Subscriptions
 * Consolidated View across the exact 8 Subscribed Entity Types & 5 Grant Levels:
 * 1. Models
 * 2. Agents
 * 3. Agentic workflows
 * 4. AI tools
 * 5. Projects
 * 6. Notifications
 * 7. Governance policies
 * 8. Reports and dashboards
 */
export default function EngineeringSubscriptions({ subscriptions = [], onSubscriptionAction, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [subTypeFilter, setSubTypeFilter] = useState('All');
  const [subLevelFilter, setSubLevelFilter] = useState('All');

  const filteredSubscriptions = subscriptions.filter(s => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (s.entityName || '').toLowerCase().includes(searchLower) ||
      (s.type || '').toLowerCase().includes(searchLower) ||
      (s.grantedBy || '').toLowerCase().includes(searchLower) ||
      (s.id || '').toLowerCase().includes(searchLower);

    const typeNormalized = (s.type || '').toLowerCase();
    const filterNormalized = subTypeFilter.toLowerCase();
    
    let matchesType = subTypeFilter === 'All';
    if (!matchesType) {
      if (filterNormalized === 'model') {
        matchesType = typeNormalized.includes('model');
      } else if (filterNormalized === 'agent') {
        matchesType = typeNormalized === 'agent';
      } else if (filterNormalized.includes('workflow')) {
        matchesType = typeNormalized.includes('workflow');
      } else if (filterNormalized.includes('tool')) {
        matchesType = typeNormalized.includes('tool');
      } else if (filterNormalized.includes('project')) {
        matchesType = typeNormalized.includes('project');
      } else if (filterNormalized.includes('notification')) {
        matchesType = typeNormalized.includes('notification');
      } else if (filterNormalized.includes('governance')) {
        matchesType = typeNormalized.includes('governance') || typeNormalized.includes('policy');
      } else if (filterNormalized.includes('report') || filterNormalized.includes('dashboard')) {
        matchesType = typeNormalized.includes('report') || typeNormalized.includes('dashboard');
      } else {
        matchesType = typeNormalized === filterNormalized;
      }
    }

    const matchesLevel = subLevelFilter === 'All' || s.level?.toLowerCase() === subLevelFilter.toLowerCase();
    return matchesSearch && matchesType && matchesLevel;
  });

  const handleAction = (subId, actionType, entityName) => {
    if (onSubscriptionAction) {
      onSubscriptionAction(subId, actionType);
    }
    if (showToast) {
      showToast(`${actionType.toUpperCase()}: Subscription for "${entityName}" processed.`);
    }
  };

  const getTypeMeta = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('model')) {
      return { icon: <Cpu size={12} />, badgeClass: 'badge-purple' };
    }
    if (t === 'agent') {
      return { icon: <Bot size={12} />, badgeClass: 'badge-info' };
    }
    if (t.includes('workflow')) {
      return { icon: <Zap size={12} />, badgeClass: 'badge-purple' };
    }
    if (t.includes('tool')) {
      return { icon: <Wrench size={12} />, badgeClass: 'badge-neutral' };
    }
    if (t.includes('project')) {
      return { icon: <FolderGit2 size={12} />, badgeClass: 'badge-info' };
    }
    if (t.includes('notification') || t.includes('alert')) {
      return { icon: <Bell size={12} />, badgeClass: 'badge-warning' };
    }
    if (t.includes('governance') || t.includes('policy')) {
      return { icon: <ShieldCheck size={12} />, badgeClass: 'badge-success' };
    }
    if (t.includes('report') || t.includes('dashboard')) {
      return { icon: <BarChart3 size={12} />, badgeClass: 'badge-neutral' };
    }
    return { icon: <BookmarkCheck size={12} />, badgeClass: 'badge-info' };
  };

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
            <BookmarkCheck size={18} color="var(--stellantis-action, #0284c7)" />
            <span>My Subscriptions</span>
            <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>
              {subscriptions.length} Subscriptions Active
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Consolidated persona view across all 8 subscribed types: Models, Agents, Agentic workflows, AI tools, Projects, Notifications, Governance policies, and Reports &amp; dashboards.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span className="st-badge badge-purple" style={{ fontSize: '0.7rem' }}>
            8 Entity Types
          </span>
          <span className="st-badge badge-info" style={{ fontSize: '0.7rem' }}>
            5 Grant Levels
          </span>
        </div>
      </div>

      {/* Search & Multi-Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search subscriptions by entity, grant level, granted by..."
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
          {/* PRD §5.6 - Exactly the 8 Subscribed Entity Types */}
          <select
            value={subTypeFilter}
            onChange={(e) => setSubTypeFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            <option value="All">All 8 Types</option>
            <option value="Model">Models</option>
            <option value="Agent">Agents</option>
            <option value="Agentic workflow">Agentic workflows</option>
            <option value="AI tool">AI tools</option>
            <option value="Project">Projects</option>
            <option value="Notifications">Notifications</option>
            <option value="Governance policy">Governance policies</option>
            <option value="Reports and dashboards">Reports and dashboards</option>
          </select>

          {/* PRD §5.6 - Exactly the 5 Grant Levels */}
          <select
            value={subLevelFilter}
            onChange={(e) => setSubLevelFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            <option value="All">All 5 Levels</option>
            <option value="Individual level">Individual Level</option>
            <option value="Team level">Team Level</option>
            <option value="Project level">Project Level</option>
            <option value="Portfolio level">Portfolio Level</option>
            <option value="Enterprise level">Enterprise Level</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table Card */}
      <div className="st-card" style={{ padding: '0', overflowX: 'auto' }}>
        <table className="ad-modal-table" style={{ margin: '0', width: '100%' }}>
          <thead>
            <tr>
              <th>ID &amp; Entity Name</th>
              <th>Type</th>
              <th>Grant Level</th>
              <th>Monthly Usage</th>
              <th>Cost Allocation</th>
              <th>Granted By</th>
              <th>Renewal Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No subscriptions match the selected filter.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => {
                const meta = getTypeMeta(sub.type);
                return (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{sub.entityName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{sub.id}</div>
                    </td>
                    <td>
                      <span className={`st-badge ${meta.badgeClass}`} style={{ fontSize: '0.66rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {meta.icon}
                        <span>{sub.type}</span>
                      </span>
                    </td>
                    <td>
                      <span className="st-badge badge-purple" style={{ fontSize: '0.64rem' }}>
                        {sub.level}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-primary)' }}>{sub.monthlyUsage}</td>
                    <td style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sub.costAllocation}</td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{sub.grantedBy}</td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{sub.renewalDate}</td>
                    <td>
                      <span className={`st-badge ${sub.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleAction(sub.id, 'renew', sub.entityName)}
                          className="st-btn st-btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.68rem' }}
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleAction(sub.id, 'cancel', sub.entityName)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.68rem',
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#ef4444',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
