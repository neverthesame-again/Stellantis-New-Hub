import React, { useState } from 'react';
import { Bot, CircleStop, GitFork, GitMerge, Play, ShieldCheck, UserCheck } from 'lucide-react';
import { AMS_AGENT_AREAS } from '../../../../model/agentOptions';
import { HARNESS_MIN_STAGE } from '../../../../model/agentLifecycle';
import { WORKFLOW_NODE_DEFINITIONS, WORKFLOW_NODE_TYPE } from '../../../../model/workflowModel';
import { PALETTE_DRAG_TYPE } from './playgroundContext';

const CONTROL_ITEMS = [
  { type: WORKFLOW_NODE_TYPE.START, icon: Play },
  { type: WORKFLOW_NODE_TYPE.END, icon: CircleStop },
  { type: WORKFLOW_NODE_TYPE.APPROVAL, icon: UserCheck },
  { type: WORKFLOW_NODE_TYPE.POLICY, icon: ShieldCheck },
  { type: WORKFLOW_NODE_TYPE.FORK, icon: GitFork },
  { type: WORKFLOW_NODE_TYPE.JOIN, icon: GitMerge }
];

/**
 * One draggable palette entry. Dragging drops it where released; clicking (or
 * Enter/Space) adds it to the middle of the canvas, so the palette also works
 * without a mouse.
 *
 * @param {Object} props
 * @param {{ type: string, data?: Object }} props.item
 * @param {import('react').ComponentType<{ size?: number }>} props.icon
 * @param {string} props.label
 * @param {string} [props.hint]
 * @param {string} [props.disabledReason] When set, the item cannot be used.
 * @param {(item: { type: string, data?: Object }) => void} props.onAdd
 * @returns {JSX.Element}
 */
function PaletteItem({ item, icon: Icon, label, hint, disabledReason, onAdd }) {
  const disabled = Boolean(disabledReason);
  return (
    <li>
      <button
        type="button"
        className="ams-palette-item"
        draggable={!disabled}
        disabled={disabled}
        title={disabledReason ?? `Drag onto the canvas, or click to add`}
        onDragStart={(event) => {
          event.dataTransfer.setData(PALETTE_DRAG_TYPE, JSON.stringify(item));
          event.dataTransfer.effectAllowed = 'move';
        }}
        onClick={() => onAdd(item)}
      >
        <Icon size={14} aria-hidden="true" />
        <span className="ams-palette-item-text">
          <span>{label}</span>
          {(hint || disabledReason) && <span className="ams-muted-note">{disabledReason ?? hint}</span>}
        </span>
      </button>
    </li>
  );
}

/**
 * Left-hand palette: onboarded agents grouped by AMS area, and control nodes.
 * Agents still in registration are listed but cannot be used yet.
 *
 * @param {Object} props
 * @param {Object[]} props.agents Studio agents.
 * @param {(item: { type: string, data?: Object }) => void} props.onAdd
 * @returns {JSX.Element}
 */
export default function NodePalette({ agents, onAdd }) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = agents.filter((agent) => !needle || agent.name.toLowerCase().includes(needle));

  return (
    <aside className="ams-palette" aria-label="Node palette">
      <p className="ams-section-title">Agents</p>
      <input
        type="search"
        className="ams-input"
        placeholder="Filter agents"
        aria-label="Filter agents"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {AMS_AGENT_AREAS.map((area) => {
        const areaAgents = visible.filter((agent) => agent.area === area.id);
        if (areaAgents.length === 0) return null;
        return (
          <div key={area.id} className="ams-palette-group">
            <p className="ams-palette-group-title">{area.label}</p>
            <ul>
              {areaAgents.map((agent) => (
                <PaletteItem
                  key={agent.id}
                  item={{ type: WORKFLOW_NODE_TYPE.AGENT, data: { agentId: agent.id } }}
                  icon={Bot}
                  label={agent.name}
                  hint={`${agent.serviceTier || 'Untiered'} · stage ${agent.stage}`}
                  disabledReason={agent.stage < HARNESS_MIN_STAGE ? 'Still in registration' : undefined}
                  onAdd={onAdd}
                />
              ))}
            </ul>
          </div>
        );
      })}

      <p className="ams-section-title">Controls</p>
      <ul>
        {CONTROL_ITEMS.map(({ type, icon }) => (
          <PaletteItem
            key={type}
            item={{ type }}
            icon={icon}
            label={WORKFLOW_NODE_DEFINITIONS[type].label}
            onAdd={onAdd}
          />
        ))}
      </ul>
    </aside>
  );
}
