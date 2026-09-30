import React from 'react';
import { Server, Check, LoaderCircle, CircleCheck, CircleX, PlugZap, Info, Link2 } from 'lucide-react';
import { RUNTIMES } from '../../agentStudioData';
import { FormSection } from './FormSection';
import { getRuntime, runtimePreflight, endpointPreview, runtimeStatusMeta } from './onboardingHelpers';

const TAG_TONE = { Recommended: 'is-success', Supported: 'is-info', Custom: 'is-purple' };

/** Section 02 — runtime picker, endpoint configuration and health check. */
export default function RuntimeSection({ index, runtime, live, isNew, configChanged, verifying, onSelectRuntime, onRuntimeField, onVerify }) {
  const rt = getRuntime(runtime.type);
  const preflight = runtimePreflight(runtime);
  const status = live?.status || 'unverified';
  const meta = runtimeStatusMeta(status);

  let statusPanel;
  if (isNew) {
    statusPanel = (
      <div className="ad-onb-rt-status">
        <Info size={15} />
        <div>
          <strong>Verification runs after registration</strong>
          <span>The health check is the Stage 1 → 2 exit criterion; register the agent first, then verify here.</span>
        </div>
      </div>
    );
  } else if (verifying || status === 'verifying') {
    statusPanel = (
      <div className="ad-onb-rt-status is-busy">
        <LoaderCircle size={15} className="ad-onb-spin" />
        <div>
          <strong>Verifying connection…</strong>
          <span className="ad-onb-mono">GET {endpointPreview(runtime)}</span>
        </div>
      </div>
    );
  } else if (configChanged) {
    statusPanel = (
      <div className="ad-onb-rt-status is-warn">
        <Info size={15} />
        <div>
          <strong>Configuration changed</strong>
          <span>Verifying saves the new endpoint and re-runs the health check. The previous result ({meta.label.toLowerCase()}) no longer applies.</span>
        </div>
      </div>
    );
  } else if (status === 'connected') {
    statusPanel = (
      <div className="ad-onb-rt-status is-good">
        <CircleCheck size={15} />
        <div>
          <strong>Connected · {live.latencyMs} ms</strong>
          <span>Health check passed against {rt.label}. Runtime exit criterion satisfied.</span>
        </div>
      </div>
    );
  } else if (status === 'failed') {
    statusPanel = (
      <div className="ad-onb-rt-status is-bad">
        <CircleX size={15} />
        <div>
          <strong>Health check failed</strong>
          <span>The runtime needs an https:// base URL and a {rt.idLabel}. Fix the fields below and verify again.</span>
        </div>
      </div>
    );
  } else {
    statusPanel = (
      <div className="ad-onb-rt-status">
        <PlugZap size={15} />
        <div>
          <strong>Not verified yet</strong>
          <span>Run the health check to connect the agent to {rt.label}.</span>
        </div>
      </div>
    );
  }

  return (
    <FormSection
      id="runtime"
      index={index}
      icon={Server}
      title="Runtime connection"
      subtitle="Where the agent executes. The TCS Ai Operating Engineering Portal brokers credentials and audit for every runtime."
      aside={!isNew && <span className={`ad-studio-badge ${meta.tone}`}>{meta.label}</span>}
    >
      <div className="ad-onb-runtime-grid" role="radiogroup" aria-label="Runtime">
        {RUNTIMES.map((r) => {
          const selected = r.id === runtime.type;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`ad-onb-runtime-card ${selected ? 'is-selected' : ''}`}
              onClick={() => onSelectRuntime(r.id)}
            >
              <span className="ad-onb-runtime-head">
                <strong>{r.label}</strong>
                <span className={`ad-studio-badge ad-onb-badge-xs ${TAG_TONE[r.tag] || ''}`}>{r.tag}</span>
                <span className="ad-onb-runtime-check">{selected && <Check size={12} strokeWidth={3} />}</span>
              </span>
              <span className="ad-onb-runtime-desc">{r.description}</span>
              <span className="ad-onb-runtime-scope">{r.scope}</span>
            </button>
          );
        })}
      </div>

      {runtime.type === 'SEL' && (
        <div className="ad-onb-note">
          <Link2 size={13} />
          <span>SEL agents route through the existing <strong>SEL Nexus</strong> integration — orchestration, service credentials and execution audit are inherited from the Nexus workspace.</span>
        </div>
      )}

      <div className="ad-onb-runtime-fields">
        <label className="ad-studio-field ad-onb-span-2">
          <span className="ad-studio-label">Base URL</span>
          <input
            className={`ad-studio-input ad-onb-mono ${status === 'failed' && !preflight[0].pass ? 'is-invalid' : ''}`}
            value={runtime.baseUrl}
            onChange={(e) => onRuntimeField('baseUrl', e.target.value)}
            placeholder={rt.defaultBaseUrl}
          />
        </label>
        <label className="ad-studio-field">
          <span className="ad-studio-label">{rt.idLabel}</span>
          <input
            className={`ad-studio-input ad-onb-mono ${status === 'failed' && !preflight[1].pass ? 'is-invalid' : ''}`}
            value={runtime.agentId}
            onChange={(e) => onRuntimeField('agentId', e.target.value)}
            placeholder={runtime.type === 'EXTERNAL' ? 'deploy/my-service' : 'e.g. sel-ad-lidar-01'}
          />
        </label>
        <label className="ad-studio-field">
          <span className="ad-studio-label">Health-check URL</span>
          <input
            className="ad-studio-input ad-onb-mono"
            value={runtime.healthUrl}
            onChange={(e) => onRuntimeField('healthUrl', e.target.value)}
            placeholder="/health"
          />
        </label>
      </div>

      <div className="ad-onb-endpoint">
        <span className="ad-studio-label">Resolved health endpoint</span>
        <code>{endpointPreview(runtime)}</code>
      </div>

      <div className="ad-onb-rt-verify">
        <ul className="ad-onb-preflight">
          {preflight.map((p) => (
            <li key={p.key} className={p.pass ? 'is-pass' : 'is-fail'}>
              {p.pass ? <CircleCheck size={12} /> : <CircleX size={12} />} {p.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="ad-studio-btn is-primary"
          onClick={onVerify}
          disabled={isNew || verifying || status === 'verifying'}
          title={isNew ? 'Register the agent first' : undefined}
        >
          {verifying || status === 'verifying' ? <LoaderCircle size={13} className="ad-onb-spin" /> : <PlugZap size={13} />}
          Verify connection
        </button>
      </div>

      {statusPanel}
    </FormSection>
  );
}
