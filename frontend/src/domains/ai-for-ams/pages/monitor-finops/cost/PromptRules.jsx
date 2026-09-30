import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { PROMPT_RULE_MODES, PROMPT_RULE_SCOPES } from '../../../model/finopsModel';

const MODE_HINT = {
  monitor: 'Watch and report only',
  recommend: 'Suggest a cheaper prompt',
  enforce: 'Block non-compliant prompts'
};

/**
 * Prompt rules (F10): scope (all agents or AMS only), mode (monitor,
 * recommend, enforce) and parameters. Scope and mode change in place; new
 * rules are added with the form below the table.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function PromptRules({ showToast }) {
  const { state, actions } = useAmsStudio();
  const [draft, setDraft] = useState({ name: '', scope: PROMPT_RULE_SCOPES[1], mode: PROMPT_RULE_MODES[0], parameters: '' });

  const update = (rule, patch) => {
    actions.savePromptRule({ ...rule, ...patch });
    showToast(`"${rule.name}" updated.`);
  };

  const add = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      showToast('Give the rule a name.');
      return;
    }
    actions.savePromptRule(draft);
    showToast(`Rule "${draft.name.trim()}" added.`);
    setDraft({ ...draft, name: '', parameters: '' });
  };

  return (
    <section className="st-card ams-card" aria-labelledby="ams-prompt-rules-title">
      <div>
        <h3 id="ams-prompt-rules-title" className="ams-card-title">Prompt rules</h3>
        <p className="ams-card-subtitle">Keep prompts lean. Monitor watches, recommend suggests a cheaper prompt, enforce blocks prompts that break the rule.</p>
      </div>
      <div className="ams-table-wrap">
        <table className="ams-table">
          <thead>
            <tr><th scope="col">Rule</th><th scope="col">Scope</th><th scope="col">Mode</th><th scope="col">Parameters</th></tr>
          </thead>
          <tbody>
            {state.promptRules.map((rule) => (
              <tr key={rule.id}>
                <td><span className="is-strong">{rule.name}</span> <span className="is-small">{rule.id}</span></td>
                <td>
                  <select className="ams-input" value={rule.scope} onChange={(event) => update(rule, { scope: event.target.value })} aria-label={`Scope of ${rule.name}`}>
                    {PROMPT_RULE_SCOPES.map((scope) => <option key={scope}>{scope}</option>)}
                  </select>
                </td>
                <td>
                  <select className="ams-input" value={rule.mode} onChange={(event) => update(rule, { mode: event.target.value })} aria-label={`Mode of ${rule.name}`} title={MODE_HINT[rule.mode]}>
                    {PROMPT_RULE_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                  </select>
                </td>
                <td>{rule.parameters || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="ams-rule-form" onSubmit={add}>
        <input className="ams-input" placeholder="New rule name" aria-label="New rule name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <select className="ams-input" value={draft.scope} onChange={(event) => setDraft({ ...draft, scope: event.target.value })} aria-label="New rule scope">
          {PROMPT_RULE_SCOPES.map((scope) => <option key={scope}>{scope}</option>)}
        </select>
        <select className="ams-input" value={draft.mode} onChange={(event) => setDraft({ ...draft, mode: event.target.value })} aria-label="New rule mode">
          {PROMPT_RULE_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
        </select>
        <input className="ams-input" placeholder="Parameters, e.g. max 8k tokens" aria-label="New rule parameters" value={draft.parameters} onChange={(event) => setDraft({ ...draft, parameters: event.target.value })} />
        <button type="submit" className="st-btn st-btn-outline"><Plus size={14} /> Add rule</button>
      </form>
    </section>
  );
}
