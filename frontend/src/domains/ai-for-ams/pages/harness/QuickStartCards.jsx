import React from 'react';
import { CirclePlay, LayoutTemplate, PencilRuler } from 'lucide-react';

/**
 * The three Harness entry points (F3 Quick Start).
 *
 * @param {Object} props
 * @param {() => void} props.onRunSingle         Focus the single-agent run form.
 * @param {() => void} props.onUseTemplate       Open the ready-made workflows.
 * @param {() => void} props.onBuildFromScratch  Open a new, empty workflow.
 * @returns {JSX.Element}
 */
export default function QuickStartCards({ onRunSingle, onUseTemplate, onBuildFromScratch }) {
  const cards = [
    { icon: CirclePlay, title: 'Run single agent', text: 'Pick an onboarded agent, give it a real ticket and watch the 10-step pipeline.', onClick: onRunSingle },
    { icon: LayoutTemplate, title: 'Use a template', text: 'Start from a ready-made AMS flow such as triage → RCA → runbook.', onClick: onUseTemplate },
    { icon: PencilRuler, title: 'Build from scratch', text: 'Open the workflow playground and chain agents yourself.', onClick: onBuildFromScratch }
  ];

  return (
    <div className="ams-journey" role="group" aria-label="Quick start">
      {cards.map(({ icon: Icon, title, text, onClick }) => (
        <button key={title} type="button" className="ams-journey-step" onClick={onClick}>
          <span className="ams-journey-step-head"><Icon size={16} aria-hidden="true" /><span>{title}</span></span>
          <span className="ams-journey-step-text">{text}</span>
        </button>
      ))}
    </div>
  );
}
