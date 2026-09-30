import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import Modal from '../../components/Modal';

/** Attributes compared side by side, in display order. */
const COMPARED_ATTRIBUTES = [
  { key: 'provider', label: 'Provider' },
  { key: 'modality', label: 'Modality' },
  { key: 'deploymentType', label: 'Deployment' },
  { key: 'latency', label: 'Latency P95', className: 'is-strong' },
  { key: 'costTier', label: 'Cost Tier' },
  { key: 'benchmarkScore', label: 'Benchmark Score', className: 'ams-text-success' },
  { key: 'riskRating', label: 'Risk Rating' },
  { key: 'dataRestrictions', label: 'Data Restrictions', className: 'is-small' }
];

/**
 * Side-by-side comparison of two or three catalogue models.
 *
 * @param {Object} props
 * @param {Object[]} props.models Models to compare, in selection order.
 * @param {() => void} props.onClose
 * @returns {JSX.Element}
 */
export default function ModelCompareModal({ models, onClose }) {
  return (
    <Modal title="Side-by-Side Model Comparison" icon={ArrowLeftRight} onClose={onClose} maxWidth={850}>
      <div className="ams-table-wrap">
        <table className="ams-table">
          <thead>
            <tr>
              <th scope="col">Attribute</th>
              {models.map((model) => <th key={model.id} scope="col">{model.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {COMPARED_ATTRIBUTES.map(({ key, label, className }) => (
              <tr key={key}>
                <th scope="row" className="is-strong">{label}</th>
                {models.map((model) => (
                  <td key={model.id} className={className}>{model[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
