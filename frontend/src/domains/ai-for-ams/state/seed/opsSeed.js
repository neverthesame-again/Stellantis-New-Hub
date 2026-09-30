/**
 * @file Demo programmes and prompt rules (F10, F12).
 */

/** Programmes grouping the demo agents by service portfolio. */
export const SEED_PROGRAMMES = Object.freeze([
  {
    id: 'PRG-1',
    name: 'Connected Vehicle Resilience',
    portfolio: 'Connected Vehicle Core',
    description: 'Cut P1 telematics incidents by resolving recurring Kafka and edge-ingest failures with agents.',
    objective: 'Halve MTTR for telematics P1s by Q4',
    stakeholders: 'Tony (Head of AMS), AMS L2 Telematics, Core Infrastructure Squad',
    targetDate: '2026-12-15',
    agentIds: ['AMS-AGT-201', 'AMS-AGT-203', 'AMS-AGT-207', 'AMS-AGT-208'],
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'PRG-2',
    name: 'Dealer & Commercial Stability',
    portfolio: 'Global Commercial Operations',
    description: 'Keep dealer invoicing and parts lookup available through change-risk scoring and faster problem management.',
    objective: 'Zero P2 invoicing outages during month-end close',
    stakeholders: 'Commercial Platforms Squad, AMS Problem Management',
    targetDate: '2026-11-30',
    agentIds: ['AMS-AGT-202', 'AMS-AGT-204', 'AMS-AGT-205', 'AMS-AGT-209'],
    createdAt: '2026-09-05T08:00:00.000Z'
  }
]);

/** Prompt rules applied to AMS agents (F10). */
export const SEED_PROMPT_RULES = Object.freeze([
  { id: 'PR-1', name: 'Cap prompt context', scope: 'AMS only', mode: 'enforce', parameters: 'Max 12k tokens of context per prompt' },
  { id: 'PR-2', name: 'Summarise logs before prompting', scope: 'All agents', mode: 'recommend', parameters: 'Summarise excerpts longer than 200 lines' },
  { id: 'PR-3', name: 'Reuse answers for repeat incidents', scope: 'AMS only', mode: 'monitor', parameters: 'Semantic cache, similarity ≥ 0.92, TTL 30 min' }
]);
