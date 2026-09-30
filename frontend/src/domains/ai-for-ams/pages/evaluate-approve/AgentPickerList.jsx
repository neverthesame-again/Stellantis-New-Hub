import React from 'react';
import EmptyState from '../../components/EmptyState';

/**
 * @typedef {Object} PickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle]
 * @property {Array<{ className: string, label: string }>} [badges]
 */

/**
 * Selectable list of agents used by the Evaluate and Approve tabs.
 *
 * @param {Object} props
 * @param {PickerItem[]} props.items
 * @param {string | null} props.selectedId
 * @param {(id: string) => void} props.onSelect
 * @param {string} props.ariaLabel
 * @param {string} [props.emptyMessage]
 * @param {import('react').ReactNode} [props.header] Content above the list (filters…).
 * @returns {JSX.Element}
 */
export default function AgentPickerList({ items, selectedId, onSelect, ariaLabel, emptyMessage = 'No agents to show.', header }) {
  return (
    <section className="st-card ams-card ams-agent-list" aria-label={ariaLabel}>
      {header}
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ul className="ams-agent-items">
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`ams-agent-item ${selected ? 'is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="ams-agent-item-name">{item.title}</span>
                  {item.subtitle && <span className="ams-agent-item-meta">{item.subtitle}</span>}
                  {item.badges?.length > 0 && (
                    <span className="ams-badge-row">
                      {item.badges.map((badge) => (
                        <span key={badge.label} className={`st-badge ${badge.className}`}>{badge.label}</span>
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
