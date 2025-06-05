import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import isEqual from 'fast-deep-equal';

import {
  PairingResult,
  TournamentPairingMethod,
  tournamentPairingMethodOptions,
  UnassignedPairingInput,
} from '~/api';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { TournamentPairingsGrid } from '~/components/TournamentPairingsGrid';
import { useTournament } from '~/components/TournamentProvider';
import { useGetDraftTournamentPairings } from '~/services/tournamentPairings/useGetDraftTournamentPairings';

import { ConfirmPairingsDialog, confirmPairingsDialogId } from '../ConfirmPairingsDialog';

import styles from './PairingsStep.module.scss';

const changePairingMethodConfirmDialogId = 'confirm-change-pairing-method';
const resetPairingsConfirmDialogId = 'confirm-reset-pairings';

export interface PairingsStepProps {
  nextRound: number;
  onConfirm: (pairings: UnassignedPairingInput[]) => void;
}

export interface PairingsStepHandle {
  validate: () => void;
}

export const PairingsStep = forwardRef<PairingsStepHandle, PairingsStepProps>(({
  nextRound,
  onConfirm,
}: PairingsStepProps, ref) => {
  const tournament = useTournament();

  // Pairing state
  const isFirstRound = nextRound === 0;
  const defaultPairingMethod = isFirstRound ? 'random' : tournament.pairingMethod;
  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod>(defaultPairingMethod);
  const { data: draftPairingResults } = useGetDraftTournamentPairings({
    tournamentId: tournament._id,
    round: nextRound,
    method: pairingMethod,
  });
  const [manualPairings, setManualPairings] = useState<PairingResult | undefined>(draftPairingResults);
  useEffect(() => {
    if (draftPairingResults) {
      setManualPairings(draftPairingResults);
    }
  }, [draftPairingResults]);

  const isDirty = manualPairings && !isEqual(manualPairings, draftPairingResults);

  const { open: openChangePairingMethodConfirmDialog } = useConfirmationDialog(changePairingMethodConfirmDialogId);
  const { open: openResetPairingsConfirmDialog } = useConfirmationDialog(resetPairingsConfirmDialogId);
  const { open: openConfirmPairingsDialog } = useConfirmationDialog(confirmPairingsDialogId);

  const handleChangePairingMethod = (value: TournamentPairingMethod): void => {
    if (isDirty) {
      openChangePairingMethodConfirmDialog({
        onConfirm: () => setPairingMethod(value),
      });
    } else {
      setPairingMethod(value);
    }
  };

  const handleReset = (): void => {
    if (draftPairingResults) {
      if (isDirty) {
        openResetPairingsConfirmDialog({
          onConfirm: () => setManualPairings(draftPairingResults),
        });
      } else {
        setManualPairings(draftPairingResults);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    validate: openConfirmPairingsDialog,
  }));

  return (
    <div className={styles.PairingStep}>
      <div className={styles.PairingStep_PairingMethodSection}>
        <Label>Pairing Method</Label>
        <InputSelect
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={handleChangePairingMethod}
          options={tournamentPairingMethodOptions}
          value={pairingMethod}
          disabled={isFirstRound}
        />
        <Button onClick={handleReset} variant="secondary" disabled={isEqual(manualPairings, draftPairingResults)}>
          Reset
        </Button>
      </div>
      <Separator />
      <TournamentPairingsGrid value={manualPairings} onChange={setManualPairings} />
      <ConfirmationDialog
        id={changePairingMethodConfirmDialogId}
        title="Confirm Change Pairing Method"
        description="Are you sure you want to change the pairing method? The existing pairings will be replaced."
      />
      <ConfirmationDialog
        id={resetPairingsConfirmDialogId}
        title="Confirm Reset Pairing Method"
        description="Are you sure you want to reset? The existing pairings will be replaced."
      />
      <ConfirmPairingsDialog
        nextRound={nextRound}
        manualPairings={manualPairings}
        onConfirm={onConfirm}
      />
    </div>
  );
});
