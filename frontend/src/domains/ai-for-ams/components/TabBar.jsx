import React from 'react';

/**
 * @typedef {Object} TabDefinition
 * @property {string} id
 * @property {string} label
 * @property {import('react').ComponentType<{ size?: number }>} [icon]
 * @property {number} [count] Optional count badge.
 */

/**
 * Accessible tab strip used to switch between views of one AMS page.
 *
 * @param {Object} props
 * @param {TabDefinition[]} props.tabs
 * @param {string} props.activeTab             Id of the selected tab.
 * @param {(tabId: string) => void} props.onChange
 * @param {string} props.ariaLabel             Describes the tab set for screen readers.
 * @param {string} [props.idPrefix]            Prefix for tab/panel ids; defaults to "ams-tab".
 * @returns {JSX.Element}
 */
export default function TabBar({ tabs, activeTab, onChange, ariaLabel, idPrefix = 'ams-tab' }) {
  /** Arrow keys move between tabs, following the WAI-ARIA tabs pattern. */
  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    onChange(next.id);
    document.getElementById(`${idPrefix}-${next.id}`)?.focus();
  };

  return (
    <div className="ams-tabbar" role="tablist" aria-label={ariaLabel} onKeyDown={handleKeyDown}>
      {tabs.map(({ id, label, icon: Icon, count }) => {
        const selected = id === activeTab;
        return (
          <button
            key={id}
            id={`${idPrefix}-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            className={`ams-tab ${selected ? 'is-active' : ''}`}
            onClick={() => onChange(id)}
          >
            {Icon && <Icon size={15} />}
            <span>{label}</span>
            {count !== undefined && <span className="ams-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
