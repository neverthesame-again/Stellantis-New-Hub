import React, { useState } from 'react';
import { Loader2, PlugZap } from 'lucide-react';
import {
  CONNECTION_STATUS,
  DEFAULT_HEALTH_CHECK_PATH,
  HOSTING_REGIONS,
  RUNTIME_OPTIONS
} from '../../../model/agentOptions';
import { verifyRuntimeConnection } from '../../../model/runtimeVerification';
import ConnectionBadge from '../../../components/ConnectionBadge';

/** Runtime fields whose change invalidates a previous connection check. */
const ENDPOINT_FIELDS = new Set(['type', 'baseUrl', 'agentId', 'healthCheckUrl']);

/**
 * Runtime section of the registration form: runtime picker, endpoint fields
 * and a "Verify connection" check (simulated in the PoC). Editing any endpoint
 * field resets the verification, so a saved "connected" status always refers
 * to the endpoint being saved.
 *
 * @param {Object} props
 * @param {Object} props.runtime Current runtime settings.
 * @param {(runtime: Object) => void} props.onChange
 * @param {boolean} props.showErrors Highlight missing required fields.
 * @returns {JSX.Element}
 */
export default function RuntimeFields({ runtime, onChange, showErrors }) {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState(null);

  const update = (field, value) => {
    const next = { ...runtime, [field]: value };
    if (ENDPOINT_FIELDS.has(field)) {
      Object.assign(next, { connectionStatus: CONNECTION_STATUS.NOT_VERIFIED, latencyMs: null, checkedAt: null });
      setMessage(null);
    }
    onChange(next);
  };

  const verify = async () => {
    setChecking(true);
    const result = await verifyRuntimeConnection(runtime);
    setChecking(false);
    setMessage(result.message);
    onChange({ ...runtime, connectionStatus: result.status, latencyMs: result.latencyMs, checkedAt: result.checkedAt });
  };

  return (
    <div className="ams-form-grid">
      <fieldset className="ams-field is-full">
        <legend className="ams-field-label">Runtime *</legend>
        <div className="ams-option-cards">
          {RUNTIME_OPTIONS.map((option) => (
            <label key={option.id} className={`ams-option-card ${runtime.type === option.id ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="runtime-type"
                value={option.id}
                checked={runtime.type === option.id}
                onChange={() => update('type', option.id)}
              />
              <span className="ams-option-card-title">
                {option.label}
                {option.recommended && <span className="st-badge badge-success">Recommended</span>}
              </span>
              <span className="ams-option-card-text">{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="ams-field">
        <span className="ams-field-label">Base URL *</span>
        <input
          className="ams-input"
          value={runtime.baseUrl}
          onChange={(event) => update('baseUrl', event.target.value)}
          placeholder="https://agents.ams.internal/my-agent"
          aria-invalid={showErrors && !runtime.baseUrl.trim()}
        />
      </label>
      <label className="ams-field">
        <span className="ams-field-label">Agent ID *</span>
        <input
          className="ams-input"
          value={runtime.agentId}
          onChange={(event) => update('agentId', event.target.value)}
          placeholder="my-agent"
          aria-invalid={showErrors && !runtime.agentId.trim()}
        />
      </label>
      <label className="ams-field">
        <span className="ams-field-label">Health-check URL</span>
        <input
          className="ams-input"
          value={runtime.healthCheckUrl}
          onChange={(event) => update('healthCheckUrl', event.target.value)}
          placeholder={DEFAULT_HEALTH_CHECK_PATH}
        />
      </label>
      <label className="ams-field">
        <span className="ams-field-label">Hosting region</span>
        <select className="ams-input" value={runtime.region} onChange={(event) => update('region', event.target.value)}>
          {HOSTING_REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}
        </select>
      </label>

      <div className="ams-verify-row is-full">
        <button type="button" className="st-btn st-btn-outline" onClick={verify} disabled={checking}>
          {checking ? <Loader2 size={14} className="ams-spin" /> : <PlugZap size={14} />}
          {checking ? 'Verifying…' : 'Verify connection'}
        </button>
        <ConnectionBadge status={runtime.connectionStatus} latencyMs={runtime.latencyMs} />
        <span className="st-badge badge-purple">Simulated</span>
        {message && <span className="ams-muted-note" role="status">{message}</span>}
      </div>
    </div>
  );
}
