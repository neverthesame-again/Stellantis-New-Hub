import React from 'react';
import { Check } from 'lucide-react';

/**
 * @typedef {Object} ChipOption
 * @property {string} id
 * @property {string} label
 * @property {string} [hint] Secondary text, e.g. a skill's source agent.
 */

/**
 * Multi-select rendered as toggle chips.
 *
 * @param {Object} props
 * @param {Array<ChipOption | string>} props.options Plain strings use the string as id and label.
 * @param {string[]} props.value                  Selected ids.
 * @param {(value: string[]) => void} props.onChange
 * @param {string} props.ariaLabel
 * @returns {JSX.Element}
 */
export default function ToggleChips({ options, value, onChange, ariaLabel }) {
  const normalised = options.map((option) => (typeof option === 'string' ? { id: option, label: option } : option));

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  };

  return (
    <div className="ams-toggle-chips" role="group" aria-label={ariaLabel}>
      {normalised.map(({ id, label, hint }) => {
        const selected = value.includes(id);
        return (
          <button
            key={id}
            type="button"
            className={`ams-toggle-chip ${selected ? 'is-selected' : ''}`}
            aria-pressed={selected}
            onClick={() => toggle(id)}
          >
            {selected && <Check size={12} strokeWidth={3} aria-hidden="true" />}
            <span>{label}</span>
            {hint && <span className="ams-toggle-chip-hint">{hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
