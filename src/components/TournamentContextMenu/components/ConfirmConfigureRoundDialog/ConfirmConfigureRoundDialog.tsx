import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useMemo,
} from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { PATHS } from '~/settings';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { getWarnings, sortCompetitorsByActive } from './ConfirmConfigureRoundDialog.utils';

import styles from './ConfirmConfigureRoundDialog.module.scss';

export interface ConfirmConfigureRoundDialogProps {
  className?: string;
}

export interface ConfirmConfigureRoundDialogHandle {
  open: () => void;
}

export const ConfirmConfigureRoundDialog = forwardRef<ConfirmConfigureRoundDialogHandle, ConfirmConfigureRoundDialogProps>(({
  className,
}: ConfirmConfigureRoundDialogProps, ref): JSX.Element => {
  const tournament = useTournament();
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId: tournament._id,
  });
  const navigate = useNavigate();
  const { id, open } = useConfirmationDialog();
  const proceed = (): void => {
    navigate(generatePath(PATHS.tournamentPairings, { id: tournament._id }));
  };

  const { active: activeCompetitors } = sortCompetitorsByActive(tournamentCompetitors ?? []);
  const warnings: ReactNode[] = useMemo(() => getWarnings(tournament, tournamentCompetitors ?? []), [
    tournament,
    tournamentCompetitors,
  ]);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (activeCompetitors.length < 2) {
        return toast.error('Cannot Configure Round', {
          description: 'Please ensure at least 2 competitors are active.',
        });
      }
      if (activeCompetitors.length > tournament.maxCompetitors) {
        return toast.error('Cannot Configure Round', {
          description: `There are too many active competitors. Please disable ${activeCompetitors.length - tournament.maxCompetitors} to proceed.`,
        });
      }
      for (const competitor of activeCompetitors) {
        const activePlayers = competitor.players.filter(({ active }) => active);
        if (activePlayers.length > tournament.competitorSize) {
          return toast.error('Cannot Configure Round', {
            description: `${getTournamentCompetitorDisplayName(competitor)} has too many active players.`,
          });
        }
        if (activePlayers.length < tournament.competitorSize) {
          return toast.error('Cannot Configure Round', {
            description: `${getTournamentCompetitorDisplayName(competitor)} has too few active players.`,
          });
        }
      }

      if (warnings.length) {
        open();
      } else {
        proceed();
      }
    },
  }));
  return (
    <ConfirmationDialog
      id={id}
      className={clsx(styles.ConfirmConfigureRoundDialog, className)}
      onConfirm={proceed}
      title={`Proceed to Round ${(tournament.lastRound ?? -1) + 2} Configuration?`}
    >
      {warnings.map((warning, i) => (
        <Warning key={i}>
          {warning}
        </Warning>
      ))}
    </ConfirmationDialog>
  );
});
