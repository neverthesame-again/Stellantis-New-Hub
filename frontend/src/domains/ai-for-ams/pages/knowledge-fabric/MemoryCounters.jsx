import React from 'react';
import { Archive, Boxes, BrainCircuit, FolderKanban, Scale } from 'lucide-react';

const ICON = { enterprise: Archive, operational: BrainCircuit, decision: Scale, project: FolderKanban, artifacts: Boxes };

/**
 * Memory counters (F8): enterprise, operational, decision and project memory,
 * and reusable artifacts.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string, value: number, hint: string }>} props.counters
 * @returns {JSX.Element}
 */
export default function MemoryCounters({ counters }) {
  return (
    <div className="ams-kpi-row" role="list" aria-label="Memory counters">
      {counters.map(({ id, label, value, hint }) => {
        const Icon = ICON[id] ?? Archive;
        return (
          <div key={id} className="st-card ams-kpi" role="listitem">
            <span className="ams-kpi-label"><Icon size={13} aria-hidden="true" /> {label}</span>
            <span className="ams-kpi-value">{value.toLocaleString('en-GB')}</span>
            <span className="ams-muted-note">{hint}</span>
          </div>
        );
      })}
    </div>
  );
}
