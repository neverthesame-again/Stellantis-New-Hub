import { useState } from 'react';
import { Sparkles, Flame, Timer, Radar, ShieldCheck, Gauge as GaugeIcon, ArrowRight, GitMerge, Crosshair, RefreshCw, ChevronRight, MessageSquareText } from 'lucide-react';
import { useApi, fmt, md, PRIORITY_COLOR, complianceTone } from '../lib.jsx';
import { Card, Kpi, Delta, RiskPill, SourceBadges, KevBadge, ComplianceCell, AiTag, LoadingGrid, ErrorState } from '../components/ui.jsx';
import { LineChart, StackedColumns, Legend, Gauge, Sparkline } from '../components/charts.jsx';

const GRADE_COLOR = { A: 'var(--good)', B: '#5bb85d', C: 'var(--warn)', D: 'var(--p2)', E: 'var(--p1)' };
const PKEYS = [
  { key: 'P4', label: 'P4 Routine', color: 'var(--p4)' },
  { key: 'P3', label: 'P3 Planned', color: 'var(--p3)' },
  { key: 'P2', label: 'P2 Urgent', color: 'var(--p2)' },
  { key: 'P1', label: 'P1 Act now', color: 'var(--p1)' },
];

export default function Overview({ company, setCompany, navigate, companies }) {
  const { data, loading, error, reload } = useApi('/overview', { company });
  const [metric, setMetric] = useState('exposure');
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading && !data) return <LoadingGrid />;
  const { kpis: k, trend, scorecard, priorityByCompany, topRisks, briefing } = data;
  const scopeName = company === 'all' ? 'SHV Group' : companies.find((c) => c.id === company)?.short;
  const band = k.exposureScore < 30 ? ['Low', 'var(--good)'] : k.exposureScore < 60 ? ['Medium', 'var(--warn)'] : ['High', 'var(--bad)'];
  const series = {
    exposure: { key: 'exposure', label: 'Exposure score', color: 'var(--accent)' },
    open: { key: 'open', label: 'Open findings', color: 'var(--accent)' },
    urgent: { key: 'urgent', label: 'Open P1 + P2', color: 'var(--p2)' },
  }[metric];

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="grid g-main">
        <Card className="ai-card">
          <div className="ai-head">
            <Sparkles size={15} className="sparkle" />AI executive briefing · {scopeName}
            <span className="sp" />
            <AiTag>Grounded on live data</AiTag>
            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={reload} title="Regenerate"><RefreshCw size={13} /></button>
          </div>
          <div className="ai-headline">{briefing.headline}</div>
          {briefing.paragraphs.slice(0, 3).map((p, i) => <p key={i} className="ai-p">{md(p)}</p>)}
          <div className="section-t" style={{ marginTop: 14 }}>Recommended next actions</div>
          {briefing.actions.map((a, i) => (
            <div className="action-row" key={i}>
              <span className="n">{i + 1}</span>
              <span style={{ flex: 1 }}>{a.text}</span>
              {a.cve && <button className="link-btn" onClick={() => navigate('vulnerabilities', { cve: a.cve })}>Open <ChevronRight size={13} /></button>}
              {a.link && <button className="link-btn" onClick={() => navigate(a.link)}>Review <ChevronRight size={13} /></button>}
            </div>
          ))}
          <div className="row mt">
            <button className="btn btn-ai" onClick={() => navigate('copilot', { q: 'Summarise for the board' })}><MessageSquareText size={14} />Ask a follow-up</button>
            <button className="btn" onClick={() => navigate('reports', { open: 'monthly' })}>Generate board report</button>
          </div>
        </Card>

        <Card title="Enterprise exposure score" sub="Risk-weighted open exposure, 0 (none) – 100 (severe)" icon={<GaugeIcon size={16} />}>
          <div style={{ display: 'grid', placeItems: 'center', marginTop: 4 }}>
            <Gauge value={k.exposureScore} prev={k.exposureScorePrev} />
            <div style={{ marginTop: -54, textAlign: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{k.exposureScore}</div>
              <div className="row" style={{ justifyContent: 'center', gap: 6, marginTop: 6 }}>
                <span className="badge" style={{ color: band[1], borderColor: band[1] }}>{band[0]} exposure</span>
                <Delta value={k.exposureScore - k.exposureScorePrev} unit=" pts" />
                <span className="muted" style={{ fontSize: 11.5 }}>vs 4 wks</span>
              </div>
            </div>
          </div>
          <div className="section-t">What drives it</div>
          <div className="col" style={{ gap: 8 }}>
            <Driver label="Open P1 + P2 findings" value={k.openP1 + k.openP2} color="var(--p1)" onClick={() => navigate('vulnerabilities', { priority: 'P1,P2' })} />
            <Driver label="Actively exploited (KEV) instances" value={k.kevOpen} color="var(--p2)" onClick={() => navigate('vulnerabilities', { kev: 'true' })} />
            <Driver label="Findings past SLA" value={k.breached} color="var(--p3)" onClick={() => navigate('remediation')} />
            <Driver label="Assets not assessed by any tool" value={k.coverage.none} color="var(--p4)" onClick={() => navigate('assets', { coverage: 'none' })} />
          </div>
        </Card>
      </div>

      <div className="grid g-6">
        <Kpi label="Open P1 + P2" icon={<Crosshair size={14} />} value={fmt.n(k.openP1 + k.openP2)} delta={k.openP1 + k.openP2 - k.openUrgentPrev} foot="vs 4 weeks ago"
          spark={<Sparkline values={trend.map((t) => t.urgent)} color="var(--p2)" />} onClick={() => navigate('vulnerabilities', { priority: 'P1,P2' })} />
        <Kpi label="Actively exploited" icon={<Flame size={14} />} value={fmt.n(k.kevOpen)} delta={k.kevOpen - k.kevOpenPrev} foot="KEV instances"
          spark={<Sparkline values={trend.map((t) => t.kev)} color="var(--p1)" />} onClick={() => navigate('vulnerabilities', { kev: 'true' })} />
        <Kpi label="SLA compliance" icon={<ShieldCheck size={14} />} value={k.slaCompliance} unit="%" foot={`${fmt.n(k.breached)} past due`}
          tone={complianceTone(k.slaCompliance) === 'bad' ? 'var(--bad)' : undefined} onClick={() => navigate('remediation')} />
        <Kpi label="Mean time to remediate" icon={<Timer size={14} />} value={k.mttr} unit=" d" delta={k.mttr - k.mttrPrev} deltaUnit=" d" foot="vs prior quarter" />
        <Kpi label="Mean time to identify" icon={<Radar size={14} />} value={k.mtti} unit=" d" foot={`Rapid7 alone: ${k.mttiR7} d`} onClick={() => navigate('correlation')} />
        <Kpi label="Asset coverage" icon={<ShieldCheck size={14} />} value={k.coverage.pct} unit="%" foot={`${k.coverage.none} blind spots · target 95%`}
          tone={k.coverage.pct < 95 ? 'var(--warn)' : undefined} onClick={() => navigate('assets')} />
      </div>

      <div className="grid g-main">
        <Card title="Exposure trend" sub="Last 13 weeks · computed from Rapid7 + Defender history"
          action={
            <div className="seg">
              {[['exposure', 'Score'], ['open', 'Open'], ['urgent', 'P1+P2']].map(([id, l]) => <button key={id} className={metric === id ? 'on' : ''} onClick={() => setMetric(id)}>{l}</button>)}
            </div>
          }>
          <LineChart data={trend} series={[series]} height={250} yMax={metric === 'exposure' ? 100 : undefined} annotations={[{ index: trend.length - 4, label: 'MDVM trial start' }]} />
        </Card>
        <Card title="Open findings by company" sub="Unified priority · click a company to scope the dashboard">
          <StackedColumns rows={priorityByCompany.map((r) => ({ ...r, label: r.name }))} keys={PKEYS} height={228} onClick={(r) => setCompany(r.id)} />
          <div className="mt-s"><Legend items={[...PKEYS].reverse()} /></div>
        </Card>
      </div>

      <Card title="Group company scorecard" sub="Same scoring, same SLA, every company — click to drill in" flush>
        <div className="table-wrap">
          <table className="t">
            <thead>
              <tr><th>Company</th><th>Grade</th><th className="r">Exposure</th><th>12-wk trend</th><th className="r">P1+P2</th><th className="r">KEV</th><th>SLA</th><th className="r">MTTR</th><th className="r">Coverage</th></tr>
            </thead>
            <tbody>
              {scorecard.map((s) => (
                <tr key={s.id} className={`click ${company === s.id ? 'sel' : ''}`} onClick={() => setCompany(company === s.id ? 'all' : s.id)}>
                  <td><div style={{ fontWeight: 600 }}>{s.short}</div><div className="muted" style={{ fontSize: 11 }}>{s.sector}</div></td>
                  <td><span className="grade" style={{ background: GRADE_COLOR[s.grade] }}>{s.grade}</span></td>
                  <td className="r num"><b>{s.exposureScore}</b> <Delta value={s.exposureDelta} /></td>
                  <td><Sparkline values={s.spark} color={s.exposureDelta <= 0 ? 'var(--good)' : 'var(--bad)'} /></td>
                  <td className="r num">{s.openP1 + s.openP2}</td>
                  <td className="r num">{s.kevOpen}</td>
                  <td><ComplianceCell value={s.slaCompliance} /></td>
                  <td className="r num">{s.mttr} d</td>
                  <td className="r num" style={{ color: s.coverage < 95 ? 'var(--warn)' : undefined }}>{s.coverage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid g-main">
        <Card title="Fix these first" sub="Highest priority, largest share of exposure" action={<button className="link-btn" onClick={() => navigate('vulnerabilities')}>All <ArrowRight size={13} /></button>}>
          <div className="col" style={{ gap: 4 }}>
            {topRisks.map((t) => (
              <button key={t.cve} className="task" style={{ alignItems: 'center', padding: '8px 6px' }} onClick={() => navigate('vulnerabilities', { cve: t.cve })}>
                <RiskPill risk={t.maxRisk} showPriority={false} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="row" style={{ gap: 6 }}><span className="mono" style={{ fontWeight: 600, color: 'var(--text)' }}>{t.cve}</span>{t.kev && <KevBadge />}</span>
                  <span style={{ display: 'block', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                </span>
                <span style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontWeight: 700, color: 'var(--text)' }}>{t.assets} assets</span>
                  <SourceBadges sources={t.sources} />
                </span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="The correlation dividend" sub="What a single source of truth gives you, measured on today's data" icon={<GitMerge size={16} />}
          action={<button className="link-btn" onClick={() => navigate('correlation')}>How it works <ArrowRight size={13} /></button>}>
          <div className="grid g-2" style={{ gap: 22 }}>
            <Dividend label="Raw findings from both tools" value={fmt.n(k.rawFindings)} note="Rapid7 + Defender exports" />
            <Dividend label="Unified findings" value={fmt.n(k.unifiedFindings)} note={`${fmt.n(k.duplicatesRemoved)} duplicates removed automatically`} color="var(--both)" />
            <Dividend label="Time to identify" value={`${k.mttiR7} → ${k.mtti} d`} note="Rapid7 scan cycle vs continuous Defender signal" color="var(--accent)" />
            <Dividend label="Report consolidation" value="4 days → 5 min" note="Manual spreadsheet merge replaced" color="var(--ai)" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Driver({ label, value, color, onClick }) {
  return (
    <button className="task" style={{ alignItems: 'center', padding: '6px 6px' }} onClick={onClick}>
      <span style={{ width: 4, height: 22, borderRadius: 4, background: color }} />
      <span style={{ flex: 1 }}>{label}</span>
      <b className="num" style={{ color: 'var(--text)' }}>{fmt.n(value)}</b>
      <ChevronRight size={14} className="muted" />
    </button>
  );
}

function Dividend({ label, value, note, color = 'var(--text)' }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12 }}>
      <div className="muted" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '2px 0' }}>{value}</div>
      <div className="text-2" style={{ fontSize: 12 }}>{note}</div>
    </div>
  );
}
