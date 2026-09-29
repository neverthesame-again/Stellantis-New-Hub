import React from 'react';
import { ShieldCheck, CircleCheck, Hourglass, CircleX, Award, Siren } from 'lucide-react';
import { GOVERNANCE_POLICIES } from '../../agentStudioData';
import { coverageForPolicies, coverageTone, isCritical } from './governanceUtils';

const ALL_POLICY_IDS = GOVERNANCE_POLICIES.map((p) => p.id);

/** KPI strip for the Governance Center. */
export default function GovernanceKpis({ agents, governed, checksById }) {
  const coverage = coverageForPolicies(ALL_POLICY_IDS, governed, checksById);
  const approved = agents.filter((a) => a.governance.status === 'approved').length;
  const pending = agents.filter((a) => a.governance.status === 'pending');
  const rejected = agents.filter((a) => a.governance.status === 'rejected').length;
  const certificates = agents.filter((a) => a.certificateId).length;
  const criticalPending = pending.filter(isCritical).length;

  const tiles = [
    {
      key: 'coverage',
      icon: ShieldCheck,
      label: 'Policy coverage',
      value: coverage.pct == null ? '—' : coverage.pct,
      unit: coverage.pct == null ? '' : '%',
      note: `${coverage.passed}/${coverage.total} checks · ${governed.length} governed agents`,
      tone: coverageTone(coverage.pct)
    },
    { key: 'approved', icon: CircleCheck, label: 'Approved', value: approved, note: 'Governance decision recorded', tone: 'is-good' },
    { key: 'pending', icon: Hourglass, label: 'Pending approval', value: pending.length, note: 'Awaiting approver decision', tone: pending.length ? 'is-warn' : 'is-none' },
    { key: 'rejected', icon: CircleX, label: 'Rejected', value: rejected, note: 'Returned to onboarding', tone: rejected ? 'is-bad' : 'is-none' },
    { key: 'certs', icon: Award, label: 'Certificates issued', value: certificates, note: 'Version frozen · AD-CERT', tone: 'is-info' },
    { key: 'critical', icon: Siren, label: 'Critical pending', value: criticalPending, note: 'ASIL C/D awaiting decision', tone: criticalPending ? 'is-bad' : 'is-none' }
  ];

  return (
    <div className="ad-studio-kpi-grid ad-gov-kpis">
      {tiles.map(({ key, icon: Icon, label, value, unit, note, tone }) => (
        <div key={key} className={`ad-studio-kpi ad-gov-kpi ${tone}`}>
          <span className="ad-studio-kpi-label"><Icon size={12} className="ad-gov-kpi-icon" /> {label}</span>
          <span className="ad-studio-kpi-value">{value}{unit && <small>{unit}</small>}</span>
          <span className="ad-studio-kpi-note">{note}</span>
        </div>
      ))}
    </div>
  );
}
