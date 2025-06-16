import { ReactElement } from 'react';
import { format } from 'date-fns';

import {
  convertRoundStructureToMs,
  TournamentPhase,
  TournamentRoundStructure,
  TournamentTimer,
} from '~/api';

import styles from './TournamentTimer.module.scss';

export const phaseLabels: Record<TournamentPhase, string> = {
  setUp: 'Set-Up',
  pairing: 'Pairing',
  playing: 'Playing',
  completed: 'Completed',
} as const;

export const getRemainingTimeElements = (duration: number | null): ReactElement[] => {
  if (duration === null) {
    return [];
  }
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const spacer = <span className={styles.TournamentTimer_TimeRemaining_Spacer}>:</span>;
  const createDigits = (key: 'h' | 'm' | 's', n: number, pad: number = 2): ReactElement[] => (
    n.toString().padStart(pad, '0').split('').map((digit, i) => (
      <span key={`${key}_${i}`} className={styles.TournamentTimer_TimeRemaining_Digit}>{digit}</span>
    ))
  );
  const hourDigits = [
    ...createDigits('h', hours, 1),
    spacer,
  ];
  const minuteDigits = [
    ...createDigits('m', minutes),
    spacer,
  ];
  const secondDigits = createDigits('s', seconds);
  return [
    ...hourDigits,
    ...minuteDigits,
    ...secondDigits,
  ];
};

export const getCurrentPhase = (
  elapsed: number,
  structure: TournamentRoundStructure,
): TournamentPhase => {
  const roundStructureMs = convertRoundStructureToMs(structure);
  if (elapsed < roundStructureMs.pairingTime) {
    return 'pairing';
  }
  if (elapsed < roundStructureMs.pairingTime + roundStructureMs.setUpTime) {
    return 'setUp';
  }
  if (elapsed < roundStructureMs.pairingTime + roundStructureMs.setUpTime + roundStructureMs.playingTime) {
    return 'playing';
  }
  return 'completed';
};

export const getCurrentPhaseTimeRemaining = (
  elapsed: number,
  structure: TournamentRoundStructure,
): number => {
  const roundStructureMs = convertRoundStructureToMs(structure);
  const playingEndTime = roundStructureMs.playingTime + roundStructureMs.setUpTime + roundStructureMs.pairingTime;
  const setUpEndTime = roundStructureMs.setUpTime + roundStructureMs.pairingTime;
  const pairingEndTime = roundStructureMs.pairingTime;

  // Current phase is "completed":
  if (elapsed >= playingEndTime) {
    return 0;
  }

  // Current phase is "playing":
  if (elapsed >= setUpEndTime) {
    return Math.max(playingEndTime - elapsed, 0);
  }

  // Current phase is "setUp":
  if (elapsed >= pairingEndTime) {
    return Math.max(setUpEndTime - elapsed, 0);
  }

  // Current phase is "pairing":
  return Math.max(pairingEndTime - elapsed, 0);
};

export const getCurrentPhaseEndTime = (
  timer: TournamentTimer,
  structure: TournamentRoundStructure,
): string => {
  if (timer.startedAt === null || timer.pausedAt !== null) {
    return '--:--';
  }
  const remainingInPhase = getCurrentPhaseTimeRemaining(timer.elapsed, structure);
  if (remainingInPhase) {
    return format(new Date(Date.now() + remainingInPhase), 'HH:mm');
  }
  return '--:--';
};
