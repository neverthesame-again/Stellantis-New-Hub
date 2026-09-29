import React from 'react';
import { Boxes, Hourglass, Scale, Rocket, PlugZap, Recycle } from 'lucide-react';
import { SKILL_LIBRARY } from '../../agentStudioData';

/** KPI strip for the Onboarding Studio header area. */
export default function StudioKpis({ agents }) {
  const total = agents.length;
  const inOnboarding = agents.filter((a) => a.stage < 6).length;
  const awaiting = agents.filter((a) => a.governance?.status === 'pending').length;
  const published = agents.filter((a) => a.stage >= 9).length;
  const suspended = agents.filter((a) => a.operationalState === 'Suspended').length;
  const connected = agents.filter((a) => a.runtime?.status === 'connected').length;
  const verifiedPct = total ? Math.round((connected / total) * 100) : 0;
  const studioOnly = agents.filter((a) => !a.catalogueId).length;
  const reuse = SKILL_LIBRARY.reduce((sum, s) => sum + s.reuse, 0);

  const tiles = [
    { key: 'total', icon: Boxes, label: 'Agents in studio', value: total, note: `${total - studioOnly} catalogued · ${studioOnly} studio-only` },
    { key: 'onb', icon: Hourglass, label: 'In onboarding', value: inOnboarding, note: 'Stages 1–5 · Onboarding Studio' },
    { key: 'gov', icon: Scale, label: 'Awaiting governance', value: awaiting, note: 'Pending approver decision', tone: awaiting ? 'is-warn' : '' },
    { key: 'pub', icon: Rocket, label: 'Published', value: published, note: `${suspended} suspended by governance` },
    { key: 'rt', icon: PlugZap, label: 'Runtime verified', value: verifiedPct, unit: '%', note: `${connected}/${total} endpoints healthy`, bar: verifiedPct },
    { key: 'reuse', icon: Recycle, label: 'Certified skill reuse', value: reuse, unit: '×', note: `${SKILL_LIBRARY.length} certified skills in library` }
  ];

  return (
    <div className="ad-studio-kpi-grid ad-onb-kpis">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.key} className={`ad-studio-kpi ad-onb-kpi ${t.tone || ''}`}>
            <span className="ad-studio-kpi-label"><Icon size={12} />{t.label}</span>
            <span className="ad-studio-kpi-value">{t.value}{t.unit && <small>{t.unit}</small>}</span>
            {t.bar != null && (
              <div className={`ad-studio-progress ${t.bar >= 80 ? 'is-good' : 'is-warn'}`}><span style={{ width: `${t.bar}%` }} /></div>
            )}
            <span className="ad-studio-kpi-note">{t.note}</span>
          </div>
        );
      })}
    </div>
  );
}
