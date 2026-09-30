import React from 'react';
import { CircleCheck, FolderPlus } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import {
  PROGRAMME_STATUS,
  getProgrammeAgents,
  getProgrammeProgress,
  getProgrammeStatus
} from '../../model/programmeModel';
import { formatDate, pluralize } from '../../utils/formatters';
import { useNow } from '../../utils/useNow';

const STATUS_BADGE = {
  [PROGRAMME_STATUS.PLANNING]: 'badge-info',
  [PROGRAMME_STATUS.ON_TRACK]: 'badge-success',
  [PROGRAMME_STATUS.AT_RISK]: 'badge-high',
  [PROGRAMME_STATUS.COMPLETED]: 'badge-purple'
};

/**
 * Programme cards (F12): status, progress and linked agents; "Set active"
 * switches the programme that filters the studio.
 *
 * @param {Object} props
 * @param {() => void} props.onNewProgramme
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function ProgrammeSection({ onNewProgramme, showToast }) {
  const { state, actions } = useAmsStudio();
  const now = useNow(60_000);

  const activate = (programme) => {
    actions.activateProgramme(programme.id);
    showToast(`"${programme.name}" is now the active programme.`);
  };

  return (
    <section className="st-card ams-card" aria-labelledby="ams-programmes-title">
      <div className="ams-toolbar">
        <div>
          <h3 id="ams-programmes-title" className="ams-card-title">Programmes</h3>
          <p className="ams-card-subtitle">Group agents by service portfolio. The active programme filters the scorecard, agents, runs and runtime monitor.</p>
        </div>
        <button type="button" className="st-btn st-btn-outline" onClick={onNewProgramme}><FolderPlus size={14} /> New programme</button>
      </div>
      <div className="ams-grid">
        {state.programmes.map((programme) => {
          const status = getProgrammeStatus(programme, state.studioAgents, now);
          const progress = getProgrammeProgress(programme, state.studioAgents);
          const agents = getProgrammeAgents(programme, state.studioAgents);
          const active = programme.id === state.activeProgrammeId;
          return (
            <article key={programme.id} className={`st-card ams-card ${active ? 'is-selected' : ''}`}>
              <div className="ams-card-head">
                <span className="ams-card-id">{programme.id} · {programme.portfolio || 'No portfolio'}</span>
                <span className={`st-badge ${STATUS_BADGE[status]}`}>{status}</span>
              </div>
              <h4 className="ams-card-title">{programme.name}</h4>
              <p className="ams-card-text">{programme.description}</p>
              <div>
                <div className="ams-progress-label"><span>Progress</span><span className="ams-text-accent">{progress}%</span></div>
                <div className="ams-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`${programme.name} progress`}>
                  <div className="ams-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <p className="ams-muted-note">
                {pluralize(agents.length, 'agent')}{programme.targetDate ? ` · target ${formatDate(programme.targetDate)}` : ''}
                {programme.objective ? ` · ${programme.objective}` : ''}
              </p>
              <div className="ams-chip-list">
                {agents.map((agent) => <span key={agent.id} className="st-badge badge-info">{agent.name}</span>)}
              </div>
              <div className="ams-card-actions">
                {active
                  ? <span className="st-badge badge-success"><CircleCheck size={12} /> Active programme</span>
                  : <button type="button" className="st-btn st-btn-outline" onClick={() => activate(programme)}>Set active</button>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
