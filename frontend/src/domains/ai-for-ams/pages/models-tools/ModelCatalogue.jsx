import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import EmptyState from '../../components/EmptyState';
import SearchField from '../../components/SearchField';
import ModelCard from './ModelCard';
import ModelCompareModal from './ModelCompareModal';
import ModelFacetPanel from './ModelFacetPanel';
import ModelOnboardingModal from './ModelOnboardingModal';
import { createEmptyFacetSelection, filterModels, hasActiveFacets } from './modelFacets';

/** Maximum number of models in one comparison. */
const MAX_COMPARED_MODELS = 3;

/**
 * Faceted model catalogue: search, filter, subscribe, compare and request
 * onboarding of new models. Subscriptions are saved in the AMS store and show
 * up under Monitor & FinOps → Subscriptions.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast Page-level confirmation toast.
 * @returns {JSX.Element}
 */
export default function ModelCatalogue({ showToast }) {
  const { state, actions } = useAmsStudio();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(createEmptyFacetSelection);
  const [comparedIds, setComparedIds] = useState([]);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);

  const visibleModels = useMemo(
    () => filterModels(state.models, query, selection),
    [state.models, query, selection]
  );
  const comparedModels = comparedIds
    .map((id) => state.models.find((model) => model.id === id))
    .filter(Boolean);

  const resetFilters = () => {
    setQuery('');
    setSelection(createEmptyFacetSelection());
    showToast('Filters reset');
  };

  const toggleSubscription = (model) => {
    actions.toggleModelSubscription(model.id);
    showToast(model.subscribed
      ? `Removed "${model.name}" from your portfolio`
      : `Subscribed "${model.name}" to your portfolio`);
  };

  const toggleCompare = (modelId) => {
    if (comparedIds.includes(modelId)) {
      setComparedIds(comparedIds.filter((id) => id !== modelId));
      return;
    }
    if (comparedIds.length >= MAX_COMPARED_MODELS) {
      showToast(`You can compare up to ${MAX_COMPARED_MODELS} models at once.`);
      return;
    }
    setComparedIds([...comparedIds, modelId]);
  };

  const submitOnboardingRequest = ({ modelName }) => {
    setOnboardingOpen(false);
    showToast(`Onboarding request for "${modelName}" sent to the Chief AI Officer review board.`);
  };

  return (
    <div className="ams-browse-layout">
      <ModelFacetPanel
        models={state.models}
        query={query}
        selection={selection}
        onChange={setSelection}
        onReset={resetFilters}
      />

      <div className="ams-browse-main">
        <div className="ams-toolbar">
          <SearchField value={query} onChange={setQuery} placeholder="Search models, providers or use cases" />
          <div className="ams-page-actions">
            {comparedModels.length >= 2 && (
              <button type="button" className="st-btn st-btn-action" onClick={() => setCompareOpen(true)}>
                <ArrowLeftRight size={14} /> Compare selected ({comparedModels.length})
              </button>
            )}
            <button type="button" className="st-btn st-btn-outline" onClick={() => setOnboardingOpen(true)}>
              <Plus size={14} /> Request new model
            </button>
          </div>
        </div>

        <p className="ams-section-title" aria-live="polite">
          Showing {visibleModels.length} of {state.models.length} models
        </p>

        {visibleModels.length === 0 ? (
          <EmptyState
            message="No models match your search and filters."
            action={(query || hasActiveFacets(selection)) && (
              <button type="button" className="st-btn st-btn-outline" onClick={resetFilters}>Clear filters</button>
            )}
          />
        ) : (
          <div className="ams-grid">
            {visibleModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isCompared={comparedIds.includes(model.id)}
                onToggleSubscription={() => toggleSubscription(model)}
                onToggleCompare={() => toggleCompare(model.id)}
              />
            ))}
          </div>
        )}
      </div>

      {isCompareOpen && <ModelCompareModal models={comparedModels} onClose={() => setCompareOpen(false)} />}
      {isOnboardingOpen && (
        <ModelOnboardingModal onClose={() => setOnboardingOpen(false)} onSubmit={submitOnboardingRequest} />
      )}
    </div>
  );
}
