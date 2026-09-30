import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  FileText,
  ShieldAlert,
  Boxes,
  Code2,
  FlaskConical,
  Rocket,
  Bot,
  CircleCheck
} from 'lucide-react';
import { RECORD_STATUS } from '../model/adKnowledgeGraph';

const LANE_ICON = {
  requirement: FileText,
  safety: ShieldAlert,
  design: Boxes,
  code: Code2,
  verification: FlaskConical,
  release: Rocket,
  agent: Bot
};

export function AdKnowledgeRecordNode({ data, selected }) {
  const { record, dimmed, covered } = data;
  const Icon = LANE_ICON[record.lane] || FileText;
  const status = RECORD_STATUS[record.status];
  const classes = [
    'ad-kg-node',
    `lane-${record.lane}`,
    record.status === 'gap' ? 'is-gap' : '',
    selected ? 'is-selected' : '',
    dimmed ? 'is-dimmed' : '',
    covered ? 'is-covered' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} title={status ? `${record.label} — ${status.label}` : record.label}>
      {record.lane !== 'requirement' && (
        <Handle type="target" position={Position.Left} isConnectable={false} />
      )}
      <div className="ad-kg-node-head">
        <Icon size={13} aria-hidden="true" />
        <span className="ad-kg-node-system">{record.system}</span>
        {covered ? (
          <CircleCheck size={13} className="ad-kg-node-check" aria-label="Grounds the selected agent" />
        ) : status && (
          <span className={`ad-kg-status-dot tone-${status.tone}`} aria-label={status.label} />
        )}
      </div>
      <div className="ad-kg-node-title">{record.label}</div>
      <div className="ad-kg-node-meta">
        <span className="ad-kg-node-id">{record.recordId}</span>
        <span>{record.count}</span>
      </div>
      {record.lane !== 'agent' && (
        <Handle type="source" position={Position.Right} isConnectable={false} />
      )}
    </div>
  );
}

export function AdLaneHeaderNode({ data }) {
  return (
    <div className={`ad-kg-lane lane-${data.lane}`}>
      <span className="ad-kg-lane-step">{data.step}</span>
      <span style={{ minWidth: 0 }}>
        <span className="ad-kg-lane-label">{data.label}</span>
        <span className="ad-kg-lane-system">{data.process}</span>
      </span>
    </div>
  );
}
