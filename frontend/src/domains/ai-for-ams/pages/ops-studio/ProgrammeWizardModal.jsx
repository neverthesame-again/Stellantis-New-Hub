import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { createEmptyProgramme } from '../../model/programmeModel';
import Modal from '../../components/Modal';
import ToggleChips from '../../components/ToggleChips';

const STEPS = ['Basics', 'Goals', 'Agents'];

/**
 * Short programme setup wizard (F12): name*, service portfolio, description*;
 * then objective, stakeholders and target date; then the agents it covers.
 * The new programme becomes the active one.
 *
 * @param {Object} props
 * @param {() => void} props.onClose
 * @param {(programmeId: string, name: string) => void} props.onCreated
 * @returns {JSX.Element}
 */
export default function ProgrammeWizardModal({ onClose, onCreated }) {
  const { state, actions } = useAmsStudio();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(createEmptyProgramme);
  const [showErrors, setShowErrors] = useState(false);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const basicsValid = form.name.trim() !== '' && form.description.trim() !== '';

  const next = () => {
    if (step === 0 && !basicsValid) {
      setShowErrors(true);
      return;
    }
    setStep((current) => current + 1);
  };

  const create = () => {
    const id = actions.createProgramme(form);
    onCreated(id, form.name.trim());
  };

  return (
    <Modal
      title="Set up a programme"
      icon={FolderPlus}
      onClose={onClose}
      maxWidth={640}
      footer={(
        <>
          {step > 0 && <button type="button" className="st-btn st-btn-outline" onClick={() => setStep(step - 1)}>Back</button>}
          {step < STEPS.length - 1
            ? <button type="button" className="st-btn st-btn-primary" onClick={next}>Next</button>
            : <button type="button" className="st-btn st-btn-primary" onClick={create}>Create programme</button>}
        </>
      )}
    >
      <ol className="ams-wizard-steps" aria-label="Wizard steps">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? 'is-current' : index < step ? 'is-done' : ''} aria-current={index === step ? 'step' : undefined}>
            <span>{index + 1}</span> {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="ams-form-grid">
          <label className="ams-field is-full">
            <span className="ams-field-label">Programme name *</span>
            <input className="ams-input" value={form.name} onChange={(event) => set('name', event.target.value)} aria-invalid={showErrors && !form.name.trim()} placeholder="e.g. Connected Vehicle Resilience" />
          </label>
          <label className="ams-field is-full">
            <span className="ams-field-label">Service portfolio</span>
            <input className="ams-input" value={form.portfolio} onChange={(event) => set('portfolio', event.target.value)} placeholder="e.g. Connected Vehicle Core" />
          </label>
          <label className="ams-field is-full">
            <span className="ams-field-label">Description *</span>
            <textarea className="ams-input" rows={3} value={form.description} onChange={(event) => set('description', event.target.value)} aria-invalid={showErrors && !form.description.trim()} />
          </label>
          {showErrors && !basicsValid && <p className="ams-form-error" role="alert">Name and description are required.</p>}
        </div>
      )}

      {step === 1 && (
        <div className="ams-form-grid">
          <label className="ams-field is-full">
            <span className="ams-field-label">Objective</span>
            <input className="ams-input" value={form.objective} onChange={(event) => set('objective', event.target.value)} placeholder="e.g. Halve MTTR for telematics P1s by Q4" />
          </label>
          <label className="ams-field is-full">
            <span className="ams-field-label">Stakeholders</span>
            <input className="ams-input" value={form.stakeholders} onChange={(event) => set('stakeholders', event.target.value)} placeholder="People and teams involved" />
          </label>
          <label className="ams-field">
            <span className="ams-field-label">Target date</span>
            <input type="date" className="ams-input" value={form.targetDate} onChange={(event) => set('targetDate', event.target.value)} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="ams-form">
          <p className="ams-muted-note">Choose the agents this programme covers. You can create it now and add agents later.</p>
          <ToggleChips
            options={state.studioAgents.map((agent) => ({ id: agent.id, label: agent.name, hint: `stage ${agent.stage}` }))}
            value={form.agentIds}
            onChange={(agentIds) => set('agentIds', agentIds)}
            ariaLabel="Programme agents"
          />
        </div>
      )}
    </Modal>
  );
}
