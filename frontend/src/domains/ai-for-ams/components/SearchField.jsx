import React from 'react';
import { Search } from 'lucide-react';

/**
 * Search input with a leading icon.
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} props.placeholder Also used as the accessible label.
 * @returns {JSX.Element}
 */
export default function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="ams-search">
      <Search size={14} className="ams-search-icon" aria-hidden="true" />
      <input
        type="search"
        className="ams-search-input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
