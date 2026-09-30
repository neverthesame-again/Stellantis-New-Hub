/**
 * @file Faceted filtering for the AMS model catalogue.
 *
 * Pure functions, so the facet counts and the visible grid are always computed
 * by exactly the same rules.
 */

/**
 * @typedef {Object} ModelFacet
 * @property {string} key      Model field the facet filters on.
 * @property {string} label    Heading shown in the facet panel.
 * @property {string[]} values Options offered, in display order.
 */

/** @type {ReadonlyArray<ModelFacet>} */
export const MODEL_FACETS = Object.freeze([
  {
    key: 'capabilityGroup',
    label: 'Capability',
    values: [
      'General Reasoning & Code',
      'Deep & Complex Reasoning',
      'Multimodal Telemetry & Vision',
      'Edge Simulation & Diagnostics'
    ]
  },
  {
    key: 'deployType',
    label: 'Deployment Type',
    values: [
      'Dedicated Sovereign Cloud',
      'Multi-Tenant Cloud API',
      'On-Premise Sovereign Cluster',
      'Private VPC Appliance'
    ]
  },
  {
    key: 'costTier',
    label: 'Cost Tier',
    values: ['Economy Compute', 'Standard Compute', 'Premium Compute']
  },
  {
    key: 'provider',
    label: 'Provider',
    values: ['Anthropic', 'Google', 'OpenAI', 'Mistral AI', 'Meta AI', 'DeepSeek AI', 'Cohere', 'AI21 Labs']
  }
]);

/**
 * @typedef {Record<string, string[]>} FacetSelection Facet key → selected values.
 */

/**
 * Creates a selection with nothing checked.
 *
 * @returns {FacetSelection}
 */
export function createEmptyFacetSelection() {
  return Object.fromEntries(MODEL_FACETS.map((facet) => [facet.key, []]));
}

/**
 * Whether any facet value is checked.
 *
 * @param {FacetSelection} selection
 * @returns {boolean}
 */
export function hasActiveFacets(selection) {
  return Object.values(selection).some((values) => values.length > 0);
}

/**
 * Free-text match over the model's searchable fields.
 *
 * @param {Object} model
 * @param {string} query Raw search text.
 * @returns {boolean} True for an empty query.
 */
function matchesQuery(model, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [model.name, model.provider, model.deployType, model.costTier, ...(model.supportedUseCases || [])];
  return haystack.some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * Applies the search text and facet selection. Values within one facet are
 * OR-ed; different facets are AND-ed.
 *
 * @param {Object[]} models
 * @param {string} query
 * @param {FacetSelection} selection
 * @returns {Object[]} Matching models, in catalogue order.
 */
export function filterModels(models, query, selection) {
  return models.filter((model) => (
    matchesQuery(model, query)
    && MODEL_FACETS.every(({ key }) => {
      const selected = selection[key] || [];
      return selected.length === 0 || selected.includes(model[key]);
    })
  ));
}

/**
 * How many models would show if a facet were narrowed to one value, given the
 * other facets and the search text. Drives the counts next to each option.
 *
 * @param {Object[]} models
 * @param {string} query
 * @param {FacetSelection} selection
 * @param {string} facetKey
 * @param {string} value
 * @returns {number}
 */
export function countFacetValue(models, query, selection, facetKey, value) {
  return filterModels(models, query, { ...selection, [facetKey]: [value] }).length;
}

/**
 * Badge class for a model's risk rating.
 *
 * @param {string} riskRating "High" | "Medium" | "Low".
 * @returns {string}
 */
export function riskBadgeClass(riskRating) {
  if (riskRating === 'High') return 'badge-high';
  if (riskRating === 'Medium') return 'badge-purple';
  return 'badge-info';
}
