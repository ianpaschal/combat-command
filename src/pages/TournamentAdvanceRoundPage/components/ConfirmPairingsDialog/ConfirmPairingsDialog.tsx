import { DraftTournamentPairing, UnassignedTournamentPairing } from '~/api';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';
import { convertDraftPairingsToUnassignedPairings } from '../PairingsStep/PairingsStep.utils';

import styles from './ConfirmPairingsDialog.module.scss';

export const confirmPairingsDialogId = 'confirm-pairings';

export interface ConfirmPairingsDialogProps {
  nextRound: number;
  manualPairings?: DraftTournamentPairing[];
  onConfirm: (pairings: UnassignedTournamentPairing[]) => void;
}

export const ConfirmPairingsDialog = ({
  nextRound,
  manualPairings = [],
  onConfirm,
}: ConfirmPairingsDialogProps): JSX.Element => {
  const unassignedPairings = convertDraftPairingsToUnassignedPairings(manualPairings);

  const handleConfirm = () => {
    if (!unassignedPairings.length) {
      throw new Error('cannot confirm non-existent pairings!');
    }
    onConfirm(unassignedPairings);
  };

  return (
    <ConfirmationDialog
      id={confirmPairingsDialogId}
      title={`Confirm Round ${nextRound + 1} Pairings`}
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
