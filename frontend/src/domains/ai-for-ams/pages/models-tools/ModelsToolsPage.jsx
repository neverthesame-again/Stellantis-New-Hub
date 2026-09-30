import React, { useState } from 'react';
import { Cpu, Wrench } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { amsExperienceData } from '../../mockData.js';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import PageHeader from '../../components/PageHeader';
import TabBar from '../../components/TabBar';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import ModelCatalogue from './ModelCatalogue';
import ToolsCatalogue from './ToolsCatalogue';

const TAB = Object.freeze({ MODELS: 'models', TOOLS: 'tools' });

/**
 * Models & Tools — the reference catalogues AMS agents draw on: approved AI
 * models (subscribe, compare, request onboarding) and approved AI tools.
 *
 * @returns {JSX.Element}
 */
export default function ModelsToolsPage() {
  const route = getAmsRoute(AMS_SUBPAGE.MODELS_TOOLS);
  const { state } = useAmsStudio();
  const [activeTab, setActiveTab] = useState(TAB.MODELS);
  const { message, showToast } = useToast();

  const tabs = [
    { id: TAB.MODELS, label: 'Models', icon: Cpu, count: state.models.length },
    { id: TAB.TOOLS, label: 'AI Tools', icon: Wrench, count: amsExperienceData.tools.length }
  ];

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Catalogue" idPrefix="ams-catalogue-tab" />
      <div role="tabpanel" id="ams-catalogue-tab-panel" aria-labelledby={`ams-catalogue-tab-${activeTab}`}>
        {activeTab === TAB.MODELS
          ? <ModelCatalogue showToast={showToast} />
          : <ToolsCatalogue showToast={showToast} />}
      </div>
      <Toast message={message} />
    </div>
  );
}
