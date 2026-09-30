import React, { useState } from 'react';
import { BookmarkCheck, Cpu, Wallet } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import PageHeader from '../../components/PageHeader';
import TabBar from '../../components/TabBar';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import AmsFinOps from './cost/AmsFinOps';
import RuntimeMonitor from './runtime/RuntimeMonitor';
import SubscriptionsTable from './SubscriptionsTable';

/** Views of the Monitor & FinOps page. */
const MONITOR_TAB = Object.freeze({
  RUNTIME: 'runtime',
  COST: 'cost',
  SUBSCRIPTIONS: 'subscriptions'
});

/**
 * Monitor & FinOps — what is running and what it costs: runtime health (F12),
 * AI spend (F10) and the user's active subscriptions.
 *
 * Route params: `{ tab?: 'runtime' | 'cost' | 'subscriptions', agentId?: string }` —
 * `agentId` highlights that agent's cost.
 *
 * @returns {JSX.Element}
 */
export default function MonitorFinOpsPage() {
  const route = getAmsRoute(AMS_SUBPAGE.MONITOR_FINOPS);
  const { state } = useAmsStudio();
  const [activeTab, setActiveTab] = useState(MONITOR_TAB.RUNTIME);
  const [costAgentId, setCostAgentId] = useState(null);
  const { message, showToast } = useToast();

  useAmsRouteRequest(AMS_SUBPAGE.MONITOR_FINOPS, (params) => {
    if (Object.values(MONITOR_TAB).includes(params.tab)) setActiveTab(params.tab);
    setCostAgentId(params.agentId ?? null);
  });

  const tabs = [
    { id: MONITOR_TAB.RUNTIME, label: 'Runtime', icon: Cpu },
    { id: MONITOR_TAB.COST, label: 'Cost', icon: Wallet },
    { id: MONITOR_TAB.SUBSCRIPTIONS, label: 'Subscriptions', icon: BookmarkCheck, count: state.subscriptions.length }
  ];

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Monitor and FinOps views" idPrefix="ams-monitor-tab" />
      <div role="tabpanel" id="ams-monitor-tab-panel" aria-labelledby={`ams-monitor-tab-${activeTab}`}>
        {activeTab === MONITOR_TAB.RUNTIME && <RuntimeMonitor showToast={showToast} />}
        {activeTab === MONITOR_TAB.COST && <AmsFinOps highlightAgentId={costAgentId} showToast={showToast} />}
        {activeTab === MONITOR_TAB.SUBSCRIPTIONS && <SubscriptionsTable showToast={showToast} />}
      </div>
      <Toast message={message} />
    </div>
  );
}
