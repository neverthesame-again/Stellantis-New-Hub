import React from 'react';
import { Database, FileText, ShieldAlert, Boxes, FlaskConical, Car, Link2 } from 'lucide-react';

const COUNTER_ICONS = {
  requirements: FileText,
  safety: ShieldAlert,
  design: Boxes,
  verification: FlaskConical,
  fleet: Car,
  trace: Link2
};

export default function AdMemoryCounters({ counters }) {
  return (
    <div className="ad-kg-counters-grid">
      {counters.map((c) => {
        const Icon = COUNTER_ICONS[c.id] || Database;
        return (
          <div key={c.id} className={`ad-kg-counter-card counter-${c.id}`}>
            <div className="ad-kg-counter-head">
              <span className="ad-kg-counter-label">{c.label}</span>
              <Icon size={15} className="ad-kg-counter-icon" />
            </div>
            <div className="ad-kg-counter-value">
              {typeof c.value === 'number' ? c.value.toLocaleString('en-US') : c.value}
            </div>
            <div className="ad-kg-counter-hint" title={c.hint}>{c.hint}</div>
          </div>
        );
      })}
    </div>
  );
}
