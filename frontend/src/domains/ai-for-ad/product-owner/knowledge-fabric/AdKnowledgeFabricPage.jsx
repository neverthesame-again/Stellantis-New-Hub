import React, { useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Network, GitBranch, ShieldCheck, User } from 'lucide-react';
import {
  AD_SCENARIOS,
  AD_KNOWLEDGE_LANES,
  RECORD_STATUS,
  buildAdKnowledgeGraph,
  filterAdGraphToScenario,
  getAdMemoryCounters,
  getAdDebtProfile,
  scenarioCoverage
} from './model/adKnowledgeGraph';
import AdMemoryCounters from './AdMemoryCounters';
import AdKnowledgeGraphCanvas from './graph/AdKnowledgeGraphCanvas';
import AdNodeDetailPanel from './AdNodeDetailPanel';
import AdAgentCoverageCard from './AdAgentCoverageCard';
import AdDebtProfiler from './AdDebtProfiler';
import { useAgentStudio } from '../agent-studio/useAgentStudio';
import './adKnowledgeFabric.css';

const VIEW = Object.freeze({ FLOW: 'flow', EXPLORE: 'explore' });
const ALL = '';

function StatusLegend() {
  return (
    <div className="ad-kg-legend" aria-label="Record status legend">
      {Object.entries(RECORD_STATUS).map(([key, s]) => (
        <span key={key} className="ad-kg-legend-item">
          <span className={`ad-kg-status-dot tone-${s.tone}`} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

function ThreadSummary({ scenario }) {
  const cov = scenarioCoverage(scenario);
  return (
    <div className="ad-kg-thread">
      <div className="ad-kg-thread-main">
        <div className="ad-kg-thread-id">{scenario.id}</div>
        <div className="ad-kg-thread-title">{scenario.title}</div>
        <p className="ad-kg-thread-desc">{scenario.summary}</p>
      </div>
      <div className="ad-kg-thread-facts">
        <span className="ad-kg-fact"><GitBranch size={13} />{scenario.release}</span>
        <span className="ad-kg-fact"><ShieldCheck size={13} />{scenario.asil}</span>
        <span className="ad-kg-fact"><User size={13} />{scenario.owner}</span>
        <span className={`ad-kg-phase ${cov.gaps ? 'has-gap' : ''}`}>{scenario.phase}</span>
      </div>
      <div className="ad-kg-thread-cov">
        <div className="ad-kg-cov-row">
          <span>Trace coverage</span>
          <strong>{cov.percent}%</strong>
        </div>
        <div className="ad-kg-cov-bar" role="progressbar" aria-valuenow={cov.percent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${cov.percent}%` }} />
        </div>
        <div className="ad-kg-cov-sub">
          {cov.verified}/{cov.total} artefacts verified{cov.gaps ? ` · ${cov.gaps} gap${cov.gaps > 1 ? 's' : ''}` : ''}
        </div>
      </div>
    </div>
  );
}

function ReadingGuide() {
  return (
    <aside className="ad-kg-inspector" aria-label="Reading the graph">
      <div className="ad-kg-inspector-header">
        <span className="ad-kg-tag lane-agent">GUIDE</span>
        <span className="ad-kg-system-tag">ASPICE V-model</span>
      </div>
      <h3 className="ad-kg-inspector-title">How to read the fabric</h3>
      <p className="ad-kg-sec-desc">
        Each AD feature is traced left-to-right through the development lifecycle. Click any artefact to inspect it,
        or pick an agent to see which knowledge it is grounded in.
      </p>
      <ol className="ad-kg-guide-list">
        {AD_KNOWLEDGE_LANES.map((lane) => (
          <li key={lane.id}>
            <span className={`ad-kg-guide-dot lane-${lane.id}`} />
            <span>
              <strong>{lane.label}</strong>
              <em>{lane.process}</em>
            </span>
          </li>
        ))}
      </ol>
      <StatusLegend />
    </aside>
  );
}

export default function AdKnowledgeFabricPage() {
  const { agents, navigate } = useAgentStudio();

  const [view, setView] = useState(VIEW.FLOW);
  const [scenarioId, setScenarioId] = useState(AD_SCENARIOS[0].id);
  const [agentId, setAgentId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const fullGraph = useMemo(() => buildAdKnowledgeGraph(agents), [agents]);
  const activeScenarioId = scenarioId || AD_SCENARIOS[0].id;
  const graph = view === VIEW.FLOW ? filterAdGraphToScenario(fullGraph, activeScenarioId) : fullGraph;
  const scenario = AD_SCENARIOS.find((s) => s.id === activeScenarioId);

  const agent = agents.find((a) => a.id === agentId) || null;
  const selectedRecord = graph.nodes.find((n) => n.id === selectedNodeId) || null;

  const memoryCounters = useMemo(() => getAdMemoryCounters(), []);
  const debtProfile = useMemo(() => getAdDebtProfile(agents), [agents]);

  const showScenario = (id) => {
    setView(VIEW.FLOW);
    setScenarioId(id);
    setSelectedNodeId(null);
    document.querySelector('.ad-kg-main-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showAgent = (id) => {
    setAgentId(id);
    setSelectedNodeId(null);
    document.querySelector('.ad-kg-main-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const changeView = (next) => {
    setView(next);
    setSelectedNodeId(null);
    if (next === VIEW.FLOW && !scenarioId) setScenarioId(AD_SCENARIOS[0].id);
    if (next === VIEW.EXPLORE) setScenarioId(ALL);
  };

  const openInStudio = (id) => navigate({ tab: 'evaluation', agentId: id });

  return (
    <div className="ad-kg-page animate-fade-in">
      <div className="ad-kg-header-card">
        <div className="ad-kg-title-area">
          <div className="ad-kg-icon-box">
            <Network size={24} />
          </div>
          <div>
            <h2 className="ad-kg-page-title">
              <span>AD SDLC Knowledge Fabric</span>
              <span className="st-badge badge-info" style={{ fontSize: '0.65rem' }}>ASPICE CL2 · ISO 26262</span>
            </h2>
            <p className="ad-kg-page-desc">
              Traceability from requirement to fleet for every AI for AD feature — Polarion → HARA → AUTOSAR → Code → SIL/HIL → Release → the AI agents grounded in it.
            </p>
          </div>
        </div>
        <div className="ad-kg-header-badges">
          <span className="st-badge badge-purple" style={{ fontSize: '0.72rem' }}>{agents.length} Studio Agents</span>
          <span className="st-badge badge-success" style={{ fontSize: '0.72rem' }}>{AD_SCENARIOS.length} Feature Threads</span>
        </div>
      </div>

      <AdMemoryCounters counters={memoryCounters} />

      <section className="ad-kg-main-card" aria-label="AD SDLC knowledge graph">
        <div className="ad-kg-toolbar">
          <div className="ad-kg-view-toggle" role="tablist">
            <button
              role="tab"
              aria-selected={view === VIEW.FLOW}
              className={`ad-kg-toggle-btn ${view === VIEW.FLOW ? 'active' : ''}`}
              onClick={() => changeView(VIEW.FLOW)}
              type="button"
            >
              Feature Trace
            </button>
            <button
              role="tab"
              aria-selected={view === VIEW.EXPLORE}
              className={`ad-kg-toggle-btn ${view === VIEW.EXPLORE ? 'active' : ''}`}
              onClick={() => changeView(VIEW.EXPLORE)}
              type="button"
            >
              Explore All Knowledge
            </button>
          </div>

          <div className="ad-kg-selectors">
            <select
              className="ad-kg-select"
              value={scenarioId}
              onChange={(e) => {
                setScenarioId(e.target.value);
                setSelectedNodeId(null);
              }}
              aria-label="Feature thread"
            >
              {view === VIEW.EXPLORE && <option value={ALL}>All feature threads</option>}
              {AD_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>{sc.id} · {sc.title}</option>
              ))}
            </select>

            <select
              className="ad-kg-select"
              value={agentId}
              onChange={(e) => {
                setAgentId(e.target.value);
                setSelectedNodeId(null);
              }}
              aria-label="Highlight agent coverage"
            >
              <option value="">No agent highlight</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>Agent: {a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {view === VIEW.FLOW && scenario ? (
          <ThreadSummary scenario={scenario} />
        ) : (
          <div className="ad-kg-help-row">
            <p className="ad-kg-help-note">
              Consolidated lifecycle knowledge across all feature threads. Shared artefacts (MISRA gate, FusionManager SWC, release gates) appear once.
              Pick a thread or an agent to light up its path.
            </p>
            <StatusLegend />
          </div>
        )}

        <div className={`ad-kg-canvas-layout ${view === VIEW.FLOW ? 'is-flow' : ''}`}>
          <ReactFlowProvider>
            <AdKnowledgeGraphCanvas
              key={`${view}-${view === VIEW.FLOW ? activeScenarioId : 'all'}`}
              graph={graph}
              highlightScenarioId={view === VIEW.EXPLORE ? scenarioId || null : null}
              agent={agent}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              animatePath={view === VIEW.FLOW || Boolean(scenarioId)}
            />
          </ReactFlowProvider>

          {selectedRecord ? (
            <AdNodeDetailPanel
              record={selectedRecord}
              agents={agents}
              onShowScenario={showScenario}
              onShowAgent={showAgent}
              onOpenInStudio={openInStudio}
              onClose={() => setSelectedNodeId(null)}
            />
          ) : agent ? (
            <AdAgentCoverageCard
              agent={agent}
              graph={fullGraph}
              onShowScenario={showScenario}
              onOpenInStudio={openInStudio}
              onClear={() => setAgentId('')}
            />
          ) : (
            <ReadingGuide />
          )}
        </div>
      </section>

      <AdDebtProfiler
        profile={debtProfile}
        onShowScenario={showScenario}
        onShowAgent={showAgent}
      />
    </div>
  );
}
