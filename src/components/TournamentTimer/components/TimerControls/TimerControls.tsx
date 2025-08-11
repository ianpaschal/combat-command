import { getTournamentRoundPhaseDisplayName, TournamentRoundPhase } from '@ianpaschal/combat-command-static-data/common';
import clsx from 'clsx';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Undo,
} from 'lucide-react';

import { TournamentTimer } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useSetTournamentTimerPhase, useToggleTournamentTimer } from '~/services/tournamentTimers';
import { getCurrentPhase } from '../../TournamentTimer.utils';

import styles from '../../TournamentTimer.module.scss';

const confirmSetPhaseDialogId = 'confirm-set-phase';
const confirmRepeatPhaseDialogId = 'confirm-repeat-phase';

export interface TimerControlsProps {
  className?: string;
  timer: TournamentTimer | null;
}

export const TimerControls = ({
  className,
  timer,
}: TimerControlsProps): JSX.Element | null => {
  const user = useAuth();
  const { organizerUserIds, roundStructure } = useTournament();

  const { open: openConfirmSetPhaseDialog } = useConfirmationDialog(confirmSetPhaseDialogId);
  const { open: openConfirmRepeatPhaseDialog } = useConfirmationDialog(confirmRepeatPhaseDialogId);

  const { mutation: toggleTimer } = useToggleTournamentTimer({
    onSuccess: (paused) => {
      if (paused) {
        toast.success('Timer stopped!');
      } else {
        toast.success('Timer started!');
      }
    },
  });
  const { mutation: setTimerPhase } = useSetTournamentTimerPhase();

  if (!user || !organizerUserIds.includes(user._id)) {
    return null;
  }

  if (!timer) {
    return <>Loading...</>;
  }

  const currentPhase = getCurrentPhase(timer.elapsed, roundStructure);

  const handleJumpToPhase = (phase: TournamentRoundPhase): void => openConfirmSetPhaseDialog({
    title: `Confirm Jump to ${getTournamentRoundPhaseDisplayName(phase)} Phase`,
    description: `Are you sure you want to skip to ${getTournamentRoundPhaseDisplayName(phase)?.toLocaleLowerCase()}? This can not be undone!`,
    onConfirm: () => setTimerPhase({ id: timer._id, phase }),
  });

  const handleClickResetButton = (): void => {
    handleJumpToPhase(roundStructure.pairingTime ? TournamentRoundPhase.Pairing : TournamentRoundPhase.SetUp);
  };

  const handleClickLastPhaseButton = (): void => {
    if (currentPhase === TournamentRoundPhase.Completed) {
      handleJumpToPhase(TournamentRoundPhase.Playing);
    }
    if (currentPhase === TournamentRoundPhase.Playing) {
      handleJumpToPhase(TournamentRoundPhase.SetUp);
    }
    if (currentPhase === TournamentRoundPhase.SetUp && roundStructure.pairingTime) {
      handleJumpToPhase(TournamentRoundPhase.Pairing);
    }
  };

  const handleClickResetPhaseButton = (): void => {
    if (currentPhase) {
      openConfirmRepeatPhaseDialog({
        onConfirm: () => setTimerPhase({ id: timer._id, phase: currentPhase }),
      });
    }
  };

  const handleClickPlayButton = (): void => {
    toggleTimer({ id: timer._id });
  };

  const handleClickNextPhaseButton = (): void => {
    if (currentPhase === TournamentRoundPhase.Pairing) {
      handleJumpToPhase(TournamentRoundPhase.SetUp);
    }
    if (currentPhase === TournamentRoundPhase.SetUp) {
      handleJumpToPhase(TournamentRoundPhase.Playing);
    }
    if (currentPhase === TournamentRoundPhase.Playing) {
      handleJumpToPhase(TournamentRoundPhase.Completed);
    }
  };

  const handleClickJumpToEndButton = (): void => {
    handleJumpToPhase(TournamentRoundPhase.Completed);
  };

  const isStartPhase = currentPhase === TournamentRoundPhase.Pairing || (currentPhase === TournamentRoundPhase.SetUp && !roundStructure.pairingTime);
  const isEndPhase = currentPhase === TournamentRoundPhase.Completed;

  return (
    <>
      <div className={clsx(styles.TournamentTimer_Controls, className)}>
        <Button variant="ghost" size="small" onClick={handleClickResetButton} disabled={isStartPhase}>
          <ChevronFirst />
        </Button>
        <Button variant="ghost" size="small" onClick={handleClickLastPhaseButton} disabled={isStartPhase}>
          <ChevronLeft />
        </Button>
        <Button variant="ghost" size="small" onClick={handleClickResetPhaseButton} disabled={isEndPhase}>
          <Undo />
        </Button>
        <Button variant={timer.pausedAt ? 'primary' : 'ghost'} size="small" onClick={handleClickPlayButton} disabled={isEndPhase}>
          {timer.pausedAt ? <Play /> : <Pause />}
        </Button>
        <Button variant="ghost" size="small" onClick={handleClickNextPhaseButton} disabled={isEndPhase}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="small" onClick={handleClickJumpToEndButton} disabled={isEndPhase}>
          <ChevronLast />
        </Button>
      </div>
      <ConfirmationDialog id={confirmSetPhaseDialogId} title="Confirm Jump to Phase" />
      <ConfirmationDialog
        id={confirmRepeatPhaseDialogId}
        title={`Confirm Repeat ${getTournamentRoundPhaseDisplayName(currentPhase)} Phase`}
        description={`Are you sure you want to reset the timer to the beginning of ${getTournamentRoundPhaseDisplayName(currentPhase)?.toLocaleLowerCase()}? This can not be undone!`}
      />
    </>
  );
};
