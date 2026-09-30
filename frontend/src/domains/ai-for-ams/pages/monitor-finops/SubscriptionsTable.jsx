import React, { useMemo, useState } from 'react';
import { useAmsStudio } from '../../state/useAmsStudio';
import EmptyState from '../../components/EmptyState';
import FilterPills from '../../components/FilterPills';
import SearchField from '../../components/SearchField';

/** Entitlement types, in filter order. */
const SUBSCRIPTION_TYPES = ['Model', 'Agent', 'Tool', 'Project', 'Notification', 'Governance policy', 'Report'];

const ALL_TYPES = 'All';

/**
 * Whether a subscription matches the free-text search.
 *
 * @param {Object} subscription
 * @param {string} query
 * @returns {boolean}
 */
function matchesQuery(subscription, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [subscription.entityName, subscription.type].some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * The signed-in user's active entitlements across models, agents, tools,
 * projects, notifications, governance policies and reports. Model
 * subscriptions change live as the user subscribes in Models & Tools.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast Page-level confirmation toast.
 * @returns {JSX.Element}
 */
export default function SubscriptionsTable({ showToast }) {
  const { state } = useAmsStudio();
  const [query, setQuery] = useState('');
  const [type, setType] = useState(ALL_TYPES);

  const typeOptions = useMemo(() => [
    { id: ALL_TYPES, label: 'All subscriptions', count: state.subscriptions.length },
    ...SUBSCRIPTION_TYPES.map((name) => ({
      id: name,
      label: name,
      count: state.subscriptions.filter((subscription) => subscription.type === name).length
    }))
  ], [state.subscriptions]);

  const visibleSubscriptions = state.subscriptions.filter((subscription) => (
    matchesQuery(subscription, query) && (type === ALL_TYPES || subscription.type === type)
  ));

  return (
    <section className="st-card ams-card" aria-labelledby="ams-subscriptions-title">
      <div className="ams-page-header">
        <div>
          <h3 id="ams-subscriptions-title" className="ams-card-title">Active enterprise subscriptions</h3>
          <p className="ams-card-subtitle">
            Consolidated entitlements across models, agents, tools, projects, notifications and governance.
          </p>
        </div>
        <span className="st-badge badge-success">{state.subscriptions.length} active entitlements</span>
      </div>

      <div className="ams-toolbar">
        <FilterPills options={typeOptions} value={type} onChange={setType} ariaLabel="Subscription type" />
        <SearchField value={query} onChange={setQuery} placeholder="Search subscriptions" />
      </div>

      {visibleSubscriptions.length === 0 ? (
        <EmptyState message="No subscriptions match your search and filter." />
      ) : (
        <div className="ams-table-wrap">
          <table className="ams-table">
            <thead>
              <tr>
                <th scope="col">Item / capability</th>
                <th scope="col">Type</th>
                <th scope="col">Granted level</th>
                <th scope="col">Usage / throughput</th>
                <th scope="col">Cost allocation</th>
                <th scope="col">Granted by</th>
                <th scope="col">Status</th>
                <th scope="col" className="is-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="is-strong">{subscription.entityName}</td>
                  <td><span className="st-badge badge-info">{subscription.type}</span></td>
                  <td><span className="ams-tag">{subscription.level}</span></td>
                  <td>{subscription.monthlyUsage}</td>
                  <td className="is-strong">{subscription.costAllocation}</td>
                  <td className="is-small">{subscription.grantedBy}</td>
                  <td><span className="st-badge badge-success">{subscription.status}</span></td>
                  <td className="is-right">
                    <button
                      type="button"
                      className="st-btn st-btn-outline"
                      onClick={() => showToast(`Quota change for "${subscription.entityName}" requested from the Chief AI Officer.`)}
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
