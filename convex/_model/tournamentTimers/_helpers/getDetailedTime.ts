import { Doc } from '../../../_generated/dataModel';

type RoundStructure = {
  pairingTime: number;
  setUpTime: number;
  playingTime: number;
};

type Phase = 'pairing' | 'setUp' | 'playing' | null;

export const getDetailedTime = (timer: Doc<'tournamentTimers'>, roundStructure: RoundStructure): {
  currentPhase: Phase;
  elapsed: number;
  remaining: number;
  remainingInPhase: number;
} => {

  // Convert the round structure to milliseconds
  const roundStructureMs = Object.entries(roundStructure).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value * 60000,
  }), {} as { [key: string]: number });

  const totalTime = Object.values(roundStructureMs).reduce((acc, value) => acc + value, 0);

  const now = Date.now();
  const elapsed = timer.startedAt ? ((timer.pausedAt ?? now) - timer.startedAt) - timer.pauseTime : 0;
  const remaining = totalTime - elapsed;

  let currentPhase: Phase = null;
  let remainingInPhase = 0;

  const { pairingTime, setUpTime } = roundStructureMs;
  if (elapsed < pairingTime) {
    currentPhase = 'pairing';
    remainingInPhase = pairingTime - elapsed;
  } else if (elapsed < pairingTime + setUpTime) {
    currentPhase = 'setUp';
    remainingInPhase = pairingTime + setUpTime - elapsed;
  } else if (elapsed < totalTime) {
    currentPhase = 'playing';
    remainingInPhase = totalTime - elapsed;
  } else {
    currentPhase = null;
    remainingInPhase = 0;
  }

  return {
    currentPhase,
    elapsed,
    remaining,
    remainingInPhase,
  };
};
