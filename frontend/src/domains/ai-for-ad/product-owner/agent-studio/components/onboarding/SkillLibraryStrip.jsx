import React, { useMemo, useState } from 'react';
import { Library, BadgeCheck, Recycle, Plus, Check } from 'lucide-react';
import { SKILL_LIBRARY } from '../../agentStudioData';

const SKILL_CATEGORIES = ['All', ...Array.from(new Set(SKILL_LIBRARY.map((s) => s.category)))];

/**
 * Enterprise Skill Library — certified skills harvested from published agents.
 * When an editable agent is open, each card can attach/detach the skill.
 */
export default function SkillLibraryStrip({ agents, attached = [], canAttach, targetName, onToggle }) {
  const [category, setCategory] = useState('All');

  const usage = useMemo(() => {
    const map = {};
    agents.forEach((a) => a.skills.forEach((id) => { map[id] = (map[id] || 0) + 1; }));
    return map;
  }, [agents]);

  const skills = SKILL_LIBRARY.filter((s) => category === 'All' || s.category === category);

  return (
    <section className="ad-studio-card ad-onb-library">
      <div className="ad-studio-card-title">
        <h3><Library size={13} /> Enterprise Skill Library</h3>
        <span className="ad-studio-muted">
          {canAttach ? <>Click a skill to attach it to <strong>{targetName}</strong></> : 'Certified skills reusable across AD agents'}
        </span>
      </div>
      <div className="ad-onb-chip-row">
        {SKILL_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`ad-studio-chip ad-onb-chip-sm ${category === c ? 'is-selected' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
            <span className="ad-onb-chip-count">{c === 'All' ? SKILL_LIBRARY.length : SKILL_LIBRARY.filter((s) => s.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="ad-onb-library-track">
        {skills.map((s) => {
          const isAttached = attached.includes(s.id);
          return (
            <div key={s.id} className={`ad-onb-skill-card ${isAttached ? 'is-attached' : ''}`}>
              <div className="ad-onb-skill-card-top">
                <span className="ad-studio-badge is-purple ad-onb-badge-xs">{s.category}</span>
                <span className="ad-onb-cert" title="Certified by AI Safety Board"><BadgeCheck size={13} /></span>
              </div>
              <div className="ad-onb-skill-name">{s.name}</div>
              <div className="ad-onb-skill-src">from {s.sourceAgent}</div>
              <div className="ad-onb-skill-foot">
                <span className="ad-studio-badge is-mono"><Recycle size={10} /> reuse ×{s.reuse}</span>
                <span className="ad-studio-muted">{usage[s.id] || 0} in studio</span>
              </div>
              {canAttach && (
                <button
                  type="button"
                  className={`ad-studio-btn is-sm ${isAttached ? 'is-good' : 'is-accent'} ad-onb-skill-attach`}
                  onClick={() => onToggle(s.id)}
                >
                  {isAttached ? <><Check size={11} /> Attached</> : <><Plus size={11} /> Attach</>}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
