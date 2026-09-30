/**
 * Simulated live telemetry for AI for AD pages. Values are a pure function of
 * (metric, tick), so every page shows consistent numbers and no history state
 * is needed for deltas or sparklines.
 */
import { useEffect, useState } from 'react';
import {
  Activity, Bot, Car, Clock, Coins, Cpu, Database, FileSearch, Gauge, Layers, Link2,
  MemoryStick, Radar, ShieldAlert, ShieldCheck, Timer, TriangleAlert, Zap, FlaskConical, ScrollText
} from 'lucide-react';
import { isHarnessReady } from '../../agent-studio/components/harness/harnessUtils';

export const LIVE_REFRESH_MS = 3000;
export const SPARK_POINTS = 16;

const tickOf = (ms) => Math.floor(Date.now() / ms);

export function useLiveTick(ms = LIVE_REFRESH_MS, paused = false) {
  const [tick, setTick] = useState(() => tickOf(ms));
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setTick(tickOf(ms)), ms);
    return () => clearInterval(id);
  }, [ms, paused]);
  return tick;
}

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const unit = (str) => (hash(str) % 10000) / 10000;

const startOfDayTick = (ms) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / ms);
};

/**
 * Metric definition: { id, label, icon, hint, base, amp, period, noise, rate,
 * counter, decimals, prefix, suffix, min, max, good: 'up' | 'down' }.
 * `rate` (per tick since midnight) makes a monotonic "today" counter.
 */
export function sampleMetric(def, tick, ms = LIVE_REFRESH_MS) {
  const phase = unit(def.id) * Math.PI * 2;
  const wave = (def.amp || 0) * Math.sin((tick / (def.period || 24)) * Math.PI * 2 + phase);
  let value;
  if (def.counter) {
    const n = Math.max(0, tick - startOfDayTick(ms));
    value = def.base + def.rate * n + (def.noise || 0) * unit(`${def.id}:${tick}`);
  } else {
    value = def.base + wave + (def.noise || 0) * (unit(`${def.id}:${tick}`) * 2 - 1);
  }
  if (def.min !== undefined) value = Math.max(def.min, value);
  if (def.max !== undefined) value = Math.min(def.max, value);
  const f = 10 ** (def.decimals || 0);
  return Math.round(value * f) / f;
}

export function formatMetric(def, value) {
  const num = value.toLocaleString('en-US', { minimumFractionDigits: def.decimals || 0, maximumFractionDigits: def.decimals || 0 });
  return `${def.prefix || ''}${num}${def.suffix || ''}`;
}

// ---------------------------------------------------------------------------
// Presets — one per page, sized from the real Agent Studio agents where it matters
// ---------------------------------------------------------------------------
const liveAgents = (agents) => agents.filter(isHarnessReady);
const avgLatency = (agents) => {
  const connected = agents.filter((a) => a.runtime?.status === 'connected' && a.runtime.latencyMs);
  return connected.length ? connected.reduce((s, a) => s + a.runtime.latencyMs, 0) / connected.length : 70;
};

export const LIVE_PRESETS = {
  persona: () => [
    { id: 'p-fleet-km', label: 'Shadow-fleet km today', icon: Car, hint: 'Balocco + public-road shadow mode', counter: true, base: 1200, rate: 2.4, noise: 3, good: 'up' },
    { id: 'p-hil', label: 'HIL rigs busy', icon: Cpu, hint: 'dSPACE SCALEXIO benches in use (of 12)', base: 9, amp: 2, noise: 1, min: 4, max: 12, suffix: ' / 12', good: 'up' },
    { id: 'p-sim', label: 'Scenario sims / min', icon: FlaskConical, hint: 'OpenSCENARIO variants executed', base: 184, amp: 36, noise: 18, good: 'up' },
    { id: 'p-dis', label: 'Disengagements / 1k km', icon: TriangleAlert, hint: 'Rolling 1-hour fleet window', base: 0.42, amp: 0.08, noise: 0.05, decimals: 2, min: 0.1, good: 'down' }
  ],
  studio: (agents) => {
    const n = Math.max(1, liveAgents(agents).length);
    return [
      { id: 's-exec', label: 'Agent executions / min', icon: Zap, hint: `${n} runnable agents on SEL · Bedrock · Foundry`, base: 42 * n, amp: 9 * n, noise: 5 * n, good: 'up' },
      { id: 's-lat', label: 'p95 latency', icon: Timer, hint: 'Across connected runtimes', base: avgLatency(agents) * 1.6, amp: 14, noise: 9, suffix: ' ms', min: 20, good: 'down' },
      { id: 's-ok', label: 'Success rate', icon: ShieldCheck, hint: 'Runs passing the quality gate', base: 97.2, amp: 0.9, noise: 0.5, decimals: 1, max: 99.9, suffix: '%', good: 'up' },
      { id: 's-cost', label: 'Token spend', icon: Coins, hint: 'All agents · current hour', base: 11.8 + n * 1.4, amp: 2.2, noise: 0.8, decimals: 2, prefix: '€', suffix: '/h', good: 'down' }
    ];
  },
  harness: (agents) => {
    const n = Math.max(1, liveAgents(agents).length);
    return [
      { id: 'h-cpu', label: 'CPU', icon: Cpu, hint: 'Average across running agents', base: 24 + n * 1.5, amp: 9, noise: 4, suffix: '%', min: 3, max: 98, good: 'down' },
      { id: 'h-mem', label: 'Memory', icon: MemoryStick, hint: 'Total in use', base: 0.42 * n + 1.1, amp: 0.3, noise: 0.15, decimals: 1, suffix: ' GB', good: 'down' },
      { id: 'h-thr', label: 'Throughput', icon: Activity, hint: 'Pipeline requests handled', base: 52 * n, amp: 14 * n, noise: 8 * n, suffix: '/min', good: 'up' },
      { id: 'h-err', label: 'Error rate', icon: TriangleAlert, hint: 'Weighted by throughput', base: 0.24, amp: 0.09, noise: 0.05, decimals: 2, min: 0.02, suffix: '%', good: 'down' }
    ];
  },
  evaluation: (agents) => [
    { id: 'e-queue', label: 'Evaluation jobs queued', icon: Layers, hint: `${agents.filter((a) => a.stage >= 5 && a.stage <= 6).length} agents at the evaluation gate`, base: 6, amp: 3, noise: 1.5, min: 0, good: 'down' },
    { id: 'e-scn', label: 'Scenarios scored / min', icon: Radar, hint: 'OpenSCENARIO + Euro NCAP cases', base: 312, amp: 60, noise: 25, good: 'up' },
    { id: 'e-grd', label: 'Groundedness (rolling)', icon: FileSearch, hint: 'Claims backed by bound knowledge', base: 91.4, amp: 1.2, noise: 0.6, decimals: 1, suffix: '%', max: 99.5, good: 'up' },
    { id: 'e-hal', label: 'Hallucination flags / h', icon: ShieldAlert, hint: 'Blocked before reaching engineers', base: 3.2, amp: 1.1, noise: 0.7, decimals: 1, min: 0, good: 'down' }
  ],
  governance: () => [
    { id: 'g-checks', label: 'Policy checks / min', icon: ShieldCheck, hint: 'ISO 26262 · SOTIF · R155 · ASPICE', base: 146, amp: 28, noise: 12, good: 'up' },
    { id: 'g-blocked', label: 'Guardrail blocks today', icon: ShieldAlert, hint: 'Outputs stopped by mandatory policies', counter: true, base: 3, rate: 0.004, noise: 0.9, good: 'down' },
    { id: 'g-audit', label: 'Audit events today', icon: ScrollText, hint: 'Actor + timestamp, ISO 26262-2 §6', counter: true, base: 40, rate: 0.09, noise: 2, good: 'up' },
    { id: 'g-sla', label: 'Approval SLA', icon: Clock, hint: 'Median time to a gate decision', base: 3.4, amp: 0.6, noise: 0.3, decimals: 1, suffix: ' h', min: 0.5, good: 'down' }
  ],
  knowledge: () => [
    { id: 'k-ingest', label: 'Records ingested / min', icon: Database, hint: 'Polarion · DOORS · HIL · ARXML', base: 410, amp: 85, noise: 30, good: 'up' },
    { id: 'k-frames', label: 'Fleet frames indexed today', icon: Car, hint: 'Balocco Fleet Data Lake', counter: true, base: 18000, rate: 22, noise: 40, good: 'up' },
    { id: 'k-links', label: 'Trace links updated / min', icon: Link2, hint: 'Requirement ↔ test ↔ release', base: 36, amp: 9, noise: 4, good: 'up' },
    { id: 'k-ret', label: 'Retrieval latency p95', icon: Gauge, hint: 'Agent knowledge queries', base: 118, amp: 18, noise: 10, suffix: ' ms', min: 40, good: 'down' }
  ],
  models: () => [
    { id: 'm-req', label: 'Inference requests / min', icon: Zap, hint: 'All catalogue models', base: 1840, amp: 320, noise: 110, good: 'up' },
    { id: 'm-lat', label: 'p95 inference latency', icon: Timer, hint: 'Edge + cloud endpoints', base: 212, amp: 30, noise: 14, suffix: ' ms', min: 60, good: 'down' },
    { id: 'm-gpu', label: 'GPU utilisation', icon: Cpu, hint: 'Shared EU-Frankfurt pool', base: 68, amp: 11, noise: 4, suffix: '%', max: 99, good: 'up' },
    { id: 'm-tok', label: 'Tokens / min', icon: Bot, hint: 'Prompt + completion', base: 412000, amp: 60000, noise: 20000, good: 'up' }
  ]
};
