import React from 'react';
import { Funnel } from 'lucide-react';
import { MODEL_FACETS, countFacetValue } from './modelFacets';

/**
 * Left-hand facet filter panel of the model catalogue.
 *
 * @param {Object} props
 * @param {Object[]} props.models   Full catalogue (counts are computed against it).
 * @param {string} props.query      Current search text.
 * @param {import('./modelFacets').FacetSelection} props.selection
 * @param {(selection: import('./modelFacets').FacetSelection) => void} props.onChange
 * @param {() => void} props.onReset
 * @returns {JSX.Element}
 */
export default function ModelFacetPanel({ models, query, selection, onChange, onReset }) {
  const toggleValue = (facetKey, value, checked) => {
    const current = selection[facetKey] || [];
    const next = checked ? [...current, value] : current.filter((item) => item !== value);
    onChange({ ...selection, [facetKey]: next });
  };

  return (
    <aside className="ams-facet-panel" aria-label="Model filters">
      <div className="ams-facet-header">
        <div className="ams-facet-title">
          <Funnel size={13} aria-hidden="true" />
          <span>Facet Filters</span>
        </div>
        <button type="button" className="ams-facet-reset" onClick={onReset}>
          Reset All
        </button>
      </div>

      {MODEL_FACETS.map((facet) => (
        <fieldset key={facet.key} className="ams-facet-section">
          <legend className="ams-facet-section-title">{facet.label}</legend>
          <div className="ams-facet-options">
            {facet.values.map((value) => {
              const count = countFacetValue(models, query, selection, facet.key, value);
              const checked = (selection[facet.key] || []).includes(value);
              return (
                <label
                  key={value}
                  className={`ams-facet-option ${count === 0 ? 'is-empty' : ''} ${checked ? 'is-checked' : ''}`}
                >
                  <span className="ams-facet-option-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => toggleValue(facet.key, value, event.target.checked)}
                    />
                    <span>{value}</span>
                  </span>
                  <span className="ams-facet-count">{count}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </aside>
  );
}
