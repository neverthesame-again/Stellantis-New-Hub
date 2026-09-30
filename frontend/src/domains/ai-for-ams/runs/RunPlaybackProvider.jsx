/**
 * @file Run playback — starts harness (F3) and workflow (F9) runs and animates them.
 *
 * Mounted once by the AMS domain router, so a run keeps playing while the user
 * moves between AMS pages, and any page (the Harness, the playground, the Ops
 * Studio execute bar) can start one. The run script is built up front by the
 * model; this provider only reveals its steps over time and then tells the
 * store that playback reached the first stop, where the store decides whether
 * the run passed, failed or waits for approval.
 *
 * One run plays at a time.
 */

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAmsStudio } from '../state/useAmsStudio';
import { isHarnessEligible } from '../model/agentLifecycle';
import { buildHarnessRun } from '../model/harnessPipeline';
import { getIncident } from '../model/incidents';
import { findPlaybackStop } from '../model/runModel';
import { buildWorkflowRun, validateWorkflow } from '../model/workflowModel';
import { createSeed } from '../utils/random';
import { RunPlaybackContext } from './runPlaybackContext';

/** Playback speed relative to each step's recorded duration. */
const PLAYBACK_SPEED = 0.6;

const wait = (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); });

/**
 * Provides run playback to every AMS page.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function RunPlaybackProvider({ children }) {
  const { state, actions } = useAmsStudio();
  const [playback, setPlayback] = useState(null);
  const activeRunId = useRef(null);
  const stateRef = useRef(state);

  useLayoutEffect(() => {
    stateRef.current = state;
  });

  /**
   * Stores the run, reveals its steps up to the first stop, then hands over to the store.
   *
   * @param {import('../model/runModel').AmsRun} run
   */
  const play = useCallback(async (run) => {
    activeRunId.current = run.id;
    actions.startRun(run);
    setPlayback({ runId: run.id, revealed: 0 });

    const { index: lastIndex } = findPlaybackStop(run, 0);
    for (let index = 0; index <= lastIndex; index += 1) {
      await wait(run.steps[index].durationMs * PLAYBACK_SPEED);
      setPlayback({ runId: run.id, revealed: index + 1 });
    }

    actions.completeRunPlayback(run.id);
    activeRunId.current = null;
    setPlayback(null);
  }, [actions]);

  const startHarnessRun = useCallback((agentId, task) => {
    const current = stateRef.current;
    const agent = current.studioAgents.find((candidate) => candidate.id === agentId);
    if (activeRunId.current || !agent || !isHarnessEligible(agent) || !task?.trim()) return null;

    const run = buildHarnessRun({
      id: actions.nextRunId(),
      agent,
      task: task.trim(),
      skills: current.skills,
      workflows: current.workflows,
      peerAgents: current.studioAgents,
      seed: createSeed(),
      startedAt: new Date().toISOString()
    });
    play(run);
    return run.id;
  }, [actions, play]);

  const startWorkflowRun = useCallback((workflowId, incidentId) => {
    const current = stateRef.current;
    const workflow = current.workflows.find((candidate) => candidate.id === workflowId);
    const incident = getIncident(incidentId);
    const agentsById = Object.fromEntries(current.studioAgents.map((agent) => [agent.id, agent]));
    if (activeRunId.current || !workflow || !incident || !validateWorkflow(workflow, agentsById).isValid) return null;

    const run = buildWorkflowRun({
      id: actions.nextRunId(),
      workflow,
      incident,
      agentsById,
      seed: createSeed(),
      startedAt: new Date().toISOString()
    });
    play(run);
    return run.id;
  }, [actions, play]);

  const value = useMemo(() => ({
    playback,
    isBusy: playback !== null,
    startHarnessRun,
    startWorkflowRun,
    getRevealedCount: (runId) => (playback?.runId === runId ? playback.revealed : null)
  }), [playback, startHarnessRun, startWorkflowRun]);

  return <RunPlaybackContext.Provider value={value}>{children}</RunPlaybackContext.Provider>;
}
