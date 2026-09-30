import React from 'react';

/**
 * @typedef {Object} PillOption
 * @property {string} id
 * @property {string} label
 * @property {number} [count] Optional count shown inside the pill.
 */

/**
 * Single-select row of filter pills.
 *
 * @param {Object} props
 * @param {PillOption[]} props.options
 * @param {string} props.value                Selected option id.
 * @param {(optionId: string) => void} props.onChange
 * @param {string} props.ariaLabel            Describes the filter for screen readers.
 * @param {string} [props.label]              Optional visible caption before the pills.
 * @returns {JSX.Element}
 */
export default function FilterPills({ options, value, onChange, ariaLabel, label }) {
  return (
    <div className="ams-pill-group" role="group" aria-label={ariaLabel}>
      {label && <span className="ams-pill-group-label">{label}</span>}
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={`ams-pill ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(option.id)}
          >
            <span>{option.label}</span>
            {option.count !== undefined && <span className="ams-count">{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
