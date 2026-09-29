import React, { useEffect, useRef, useState } from 'react';
import { ListChecks, CircleCheck, CircleX, RefreshCw, LoaderCircle } from 'lucide-react';
import { GOVERNANCE_POLICIES, formatDateTime } from '../../agentStudioData';
import { useAgentStudio } from '../../useAgentStudio';
import CoverageRing from './CoverageRing';
import { lastComplianceScan, relativeTime } from './governanceUtils';

const SCAN_MS = 1100;

/**
 * GuardrailChecklist — every governance policy with pass/fail + evidence for
 * one agent, and a "Re-run compliance scan" action (~1 s animation).
 */
export default function GuardrailChecklist({ agent, checks, notify }) {
  const { audit, rescanCompliance } = useAgentStudio();
  const [scanning, setScanning] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const passed = GOVERNANCE_POLICIES.filter((p) => checks[p.id]?.pass).length;
  const mandatory = GOVERNANCE_POLICIES.filter((p) => p.mandatory);
  const mandatoryFail = mandatory.filter((p) => !checks[p.id]?.pass).length;
  const pct = Math.round((passed / GOVERNANCE_POLICIES.length) * 100);
  const lastScan = lastComplianceScan(agent.id, audit);

  const runScan = () => {
    setScanning(true);
    timer.current = setTimeout(() => {
      const result = rescanCompliance(agent.id);
      setScanning(false);
      if (result) {
        const ok = GOVERNANCE_POLICIES.filter((p) => result[p.id].pass).length;
        notify(`Compliance scan complete — ${ok}/${GOVERNANCE_POLICIES.length} policies compliant for ${agent.name}`);
      }
    }, SCAN_MS);
  };

  return (
    <section className="ad-gov-section">
      <div className="ad-gov-section-head">
        <h4><ListChecks size={13} /> Guardrail checklist</h4>
        <div className="ad-gov-scan">
          <span className="ad-studio-muted">
            {scanning ? 'Scanning policies…' : lastScan ? `Last scanned ${relativeTime(lastScan.ts)} · ${formatDateTime(lastScan.ts)}` : 'Not scanned this session'}
          </span>
          <button type="button" className="ad-studio-btn is-accent is-sm" onClick={runScan} disabled={scanning}>
            {scanning ? <LoaderCircle size={12} className="ad-gov-spin" /> : <RefreshCw size={12} />}
            {scanning ? 'Scanning' : 'Re-run compliance scan'}
          </button>
        </div>
      </div>

      <div className="ad-gov-check-summary">
        <CoverageRing pct={pct} size={60} label={`${passed}/${GOVERNANCE_POLICIES.length}`} sublabel="pass" />
        <div className="ad-gov-check-summary-text">
          <strong>{passed} of {GOVERNANCE_POLICIES.length} guardrails passing</strong>
          <span className={mandatoryFail ? 'ad-gov-bad' : 'ad-gov-ok'}>
            {mandatoryFail ? `${mandatoryFail} of ${mandatory.length} mandatory guardrails failing — approval blocked` : `All ${mandatory.length} mandatory guardrails satisfied`}
          </span>
        </div>
        {scanning && <div className="ad-gov-scanbar" aria-hidden="true"><span /></div>}
      </div>

      <ul className={`ad-gov-checklist ${scanning ? 'is-scanning' : ''}`}>
        {GOVERNANCE_POLICIES.map((p, i) => {
          const check = checks[p.id] || { pass: false, evidence: '—' };
          return (
            <li
              key={p.id}
              className={`ad-gov-check ${check.pass ? 'is-pass' : 'is-fail'} ${p.mandatory ? 'is-mandatory' : ''}`}
              style={scanning ? { animationDelay: `${i * 90}ms` } : undefined}
            >
              <span className="ad-gov-check-icon">
                {scanning
                  ? <LoaderCircle size={15} className="ad-gov-spin" />
                  : check.pass ? <CircleCheck size={15} className="ad-gov-ok" /> : <CircleX size={15} className="ad-gov-bad" />}
              </span>
              <span className="ad-gov-check-body">
                <span className="ad-gov-check-name">
                  {p.name}
                  <span className="ad-gov-check-std">{p.standard}</span>
                </span>
                <span className="ad-gov-check-evidence">{check.evidence}</span>
              </span>
              <span className="ad-gov-check-tags">
                {p.mandatory ? <span className="ad-studio-badge is-critical">Mandatory</span> : <span className="ad-studio-badge">Advisory</span>}
                <span className={`ad-studio-badge is-mono ${check.pass ? 'is-success' : 'is-critical'}`}>{check.pass ? 'PASS' : 'FAIL'}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
