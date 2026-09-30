import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';

/** Deployment targets a new model can be requested for. */
const DEPLOYMENT_TARGETS = [
  'Dedicated On-Prem (Turin High-Performance Datacenter)',
  'Private Cloud (AWS Frankfurt EU-West-3)',
  'Edge Gateway Telemetry Cluster'
];

/**
 * Form for requesting that a new model be added to the catalogue. The request
 * goes to the Chief AI Officer review board (mocked in the PoC).
 *
 * @param {Object} props
 * @param {() => void} props.onClose
 * @param {(request: { modelName: string, useCase: string, deploymentTarget: string }) => void} props.onSubmit
 * @returns {JSX.Element}
 */
export default function ModelOnboardingModal({ onClose, onSubmit }) {
  const [modelName, setModelName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [deploymentTarget, setDeploymentTarget] = useState(DEPLOYMENT_TARGETS[0]);
  const [showErrors, setShowErrors] = useState(false);

  const isValid = modelName.trim() !== '' && useCase.trim() !== '';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    onSubmit({ modelName: modelName.trim(), useCase: useCase.trim(), deploymentTarget });
  };

  return (
    <Modal title="Request New Model Onboarding" icon={Plus} onClose={onClose} maxWidth={520}>
      <form className="ams-modal-body" onSubmit={handleSubmit} noValidate>
        <label className="ams-field">
          <span className="ams-field-label">Model name / HuggingFace or provider URI *</span>
          <input
            className="ams-input"
            value={modelName}
            onChange={(event) => setModelName(event.target.value)}
            placeholder="e.g. mistralai/Mixtral-8x22B-Instruct-v0.1"
            aria-invalid={showErrors && !modelName.trim()}
            required
          />
        </label>
        <label className="ams-field">
          <span className="ams-field-label">Intended AMS use case *</span>
          <input
            className="ams-input"
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            placeholder="e.g. Telematics anomaly log reasoning"
            aria-invalid={showErrors && !useCase.trim()}
            required
          />
        </label>
        <label className="ams-field">
          <span className="ams-field-label">Requested deployment target</span>
          <select
            className="ams-input"
            value={deploymentTarget}
            onChange={(event) => setDeploymentTarget(event.target.value)}
          >
            {DEPLOYMENT_TARGETS.map((target) => <option key={target}>{target}</option>)}
          </select>
        </label>

        {showErrors && !isValid && (
          <p className="ams-form-error" role="alert">Model name and use case are required.</p>
        )}

        <div className="ams-modal-footer">
          <button type="button" className="st-btn st-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="st-btn st-btn-primary">Submit Onboarding Request</button>
        </div>
      </form>
    </Modal>
  );
}
