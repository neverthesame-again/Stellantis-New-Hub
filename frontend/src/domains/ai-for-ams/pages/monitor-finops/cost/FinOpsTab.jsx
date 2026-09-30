import React, { useEffect, useMemo, useRef } from 'react';
import { Lightbulb, TriangleAlert } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { getAreaLabel } from '../../../model/agentOptions';
import { formatUsd, getFinOpsSummary } from '../../../model/finopsModel';
import { getProgrammeScope } from '../../../model/opsOverview';
import { useNow } from '../../../utils/useNow';
import EmptyState from '../../../components/EmptyState';
import PromptRules from './PromptRules';
import SpendBars from './SpendBars';
import SpendBurnChart from './SpendBurnChart';

/**
 * FinOps for AI in AMS (F10): spend KPIs, daily burn with forecast against the
 * cap, spend by area and by model, per-agent cost, cost alerts, prompt rules,
 * and the link between AI spend and the dashboard's cost per ticket.
 *
 * @param {Object} props
 * @param {string | null} props.highlightAgentId Agent whose cost row to highlight (from an agent card).
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function FinOpsTab({ highlightAgentId, showToast }) {
  const { state } = useAmsStudio();
  const now = useNow(60_000);
  const scope = getProgrammeScope(state);
  const summary = useMemo(() => getFinOpsSummary(state, now, scope.agentIds), [state, now, scope.agentIds]);
  const highlightRef = useRef(null);

  useEffect(() => {
    highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightAgentId]);

  const kpis = [
    { label: 'Month-to-date spend', value: formatUsd(summary.mtdSpend), hint: `Day ${summary.dayOfMonth} of ${summary.daysInMonth}` },
    { label: 'Token volume', value: `${summary.tokensMtdM.toFixed(1)}M`, hint: 'Tokens this month' },
    { label: 'Budget used', value: `${Math.round(summary.budgetUsedPct)}%`, hint: `of ${formatUsd(summary.cap)} cap` },
    { label: 'Cost per 1M tokens', value: formatUsd(summary.costPerMillion), hint: 'After caching' },
    { label: 'Cache savings', value: formatUsd(summary.cacheSavings), hint: 'vs list price' },
    { label: 'Efficiency index', value: `${summary.efficiencyIndex}/100`, hint: 'Spend not flagged as avoidable' }
  ];
  const overCap = summary.forecast > summary.cap;

  if (summary.perAgent.length === 0) {
    return <EmptyState message="No agents in this programme are running yet, so there is no AI spend to show." />;
  }

  return (
    <div className="ams-page">
      {scope.programme && <p className="ams-muted-note">Showing spend for the “{scope.programme.name}” programme.</p>}

      <div className="ams-kpi-row">
        {kpis.map(({ label, value, hint }) => (
          <div key={label} className="st-card ams-kpi">
            <span className="ams-kpi-label">{label}</span>
            <span className="ams-kpi-value">{value}</span>
            <span className="ams-muted-note">{hint}</span>
          </div>
        ))}
      </div>

      <div className="ams-callout is-info" role="note">
        <Lightbulb size={16} aria-hidden="true" />
        <span>
          AI spend works out at <strong>{formatUsd(summary.aiCostPerTicket)} per ticket</strong> this month — part of the dashboard's{' '}
          <strong>{summary.costPerTicket}</strong> cost per ticket (down from {summary.baselineCostPerTicket} before AI).
        </span>
      </div>

      <section className="st-card ams-card" aria-label="Daily burn">
        <SpendBurnChart days={summary.days} dayOfMonth={summary.dayOfMonth} cap={summary.cap} monthLabel={summary.monthLabel} />
        <p className={`ams-callout ${overCap ? 'is-warning' : 'is-success'}`} role="status">
          {overCap ? <TriangleAlert size={16} aria-hidden="true" /> : null}
          End-of-month forecast {formatUsd(summary.forecast)} — {overCap
            ? `${formatUsd(summary.forecast - summary.cap)} over the cap. Apply the cost alerts below.`
            : `${formatUsd(summary.cap - summary.forecast)} under the cap.`}
        </p>
      </section>

      <div className="ams-detail-columns">
        <section className="st-card ams-card"><SpendBars title="Spend by AMS area" rows={summary.byArea} /></section>
        <section className="st-card ams-card"><SpendBars title="Spend by model" rows={summary.byModel} /></section>
      </div>

      <section className="st-card ams-card" aria-labelledby="ams-cost-alerts-title">
        <h3 id="ams-cost-alerts-title" className="ams-card-title">Cost alerts</h3>
        {summary.alerts.length === 0 ? (
          <p className="ams-muted-note">No avoidable spend detected.</p>
        ) : (
          <ul className="ams-alert-list">
            {summary.alerts.map((alert) => (
              <li key={alert.id} className="ams-alert">
                <div className="ams-alert-head">
                  <TriangleAlert size={15} aria-hidden="true" />
                  <strong>{alert.agentName}</strong>
                  <span className="st-badge badge-high">+{formatUsd(alert.extraCost)} this month</span>
                </div>
                <p><strong>Why:</strong> {alert.reason}</p>
                <p><strong>Avoid:</strong> {alert.avoid}</p>
                <p><strong>Fix:</strong> {alert.fix}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="st-card ams-card" aria-labelledby="ams-agent-cost-title">
        <h3 id="ams-agent-cost-title" className="ams-card-title">Cost by agent</h3>
        <div className="ams-table-wrap">
          <table className="ams-table">
            <thead>
              <tr>
                <th scope="col">Agent</th><th scope="col">Area</th><th scope="col">Model</th>
                <th scope="col">Tokens (MTD)</th><th scope="col">Cache hit</th><th scope="col" className="is-right">Spend (MTD)</th>
              </tr>
            </thead>
            <tbody>
              {summary.perAgent.map(({ agent, usage, spendMtd, tokensMtdM }) => {
                const highlighted = agent.id === highlightAgentId;
                return (
                  <tr key={agent.id} ref={highlighted ? highlightRef : undefined} className={highlighted ? 'is-selected' : undefined}>
                    <td className="is-strong">{agent.name}</td>
                    <td>{getAreaLabel(agent.area)}</td>
                    <td>{usage.model}</td>
                    <td>{tokensMtdM.toFixed(1)}M</td>
                    <td>{Math.round(usage.cacheHitRate * 100)}%</td>
                    <td className="is-right is-strong">{formatUsd(spendMtd)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="ams-muted-note">Estimated from each agent's stage, tier, model, prompt context and runs — the PoC has no billing feed.</p>
      </section>

      <PromptRules showToast={showToast} />
    </div>
  );
}
