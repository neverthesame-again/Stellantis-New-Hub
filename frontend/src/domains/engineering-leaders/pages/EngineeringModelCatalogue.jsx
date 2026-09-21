import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeftRight,
  Database,
  Lock,
  X,
  Info
} from 'lucide-react';

// ── Facet Filter Constants (matched to engineering mockData fields) ────────────
const ENG_CAPABILITIES = [
  'Complex Code Synthesis & Architecture Blueprinting',
  'High-Performance C++ & Rust AUTOSAR Synthesis',
  'Diagnostic Reasoning & ECU Troubleshooting',
  'Multimodal Vision & Driver Monitoring Validation',
  'Multi-jurisdiction Homologation & Regulatory Compliance',
  'Python Fleet Telemetry ETL & Battery Thermal Analytics',
  'Ultra-Low Latency Embedded POSIX C Code Completion',
  'Multilingual Cockpit Assistant & APAC Voice AI'
];
const ENG_DEPLOYMENTS = [
  'Private VPC',
  'Air-Gapped On-Premises',
  'Dedicated Azure / Cloud Tenant',
  'EU Sovereign Cloud',
  'AWS Dedicated Cluster',
  'Local / Edge'
];
const ENG_RISK_RATINGS = ['Low', 'Medium', 'High'];
const ENG_PROVIDERS = [
  'Anthropic',
  'DeepSeek',
  'Meta',
  'OpenAI',
  'Mistral AI',
  'BigCode',
  'Alibaba'
];

// Helper: normalize deploymentType string → facet bucket
function getDeployBucket(deploymentType = '') {
  const d = deploymentType.toLowerCase();
  if (d.includes('air-gapped') || d.includes('on-premises') || d.includes('on-prem')) return 'Air-Gapped On-Premises';
  if (d.includes('azure') || d.includes('fedram') || d.includes('government')) return 'Dedicated Azure / Cloud Tenant';
  if (d.includes('eu sovereign') || d.includes('ovhcloud') || d.includes('paris') || d.includes('frankfurt') && d.includes('sovereign')) return 'EU Sovereign Cloud';
  if (d.includes('aws') && (d.includes('dedicated') || d.includes('ec2'))) return 'AWS Dedicated Cluster';
  if (d.includes('local') || d.includes('micro-edge') || d.includes('workstation') || d.includes('edge')) return 'Local / Edge';
  if (d.includes('vpc') || d.includes('private')) return 'Private VPC';
  return 'Private VPC';
}

// Helper: normalize provider string → facet bucket
function getProviderBucket(provider = '') {
  const p = provider.toLowerCase();
  if (p.includes('anthropic')) return 'Anthropic';
  if (p.includes('deepseek')) return 'DeepSeek';
  if (p.includes('meta')) return 'Meta';
  if (p.includes('openai') || p.includes('microsoft')) return 'OpenAI';
  if (p.includes('mistral')) return 'Mistral AI';
  if (p.includes('bigcode') || p.includes('starcoder')) return 'BigCode';
  if (p.includes('alibaba') || p.includes('qwen')) return 'Alibaba';
  return provider;
}

/**
 * PRD §5.3 — Model Catalogue
 * Enterprise Automotive Foundation Models
 */
export default function EngineeringModelCatalogue({ models = [], onToggleSubscription, onOnboardModel, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  // Facet filter state (arrays = multi-select; empty = show all)
  const [selectedCaps, setSelectedCaps] = useState([]);
  const [selectedDeployments, setSelectedDeployments] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [compareList, setCompareList] = useState(['MOD-01', 'MOD-02']);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [selectedModelDetail, setSelectedModelDetail] = useState(null);

  // Reset all facet filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCaps([]);
    setSelectedDeployments([]);
    setSelectedRisks([]);
    setSelectedProviders([]);
    if (showToast) showToast('Facet filters reset — showing all models');
  };

  // Dynamic count: how many models match all OTHER active facets + this value
  const getDynamicCount = (facetCategory, value) => {
    return models.filter(m => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (m.name || '').toLowerCase().includes(q) ||
          (m.capability || '').toLowerCase().includes(q) ||
          (m.provider || '').toLowerCase().includes(q) ||
          (m.deploymentType || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      // Cross-filter: Capability
      if (facetCategory === 'capability') {
        if (m.capability !== value) return false;
      } else if (selectedCaps.length > 0 && !selectedCaps.includes(m.capability)) return false;
      // Cross-filter: Deployment
      const bucket = getDeployBucket(m.deploymentType);
      if (facetCategory === 'deployment') {
        if (bucket !== value) return false;
      } else if (selectedDeployments.length > 0 && !selectedDeployments.includes(bucket)) return false;
      // Cross-filter: Risk
      if (facetCategory === 'risk') {
        if (m.riskRating !== value) return false;
      } else if (selectedRisks.length > 0 && !selectedRisks.includes(m.riskRating)) return false;
      // Cross-filter: Provider
      const provBucket = getProviderBucket(m.provider);
      if (facetCategory === 'provider') {
        if (provBucket !== value) return false;
      } else if (selectedProviders.length > 0 && !selectedProviders.includes(provBucket)) return false;
      return true;
    }).length;
  };

  // Auto-filled presets so user doesn't have to write anything manually
  const ONBOARD_PRESETS = [
    {
      label: '⚡ Embedded AUTOSAR (Default)',
      name: 'DeepSeek-R1-AUTOSAR-v2.0',
      provider: 'Enterprise On-Premises (Turin GPU)',
      capability: 'AUTOSAR Adaptive C++ & Real-time CAN Bus Firmware Synthesis',
      deploymentType: 'Air-Gapped Private VPC',
      riskRating: 'Medium',
      intendedUse: 'In-vehicle real-time CAN bus telemetry and ASIL-D controller firmware synthesis.'
    },
    {
      label: '⚡ Cockpit Vision UX',
      name: 'Llama-Vision-Cockpit-v1.4',
      provider: 'AWS Bedrock Private VPC (Turin Region)',
      capability: 'Driver Attention Monitoring & Infotainment Gesture Recognition',
      deploymentType: 'Private VPC',
      riskRating: 'Low',
      intendedUse: 'Cockpit camera driver drowsiness telemetry analysis.'
    },
    {
      label: '⚡ ISO 26262 Safety',
      name: 'Claude-3.7-SafetyCert-v1',
      provider: 'EU Sovereign Cloud (Mistral Paris)',
      capability: 'ISO 26262 ASIL-D Hazard & Risk Analysis (HARA) Automation',
      deploymentType: 'EU Sovereign Cloud',
      riskRating: 'High',
      intendedUse: 'Automated functional safety evidence generation and verification.'
    }
  ];

  // Onboard form state — automatically pre-filled
  const [onboardForm, setOnboardForm] = useState(ONBOARD_PRESETS[0]);

  const handleToggleCompare = (modelId) => {
    setCompareList(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        if (prev.length >= 3) {
          if (showToast) showToast('Maximum 3 models can be compared side-by-side.');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    const submissionName = onboardForm.name.trim() || 'DeepSeek-R1-AUTOSAR-v2.0';
    const submission = {
      ...onboardForm,
      name: submissionName
    };
    if (onOnboardModel) {
      onOnboardModel(submission);
    }
    if (showToast) showToast(`Model "${submissionName}" onboarded and routed to Workflow Inbox!`);
    setShowOnboardModal(false);
    setOnboardForm(ONBOARD_PRESETS[0]);
  };

  // Filtered models using all facets
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      const q = searchQuery.toLowerCase();
      if (searchQuery.trim()) {
        const match = (m.name || '').toLowerCase().includes(q) ||
          (m.capability || '').toLowerCase().includes(q) ||
          (m.provider || '').toLowerCase().includes(q) ||
          (m.modality || '').toLowerCase().includes(q) ||
          (m.deploymentType || '').toLowerCase().includes(q) ||
          (m.supportedUseCases || []).some(u => u.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedCaps.length > 0 && !selectedCaps.includes(m.capability)) return false;
      if (selectedDeployments.length > 0 && !selectedDeployments.includes(getDeployBucket(m.deploymentType))) return false;
      if (selectedRisks.length > 0 && !selectedRisks.includes(m.riskRating)) return false;
      if (selectedProviders.length > 0 && !selectedProviders.includes(getProviderBucket(m.provider))) return false;
      return true;
    });
  }, [models, searchQuery, selectedCaps, selectedDeployments, selectedRisks, selectedProviders]);

  const hasActiveFilters = selectedCaps.length > 0 || selectedDeployments.length > 0 ||
    selectedRisks.length > 0 || selectedProviders.length > 0 || searchQuery.trim() !== '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search models by provider, capability, deployment, use case..."
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
          <button
            onClick={() => setShowCompareModal(true)}
            className="st-btn st-btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <ArrowLeftRight size={14} /> Compare Models ({compareList.length})
          </button>

          <button
            onClick={() => setShowOnboardModal(true)}
            className="st-btn st-btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--stellantis-action)', border: 'none', color: '#ffffff', cursor: 'pointer' }}
          >
            <Plus size={15} /> Request Model Onboarding
          </button>
        </div>
      </div>

      {/* Browse Layout: Facet Sidebar + Model Cards */}
      <div className="eng-models-browse-layout">

        {/* ── Left Facet Filter Aside ──────────────────────────────────── */}
        <aside className="eng-models-facet-aside">
          <div className="eng-facet-header">
            <div className="eng-facet-title">
              <Filter size={13} />
              <span>Facet Filters</span>
            </div>
            <button onClick={handleResetFilters} className="eng-facet-reset-btn">
              Reset All
            </button>
          </div>

          {/* 1. Capability */}
          <div className="eng-facet-section">
            <div className="eng-facet-section-header">Capability</div>
            <div className="eng-facet-options">
              {ENG_CAPABILITIES.map(cap => {
                const count = getDynamicCount('capability', cap);
                const checked = selectedCaps.includes(cap);
                return (
                  <label key={cap} className={`eng-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                    <div className="eng-facet-label-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCaps([...selectedCaps, cap]);
                          else setSelectedCaps(selectedCaps.filter(c => c !== cap));
                        }}
                      />
                      <span>{cap}</span>
                    </div>
                    <span className="eng-facet-count">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Deployment Type */}
          <div className="eng-facet-section">
            <div className="eng-facet-section-header">Deployment Type</div>
            <div className="eng-facet-options">
              {ENG_DEPLOYMENTS.map(dep => {
                const count = getDynamicCount('deployment', dep);
                const checked = selectedDeployments.includes(dep);
                return (
                  <label key={dep} className={`eng-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                    <div className="eng-facet-label-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedDeployments([...selectedDeployments, dep]);
                          else setSelectedDeployments(selectedDeployments.filter(d => d !== dep));
                        }}
                      />
                      <span>{dep}</span>
                    </div>
                    <span className="eng-facet-count">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Risk Rating */}
          <div className="eng-facet-section">
            <div className="eng-facet-section-header">Risk Rating</div>
            <div className="eng-facet-options">
              {ENG_RISK_RATINGS.map(risk => {
                const count = getDynamicCount('risk', risk);
                const checked = selectedRisks.includes(risk);
                return (
                  <label key={risk} className={`eng-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                    <div className="eng-facet-label-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRisks([...selectedRisks, risk]);
                          else setSelectedRisks(selectedRisks.filter(r => r !== risk));
                        }}
                      />
                      <span>{risk} Risk</span>
                    </div>
                    <span className="eng-facet-count">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Provider */}
          <div className="eng-facet-section">
            <div className="eng-facet-section-header">Provider</div>
            <div className="eng-facet-options">
              {ENG_PROVIDERS.map(prov => {
                const count = getDynamicCount('provider', prov);
                const checked = selectedProviders.includes(prov);
                return (
                  <label key={prov} className={`eng-facet-label ${count === 0 ? 'zero-count' : ''} ${checked ? 'is-checked' : ''}`}>
                    <div className="eng-facet-label-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProviders([...selectedProviders, prov]);
                          else setSelectedProviders(selectedProviders.filter(p => p !== prov));
                        }}
                      />
                      <span>{prov}</span>
                    </div>
                    <span className="eng-facet-count">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </aside>

        {/* ── Right: Model Cards Grid ──────────────────────────────────── */}
        <div className="eng-models-main-area">
          {hasActiveFilters && (
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={12} />
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredModels.length}</strong> of {models.length} models
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredModels.map((model) => {
          const isCompared = compareList.includes(model.id);

          return (
            <div
              key={model.id}
              className="st-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: model.riskRating === 'Critical' ? '3px solid #ef4444' : (model.riskRating === 'High' ? '3px solid #f59e0b' : '3px solid #3b82f6')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{model.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {model.version}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                    {model.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{model.provider}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`st-badge ${
                    model.riskRating === 'Low' ? 'badge-success' : (model.riskRating === 'Medium' ? 'badge-info' : 'badge-high')
                  }`}>
                    {model.riskRating} Risk
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{model.modality}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {model.capability}
              </div>

              {/* Benchmarks Matrix Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                background: 'var(--bg-surface-secondary)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>HUMANEVAL</span>
                  <strong style={{ color: '#10b981' }}>{model.benchmarkResults.humanEval}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>AUTOSAR COMPLIANCE</span>
                  <strong style={{ color: '#0284c7' }}>{model.benchmarkResults.autosarCompliantRate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>SWE-BENCH</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{model.benchmarkResults.sweBench}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>P95 LATENCY</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{model.latencyMs}ms</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>Context Window: <strong style={{ color: 'var(--text-primary)' }}>{model.contextWindow}</strong></div>
                <div>Deployment: <strong style={{ color: 'var(--text-primary)' }}>{model.deploymentType}</strong></div>
                <div>Token Cost: <strong style={{ color: 'var(--text-primary)' }}>{model.costPerMillionTokens}</strong></div>
              </div>

              {/* Card Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <button
                  onClick={() => handleToggleCompare(model.id)}
                  style={{
                    background: isCompared ? 'var(--badge-info-bg)' : 'transparent',
                    border: '1px solid var(--border-color)',
                    color: isCompared ? 'var(--stellantis-action)' : 'var(--text-secondary)',
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
                  <ArrowLeftRight size={12} />
                  {isCompared ? 'Compared' : 'Compare'}
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedModelDetail(model)}
                    className="st-btn st-btn-outline"
                    style={{ padding: '5px 10px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onToggleSubscription && onToggleSubscription(model.id)}
                    style={{
                      background: model.subscribed ? 'var(--badge-success-bg)' : 'var(--stellantis-action)',
                      color: model.subscribed ? '#10b981' : '#ffffff',
                      border: model.subscribed ? '1px solid #10b981' : 'none',
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
                    {model.subscribed ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                    {model.subscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
        {/* End model cards grid */}
        </div>
        {/* End main area */}
      </div>
      {/* End browse layout */}

      {/* =========================================================================
          MODAL 1: SIDE-BY-SIDE MODEL COMPARISON MODAL (UP TO 3 MODELS)
          ========================================================================= */}
      {showCompareModal && (
        <div className="ad-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="ad-modal-dialog" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeftRight size={20} color="var(--stellantis-action)" />
                <span className="ad-modal-title">Side-by-Side Model Benchmark Comparison ({compareList.length} Models)</span>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <div className="ad-modal-body">
              <table className="ad-modal-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Dimension / Metric</th>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return (
                        <th key={id} style={{ width: `${78 / compareList.length}%` }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.84rem' }}>{m?.name || id}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m?.provider}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>HumanEval Accuracy</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id} style={{ color: '#10b981', fontWeight: 800 }}>{m?.benchmarkResults.humanEval}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>SWE-Bench Pass@1</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id} style={{ fontWeight: 700 }}>{m?.benchmarkResults.sweBench}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>AUTOSAR Compliance Rate</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id} style={{ color: '#0284c7', fontWeight: 800 }}>{m?.benchmarkResults.autosarCompliantRate}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>P95 Inference Latency</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id}>{m?.latencyMs}ms</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Context Window</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id}>{m?.contextWindow}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Deployment Boundary</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id}>{m?.deploymentType}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Cost Per Million Tokens</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return <td key={id}>{m?.costPerMillionTokens}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Risk Rating</td>
                    {compareList.map(id => {
                      const m = models.find(mod => mod.id === id);
                      return (
                        <td key={id}>
                          <span className={`st-badge ${m?.riskRating === 'Low' ? 'badge-success' : 'badge-info'}`}>
                            {m?.riskRating} Risk
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ad-modal-footer">
              <button onClick={() => setShowCompareModal(false)} className="st-btn st-btn-primary">Close Comparison</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REQUEST MODEL ONBOARDING MODAL
          ========================================================================= */}
      {showOnboardModal && (
        <div className="ad-modal-backdrop" onClick={() => setShowOnboardModal(false)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--stellantis-action)" />
                <span className="ad-modal-title">Request Enterprise Model Onboarding</span>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <form onSubmit={handleOnboardSubmit}>
              <div className="ad-modal-body">
                {/* 1-Click Auto-Fill Preset Selector */}
                <div style={{
                  background: 'var(--bg-subtle)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Auto-Filled Profiles (Click to switch or keep default):
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ONBOARD_PRESETS.map((preset, idx) => {
                      const isSelected = onboardForm.name === preset.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setOnboardForm(preset)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: isSelected ? '1px solid var(--stellantis-action)' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--stellantis-navy)' : 'var(--bg-surface)',
                            color: isSelected ? '#ffffff' : 'var(--text-primary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Model Name &amp; Version:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CodeLlama-70B-AUTOSAR-FineTune"
                    value={onboardForm.name}
                    onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Provider / Hosting Infrastructure:</label>
                  <select
                    value={onboardForm.provider}
                    onChange={(e) => setOnboardForm({ ...onboardForm, provider: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="Enterprise On-Premises (Turin GPU)">Enterprise On-Premises (Turin GPU)</option>
                    <option value="AWS Bedrock Private VPC (Turin Region)">AWS Bedrock Private VPC (Turin Region)</option>
                    <option value="EU Sovereign Cloud (Mistral Paris)">EU Sovereign Cloud (Mistral Paris)</option>
                    <option value="Azure OpenAI Dedicated Cluster">Azure OpenAI Dedicated Cluster</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Primary Engineering Capability:</label>
                  <input
                    type="text"
                    value={onboardForm.capability}
                    onChange={(e) => setOnboardForm({ ...onboardForm, capability: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Risk Rating Classification:</label>
                  <select
                    value={onboardForm.riskRating}
                    onChange={(e) => setOnboardForm({ ...onboardForm, riskRating: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="Low">Low Risk (Standard Sandbox / Internal Prototypes)</option>
                    <option value="Medium">Medium Risk (CI/CD Pipeline Integration)</option>
                    <option value="High">High Risk (ASIL-B/C Verification Tasks)</option>
                    <option value="Critical">Critical (ASIL-D In-Vehicle Runtime Inference)</option>
                  </select>
                </div>
              </div>

              <div className="ad-modal-footer">
                <button type="button" onClick={() => setShowOnboardModal(false)} className="st-btn st-btn-secondary">Cancel</button>
                <button type="submit" className="st-btn st-btn-primary">Submit for Architecture Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: MODEL CARD DETAIL MODAL
          ========================================================================= */}
      {selectedModelDetail && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedModelDetail(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="var(--stellantis-action)" />
                <div>
                  <span className="ad-modal-title">{selectedModelDetail.name}</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{selectedModelDetail.version} • {selectedModelDetail.provider}</div>
                </div>
              </div>
              <button onClick={() => setSelectedModelDetail(null)} className="ad-modal-close"><X size={16} /></button>
            </div>

            <div className="ad-modal-body">
              <div>
                <strong style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved Use Cases:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{selectedModelDetail.approvedUseCases}</p>
              </div>

              <div>
                <strong style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data &amp; Boundary Restrictions:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{selectedModelDetail.dataRestrictions}</p>
              </div>

              <div>
                <strong style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Known Limitations:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#f59e0b' }}>{selectedModelDetail.limitations}</p>
              </div>

              <div>
                <strong style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Consumption &amp; Allocation:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  {selectedModelDetail.monthlyConsumptionTokens} tokens consumed ({selectedModelDetail.costAllocation})
                </p>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button onClick={() => setSelectedModelDetail(null)} className="st-btn st-btn-primary">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
