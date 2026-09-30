import React, { useMemo, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { amsExperienceData } from '../../mockData.js';
import EmptyState from '../../components/EmptyState';
import FilterPills from '../../components/FilterPills';
import SearchField from '../../components/SearchField';

/** The ten standard AI tool categories, in display order. */
const TOOL_CATEGORIES = [
  'Observability tools',
  'Coding assistants',
  'Testing tools',
  'Architecture tools',
  'DevOps tools',
  'Data engineering tools',
  'Modernization tools',
  'Documentation and knowledge tools',
  'Security and compliance tools',
  'Product-management tools'
];

const ALL_CATEGORIES = 'All';

/** Projects shown when a tool does not list its own approved projects. */
const DEFAULT_APPROVED_PROJECTS = ['Enterprise-Wide Developer Squads', 'AMS Core Operations'];

/**
 * Whether a tool matches the free-text search.
 *
 * @param {Object} tool
 * @param {string} query
 * @returns {boolean}
 */
function matchesQuery(tool, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [tool.name, tool.description, tool.category].some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * Read-only catalogue of approved AI tools, filterable by category.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast Page-level confirmation toast.
 * @returns {JSX.Element}
 */
export default function ToolsCatalogue({ showToast }) {
  const tools = amsExperienceData.tools;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const categoryOptions = useMemo(() => [
    { id: ALL_CATEGORIES, label: 'All', count: tools.length },
    ...TOOL_CATEGORIES.map((name) => ({ id: name, label: name, count: tools.filter((tool) => tool.category === name).length }))
  ], [tools]);

  const visibleTools = tools.filter((tool) => (
    matchesQuery(tool, query) && (category === ALL_CATEGORIES || tool.category === category)
  ));

  return (
    <div className="ams-page">
      <div className="ams-toolbar">
        <FilterPills options={categoryOptions} value={category} onChange={setCategory} ariaLabel="Tool category" />
        <SearchField value={query} onChange={setQuery} placeholder="Search tools" />
      </div>

      {visibleTools.length === 0 ? (
        <EmptyState message="No tools match your search in this category." />
      ) : (
        <div className="ams-grid" style={{ '--ams-grid-min': '360px' }}>
          {visibleTools.map((tool) => (
            <article key={tool.id} className="st-card ams-card">
              <div className="ams-card-head">
                <span className="ams-card-id">{tool.id}</span>
                <span className="st-badge badge-success">{tool.status}</span>
              </div>

              <div>
                <h3 className="ams-card-title">{tool.name}</h3>
                <p className="ams-card-subtitle is-accent">{tool.category}</p>
              </div>

              <p className="ams-card-text">{tool.description}</p>

              <dl className="ams-details">
                <div><dt>Use cases</dt><dd>{tool.useCases}</dd></div>
                <div><dt>Integration</dt><dd>{tool.integrationRequirements}</dd></div>
                <div><dt>Licensing</dt><dd>{tool.licensing}</dd></div>
                <div><dt>Security class</dt><dd>{tool.securityClassification}</dd></div>
                <div><dt>Data handling</dt><dd>{tool.dataHandlingRestrictions}</dd></div>
                <div><dt>Adoption</dt><dd className="ams-text-success">{tool.adoptionRate}</dd></div>
              </dl>

              <div>
                <p className="ams-section-title">Approved projects</p>
                <div className="ams-chip-list">
                  {(tool.approvedProjects || DEFAULT_APPROVED_PROJECTS).map((project) => (
                    <span key={project} className="st-badge badge-info">{project}</span>
                  ))}
                </div>
              </div>

              <div className="ams-card-actions">
                <button
                  type="button"
                  className="st-btn st-btn-primary is-grow"
                  onClick={() => showToast(`Seat licence request submitted for "${tool.name}".`)}
                >
                  <CircleCheck size={13} /> Request seat / licence
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
