import React from 'react';
import { FileSearch, Network } from 'lucide-react';
import Modal from '../../../components/Modal';

const TYPE_LABEL = { log: 'Log', metric: 'Metric', change: 'Change record', 'known-error': 'Known error' };

/**
 * Opens one piece of RCA evidence at its source (F5): system, record id, what
 * it says and how much data sits behind it.
 *
 * @param {Object} props
 * @param {import('../../../model/incidents').KnowledgeRecord} props.record
 * @param {() => void} props.onClose
 * @param {() => void} props.onOpenInKnowledgeFabric
 * @returns {JSX.Element}
 */
export default function EvidenceModal({ record, onClose, onOpenInKnowledgeFabric }) {
  return (
    <Modal
      title={`${record.system} · ${record.recordId}`}
      icon={FileSearch}
      onClose={onClose}
      maxWidth={560}
      footer={(
        <button type="button" className="st-btn st-btn-outline" onClick={onOpenInKnowledgeFabric}>
          <Network size={14} /> Show in Knowledge Fabric
        </button>
      )}
    >
      <dl className="ams-details ams-details-grid">
        <div><dt>Type</dt><dd>{TYPE_LABEL[record.evidenceType] ?? 'Record'}</dd></div>
        <div><dt>Source system</dt><dd>{record.system}</dd></div>
        <div className="is-full"><dt>Record</dt><dd>{record.recordId} — {record.label}</dd></div>
        <div className="is-full"><dt>Volume</dt><dd>{record.count}</dd></div>
      </dl>
      <p className="ams-section-title">What it shows</p>
      <pre className="ams-code">{record.excerpt}</pre>
      <p className="ams-muted-note">Source excerpts are sample data in the PoC.</p>
    </Modal>
  );
}
