import React, { useState } from 'react';
import {
  Network,
  GitMerge,
  FolderGit2,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Download,
  ExternalLink,
  ChevronRight,
  Code2,
  Database,
  Workflow
} from 'lucide-react';
import '../engineeringExperience.css';

export default function EngineeringKnowledgeFabric() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const graphNodes = [
    // Column 1: Repositories
    { id: 'repo-autosar', type: 'Codebase', label: 'autosar-adaptive-core', sub: 'AD & ADAS • 48 Repos', x: 20, y: 20, w: 220, h: 56, color: '#0284c7' },
    { id: 'repo-canbus', type: 'Codebase', label: 'can-bus-gateway-v2', sub: 'Powertrain • High Debt', x: 20, y: 95, w: 220, h: 56, color: '#0284c7' },
    { id: 'repo-fusion', type: 'Codebase', label: 'perception-fusion-engine', sub: 'Vision • Healthy (9.5%)', x: 20, y: 170, w: 220, h: 56, color: '#0284c7' },
    { id: 'repo-ota', type: 'Codebase', label: 'cloud-ota-orchestrator', sub: 'SDV Core • Edge Cloud', x: 20, y: 245, w: 220, h: 56, color: '#0284c7' },

    // Column 2: SDV Services
    { id: 'svc-stla', type: 'SDV Service', label: 'STLA Core OS / Runtime', sub: 'ECU 1 • AUTOSAR Adaptive', x: 350, y: 25, w: 220, h: 56, color: '#8b5cf6' },
    { id: 'svc-can', type: 'SDV Service', label: 'CAN Telemetry Gateway', sub: 'ECU 4 • Realtime Telemetry', x: 350, y: 100, w: 220, h: 56, color: '#8b5cf6' },
    { id: 'svc-fusion', type: 'SDV Service', label: 'Vision & Radar Pipeline', sub: 'ECU 2 • Perception Suite', x: 350, y: 175, w: 220, h: 56, color: '#8b5cf6' },
    { id: 'svc-ota', type: 'SDV Service', label: 'Package Verifier / OTA', sub: 'Cloud Orchestrator', x: 350, y: 250, w: 220, h: 56, color: '#8b5cf6' },

    // Column 3: AI Gateways
    { id: 'mod-claude', type: 'AI Gateway', label: 'Claude 3.5 Sonnet', sub: 'AWS Bedrock VPC', x: 670, y: 25, w: 220, h: 56, color: '#10b981' },
    { id: 'mod-mistral', type: 'AI Gateway', label: 'Mistral Large 2', sub: 'Turin Private Cloud', x: 670, y: 100, w: 220, h: 56, color: '#10b981' },
    { id: 'mod-gpt', type: 'AI Gateway', label: 'GPT-4o Enterprise', sub: 'Azure OpenAI Stellantis', x: 670, y: 175, w: 220, h: 56, color: '#10b981' },
    { id: 'mod-deepseek', type: 'AI Gateway', label: 'DeepSeek Coder V2', sub: 'Turin GPU Cluster', x: 670, y: 250, w: 220, h: 56, color: '#10b981' }
  ];

  const graphEdges = [
    // Repos -> Services
    { from: 'repo-autosar', to: 'svc-stla' },
    { from: 'repo-canbus', to: 'svc-can' },
    { from: 'repo-fusion', to: 'svc-fusion' },
    { from: 'repo-ota', to: 'svc-ota' },
    { from: 'repo-autosar', to: 'svc-fusion', dashed: true },

    // Services -> Models
    { from: 'svc-stla', to: 'mod-claude' },
    { from: 'svc-stla', to: 'mod-deepseek', dashed: true },
    { from: 'svc-can', to: 'mod-mistral' },
    { from: 'svc-fusion', to: 'mod-gpt' },
    { from: 'svc-fusion', to: 'mod-claude', dashed: true },
    { from: 'svc-ota', to: 'mod-deepseek' }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('Knowledge Fabric topology scan completed. 48 repos and 12 services verified.');
    }, 1200);
  };

  const codebases = [
    {
      id: 'repo-01',
      name: 'autosar-adaptive-core',
      portfolio: 'AD & ADAS',
      services: ['STLA Core OS', 'Adaptive Runtime'],
      models: ['Claude 3.5 Sonnet', 'DeepSeek Coder'],
      debtRatio: '8.2%',
      status: 'Healthy',
      lastScan: '12m ago',
      drift: '0.4%'
    },
    {
      id: 'repo-02',
      name: 'can-bus-gateway-v2',
      portfolio: 'Powertrain',
      services: ['Telemetry Dispatcher', 'CAN ECU Gateway'],
      models: ['Mistral Large 2'],
      debtRatio: '18.6%',
      status: 'High Debt',
      lastScan: '1h ago',
      drift: '4.1%'
    },
    {
      id: 'repo-03',
      name: 'perception-fusion-engine',
      portfolio: 'AD & ADAS',
      services: ['LiDAR/Radar Fusion', 'Vision Pipeline'],
      models: ['GPT-4o Enterprise', 'Gemini 2.5 Pro'],
      debtRatio: '9.5%',
      status: 'Healthy',
      lastScan: '30m ago',
      drift: '1.2%'
    },
    {
      id: 'repo-04',
      name: 'cockpit-hmi-framework',
      portfolio: 'SmartCockpit',
      services: ['Voice Assistant Service', 'Cluster UI'],
      models: ['GPT-4o Enterprise'],
      debtRatio: '14.1%',
      status: 'Moderate',
      lastScan: '2h ago',
      drift: '2.5%'
    },
    {
      id: 'repo-05',
      name: 'battery-bms-supervisor',
      portfolio: 'Powertrain',
      services: ['Thermal Control', 'Cell Estimator'],
      models: ['Claude 3.5 Sonnet'],
      debtRatio: '7.0%',
      status: 'Healthy',
      lastScan: '45m ago',
      drift: '0.8%'
    },
    {
      id: 'repo-06',
      name: 'cloud-ota-orchestrator',
      portfolio: 'SDV Core',
      services: ['OTA Campaign Manager', 'Package Verifier'],
      models: ['DeepSeek Coder', 'Mistral Large 2'],
      debtRatio: '11.3%',
      status: 'Healthy',
      lastScan: '15m ago',
      drift: '1.9%'
    }
  ];

  const filteredCodebases = codebases.filter(cb => {
    const matchesFilter = selectedFilter === 'ALL' || cb.portfolio.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesSearch = cb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cb.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--stellantis-navy, #0b1a30)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1100,
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="st-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--stellantis-action, #0284c7)'
            }}>
              <Network size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Knowledge Fabric &amp; Architecture Tech Debt
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Enterprise Knowledge Graph, Codebase Topology &amp; Architectural Drift Radar
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge-navy" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
              Live Architectural Topology
            </span>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="st-btn st-btn-primary"
              style={{ fontSize: '0.75rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
              <span>{isScanning ? 'Scanning...' : 'Scan Topology'}</span>
            </button>
            <button
              onClick={() => showToast('Exported STLA Brain v2.4 Knowledge Fabric manifest (JSON).')}
              className="st-btn st-btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={13} />
              <span>Export Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mapped Repos</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>48</div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>100% Graph Lineage</div>
        </div>

        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Services</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>12</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>6 SDV ECUs</div>
        </div>

        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Gateway Models</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>4</div>
          <div style={{ fontSize: '0.68rem', color: '#0284c7', marginTop: '2px', fontWeight: 600 }}>Zero Gateway Bottlenecks</div>
        </div>

        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Technical Debt Ratio</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>12.4%</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--badge-success-text)', marginTop: '2px', fontWeight: 600 }}>Healthy (&lt;15% ceiling)</div>
        </div>

        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Deprecated APIs</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>14</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>8 due in Q4</div>
        </div>

        <div className="st-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Architectural Drift</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>Low (2.1%)</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>STLA Brain v2.4 aligned</div>
        </div>
      </div>

      {/* Codebase Connection Graph & Scorecard Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        
        {/* Tile 1: Codebase Connection Graph */}
        <div className="st-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Codebase Connection Graph (Repos ↔ Services ↔ Models)
            </div>
            <span className="badge-navy" style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}>
              STLA Brain v2.4
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ flex: 1 }}>
              <FolderGit2 size={20} color="var(--stellantis-action)" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>48 Repos</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Git Codebases</div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 800 }}>↔</div>

            <div style={{ flex: 1 }}>
              <Layers size={20} color="#8b5cf6" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>12 Services</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>6 SDV ECUs</div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 800 }}>↔</div>

            <div style={{ flex: 1 }}>
              <Cpu size={20} color="#10b981" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>4 Models</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AI Gateways</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Graph Lineage: <strong style={{ color: '#10b981' }}>100% Mapped</strong></span>
            <span>Remediation Target: <strong>6 Repos scheduled</strong></span>
          </div>
        </div>

        {/* Tile 2: Technical Debt Scorecard */}
        <div className="st-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Technical Debt Scorecard
            </div>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              Q3 Benchmark: Passed
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Debt Ratio</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', margin: '3px 0' }}>12.4%</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--badge-success-text)' }}>Healthy (&lt;15%)</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Deprecated APIs</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', margin: '3px 0' }}>14</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>8 due in Q4</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Refactor Priority</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--stellantis-action)', margin: '4px 0 2px 0' }}>CAN-Bus V2</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>High Agent ROI</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Architectural Drift: <strong style={{ color: '#10b981' }}>Low (2.1%)</strong></span>
            <span>Target Q4 Remediation: <strong>6 Repos</strong></span>
          </div>
        </div>

      </div>

      {/* ================================================================= */}
      {/* INTERACTIVE GRAPHICAL TOPOLOGY (Nodes & Lineage Edges)            */}
      {/* ================================================================= */}
      <div className="st-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitMerge size={17} color="var(--stellantis-action, #0284c7)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Knowledge Fabric Graph &bull; Nodes &amp; Lineage Edges
              </h3>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Interactive topology map: Click any node to trace connections across Codebases &bull; SDV Services &bull; AI Models
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                Codebase Repos
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                SDV Services
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                AI Gateways
              </span>
            </div>

            {selectedNode && (
              <button
                onClick={() => setSelectedNode(null)}
                className="st-btn st-btn-secondary"
                style={{ fontSize: '0.7rem', padding: '3px 8px' }}
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* SVG Nodes & Edges Canvas */}
        <div style={{
          width: '100%',
          overflowX: 'auto',
          background: 'var(--bg-subtle)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '12px 6px'
        }}>
          <svg
            viewBox="0 0 920 320"
            style={{ width: '100%', minWidth: '760px', height: 'auto', display: 'block' }}
          >
            <defs>
              {/* Markers for edges */}
              <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgba(148, 163, 184, 0.45)" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
              </marker>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* EDGES (Connecting Repos to Services, and Services to Models) */}
            {graphEdges.map((edge, idx) => {
              const fromNode = graphNodes.find(n => n.id === edge.from);
              const toNode = graphNodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + fromNode.w;
              const y1 = fromNode.y + fromNode.h / 2;
              const x2 = toNode.x;
              const y2 = toNode.y + toNode.h / 2;
              const dx = (x2 - x1) * 0.55;

              const isEdgeActive = !selectedNode || selectedNode === edge.from || selectedNode === edge.to;
              const strokeColor = !selectedNode
                ? 'rgba(148, 163, 184, 0.45)'
                : isEdgeActive
                  ? '#0284c7'
                  : 'rgba(148, 163, 184, 0.15)';
              const strokeWidth = isEdgeActive && selectedNode ? 2.5 : 1.6;

              return (
                <path
                  key={`edge-${idx}`}
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={edge.dashed ? '4 3' : 'none'}
                  markerEnd={isEdgeActive && selectedNode ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}

            {/* NODES */}
            {graphNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isConnected = selectedNode && (
                graphEdges.some(e => (e.from === selectedNode && e.to === node.id) || (e.to === selectedNode && e.from === node.id))
              );
              const isDimmed = selectedNode && !isSelected && !isConnected;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  opacity={isDimmed ? 0.35 : 1}
                >
                  {/* Node Background Box */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx="8"
                    ry="8"
                    fill={isSelected ? 'var(--bg-surface)' : 'var(--bg-surface)'}
                    stroke={isSelected ? node.color : isConnected ? node.color : 'var(--border-color)'}
                    strokeWidth={isSelected ? '2.5' : isConnected ? '1.8' : '1'}
                    filter={isSelected ? 'url(#glow)' : 'none'}
                  />

                  {/* Node Accent Left Border Pill */}
                  <rect
                    x={node.x + 3}
                    y={node.y + 6}
                    width="4"
                    height={node.h - 12}
                    rx="2"
                    fill={node.color}
                  />

                  {/* Node Category Tag */}
                  <text
                    x={node.x + 14}
                    y={node.y + 16}
                    fontSize="9"
                    fontWeight="700"
                    fill="var(--text-muted)"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    {node.type}
                  </text>

                  {/* Node Label / Name */}
                  <text
                    x={node.x + 14}
                    y={node.y + 32}
                    fontSize="11.5"
                    fontWeight="700"
                    fill="var(--text-primary)"
                  >
                    {node.label}
                  </text>

                  {/* Subtitle / Metadata Badge */}
                  <text
                    x={node.x + 14}
                    y={node.y + 46}
                    fontSize="9"
                    fill={node.color}
                    fontWeight="600"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Card */}
        {selectedNode && (
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Selected Lineage Node: </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {graphNodes.find(n => n.id === selectedNode)?.label}
              </strong>
              <span style={{ margin: '0 8px', color: 'var(--border-color)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>Type: </span>
              <strong>{graphNodes.find(n => n.id === selectedNode)?.type}</strong>
              <span style={{ margin: '0 8px', color: 'var(--border-color)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>Specification: </span>
              <strong>{graphNodes.find(n => n.id === selectedNode)?.sub}</strong>
            </div>
            <button
              onClick={() => showToast(`Generated deep-inspection report for ${graphNodes.find(n => n.id === selectedNode)?.label}`)}
              className="st-btn st-btn-primary"
              style={{ fontSize: '0.7rem', padding: '4px 10px' }}
            >
              Inspect Dependencies
            </button>
          </div>
        )}
      </div>

      {/* Filterable Codebases Explorer Table */}
      <div className="st-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Connected Codebases &amp; Knowledge Topology
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Lineage view of repositories, associated vehicle services, and AI foundation model gateways
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search repos, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  outline: 'none',
                  minWidth: '200px'
                }}
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Portfolios</option>
              <option value="AD">AD &amp; ADAS</option>
              <option value="Powertrain">Powertrain</option>
              <option value="SmartCockpit">SmartCockpit</option>
              <option value="SDV Core">SDV Core</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="st-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Codebase / Repository</th>
                <th style={{ padding: '10px 12px' }}>Portfolio</th>
                <th style={{ padding: '10px 12px' }}>Mapped Services</th>
                <th style={{ padding: '10px 12px' }}>AI Gateways</th>
                <th style={{ padding: '10px 12px' }}>Debt Ratio</th>
                <th style={{ padding: '10px 12px' }}>Drift</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodebases.map((cb) => (
                <tr key={cb.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Code2 size={16} color="var(--stellantis-action)" />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cb.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Scan: {cb.lastScan}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge-navy" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                      {cb.portfolio}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {cb.services.map((svc, idx) => (
                        <span key={idx} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {cb.models.map((mod, idx) => (
                        <span key={idx} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }}>
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: cb.status === 'High Debt' ? '#ef4444' : cb.status === 'Moderate' ? '#f59e0b' : '#10b981' }}>
                        {cb.debtRatio}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                    {cb.drift}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => showToast(`Opened full architectural graph for ${cb.name}`)}
                      className="st-btn st-btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Lineage</span>
                      <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
