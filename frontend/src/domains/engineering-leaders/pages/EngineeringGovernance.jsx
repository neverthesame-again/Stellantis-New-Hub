import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Lock,
  Ban,
  Activity,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react';
import { simpleGovernanceData } from '../governanceData.js';

export default function EngineeringGovernance() {
  const [data, setData] = useState(simpleGovernanceData);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveException = (id) => {
    setData(prev => ({
      ...prev,
      policyExceptions: prev.policyExceptions.map(item => 
        item.id === id ? { ...item, status: 'Resolved' } : item
      ),
      kpis: {
        ...prev.kpis,
        policyExceptions: Math.max(0, prev.kpis.policyExceptions - 1)
      }
    }));
    showToast(`Exception ${id} marked as Resolved.`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--stellantis-navy, #0b1a30)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1100,
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--stellantis-navy, #0b1a30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={20} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Risk & Governance
              </h2>
              <span className="badge-navy" style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}>
                Executive Overview
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Monitoring policy exceptions, high-risk assets, recertification status, and incidents.
            </p>
          </div>
        </div>

        <span className="badge-success" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
          Governance Status: Compliant
        </span>
      </div>

      {/* TOP 6 COMPACT KPI TILES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '10px'
      }}>
        {/* 1. Policy Exceptions */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Policy Exceptions</span>
            <AlertTriangle size={15} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: data.kpis.policyExceptions > 0 ? '#f59e0b' : 'var(--text-primary)', margin: '4px 0 2px 0' }}>
            {data.kpis.policyExceptions} Active
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>1 High, 2 Medium</div>
        </div>

        {/* 2. High-Risk Assets */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>High-Risk Assets</span>
            <ShieldAlert size={15} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>
            {data.kpis.highRiskAssets} Assets
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>2 Models, 2 Agents</div>
        </div>

        {/* 3. Recertification Status */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Recertification Status</span>
            <Clock size={15} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', margin: '4px 0 2px 0' }}>
            {data.kpis.recertificationStatus}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>1 asset due in Oct</div>
        </div>

        {/* 4. Human Override Rate */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Human Override Rate</span>
            <UserCheck size={15} color="var(--stellantis-action)" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--stellantis-action)', margin: '4px 0 2px 0' }}>
            {data.kpis.humanOverrideRate}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>52 of 1,240 decisions</div>
        </div>

        {/* 5. Security Findings */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Security Findings</span>
            <Lock size={15} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8b5cf6', margin: '4px 0 2px 0' }}>
            {data.kpis.securityFindings} Open
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>All contained by filters</div>
        </div>

        {/* 6. Unapproved Asset Usage */}
        <div className="st-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Unapproved Usage</span>
            <Ban size={15} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444', margin: '4px 0 2px 0' }}>
            {data.kpis.unapprovedUsage} Blocked
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>NeMo guardrail active</div>
        </div>
      </div>

      {/* SECTION 1: POLICY EXCEPTIONS & UNAPPROVED ASSET USAGE */}
      <div className="st-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Policy Exceptions & Unapproved Asset Usage
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Showing {data.policyExceptions.length} records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '6px 8px' }}>ID</th>
                <th style={{ padding: '6px 8px' }}>Issue Description</th>
                <th style={{ padding: '6px 8px' }}>Asset Involved</th>
                <th style={{ padding: '6px 8px' }}>Type</th>
                <th style={{ padding: '6px 8px' }}>Squad</th>
                <th style={{ padding: '6px 8px' }}>Severity</th>
                <th style={{ padding: '6px 8px' }}>Status</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.policyExceptions.map((ex) => (
                <tr key={ex.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px', fontWeight: 800, color: 'var(--stellantis-action)' }}>{ex.id}</td>
                  <td style={{ padding: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>{ex.title}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{ex.asset}</td>
                  <td style={{ padding: '8px', fontSize: '0.7rem' }}>{ex.type}</td>
                  <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{ex.squad}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: ex.severity === 'High' ? '#fee2e2' : (ex.severity === 'Medium' ? '#fef3c7' : '#e0f2fe'),
                      color: ex.severity === 'High' ? '#991b1b' : (ex.severity === 'Medium' ? '#92400e' : '#075985')
                    }}>
                      {ex.severity}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontWeight: 600, color: ex.status === 'Resolved' ? '#10b981' : 'var(--text-primary)' }}>
                    {ex.status}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    {ex.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolveException(ex.id)}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'var(--stellantis-action)',
                          color: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        Resolve
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 700 }}>✓ Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: HIGH-RISK ASSETS IN USE & RECERTIFICATION STATUS */}
      <div className="st-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="#ef4444" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High-Risk Assets in Use & Recertification Status
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            EU AI Act & ISO 26262 Classified
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '6px 8px' }}>Asset ID & Name</th>
                <th style={{ padding: '6px 8px' }}>Type</th>
                <th style={{ padding: '6px 8px' }}>Risk Classification</th>
                <th style={{ padding: '6px 8px' }}>Recertification Due</th>
                <th style={{ padding: '6px 8px' }}>Status</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {data.highRiskAssets.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{asset.name}</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{asset.id}</div>
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{asset.type}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: asset.riskLevel.includes('High-Risk') ? '#fee2e2' : '#f1f5f9',
                      color: asset.riskLevel.includes('High-Risk') ? '#991b1b' : 'var(--text-primary)'
                    }}>
                      {asset.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{asset.recertificationDueDate}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: asset.recertStatus === 'Certified' ? '#ecfdf5' : '#fffbeb',
                      color: asset.recertStatus === 'Certified' ? '#065f46' : '#b45309'
                    }}>
                      {asset.recertStatus}
                    </span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-muted)' }}>{asset.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: MODEL, AGENT, AND WORKFLOW INCIDENTS + SECURITY FINDINGS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        
        {/* Incidents Card */}
        <div className="st-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Activity size={16} color="var(--stellantis-action)" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Model, Agent & Workflow Incidents
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.incidents.map((inc) => (
              <div
                key={inc.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {inc.id} • {inc.title}
                  </span>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: inc.status === 'Resolved' ? '#ecfdf5' : '#eff6ff',
                    color: inc.status === 'Resolved' ? '#065f46' : '#1e40af'
                  }}>
                    {inc.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--stellantis-action)', fontWeight: 600 }}>
                  Target: {inc.target} ({inc.category})
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  {inc.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Override & Security Findings Card */}
        <div className="st-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} color="#10b981" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Human Override Rate & Security Findings
            </h3>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Human Override Rate</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--stellantis-action)' }}>{data.securityAndOverrides.humanOverrideRate}</strong>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {data.securityAndOverrides.overridesCount} overrides across {data.securityAndOverrides.totalDecisions} autonomous actions.
            </div>
            <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              Primary Reason: {data.securityAndOverrides.overrideReasonTop}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Active Security Findings:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.securityAndOverrides.securityFindings.map((sec) => (
                <div
                  key={sec.id}
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '7px 10px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.72rem'
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sec.id} • {sec.title}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{sec.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
