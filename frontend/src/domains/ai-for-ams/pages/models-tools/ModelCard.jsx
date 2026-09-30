import React from 'react';
import { ArrowLeftRight, CircleCheck, Sparkles } from 'lucide-react';
import { riskBadgeClass } from './modelFacets';

/**
 * One model in the catalogue grid.
 *
 * @param {Object} props
 * @param {Object} props.model
 * @param {boolean} props.isCompared       Whether the model is in the comparison set.
 * @param {() => void} props.onToggleSubscription
 * @param {() => void} props.onToggleCompare
 * @returns {JSX.Element}
 */
export default function ModelCard({ model, isCompared, onToggleSubscription, onToggleCompare }) {
  return (
    <article className={`st-card ams-card ${isCompared ? 'is-selected' : ''}`}>
      <div className="ams-card-head">
        <span className="ams-card-id">{model.id}</span>
        <span className={`st-badge ${riskBadgeClass(model.riskRating)}`}>{model.riskRating} Risk</span>
      </div>

      <div>
        <h3 className="ams-card-title">{model.name}</h3>
        <p className="ams-card-subtitle">Provider: <strong>{model.provider}</strong></p>
      </div>

      <dl className="ams-details ams-details-grid">
        <div className="is-full">
          <dt>Capability</dt>
          <dd>{model.capabilityGroup}</dd>
        </div>
        <div>
          <dt>Deploy</dt>
          <dd>{model.deployType}</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{model.costTierPrice}</dd>
        </div>
      </dl>

      <p className="ams-card-footnote">
        <strong>Data restrictions:</strong> {model.dataRestrictions}
      </p>

      <div className="ams-card-actions">
        {model.subscribed ? (
          <button
            type="button"
            className="st-btn ams-btn-success is-grow"
            onClick={onToggleSubscription}
            aria-label={`Unsubscribe from ${model.name}`}
          >
            <CircleCheck size={14} /> Subscribed
          </button>
        ) : (
          <button type="button" className="st-btn st-btn-primary is-grow" onClick={onToggleSubscription}>
            <Sparkles size={13} /> Subscribe
          </button>
        )}
        <button
          type="button"
          className={`st-btn st-btn-outline ams-btn-toggle ${isCompared ? 'is-active' : ''}`}
          onClick={onToggleCompare}
          aria-pressed={isCompared}
          aria-label={isCompared ? `Remove ${model.name} from comparison` : `Add ${model.name} to comparison`}
          title="Add to comparison"
        >
          <ArrowLeftRight size={13} />
        </button>
      </div>
    </article>
  );
}
