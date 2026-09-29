import React from 'react';
import { CircleCheck, Circle } from 'lucide-react';
import { sectionDomId, scrollToSection } from './onboardingHelpers';

/** Numbered card used by each registration section. */
export function FormSection({ id, index, icon: Icon, title, subtitle, aside, children }) {
  return (
    <section className="ad-studio-card ad-onb-section" id={sectionDomId(id)}>
      <header className="ad-onb-section-head">
        <span className="ad-onb-section-num">{String(index).padStart(2, '0')}</span>
        <div className="ad-onb-section-titles">
          <h3>{Icon && <Icon size={14} />}{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {aside && <div className="ad-onb-section-aside">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

/** Sticky anchor nav with completion ticks for each registration section. */
export function SectionNav({ items }) {
  const done = items.filter((i) => i.complete).length;
  return (
    <nav className="ad-onb-secnav" aria-label="Registration sections">
      <span className="ad-onb-secnav-count">{done}/{items.length} complete</span>
      {items.map((i) => (
        <button key={i.key} type="button" className={`ad-onb-secnav-item ${i.complete ? 'is-complete' : ''}`} onClick={() => scrollToSection(i.key)}>
          {i.complete ? <CircleCheck size={11} /> : <Circle size={11} />}
          {i.label}
        </button>
      ))}
    </nav>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return <span className="ad-onb-field-error" role="alert">{message}</span>;
}
