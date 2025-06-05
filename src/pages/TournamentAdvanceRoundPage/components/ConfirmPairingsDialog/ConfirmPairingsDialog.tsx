import { PairingResult, UnassignedPairingInput } from '~/api';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';

import styles from './ConfirmPairingsDialog.module.scss';

export const confirmPairingsDialogId = 'confirm-pairings';

export interface ConfirmPairingsDialogProps {
  nextRound: number;
  manualPairings?: PairingResult;
  onConfirm: (pairings: UnassignedPairingInput[]) => void;
}

export const ConfirmPairingsDialog = ({
  nextRound,
  manualPairings,
  onConfirm,
}: ConfirmPairingsDialogProps): JSX.Element => {
  const unassignedPairings: UnassignedPairingInput[] = [
    ...(manualPairings?.pairings || []).map((pairing) => ({
      tournamentCompetitor0Id: pairing[0].id,
      tournamentCompetitor1Id: pairing[1]?.id ?? null,
      playedTables: Array.from(new Set([
        ...pairing[0].playedTables,
        ...(pairing[1]?.playedTables || []),
      ])),
    })),
    ...(manualPairings?.unpairedCompetitors || []).map(({ id, playedTables }) => ({
      tournamentCompetitor0Id: id,
      tournamentCompetitor1Id: null,
      playedTables,
    })),
  ];

  const handleConfirm = () => {
    if (!unassignedPairings.length) {
      throw new Error('cannot confirm non-existent pairings!');
    }
    onConfirm(unassignedPairings);
  };

  return (
    <ConfirmationDialog
      id={confirmPairingsDialogId}
      title={`Confirm Round ${nextRound} Pairings`}
      intent="default"
      onConfirm={handleConfirm}
    >
      <div className={styles.ConfirmPairingsDialog_Content}>
        <p>The following pairings will be created:</p>
        {unassignedPairings.map((pairing, i) => (
          <TournamentPairingRow key={`pairing_${i}`} pairing={pairing} />
        ))}
      </div>
    </ConfirmationDialog>
  );
};
