import React from 'react';
import { FileCode2, Link2, Package, Lock } from 'lucide-react';
import { buildArtefacts } from './harnessUtils';

/** Output artefacts (deterministic mock) for a completed or held run. */
export default function RunArtefacts({ run, agent, bare = false }) {
  if (!run || !['completed', 'awaiting_approval'].includes(run.status)) return null;
  const out = buildArtefacts(run, agent);
  const held = run.status === 'awaiting_approval';

  const body = (
    <>
      <div className="ad-hrn-artefact-headline">
        <Package size={16} />
        <span>{out.headline}</span>
        {held && <span className="ad-studio-badge is-warning"><Lock size={10} /> Held until approval</span>}
        {run.dryRun && <span className="ad-studio-badge is-info">Dry run — not written to tools</span>}
      </div>
      <div className="ad-hrn-artefact-metrics">
        {out.metrics.map((m) => (
          <div key={m.label} className="ad-hrn-artefact-metric">
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="ad-hrn-artefact-table" role="table">
        <div className="ad-hrn-artefact-row is-head" role="row">
          <span>Artefact</span><span>Type</span><span>Size</span><span>Trace</span>
        </div>
        {out.rows.map((r) => (
          <div key={r.name} className="ad-hrn-artefact-row" role="row">
            <span className="ad-hrn-artefact-name"><FileCode2 size={13} /> {r.name}</span>
            <span><span className="ad-studio-badge">{r.type}</span></span>
            <span className="ad-hrn-mono">{r.size}</span>
            <span className="ad-hrn-artefact-link"><Link2 size={12} /> {r.link}</span>
          </div>
        ))}
      </div>
    </>
  );

  if (bare) return <div className="ad-hrn-artefacts">{body}</div>;
  return (
    <div className="ad-studio-card ad-hrn-artefacts">
      <div className="ad-studio-card-title">
        <h3><Package size={14} /> Output artefacts</h3>
        <span className="ad-studio-badge is-mono">{run.id}</span>
      </div>
      {body}
    </div>
  );
}
