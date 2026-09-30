import React, { useState } from 'react';
import { Bot, CircleStop, GitFork, GitMerge, Play, ShieldCheck, UserCheck } from 'lucide-react';
import { AD_SUBDOMAINS } from '../agentStudioData';
import { WORKFLOW_NODE_DEFINITIONS, agentBlockedReason, isAgentRunnable } from './adWorkflowModel';
import { PALETTE_DRAG_TYPE } from './playgroundContext';

const CONTROL_ITEMS = [
  { type: 'start', icon: Play },
  { type: 'end', icon: CircleStop },
  { type: 'approval', icon: UserCheck },
  { type: 'policy', icon: ShieldCheck },
  { type: 'fork', icon: GitFork },
  { type: 'join', icon: GitMerge }
];

function PaletteItem({ item, icon: Icon, label, hint, disabledReason, onAdd }) {
  const disabled = Boolean(disabledReason);
  return (
    <li>
      <button
        type="button"
        className="ad-wf-palette-item"
        draggable={!disabled}
        disabled={disabled}
        title={disabledReason ?? 'Drag onto the canvas, or click to add'}
        onDragStart={(event) => {
          event.dataTransfer.setData(PALETTE_DRAG_TYPE, JSON.stringify(item));
          event.dataTransfer.effectAllowed = 'move';
        }}
        onClick={() => onAdd(item)}
      >
        <Icon size={14} aria-hidden="true" />
        <span className="ad-wf-palette-text">
          <span>{label}</span>
          {(hint || disabledReason) && <span className="ad-wf-muted">{disabledReason ?? hint}</span>}
        </span>
      </button>
    </li>
  );
}

export default function NodePalette({ agents, onAdd }) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = agents.filter((a) => !needle || a.name.toLowerCase().includes(needle));

  return (
    <aside className="ad-wf-side" aria-label="Node palette">
      <p className="ad-wf-section-title">Agents</p>
      <input
        type="search"
        className="ad-wf-input"
        placeholder="Filter agents"
        aria-label="Filter agents"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {AD_SUBDOMAINS.map((sub) => {
        const group = visible.filter((a) => a.subDomain === sub);
        if (group.length === 0) return null;
        return (
          <div key={sub}>
            <p className="ad-wf-palette-group">{sub}</p>
            <ul className="ad-wf-palette-list">
              {group.map((agent) => (
                <PaletteItem
                  key={agent.id}
                  item={{ type: 'agent', data: { agentId: agent.id } }}
                  icon={Bot}
                  label={agent.name}
                  hint={`ASIL ${agent.asil} · stage ${agent.stage}/9`}
                  disabledReason={isAgentRunnable(agent) ? undefined : agentBlockedReason(agent)}
                  onAdd={onAdd}
                />
              ))}
            </ul>
          </div>
        );
      })}

      <p className="ad-wf-section-title">Controls</p>
      <ul className="ad-wf-palette-list">
        {CONTROL_ITEMS.map(({ type, icon }) => (
          <PaletteItem key={type} item={{ type }} icon={icon} label={WORKFLOW_NODE_DEFINITIONS[type].label} onAdd={onAdd} />
        ))}
      </ul>
    </aside>
  );
}
