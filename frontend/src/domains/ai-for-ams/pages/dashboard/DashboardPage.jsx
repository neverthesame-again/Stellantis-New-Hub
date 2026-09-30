import React, { useState } from 'react';
import { BarChart3, Radio } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB } from '../../navigation/amsRoutes';
import { getIncidentForCluster } from '../../model/incidents';
import { RESOLVED_STEP } from '../../model/incidentResponse';
import TabBar from '../../components/TabBar';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import AmsDashboard from '../AmsDashboard';
import WarRoom from './war-room/WarRoom';

const VIEW = Object.freeze({ LIVE: 'live', TRENDS: 'trends' });

/**
 * AMS Dashboard with two views: **Live** — the incident war room (F4, F5) —
 * and **Trends** — the KPI dashboard. The trends' recurring clusters open
 * their incident in the war room.
 *
 * Route params (via `goToTab('dashboard', …)`): `{ incidentId }` opens that
 * incident in the Live view.
 *
 * @param {Object} props
 * @param {() => void} props.onNavigateToInbox
 * @param {() => void} props.onNavigateToExperience
 * @returns {JSX.Element}
 */
export default function DashboardPage({ onNavigateToInbox, onNavigateToExperience }) {
  const { state } = useAmsStudio();
  const [view, setView] = useState(VIEW.LIVE);
  const [incidentId, setIncidentId] = useState(null);
  const { message, showToast } = useToast();

  const openIncident = (id) => {
    if (!id) return;
    setIncidentId(id);
    setView(VIEW.LIVE);
  };

  useAmsRouteRequest(AMS_MAIN_TAB.DASHBOARD, (params) => openIncident(params.incidentId));

  const openCount = Object.values(state.incidentResponses).filter((response) => response.step < RESOLVED_STEP).length;
  const tabs = [
    { id: VIEW.LIVE, label: 'Live', icon: Radio, count: openCount },
    { id: VIEW.TRENDS, label: 'Trends', icon: BarChart3 }
  ];

  return (
    <div className="ams-page">
      <TabBar tabs={tabs} activeTab={view} onChange={setView} ariaLabel="Dashboard views" idPrefix="ams-dashboard-tab" />
      <div role="tabpanel" id="ams-dashboard-tab-panel" aria-labelledby={`ams-dashboard-tab-${view}`}>
        {view === VIEW.LIVE ? (
          <WarRoom incidentId={incidentId} onSelectIncident={setIncidentId} showToast={showToast} />
        ) : (
          <AmsDashboard
            onNavigateToInbox={onNavigateToInbox}
            onNavigateToExperience={onNavigateToExperience}
            onOpenIncident={(clusterId) => openIncident(getIncidentForCluster(clusterId)?.id)}
          />
        )}
      </div>
      <Toast message={message} />
    </div>
  );
}
