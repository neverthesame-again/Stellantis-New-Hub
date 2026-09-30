import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { getMeasureLabel, parseRulePack } from '../../../model/evaluationModel';
import { pluralize } from '../../../utils/formatters';

const SAMPLE_PACK = `rules:
  - id: RULE-SEC-02
    name: Mask VINs in log excerpts
    measure: security
    threshold: 92
    blocking: true`;

/**
 * Evaluation rules table with rule-pack upload (JSON or YAML) (F6).
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function RulesPanel({ showToast }) {
  const { state, actions } = useAmsStudio();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const { rules, errors: problems } = parseRulePack(await file.text(), file.name);
    setErrors(problems);
    if (rules.length > 0) {
      actions.importEvaluationRules(rules, file.name);
      showToast(`Imported ${pluralize(rules.length, 'rule')} from ${file.name}.`);
    }
  };

  return (
    <section className="st-card ams-card" aria-labelledby="ams-rules-title">
      <header className="ams-page-header">
        <div>
          <h3 id="ams-rules-title" className="ams-card-title">Evaluation rules</h3>
          <p className="ams-card-subtitle">Blocking rules stop an agent leaving the Evaluation stage; advisory rules are reported only.</p>
        </div>
        <div className="ams-page-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml"
            className="ams-visually-hidden"
            onChange={handleFile}
            aria-label="Upload rule pack"
          />
          <button type="button" className="st-btn st-btn-outline" onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Upload rule pack
          </button>
        </div>
      </header>

      {errors.length > 0 && (
        <ul className="ams-form-error" role="alert">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <div className="ams-table-wrap">
        <table className="ams-table">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Measure</th>
              <th scope="col">Minimum</th>
              <th scope="col">Type</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {state.evaluationRules.map((rule) => (
              <tr key={rule.id}>
                <td><span className="is-strong">{rule.id}</span> {rule.name}</td>
                <td>{getMeasureLabel(rule.measure)}</td>
                <td className="is-strong">{rule.threshold}</td>
                <td>
                  <span className={`st-badge ${rule.blocking ? 'badge-critical' : 'badge-high'}`}>
                    {rule.blocking ? 'Blocking' : 'Advisory'}
                  </span>
                </td>
                <td className="is-small">{rule.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="ams-details-disclosure">
        <summary>Rule-pack format</summary>
        <p className="ams-muted-note">
          JSON (an array of rules, or {'{ "rules": [...] }'}) or YAML as below. Measures: incidentAccuracy, rcaQuality,
          knowledgeQuality, groundedness, hallucination, security, cost, latency. A rule with an existing id replaces it.
        </p>
        <pre className="ams-code">{SAMPLE_PACK}</pre>
      </details>
    </section>
  );
}
