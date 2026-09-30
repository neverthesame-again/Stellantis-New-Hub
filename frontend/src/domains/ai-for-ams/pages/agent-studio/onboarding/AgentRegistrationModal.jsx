import React, { useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { selectSkillReuseCount } from '../../../state/selectors';
import {
  AGENT_FAMILIES,
  AMS_AGENT_AREAS,
  APPROVERS,
  CONNECTED_TOOLS,
  KNOWLEDGE_SOURCES,
  SERVICE_TIERS,
  createEmptyRegistration
} from '../../../model/agentOptions';
import { REQUIRED_REGISTRATION_FIELDS } from '../../../model/agentLifecycle';
import Modal from '../../../components/Modal';
import ToggleChips from '../../../components/ToggleChips';
import RuntimeFields from './RuntimeFields';

/** Keys of the registration part of an agent (everything the form edits). */
const REGISTRATION_KEYS = Object.keys(createEmptyRegistration());

/**
 * Copies the registration fields of an existing agent, filling gaps with defaults.
 *
 * @param {Object} agent
 * @returns {Object}
 */
function pickRegistration(agent) {
  const defaults = createEmptyRegistration();
  return Object.fromEntries(REGISTRATION_KEYS.map((key) => [key, structuredClone(agent[key] ?? defaults[key])]));
}

/**
 * Form section with a heading and short explanation.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.hint]
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
function FormSection({ title, hint, children }) {
  return (
    <section className="ams-form-section">
      <header>
        <h4 className="ams-form-section-title">{title}</h4>
        {hint && <p className="ams-muted-note">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

/**
 * Register Agent form (F1): identity, runtime with connection check, skills,
 * knowledge sources, tools, workflow mapping and governance. "Save
 * registration" stores a draft — only the agent name is needed to save; the
 * remaining required fields are what the Registration stage needs to be left.
 *
 * @param {Object} props
 * @param {Object | null} props.agent       Agent to edit, or null to register a new one.
 * @param {() => void} props.onClose
 * @param {(agentId: string, isNew: boolean) => void} props.onSaved
 * @returns {JSX.Element}
 */
export default function AgentRegistrationModal({ agent, onClose, onSaved }) {
  const { state, actions } = useAmsStudio();
  const [form, setForm] = useState(() => (agent ? pickRegistration(agent) : createEmptyRegistration()));
  const [showErrors, setShowErrors] = useState(false);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const textProps = (key) => ({
    className: 'ams-input',
    value: form[key],
    onChange: (event) => set(key, event.target.value)
  });

  const missing = REQUIRED_REGISTRATION_FIELDS.filter(({ key }) => !String(form[key] ?? '').trim());
  const skillOptions = useMemo(() => state.skills.map((skill) => ({
    id: skill.id,
    label: skill.name,
    hint: `from ${skill.sourceAgent} · reused ${selectSkillReuseCount(state, skill)}×`
  })), [state]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setShowErrors(true);
      return;
    }
    const registration = { ...form, name: form.name.trim() };
    if (agent) {
      actions.updateAgent(agent.id, registration);
      onSaved(agent.id, false);
    } else {
      onSaved(actions.registerAgent(registration), true);
    }
  };

  const invalid = (key) => showErrors && !String(form[key] ?? '').trim();

  return (
    <Modal
      title={agent ? `Edit registration — ${agent.name}` : 'Register an AMS agent'}
      icon={ClipboardList}
      onClose={onClose}
      maxWidth={880}
    >
      <form className="ams-form" onSubmit={handleSubmit} noValidate>
        <FormSection title="Identity" hint="Fields marked * are needed to leave the Registration stage.">
          <div className="ams-form-grid">
            <label className="ams-field">
              <span className="ams-field-label">Agent name *</span>
              <input {...textProps('name')} placeholder="e.g. Incident Triage Classifier" aria-invalid={invalid('name')} />
            </label>
            <label className="ams-field">
              <span className="ams-field-label">Agent family</span>
              <select {...textProps('family')}>
                {AGENT_FAMILIES.map((family) => <option key={family}>{family}</option>)}
              </select>
            </label>
            <label className="ams-field">
              <span className="ams-field-label">AMS area</span>
              <select {...textProps('area')}>
                {AMS_AGENT_AREAS.map((area) => <option key={area.id} value={area.id}>{area.label}</option>)}
              </select>
            </label>
            <label className="ams-field">
              <span className="ams-field-label">Service or portfolio *</span>
              <input {...textProps('service')} placeholder="e.g. Connected Vehicle Telematics" />
            </label>
            <label className="ams-field">
              <span className="ams-field-label">Team *</span>
              <input {...textProps('team')} placeholder="e.g. AMS L2 Telematics" />
            </label>
            <label className="ams-field">
              <span className="ams-field-label">Owner *</span>
              <input {...textProps('owner')} placeholder="Accountable person" />
            </label>
            <label className="ams-field">
              <span className="ams-field-label">Version</span>
              <input {...textProps('version')} placeholder="1.0.0" />
            </label>
            <fieldset className="ams-field">
              <legend className="ams-field-label">Service tier *</legend>
              <div className="ams-segmented" role="radiogroup">
                {SERVICE_TIERS.map((tier) => (
                  <label key={tier} className={`ams-segment ${form.serviceTier === tier ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="service-tier"
                      value={tier}
                      checked={form.serviceTier === tier}
                      onChange={() => set('serviceTier', tier)}
                    />
                    {tier}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="ams-field is-full">
              <span className="ams-field-label">Purpose *</span>
              <textarea {...textProps('purpose')} rows={2} placeholder="What the agent does and for whom" />
            </label>
          </div>
        </FormSection>

        <FormSection title="Runtime" hint="Where the agent runs. Verify the connection before advancing past the Runtime stage.">
          <RuntimeFields runtime={form.runtime} onChange={(runtime) => set('runtime', runtime)} showErrors={showErrors} />
        </FormSection>

        <FormSection title="Skills" hint="Certified skills from the shared library, with the agent they came from and how often they are reused.">
          <ToggleChips options={skillOptions} value={form.skillIds} onChange={(value) => set('skillIds', value)} ariaLabel="Skills" />
        </FormSection>

        <FormSection title="Knowledge sources">
          <ToggleChips options={KNOWLEDGE_SOURCES} value={form.knowledgeSources} onChange={(value) => set('knowledgeSources', value)} ariaLabel="Knowledge sources" />
        </FormSection>

        <FormSection title="Connected tools">
          <ToggleChips options={CONNECTED_TOOLS} value={form.connectedTools} onChange={(value) => set('connectedTools', value)} ariaLabel="Connected tools" />
        </FormSection>

        <FormSection title="Workflow mapping" hint="Incident workflows this agent takes part in.">
          <ToggleChips
            options={state.workflows.map((workflow) => ({ id: workflow.id, label: workflow.name, hint: workflow.source }))}
            value={form.workflowIds}
            onChange={(value) => set('workflowIds', value)}
            ariaLabel="Workflows"
          />
        </FormSection>

        <FormSection title="Governance">
          <div className="ams-form-grid">
            <label className="ams-field">
              <span className="ams-field-label">Approver</span>
              <select {...textProps('approver')}>
                {APPROVERS.map((approver) => <option key={approver}>{approver}</option>)}
              </select>
            </label>
            <div className="ams-field">
              <label className="ams-checkbox">
                <input type="checkbox" checked={form.piiMaskingEnabled} onChange={(event) => set('piiMaskingEnabled', event.target.checked)} />
                Mask PII in incident data before the agent sees it
              </label>
              <label className="ams-checkbox">
                <input type="checkbox" checked={form.humanApprovalRequired} onChange={(event) => set('humanApprovalRequired', event.target.checked)} />
                Require human approval for production actions
              </label>
            </div>
          </div>
        </FormSection>

        <footer className="ams-form-footer">
          <p className="ams-muted-note" aria-live="polite">
            {missing.length === 0
              ? 'All required registration fields are filled.'
              : `Still needed to leave Registration: ${missing.map(({ label }) => label).join(', ')}.`}
          </p>
          {showErrors && !form.name.trim() && <p className="ams-form-error" role="alert">Give the agent a name to save the draft.</p>}
          <div className="ams-page-actions">
            <button type="button" className="st-btn st-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="st-btn st-btn-primary">Save registration</button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
