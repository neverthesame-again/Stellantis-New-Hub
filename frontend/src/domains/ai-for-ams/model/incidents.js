/**
 * @file Open AMS incidents and the knowledge behind them.
 *
 * Seeded from the dashboard's recurring incident clusters and problem records,
 * so every feature that works on "an incident" — the live war room (F4), RCA
 * hand-off (F5), workflow runs (F9) and the knowledge fabric (F8) — talks about
 * the same incidents the dashboard shows.
 *
 * Each incident carries its knowledge chain in the order the knowledge fabric
 * draws it: affected service (CMDB) → change record → logs & monitoring →
 * known-error article → similar past incidents → runbook.
 */

import { amsDashboardData } from '../mockData.js';

const SEVERITY_BY_IMPACT = { Critical: 'P1', High: 'P2', Elevated: 'P2', Moderate: 'P3' };

/**
 * @typedef {Object} KnowledgeRecord
 * @property {string} recordId        Id in the source system, e.g. "CR-8921".
 * @property {string} label           Short human title.
 * @property {string} system          Source system shown to users.
 * @property {string} knowledgeSource Matching entry of KNOWLEDGE_SOURCES (for agent coverage).
 * @property {string} count           Size of the record set behind it, e.g. "1.2M log lines".
 * @property {string} excerpt         What the record says, used as RCA evidence.
 * @property {'log' | 'metric' | 'change' | 'known-error'} [evidenceType]
 */

/**
 * @typedef {Object} SimilarIncident
 * @property {string} id
 * @property {string} title
 * @property {number} match       Similarity score, %.
 * @property {string} resolution  How it was resolved.
 * @property {string} resolvedIn  Time to resolve.
 */

/**
 * @typedef {Object} AmsIncident
 * @property {string} id               e.g. "INC-4471".
 * @property {string} title
 * @property {string} service          Affected service.
 * @property {string} portfolio
 * @property {string} severity         "P1" … "P4".
 * @property {string} clusterId        Recurring cluster the incident belongs to.
 * @property {string} problemRecordId  Linked problem record.
 * @property {string} team             Resolver group.
 * @property {number} usersAffected    At detection.
 * @property {number} impactPerHourK   Business impact at detection, € thousand per hour.
 * @property {string} impactDescription What the business feels.
 * @property {number} openedMinutesAgo Age of the incident when demo data is created.
 * @property {string} rootCause        Plain-words root cause.
 * @property {string} fix              One-sentence recommended fix.
 * @property {{ service: KnowledgeRecord, change: KnowledgeRecord, telemetry: KnowledgeRecord[],
 *   knownError: KnowledgeRecord, runbook: KnowledgeRecord, similar: SimilarIncident[] }} knowledge
 */

/** Incident-specific detail, keyed by cluster id. */
const DETAIL_BY_CLUSTER = {
  'CLUSTER-881': {
    team: 'AMS L2 Telematics',
    usersAffected: 18400,
    impactPerHourK: 42,
    impactDescription: 'Delayed eCall and vehicle telemetry in the EU',
    openedMinutesAgo: 38,
    rootCause: 'Kafka partitions are unevenly spread across consumers, so during the EU morning heartbeat burst a few consumers fall behind and trigger a rebalance storm.',
    fix: 'Scale the consumer group to 12 pods and switch to the sticky partition assignor delivered in CR-8921.',
    knowledge: {
      service: { recordId: 'CI-OTC-BROKER', label: 'Order-to-Cash Telematics Broker', system: 'CMDB', knowledgeSource: 'CMDB', count: '42 related CIs', excerpt: 'Tier 1 service; 6 consumer pods; owner AMS L2 Telematics.' },
      change: { recordId: 'CR-8921', label: 'Consumer rebalance configuration', system: 'ServiceNow Change', knowledgeSource: 'ServiceNow ITSM', count: '3 linked changes', excerpt: 'Normal change: sticky assignor + max.poll tuning, scheduled Sprint 43.', evidenceType: 'change' },
      telemetry: [
        { recordId: 'SPL-881-A', label: 'Consumer rebalance errors', system: 'Splunk', knowledgeSource: 'Log platform (Splunk / Datadog)', count: '1.2M log lines', excerpt: '"Rebalance in progress… member vehicle-consumer-4 left the group" ×3,412 in 20 min.', evidenceType: 'log' },
        { recordId: 'DT-881-B', label: 'Consumer lag on vehicle.telemetry', system: 'Dynatrace', knowledgeSource: 'APM (Dynatrace)', count: '38 anomalies', excerpt: 'Lag peaked at 142k messages on partition 4 at 08:05 CET.', evidenceType: 'metric' }
      ],
      knownError: { recordId: 'KE-2231', label: 'Kafka rebalance storm under burst load', system: 'Known-error database', knowledgeSource: 'Known-error database', count: '14 linked incidents', excerpt: 'Workaround: scale consumers and pin partition assignment until the config change lands.', evidenceType: 'known-error' },
      runbook: { recordId: 'RB-KAFKA-07', label: 'Consumer auto-scale & partition rebalance', system: 'Runbook library', knowledgeSource: 'Runbook library', count: '6 steps', excerpt: 'Scale HPA to 12, trigger cooperative rebalance, verify lag < 10k.' },
      similar: [
        { id: 'INC-3988', title: 'Consumer lag on vehicle.telemetry (August)', match: 94, resolution: 'Scaled consumers to 12 and pinned partition assignment', resolvedIn: '38 min' },
        { id: 'INC-3710', title: 'Rebalance loop after broker patch', match: 81, resolution: 'Rolled back the broker configuration', resolvedIn: '1 h 12 min' }
      ]
    }
  },
  'CLUSTER-882': {
    team: 'AMS Commercial Platforms',
    usersAffected: 2300,
    impactPerHourK: 18,
    impactDescription: 'Dealers cannot invoice or look up parts',
    openedMinutesAgo: 95,
    rootCause: 'Release 2.4.1 of the dealer batch inventory sync opens HTTP client sessions and never closes them, so the OData gateway connection pool runs dry.',
    fix: 'Roll back release 2.4.1 of the dealer batch sync and apply the connection-pool fix from CR-8914.',
    knowledge: {
      service: { recordId: 'CI-DEALER-API', label: 'Dealer Invoicing & Part Catalog API', system: 'CMDB', knowledgeSource: 'CMDB', count: '27 related CIs', excerpt: 'Tier 1 service behind the SAP S/4HANA OData gateway.' },
      change: { recordId: 'CR-8914', label: 'HikariCP connection-pool upgrade', system: 'ServiceNow Change', knowledgeSource: 'ServiceNow ITSM', count: '2 linked changes', excerpt: 'Release 2.4.1 deployed 2 days ago; CR-8914 fixes session closing.', evidenceType: 'change' },
      telemetry: [
        { recordId: 'DD-882-A', label: 'Connection pool saturation', system: 'Datadog', knowledgeSource: 'Log platform (Splunk / Datadog)', count: '4 monitors firing', excerpt: 'Active connections 200/200 for 43 min; wait time p95 9.8 s.', evidenceType: 'metric' },
        { recordId: 'SPL-882-B', label: 'Gateway timeout errors', system: 'Splunk', knowledgeSource: 'Log platform (Splunk / Datadog)', count: '86k log lines', excerpt: '"Connection is not available, request timed out after 30000ms" from batch-sync.', evidenceType: 'log' }
      ],
      knownError: { recordId: 'KE-1987', label: 'HTTP sessions not released in batch sync', system: 'Known-error database', knowledgeSource: 'Known-error database', count: '8 linked incidents', excerpt: 'Workaround: recycle gateway pods; permanent fix needs the pool patch.', evidenceType: 'known-error' },
      runbook: { recordId: 'RB-SAP-03', label: 'OData gateway pool recycle & rollback', system: 'Runbook library', knowledgeSource: 'Runbook library', count: '5 steps', excerpt: 'Drain gateway, roll back batch-sync, recycle pool, verify invoices flow.' },
      similar: [
        { id: 'INC-3902', title: 'Dealer invoicing timeouts after sync release', match: 91, resolution: 'Rolled back the sync release and recycled gateway pods', resolvedIn: '52 min' },
        { id: 'INC-3655', title: 'Parts catalog API pool exhaustion', match: 76, resolution: 'Raised pool size temporarily', resolvedIn: '1 h 40 min' }
      ]
    }
  },
  'CLUSTER-883': {
    team: 'AMS Edge Telemetry Ops',
    usersAffected: 9600,
    impactPerHourK: 6,
    impactDescription: 'Gaps in fleet GPS positions',
    openedMinutesAgo: 12,
    rootCause: 'When a region\'s 4G network reconnects, thousands of vehicles resend at once and overflow the UDP receive buffers on the edge ingest nodes.',
    fix: 'Raise the UDP receive buffer on the edge ingest nodes and keep the load shedder on until CR-8902 lands.',
    knowledge: {
      service: { recordId: 'CI-FLEET-EDGE', label: 'Fleet Edge Telemetry Pipeline', system: 'CMDB', knowledgeSource: 'CMDB', count: '64 related CIs', excerpt: 'Tier 2 service; 18 edge ingest nodes across 3 regions.' },
      change: { recordId: 'CR-8902', label: 'UDP buffer kernel auto-tune', system: 'ServiceNow Change', knowledgeSource: 'ServiceNow ITSM', count: '1 linked change', excerpt: 'Pending architectural sizing.', evidenceType: 'change' },
      telemetry: [
        { recordId: 'K8S-883-A', label: 'UDP receive buffer overflow events', system: 'Kubernetes', knowledgeSource: 'Kubernetes events', count: '2,140 events', excerpt: '"udp: receive buffer errors" on edge-ingest-07..12 after reconnect.', evidenceType: 'log' },
        { recordId: 'DT-883-B', label: 'GPS packet loss', system: 'Dynatrace', knowledgeSource: 'APM (Dynatrace)', count: '19 anomalies', excerpt: 'Packet loss 6.2% for 9 minutes in the Iberia region.', evidenceType: 'metric' }
      ],
      knownError: { recordId: 'KE-2109', label: 'UDP buffer saturation on reconnect surges', system: 'Known-error database', knowledgeSource: 'Known-error database', count: '19 linked incidents', excerpt: 'Workaround: enable load shedding and raise rmem limits.', evidenceType: 'known-error' },
      runbook: { recordId: 'RB-EDGE-02', label: 'Edge ingest load shedding', system: 'Runbook library', knowledgeSource: 'Runbook library', count: '4 steps', excerpt: 'Enable shedder, raise net.core.rmem_max, verify loss < 1%.' },
      similar: [
        { id: 'INC-3950', title: 'GPS drops after regional reconnect', match: 88, resolution: 'Raised rmem_max and enabled load shedding', resolvedIn: '25 min' }
      ]
    }
  },
  'CLUSTER-884': {
    team: 'AMS Digital Identity',
    usersAffected: 5200,
    impactPerHourK: 3,
    impactDescription: 'Mobile app logins fail intermittently',
    openedMinutesAgo: 180,
    rootCause: 'All cached token entries expire at the same moment when the revocation list refreshes, so every login hits Redis at once and the cache thrashes.',
    fix: 'Add ±10% jitter to token-cache expiry and move validation reads to Redis read replicas (CR-8898).',
    knowledge: {
      service: { recordId: 'CI-MOBILE-IDP', label: 'Customer Mobile Identity Gateway', system: 'CMDB', knowledgeSource: 'CMDB', count: '19 related CIs', excerpt: 'Tier 1 service; Redis cluster with 3 primaries.' },
      change: { recordId: 'CR-8898', label: 'Token-cache TTL jitter & read replicas', system: 'ServiceNow Change', knowledgeSource: 'ServiceNow ITSM', count: '1 linked change', excerpt: 'Proposed change awaiting CAB.', evidenceType: 'change' },
      telemetry: [
        { recordId: 'DD-884-A', label: 'Redis evictions spike', system: 'Datadog', knowledgeSource: 'Log platform (Splunk / Datadog)', count: '12 monitors', excerpt: 'Evictions ×40 at each revocation refresh (every 15 min).', evidenceType: 'metric' },
        { recordId: 'SPL-884-B', label: 'Token validation failures', system: 'Splunk', knowledgeSource: 'Log platform (Splunk / Datadog)', count: '31k log lines', excerpt: '"JWT validation cache miss — upstream timeout" bursts every 15 min.', evidenceType: 'log' }
      ],
      knownError: { recordId: 'KE-1874', label: 'Synchronised TTL expiry on revocation list', system: 'Known-error database', knowledgeSource: 'Known-error database', count: '6 linked incidents', excerpt: 'Workaround: stagger TTLs via config hotfix.', evidenceType: 'known-error' },
      runbook: { recordId: 'RB-REDIS-05', label: 'Redis read-replica failover', system: 'Runbook library', knowledgeSource: 'Runbook library', count: '5 steps', excerpt: 'Add replicas, switch reads, apply TTL jitter, verify hit ratio.' },
      similar: [
        { id: 'INC-3801', title: 'Login failures at revocation refresh', match: 86, resolution: 'Hotfixed TTL jitter in config', resolvedIn: '41 min' }
      ]
    }
  }
};

/** @type {ReadonlyArray<AmsIncident>} */
export const AMS_INCIDENTS = Object.freeze(amsDashboardData.recurringClusters.map((cluster, index) => ({
  id: `INC-${4471 + index}`,
  title: cluster.title,
  service: cluster.affectedService,
  portfolio: cluster.portfolio,
  severity: SEVERITY_BY_IMPACT[cluster.impactLevel] ?? 'P3',
  clusterId: cluster.id,
  problemRecordId: cluster.problemTicketCreated,
  ...DETAIL_BY_CLUSTER[cluster.id]
})));

/**
 * @param {string} incidentId
 * @returns {AmsIncident | undefined}
 */
export function getIncident(incidentId) {
  return AMS_INCIDENTS.find((incident) => incident.id === incidentId);
}

/**
 * The incident raised from a recurring cluster.
 *
 * @param {string} clusterId
 * @returns {AmsIncident | undefined}
 */
export function getIncidentForCluster(clusterId) {
  return AMS_INCIDENTS.find((incident) => incident.clusterId === clusterId);
}

/**
 * Evidence behind an incident's root cause: its logs, metrics, change record
 * and known error (F5).
 *
 * @param {AmsIncident} incident
 * @returns {KnowledgeRecord[]}
 */
export function getIncidentEvidence(incident) {
  const { telemetry, change, knownError } = incident.knowledge;
  return [...telemetry, change, knownError];
}
