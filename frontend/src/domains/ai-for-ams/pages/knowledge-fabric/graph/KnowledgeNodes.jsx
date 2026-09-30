/**
 * @file Custom React Flow nodes for the knowledge fabric graph.
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertOctagon, BookOpen, Bot, CircleCheck, FileClock, History, Server, Siren, Wrench } from 'lucide-react';

/** Icon per knowledge lane. */
const LANE_ICON = {
  incident: Siren,
  service: Server,
  change: Wrench,
  telemetry: FileClock,
  'known-error': AlertOctagon,
  similar: History,
  runbook: BookOpen,
  agent: Bot
};

/**
 * One knowledge record (incident, CMDB item, change, log source, known error,
 * past incident, runbook or agent).
 *
 * @param {import('@xyflow/react').NodeProps} props `data`: `{ record, dimmed, covered }`.
 * @returns {JSX.Element}
 */
export function KnowledgeRecordNode({ data, selected }) {
  const { record, dimmed, covered } = data;
  const Icon = LANE_ICON[record.lane] ?? Server;
  const classes = ['ams-kg-node', `lane-${record.lane}`, selected ? 'is-selected' : '', dimmed ? 'is-dimmed' : '', covered ? 'is-covered' : '']
    .filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {record.lane !== 'incident' && <Handle type="target" position={Position.Left} isConnectable={false} />}
      <div className="ams-kg-node-head">
        <Icon size={13} aria-hidden="true" />
        <span className="ams-kg-node-system">{record.system}</span>
        {covered && <CircleCheck size={13} className="ams-kg-node-check" aria-label="Bound to the selected agent" />}
      </div>
      <div className="ams-kg-node-title">{record.label}</div>
      <div className="ams-kg-node-meta">{record.recordId} · {record.count}</div>
      {record.lane !== 'agent' && <Handle type="source" position={Position.Right} isConnectable={false} />}
    </div>
  );
}

/**
 * Column heading that names a lane of the flow.
 *
 * @param {import('@xyflow/react').NodeProps} props `data`: `{ label, system, step }`.
 * @returns {JSX.Element}
 */
export function LaneHeaderNode({ data }) {
  return (
    <div className="ams-kg-lane">
      <span className="ams-kg-lane-step">{data.step}</span>
      <span>
        <span className="ams-kg-lane-label">{data.label}</span>
        <span className="ams-kg-lane-system">{data.system}</span>
      </span>
    </div>
  );
}
