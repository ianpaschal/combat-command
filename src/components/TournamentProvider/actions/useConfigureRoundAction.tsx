import { generatePath, useNavigate } from 'react-router-dom';

import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { PATHS } from '~/settings';
import { validateConfigureRound } from '../utils/validateConfigureRound';

import styles from '../actions/shared.module.scss';

const KEY = TournamentActionKey.ConfigureRound;

export const useConfigureRoundAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const navigate = useNavigate();
  const nextRoundLabel = (subject.nextRound ?? 0) + 1;
  const label = `Configure Round ${nextRoundLabel}`;
  const { open, close } = useDialogInstance();
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId: subject._id,
  });
  const onConfirm = (): void => {
    navigate(generatePath(PATHS.tournamentPairings, { id: subject._id }));
  };
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label,
      handler: () => {
        const { errors, warnings } = validateConfigureRound(subject, tournamentCompetitors);
        if (errors.length) {
          return toast.error('Cannot Configure Round', {
            description: errors,
          });
        }
        if (warnings.length) {
          open({
            title: `Configure Round ${nextRoundLabel}`,
            content: (
              <div className={styles.Action_DialogContent}>
                {warnings.map((warning, i) => (
                  <Warning key={i}>{warning}</Warning>
                ))}
              </div>
            ),
            actions: [
              {
                onClick: () => {
                  onConfirm();
                  close();
                },
                text: 'Proceed',
              },
            ],
          });
        } else {
          onConfirm();
        }
      },
    };
  }
  return null;
};
