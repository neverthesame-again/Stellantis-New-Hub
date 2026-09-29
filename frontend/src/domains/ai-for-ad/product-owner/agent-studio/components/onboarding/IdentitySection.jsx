import React from 'react';
import { Fingerprint } from 'lucide-react';
import { AD_SUBDOMAINS, ASIL_LEVELS, PROGRAMS, TEAMS } from '../../agentStudioData';
import { FormSection, FieldError } from './FormSection';
import { ASIL_HINTS } from './onboardingHelpers';

/** Section 01 — agent identity, scope and safety classification. */
export default function IdentitySection({ index, draft, errors, onField, onBlur }) {
  const field = (key) => ({
    value: draft[key],
    onChange: (e) => onField(key, e.target.value),
    onBlur: () => onBlur(key),
    'aria-invalid': Boolean(errors[key])
  });
  const cls = (base, key) => `${base} ${errors[key] ? 'is-invalid' : ''}`;

  return (
    <FormSection
      id="identity"
      index={index}
      icon={Fingerprint}
      title="Identity & scope"
      subtitle="Who owns the agent, which vehicle program it serves and its ISO 26262 safety classification."
    >
      <div className="ad-studio-grid-2">
        <label className="ad-studio-field">
          <span className="ad-studio-label">Agent name<span className="req">*</span></span>
          <input className={cls('ad-studio-input', 'name')} placeholder="e.g. LiDAR-Vision Synchronizer Agent" {...field('name')} />
          <FieldError message={errors.name} />
        </label>
        <label className="ad-studio-field">
          <span className="ad-studio-label">Agent family</span>
          <input className="ad-studio-input" placeholder="e.g. Perception QA, Safety Copilot" {...field('family')} />
        </label>

        <label className="ad-studio-field">
          <span className="ad-studio-label">Vehicle program<span className="req">*</span></span>
          <select className={cls('ad-studio-select', 'program')} {...field('program')}>
            <option value="">Select program…</option>
            {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <FieldError message={errors.program} />
        </label>
        <label className="ad-studio-field">
          <span className="ad-studio-label">Owning team<span className="req">*</span></span>
          <input className={cls('ad-studio-input', 'team')} list="ad-onb-teams" placeholder="Select or type a team" {...field('team')} />
          <datalist id="ad-onb-teams">
            {TEAMS.map((t) => <option key={t} value={t} />)}
          </datalist>
          <FieldError message={errors.team} />
        </label>

        <label className="ad-studio-field">
          <span className="ad-studio-label">Accountable owner<span className="req">*</span></span>
          <input className={cls('ad-studio-input', 'owner')} placeholder="Named engineer or lead" {...field('owner')} />
          <FieldError message={errors.owner} />
        </label>
        <label className="ad-studio-field">
          <span className="ad-studio-label">Version (SemVer)</span>
          <input className={cls('ad-studio-input ad-onb-mono', 'version')} placeholder="1.0.0" {...field('version')} />
          <FieldError message={errors.version} />
        </label>

        <label className="ad-studio-field">
          <span className="ad-studio-label">AD sub-domain<span className="req">*</span></span>
          <select className={cls('ad-studio-select', 'subDomain')} {...field('subDomain')}>
            <option value="">Select sub-domain…</option>
            {AD_SUBDOMAINS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <FieldError message={errors.subDomain} />
        </label>
        <div className="ad-studio-field">
          <span className="ad-studio-label">ASIL level (ISO 26262)<span className="req">*</span></span>
          <div className="ad-onb-segmented" role="radiogroup" aria-label="ASIL level">
            {ASIL_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={draft.asil === l}
                className={`ad-onb-seg ${draft.asil === l ? `is-selected ad-studio-asil asil-${l}` : ''}`}
                onClick={() => onField('asil', l)}
              >
                {l === 'QM' ? 'QM' : `ASIL ${l}`}
              </button>
            ))}
          </div>
          <FieldError message={errors.asil} />
          {draft.asil && <span className="ad-onb-help">{ASIL_HINTS[draft.asil]}</span>}
        </div>
      </div>

      <label className="ad-studio-field ad-onb-mt">
        <span className="ad-studio-label">Purpose<span className="req">*</span></span>
        <textarea
          className={cls('ad-studio-textarea', 'purpose')}
          rows={3}
          placeholder="What the agent does, for whom, and the human oversight path (e.g. outputs reviewed by FuSa engineers before baseline)."
          {...field('purpose')}
        />
        <span className="ad-onb-field-foot">
          <FieldError message={errors.purpose} />
          <span className="ad-onb-charcount">{draft.purpose.trim().length} chars</span>
        </span>
      </label>
    </FormSection>
  );
}
