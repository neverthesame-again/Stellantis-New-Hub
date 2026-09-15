import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Bot, 
  Wrench, 
  BookmarkCheck, 
  Play, 
  CheckCircle, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Clock,
  Code,
  Database,
  BarChart3,
  GitBranch,
  FileCheck,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  Lock,
  UserCheck,
  SlidersHorizontal
} from 'lucide-react';
import { amsExperienceData } from '../mockData.js';
import '../../ai-for-ad/product-owner/adModelCatalogue.css';

export default function ExperienceZone() {
  const [data, setData] = useState(amsExperienceData);
  const [subTab, setSubTab] = useState('models'); // 'models', 'agents', 'tools', 'subscriptions', 'sandbox'
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter states
  const [agentLifecycleFilter, setAgentLifecycleFilter] = useState('All');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('All');
  const [subTypeFilter, setSubTypeFilter] = useState('All');

  // Advanced Facet Filtering for Models
  const ALL_PROVIDERS = ['Anthropic', 'Google', 'OpenAI', 'Mistral AI', 'Meta AI', 'DeepSeek AI', 'Cohere', 'AI21 Labs'];
  const ALL_CAPABILITIES = [
    'General Reasoning & Code',
    'Deep & Complex Reasoning',
    'Multimodal Telemetry & Vision',
    'Edge Simulation & Diagnostics'
  ];
  const ALL_DEPLOYMENTS = [
    'Dedicated Sovereign Cloud',
    'Multi-Tenant Cloud API',
    'On-Premise Sovereign Cluster',
    'Private VPC Appliance'
  ];
  const ALL_COST_TIERS = [
    'Economy Compute',
    'Standard Compute',
    'Premium Compute'
  ];

  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedCaps, setSelectedCaps] = useState([]);
  const [selectedDeployments, setSelectedDeployments] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);

  // Compare models state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ams/experience`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => {
        console.log('Backend not reached, using local experience data', err);
      });
  }, []);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle model subscription
  const handleToggleSubscription = (modelId) => {
    setData((prev) => {
      let toggledModelName = '';
      let isNowSubscribed = false;

      const updatedModels = prev.models.map((m) => {
        if (m.id === modelId) {
          isNowSubscribed = !m.subscribed;
          toggledModelName = m.name;
          return { ...m, subscribed: isNowSubscribed };
        }
        return m;
      });

      const targetModel = updatedModels.find((m) => m.id === modelId);
      let updatedSubscriptions = [...(prev.mySubscriptions || [])];

      if (isNowSubscribed) {
        if (!updatedSubscriptions.some((s) => s.entityName === targetModel.name)) {
          updatedSubscriptions.push({
            id: `SUB-${Date.now()}`,
            entityName: targetModel.name,
            type: 'Model',
            level: 'Portfolio level',
            monthlyUsage: '0 tokens (New)',
            costAllocation: targetModel.costTier,
            grantedBy: 'Tony / Self-Service Hub',
            renewalDate: '2026-12-31',
            status: 'Active'
          });
        }
        showToast(`Subscribed "${toggledModelName}" to Tony's Portfolio`);
      } else {
        updatedSubscriptions = updatedSubscriptions.filter((s) => s.entityName !== targetModel.name);
        showToast(`Removed "${toggledModelName}" from Portfolio`);
      }

      return {
        ...prev,
        models: updatedModels,
        mySubscriptions: updatedSubscriptions
      };
    });

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ams/experience/models/${modelId}/subscription`, {
      method: 'POST'
    }).catch(() => {});
  };

  // Toggle compare list
  const handleToggleCompare = (modelId) => {
    setCompareList((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else {
        if (prev.length >= 3) {
          showToast('Maximum 3 models can be compared at once.');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const handleSimulate = async () => {
    setSimulationRunning(true);
    setSimulationProgress({ step: 0, steps: [], outcome: null });

    const fallbackSteps = [
      "Telemetry Ingestion Anomaly Detected: Dynatrace Davis AI flagged partition 4 consumer lag",
      "RCA Synthesizer Correlated Logs: Isolated consumer group thread stall; root cause matched Pattern #881",
      "Safety & Governance Guardrail Verified: Policy #GOV-901 checked: Non-destructive scale pre-approved",
      "Kubernetes Operator Executed Pod Scale: Consumer pods scaled from 6 to 12. Partition rebalanced",
      "Post-Remediation Verification Passed: Lag reduced to 1,240 messages (< 10k threshold). SLA preserved"
    ];
    const fallbackOutcome = 'Incident prevented before customer impact. MTTD: 0.4s | MTTR: 4.8s';

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ams/experience/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'Kafka Partition Storm & Auto-Scale' })
      });
      const result = await res.json();
      const simData = result.simulation || result.data;
      const rawSteps = (simData && Array.isArray(simData.steps)) ? simData.steps : fallbackSteps;
      const outcomeText = (simData && simData.outcome) ? simData.outcome : fallbackOutcome;

      for (let i = 0; i < rawSteps.length; i++) {
        await new Promise((r) => setTimeout(r, 650));
        setSimulationProgress({
          step: i + 1,
          steps: rawSteps.slice(0, i + 1).map((s) => typeof s === 'string' ? s : (s.title ? `${s.title}: ${s.detail || ''}` : JSON.stringify(s))),
          outcome: i === rawSteps.length - 1 ? outcomeText : null
        });
      }
    } catch (e) {
      console.warn('Simulation API failed or network offline, using fallback runner', e);
      for (let i = 0; i < fallbackSteps.length; i++) {
        await new Promise((r) => setTimeout(r, 650));
        setSimulationProgress({
          step: i + 1,
          steps: fallbackSteps.slice(0, i + 1),
          outcome: i === fallbackSteps.length - 1 ? fallbackOutcome : null
        });
      }
    } finally {
      setSimulationRunning(false);
    }
  };

  // Filtered Models (Advanced Facets)
  const filteredModels = React.useMemo(() => {
    return (data.models || []).filter(m => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (m.name||'').toLowerCase().includes(q) || 
          (m.provider||'').toLowerCase().includes(q) ||
          (m.deployType||'').toLowerCase().includes(q) ||
          (m.costTier||'').toLowerCase().includes(q) ||
          (m.supportedUseCases || []).some(u => u.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedProviders.length > 0 && !selectedProviders.includes(m.provider)) return false;
      if (selectedCaps.length > 0 && !selectedCaps.includes(m.capabilityGroup)) return false;
      if (selectedDeployments.length > 0 && !selectedDeployments.includes(m.deployType)) return false;
      if (selectedCosts.length > 0 && !selectedCosts.includes(m.costTier)) return false;
      return true;
    });
  }, [data.models, searchQuery, selectedProviders, selectedCaps, selectedDeployments, selectedCosts]);

  // Dynamic Facet Counter
  const getDynamicCount = (facetCategory, value) => {
    return (data.models || []).filter(m => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (m.name||'').toLowerCase().includes(q) || (m.provider||'').toLowerCase().includes(q) || (m.deployType||'').toLowerCase().includes(q) || (m.costTier||'').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (facetCategory === 'provider') { if (m.provider !== value) return false; } else if (selectedProviders.length > 0) { if (!selectedProviders.includes(m.provider)) return false; }
      if (facetCategory === 'capability') { if (m.capabilityGroup !== value) return false; } else if (selectedCaps.length > 0) { if (!selectedCaps.includes(m.capabilityGroup)) return false; }
      if (facetCategory === 'deployment') { if (m.deployType !== value) return false; } else if (selectedDeployments.length > 0) { if (!selectedDeployments.includes(m.deployType)) return false; }
      if (facetCategory === 'cost') { if (m.costTier !== value) return false; } else if (selectedCosts.length > 0) { if (!selectedCosts.includes(m.costTier)) return false; }
      return true;
    }).length;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProviders([]);
    setSelectedCaps([]);
    setSelectedDeployments([]);
    setSelectedCosts([]);
    showToast('Facet filters reset');
  };

  // Filtered Agents
  const filteredAgents = (data.agents || []).filter((a) => {
    const matchesSearch = (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.purpose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.domain || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLifecycle = agentLifecycleFilter === 'All' || (a.status || '').toLowerCase() === agentLifecycleFilter.toLowerCase() || (a.lifecycleStage || '').toLowerCase().includes(agentLifecycleFilter.toLowerCase());
    return matchesSearch && matchesLifecycle;
  });

  // Filtered Tools
  const filteredTools = (data.tools || []).filter((t) => {
    const matchesSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = toolCategoryFilter === 'All' || (t.category || '').toLowerCase().includes(toolCategoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Filtered Subscriptions
  const filteredSubscriptions = (data.mySubscriptions || []).filter((s) => {
    const matchesSearch = (s.entityName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = subTypeFilter === 'All' || (s.type || '').toLowerCase().includes(subTypeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--stellantis-accent)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          zIndex: 999,
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-tab Navigation (NO numerical prefixes) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'models', label: 'Model Catalogue', icon: Cpu, count: data.models.length },
            { id: 'agents', label: 'Agent & Workflows', icon: Bot, count: data.agents.length },
            { id: 'tools', label: 'AI Tools Catalogue', icon: Wrench, count: data.tools.length },
            { id: 'subscriptions', label: 'My Subscriptions', icon: BookmarkCheck, count: data.mySubscriptions.length },
            { id: 'sandbox', label: 'Interactive Sandbox Simulation', icon: Play, count: null }
          ].map((tab) => {
            const isActive = subTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSubTab(tab.id);
                  setSearchQuery('');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--stellantis-accent)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--badge-info-bg)' : 'var(--bg-surface)',
                  color: isActive ? 'var(--stellantis-accent)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'var(--stellantis-accent)' : 'var(--bg-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global search within Experience Zone */}
        {subTab !== 'sandbox' && (
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={`Search ${subTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. MODEL CATALOGUE                                        */}
      {/* ========================================================= */}
      {subTab === 'models' && (
        <div className="ad-models-browse-layout" style={{ marginTop: '0', background: 'transparent' }}>
          {/* Left Facet Filters Aside */}
          <aside className="ad-models-facet-aside" style={{ flexShrink: 0 }}>
            <div className="ad-facet-header">
              <div className="ad-facet-title">
                <Filter size={13} />
                <span>Facet Filters</span>
              </div>
              <button onClick={handleResetFilters} className="ad-facet-reset-btn">
                Reset All
              </button>
            </div>

            {/* 1. Capability Filter */}
            <div className="ad-facet-section">
              <div className="ad-facet-section-header"><span>Capability</span></div>
              <div className="ad-facet-options">
                {ALL_CAPABILITIES.map(cap => {
                  const count = getDynamicCount('capability', cap);
                  const checked = selectedCaps.includes(cap);
                  return (
                    <label key={cap} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          if (e.target.checked) setSelectedCaps([...selectedCaps, cap]);
                          else setSelectedCaps(selectedCaps.filter(c => c !== cap));
                        }} />
                        <span>{cap}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Deployment Type Filter */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header"><span>Deployment Type</span></div>
              <div className="ad-facet-options">
                {ALL_DEPLOYMENTS.map(dep => {
                  const count = getDynamicCount('deployment', dep);
                  const checked = selectedDeployments.includes(dep);
                  return (
                    <label key={dep} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          if (e.target.checked) setSelectedDeployments([...selectedDeployments, dep]);
                          else setSelectedDeployments(selectedDeployments.filter(d => d !== dep));
                        }} />
                        <span>{dep}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Cost Tier Filter */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header"><span>Cost Tier</span></div>
              <div className="ad-facet-options">
                {ALL_COST_TIERS.map(tier => {
                  const count = getDynamicCount('cost', tier);
                  const checked = selectedCosts.includes(tier);
                  return (
                    <label key={tier} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          if (e.target.checked) setSelectedCosts([...selectedCosts, tier]);
                          else setSelectedCosts(selectedCosts.filter(t => t !== tier));
                        }} />
                        <span>{tier}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Provider Filter */}
            <div className="ad-facet-section" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div className="ad-facet-section-header"><span>Provider</span></div>
              <div className="ad-facet-options">
                {ALL_PROVIDERS.map(prov => {
                  const count = getDynamicCount('provider', prov);
                  const checked = selectedProviders.includes(prov);
                  return (
                    <label key={prov} className={`ad-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                      <div className="ad-facet-label-left">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          if (e.target.checked) setSelectedProviders([...selectedProviders, prov]);
                          else setSelectedProviders(selectedProviders.filter(p => p !== prov));
                        }} />
                        <span>{prov}</span>
                      </div>
                      <span className="ad-facet-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="ad-models-main-area" style={{ width: '100%' }}>
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Showing {filteredModels.length} Models
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {compareList.length >= 2 && (
                  <button onClick={() => setShowCompareModal(true)} className="st-btn st-btn-primary" style={{ fontSize: '0.75rem', padding: '6px 12px', background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowLeftRight size={14} /> Compare Selected ({compareList.length})
                  </button>
                )}
                <button onClick={() => setShowOnboardModal(true)} className="st-btn st-btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={14} /> Request New Model Onboarding
                </button>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredModels.map(model => {
                const isCompared = compareList.includes(model.id);
                return (
                  <div key={model.id} className="st-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: isCompared ? '2px solid #3b82f6' : '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{model.id}</span>
                      </div>
                      <span className={`st-badge ${model.riskRating === 'High' ? 'badge-high' : model.riskRating === 'Medium' ? 'badge-purple' : 'badge-info'}`}>
                        {model.riskRating} Risk
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{model.name}</h3>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Provider: <strong>{model.provider}</strong>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface-secondary)', borderRadius: '6px', padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>Capability:</span><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{model.capabilityGroup}</div></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Deploy:</span><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{model.deployType}</div></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Cost:</span><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{model.costTierPrice}</div></div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Data Restrictions:</strong> {model.dataRestrictions}
                    </div>

                    {/* Actions Bar */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                      {model.subscribed ? (
                        <button onClick={() => handleToggleSubscription(model.id)} className="st-btn" style={{ flex: 1, fontSize: '0.75rem', background: '#10b981', color: '#ffffff', border: '1px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}>
                          <CheckCircle size={14} /> ✓ Subscribed
                        </button>
                      ) : (
                        <button onClick={() => handleToggleSubscription(model.id)} className="st-btn st-btn-primary" style={{ flex: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
                          <Sparkles size={13} /> + Subscribe
                        </button>
                      )}
                      <button onClick={() => handleToggleCompare(model.id)} className="st-btn st-btn-outline" style={{ fontSize: '0.72rem', padding: '6px 10px', color: isCompared ? '#3b82f6' : 'var(--text-secondary)', borderColor: isCompared ? '#3b82f6' : 'var(--border-color)', background: isCompared ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }} title="Add to comparison">
                        <ArrowLeftRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. AGENT & AGENTIC WORKFLOW CATALOGUE                     */}
      {/* ========================================================= */}
      {subTab === 'agents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Lifecycle Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Lifecycle Stage:
            </span>
            {[
              { id: 'All', label: 'All Agents', count: data.agents.length },
              { id: 'Active', label: 'Active Production', count: data.agents.filter(a => a.status === 'Active').length },
              { id: 'Experimental', label: 'Experimental', count: data.agents.filter(a => a.status === 'Experimental').length },
              { id: 'Suspended', label: 'Suspended', count: data.agents.filter(a => a.status === 'Suspended').length },
              { id: 'Retired', label: 'Retired', count: data.agents.filter(a => a.status === 'Retired').length }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setAgentLifecycleFilter(st.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: agentLifecycleFilter === st.id ? 'none' : '1px solid var(--border-color)',
                  background: agentLifecycleFilter === st.id ? 'var(--stellantis-accent)' : 'var(--bg-surface)',
                  color: agentLifecycleFilter === st.id ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                <span>{st.label}</span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: agentLifecycleFilter === st.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)'
                }}>
                  {st.count}
                </span>
              </button>
            ))}
          </div>

          {/* Agents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="st-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: agent.status === 'Retired' ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="st-badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {agent.autonomyLevel}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className={`st-badge ${agent.riskRating === 'High' ? 'badge-high' : 'badge-info'}`}>
                      {agent.riskRating}
                    </span>
                    <span className={`st-badge ${agent.status === 'Active' ? 'badge-success' : agent.status === 'Experimental' ? 'badge-purple' : 'badge-critical'}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{agent.name}</h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Project: <strong>{agent.project}</strong> • Domain: {agent.domain}
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {agent.purpose}
                </p>

                {/* Inputs, Outputs & Dependencies */}
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Inputs:</strong> <span style={{ color: 'var(--text-secondary)' }}>{agent.inputs}</span></div>
                  <div><strong>Outputs:</strong> <span style={{ color: 'var(--text-secondary)' }}>{agent.outputs}</span></div>
                  <div><strong>Model Dependency:</strong> <span style={{ color: 'var(--stellantis-accent)', fontWeight: 600 }}>{agent.modelDependencies}</span></div>
                  <div><strong>Outcomes / SLA:</strong> <span style={{ color: '#10b981', fontWeight: 600 }}>{agent.metrics}</span></div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Granted Permissions:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(agent.permissions || []).map((p, i) => (
                      <span key={i} style={{ background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                  <button
                    onClick={() => {
                      setSubTab('sandbox');
                      handleSimulate();
                    }}
                    className="st-btn st-btn-primary"
                    style={{ flex: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    disabled={agent.status === 'Retired' || agent.status === 'Suspended'}
                  >
                    <Play size={12} /> Test in Sandbox
                  </button>

                  <button
                    onClick={() => showToast(`Subscribed "${agent.name}" to active project.`)}
                    className="st-btn st-btn-outline"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Subscribe Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. AI TOOLS CATALOGUE (10 Standard Categories)            */}
      {/* ========================================================= */}
      {subTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Category Filter Pills Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
            {[
              'All',
              'Observability tools',
              'Coding assistants',
              'Testing tools',
              'Architecture tools',
              'DevOps tools',
              'Data engineering tools',
              'Modernization tools',
              'Documentation and knowledge tools',
              'Security and compliance tools',
              'Product-management tools'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setToolCategoryFilter(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: toolCategoryFilter === cat ? 'none' : '1px solid var(--border-color)',
                  background: toolCategoryFilter === cat ? 'var(--stellantis-accent)' : 'var(--bg-surface)',
                  color: toolCategoryFilter === cat ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {filteredTools.map((tool) => (
              <div key={tool.id} className="st-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{tool.id}</span>
                  <span className="st-badge badge-success">{tool.status}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{tool.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--stellantis-accent)', fontWeight: 700, marginTop: '2px' }}>
                    {tool.category}
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {tool.description}
                </p>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Use Cases:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tool.useCases}</span></div>
                  <div><strong>Integration:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tool.integrationRequirements}</span></div>
                  <div><strong>Licensing:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tool.licensing}</span></div>
                  <div><strong>Security Class:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tool.securityClassification}</span></div>
                  <div><strong>Data Handling:</strong> <span style={{ color: 'var(--text-muted)' }}>{tool.dataHandlingRestrictions}</span></div>
                  <div><strong>Adoption:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>{tool.adoptionRate}</span></div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Approved Projects:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(tool.approvedProjects || ['Enterprise-Wide Developer Squads', 'AMS Core Operations']).map((p, i) => (
                      <span key={i} className="st-badge badge-info" style={{ fontSize: '0.68rem' }}>{p}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                  <button
                    onClick={() => showToast(`Seat license request submitted for "${tool.name}".`)}
                    className="st-btn st-btn-primary"
                    style={{ flex: 1, fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={13} /> Request Seat / License
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MY SUBSCRIPTIONS (5 Granted Levels)                    */}
      {/* ========================================================= */}
      {subTab === 'subscriptions' && (
        <div className="st-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Tony's Active Enterprise Subscriptions</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Consolidated entitlements across Models, Agents, Workflows, Tools, Projects, Notifications, and Governance.
              </p>
            </div>
            <span className="st-badge badge-success" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
              {data.mySubscriptions.length} Active Entitlements
            </span>
          </div>

          {/* Subscription Type Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Model', 'Agent', 'Tool', 'Project', 'Notification', 'Governance policy', 'Report'].map((t) => (
              <button
                key={t}
                onClick={() => setSubTypeFilter(t)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: subTypeFilter === t ? 'none' : '1px solid var(--border-color)',
                  background: subTypeFilter === t ? 'var(--stellantis-accent)' : 'var(--bg-surface)',
                  color: subTypeFilter === t ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {t === 'All' ? 'All Subscriptions' : t}
              </button>
            ))}
          </div>

          {/* Subscriptions Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Item / Capability</th>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th style={{ padding: '10px' }}>Granted Level</th>
                  <th style={{ padding: '10px' }}>Usage / Throughput</th>
                  <th style={{ padding: '10px' }}>Cost Allocation</th>
                  <th style={{ padding: '10px' }}>Granted By</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sub.entityName}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="st-badge badge-info" style={{ fontSize: '0.68rem' }}>{sub.type}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}>
                        {sub.level}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{sub.monthlyUsage}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>{sub.costAllocation}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sub.grantedBy}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="st-badge badge-success" style={{ fontSize: '0.68rem' }}>{sub.status}</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button
                        onClick={() => showToast(`Quota management modal opened for "${sub.entityName}".`)}
                        className="st-btn st-btn-outline"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. INTERACTIVE SANDBOX SIMULATION                         */}
      {/* ========================================================= */}
      {subTab === 'sandbox' && (
        <div className="st-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="st-badge badge-purple" style={{ fontSize: '0.72rem' }}>Digital Twin Environment</span>
                <span className="st-badge badge-success" style={{ fontSize: '0.72rem' }}>Shadow Cluster Online</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 2px 0' }}>Interactive Autonomous Sandbox Simulation</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Simulate autonomous remediation runbooks in an isolated shadow Kubernetes cluster before production rollout.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {simulationProgress && !simulationRunning && (
                <button
                  onClick={() => setSimulationProgress(null)}
                  className="st-btn st-btn-outline"
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Clear Logs
                </button>
              )}

              <button
                onClick={handleSimulate}
                disabled={simulationRunning}
                className="st-btn st-btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  opacity: simulationRunning ? 0.75 : 1,
                  cursor: simulationRunning ? 'not-allowed' : 'pointer'
                }}
              >
                <Play size={15} style={{ animation: simulationRunning ? 'spin 1.5s linear infinite' : 'none' }} />
                <span>{simulationRunning ? 'Simulating Runbook...' : simulationProgress ? 'Re-run Simulation' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Environmental Meta Pill Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'var(--bg-surface-secondary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Target Shadow Cluster:</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>k8s-shadow-twin-turin-01</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Autonomous Runbook:</span>
              <div style={{ fontWeight: 700, color: 'var(--stellantis-accent)' }}>Kafka Partition Auto-Heal</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Safety Guardrails:</span>
              <div style={{ fontWeight: 700, color: '#10b981' }}>GOV-901 Pre-Validated</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Execution Mode:</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Isolated Digital Twin Replica</div>
            </div>
          </div>

          {/* Progress Bar when running */}
          {simulationRunning && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>Autonomous Agent Orchestration Progress</span>
                <span style={{ color: 'var(--stellantis-accent)', fontWeight: 700 }}>
                  Step {simulationProgress?.step || 1} of 5
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${((simulationProgress?.step || 1) / 5) * 100}%`,
                  height: '100%',
                  background: 'var(--stellantis-accent)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          )}

          {/* Live Execution Console */}
          <div style={{
            background: '#0a0d14',
            color: '#e2e8f0',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.8rem',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#64748b',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '8px',
              fontSize: '0.74rem'
            }}>
              <span># DIGITAL TWIN RUNNER: Telematics Partition Lag Recovery [Instance #TWIN-992]</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: simulationRunning ? '#f59e0b' : simulationProgress?.outcome ? '#10b981' : '#64748b'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: simulationRunning ? '#f59e0b' : simulationProgress?.outcome ? '#10b981' : '#64748b',
                  display: 'inline-block'
                }} />
                {simulationRunning ? 'LIVE EXECUTION IN PROGRESS' : simulationProgress?.outcome ? 'RUN COMPLETED' : 'IDLE READY'}
              </span>
            </div>

            {!simulationProgress && (
              <div style={{ color: '#64748b', margin: 'auto', textAlign: 'center', padding: '30px 0' }}>
                <Play size={28} style={{ opacity: 0.3, margin: '0 auto 8px auto', display: 'block' }} />
                Click <strong style={{ color: '#94a3b8' }}>"Run Simulation"</strong> above to launch the autonomous SRE runbook simulation in the isolated shadow cluster.
              </div>
            )}

            {simulationProgress && simulationProgress.steps.map((step, idx) => (
              <div
                key={idx}
                className="animate-fade-in"
                style={{
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  lineHeight: 1.5
                }}
              >
                <span style={{ color: '#38bdf8', flexShrink: 0 }}>✓ [{(idx * 1.1 + 0.4).toFixed(1)}s]</span>
                <span style={{ color: '#f1f5f9' }}>{step}</span>
              </div>
            ))}

            {simulationProgress?.outcome && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  color: '#34d399',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={16} color="#10b981" />
                <span>★ Validation Outcome: {simulationProgress.outcome}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Comparison Modal */}
      {showCompareModal && (
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
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="st-card animate-fade-in" style={{ maxWidth: '850px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeftRight size={20} color="#3b82f6" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Side-by-Side Model Comparison</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="st-btn st-btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-surface-secondary)' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Attribute</th>
                    {compareList.map((id) => {
                      const m = data.models.find((model) => model.id === id);
                      return <th key={id} style={{ padding: '10px', textAlign: 'left' }}>{m?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Provider</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px' }}>{data.models.find(m => m.id === id)?.provider}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Modality</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px' }}>{data.models.find(m => m.id === id)?.modality}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Deployment</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px' }}>{data.models.find(m => m.id === id)?.deploymentType}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Latency P95</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px', fontWeight: 600 }}>{data.models.find(m => m.id === id)?.latency}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Cost Tier</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px' }}>{data.models.find(m => m.id === id)?.costTier}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Benchmark Score</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px', color: '#10b981', fontWeight: 700 }}>{data.models.find(m => m.id === id)?.benchmarkScore}</td>)}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Risk Rating</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px' }}>{data.models.find(m => m.id === id)?.riskRating}</td>)}
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>Data Restrictions</td>
                    {compareList.map((id) => <td key={id} style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{data.models.find(m => m.id === id)?.dataRestrictions}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Request New Model Onboarding Modal */}
      {showOnboardModal && (
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
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="st-card animate-fade-in" style={{ maxWidth: '520px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--stellantis-accent)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Request New Model Onboarding</h3>
              </div>
              <button
                onClick={() => setShowOnboardModal(false)}
                className="st-btn st-btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Name / HuggingFace or Provider URI</label>
                <input
                  type="text"
                  placeholder="e.g. mistralai/Mixtral-8x22B-Instruct-v0.1"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Intended AMS Use Case</label>
                <input
                  type="text"
                  placeholder="e.g. Telematics anomaly log reasoning"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Requested Deployment Target</label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                  <option>Dedicated On-Prem (Turin High-Performance Datacenter)</option>
                  <option>Private Cloud (AWS Frankfurt EU-West-3)</option>
                  <option>Edge Gateway Telemetry Cluster</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={() => {
                    setShowOnboardModal(false);
                    showToast('Model onboarding request submitted to Chief AI Officer review board.');
                  }}
                  className="st-btn st-btn-primary"
                  style={{ flex: 1, padding: '8px' }}
                >
                  Submit Onboarding Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
