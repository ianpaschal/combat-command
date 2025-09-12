import {
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import {
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import {
  generatePath,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { UniqueIdentifier } from '@dnd-kit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { TournamentPairingMethod, tournamentPairingMethodOptions } from '@ianpaschal/combat-command-static-data/common';

import { DraftTournamentPairing, TournamentId } from '~/api';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Pulsar } from '~/components/generic/Pulsar';
import { Separator } from '~/components/generic/Separator';
import { SortableGrid } from '~/components/generic/SortableGrid';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentProvider } from '~/components/TournamentProvider';
import { ConfirmPairingsDialog } from '~/pages/TournamentPairingsPage/components/ConfirmPairingsDialog';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import {
  useCreateTournamentPairings,
  useGenerateDraftTournamentPairings,
  useGetTournamentPairings,
} from '~/services/tournamentPairings';
import { useGetTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { FormData, schema } from './TournamentPairingsPage.schema';
import {
  flattenPairings,
  getPairingsStatuses,
  renderCompetitorCard,
  setPairings,
  updatePairings,
} from './TournamentPairingsPage.utils';

import styles from './TournamentPairingsPage.module.scss';

const WIDTH = 800;

export const TournamentPairingsPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?

  // ---- DATA FETCHING ----
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const lastRound = tournament?.lastRound ?? -1;
  const nextRound = tournament?.nextRound ?? 0;

  if (tournament?.currentRound !== undefined) {
    throw new Error('Cannot modify pairings during round.');
  }
  const tableCount = Math.ceil((tournament?.maxCompetitors ?? 2) / 2);

  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId,
    includeRankings: lastRound,
  });

  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod | 'manual'>(nextRound === 0 ? (
    TournamentPairingMethod.Random
  ) : (
    TournamentPairingMethod.Adjacent
  ));
  useEffect(() => {
    if (tournament?.pairingMethod) {
      setPairingMethod(tournament.pairingMethod);
    }
  }, [tournament, setPairingMethod]);

  const { data: existingPairings } = useGetTournamentPairings(tournament ? {
    tournamentId,
    round: nextRound,
  } : 'skip');

  // ---- DATA PERSISTING ----
  const { action: generateDraftPairings } = useGenerateDraftTournamentPairings();
  const { mutation: createTournamentPairings } = useCreateTournamentPairings({
    onSuccess: (): void => {
      toast.success(`Round ${nextRound + 1} pairings created!`);
      navigate(`${generatePath(PATHS.tournamentDetails, { id: tournamentId })}?tab=pairings`);
    },
  });

  const {
    id: confirmChangePairingMethodDialogId,
    open: openConfirmChangePairingMethodDialog,
  } = useConfirmationDialog();
  const {
    id: confirmResetPairingsDialogId,
    open: openConfirmResetPairingsDialog,
  } = useConfirmationDialog();
  const {
    id: confirmPairingsDialogId,
    open: openConfirmPairingsDialog,
  } = useConfirmationDialog();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pairings: setPairings(tournamentCompetitors ?? [], tableCount, existingPairings),
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (tournament && existingPairings) {
      form.reset({ pairings: setPairings(tournamentCompetitors ?? [], tableCount, existingPairings) });
      setPairingMethod('manual');
    }
  }, [tournament, existingPairings, form, tableCount, tournamentCompetitors]);
  const { fields } = useFieldArray({
    control: form.control,
    name: 'pairings',
  });
  const pairings = useWatch({
    control: form.control,
    name: 'pairings',
  });

  if (!tournament || !tournamentCompetitors) {
    return <div>Loading...</div>;
  }

  const tableOptions = [
    ...Array.from({ length: tableCount }).map((_, i) => ({
      label: String(i + 1),
      value: i,
    })),
    { label: 'Auto', value: -1 },
  ];

  const handleChange = (items: UniqueIdentifier[]): void => {
    updatePairings(items, form.reset);
    setPairingMethod('manual');
  };

  const changePairingMethod = async (method: TournamentPairingMethod | 'manual'): Promise<void> => {
    if (method !== 'manual') {
      const generatedPairings = await generateDraftPairings({
        round: nextRound,
        tournamentId,
        method,
      });
      if (generatedPairings) {
        form.reset({ pairings: setPairings(tournamentCompetitors, tableCount, generatedPairings) }, { keepDefaultValues: true });
        setPairingMethod(method);
      }
    }
  };

  const reset = (): void => {
    if (existingPairings) {
      form.reset({ pairings: setPairings(tournamentCompetitors, tableCount, existingPairings) });
      setPairingMethod('manual');
    } else {
      if (pairingMethod !== 'manual') {
        changePairingMethod(pairingMethod);
      }
    }
  };

  const handleReset = (): void => {
    if (form.formState.isDirty) {
      openConfirmResetPairingsDialog({
        onConfirm: () => reset(),
      });
    } else {
      reset();
    }
  };

  const handleChangePairingMethod = (method: TournamentPairingMethod | 'manual'): void => {
    if (pairingMethod === 'manual' && form.formState.isDirty) {
      openConfirmChangePairingMethodDialog({
        onConfirm: () => changePairingMethod(method),
      });
    } else {
      changePairingMethod(method);
    }
  };

  const handleCancel = (_e: MouseEvent): void => {
    // TODO: If dirty, open confirmation dialog
    navigate(-1);
  };

  const handleProceed = (_e: MouseEvent): void => {
    openConfirmPairingsDialog();
  };

  const handleConfirm = async (pairings: DraftTournamentPairing[]): Promise<void> => {
    await createTournamentPairings({ tournamentId, round: nextRound, pairings });
  };

  const pairingStatuses = getPairingsStatuses(tournamentCompetitors, pairings);

  return (
    <PageWrapper
      title={`Configure Round ${nextRound + 1}`}
      maxWidth={WIDTH}
      showBackButton
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel} key="cancel">Cancel</Button>
          <Button key="proceed" onClick={handleProceed}>{existingPairings ? 'Update' : 'Create'}</Button>
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
          <div className={styles.TournamentPairingsPage}>
            <div className={styles.TournamentPairingsPage_Header}>
              <Label>Pairing Method</Label>
              <InputSelect
                //@ts-expect-error InputSelect doesn't know type
                onChange={handleChangePairingMethod}
                options={[...tournamentPairingMethodOptions, {
                  label: 'Manual',
                  value: 'manual',
                }]}
                value={pairingMethod}
                disabled={nextRound === 0}
              />
              <Button
                className={styles.TournamentPairingsPage_ResetButton}
                onClick={handleReset}
                variant="secondary"
                disabled={!form.formState.isDirty}
              >
                Reset
              </Button>
            </div>
            <Separator />
            <div className={styles.TournamentPairingsPage_Form}>
              <div className={styles.TournamentPairingsPage_Form_Alerts}>
                {fields.map((field, i) => {
                  const { status, message } = pairingStatuses[i];
                  const statusColors: Record<typeof status, 'red' | 'yellow' | 'green'> = {
                    'error': 'red',
                    'warning': 'yellow',
                    'ok': 'green',
                  };
                  return (
                    <InfoPopover key={field.id} content={message} orientation="horizontal">
                      <Pulsar pulse={status !== 'ok'} color={statusColors[status]} size={12} />
                    </InfoPopover>
                  );
                })}
              </div>
              <Label className={styles.TournamentPairingsPage_Form_TableHeader}>Table</Label>
              <div className={styles.TournamentPairingsPage_Form_TableInputs}>
                {fields.map((field, i) => (
                  <div key={field.id} className={styles.TournamentPairingsPage_Form_TableInput}>
                    <InputSelect
                      options={tableOptions}
                      name={`pairings.${i}.table`}
                      value={pairings[i].table ?? -1}
                      onChange={(value) => form.setValue(`pairings.${i}.table`, value as number, {
                        shouldDirty: true,
                      })}
                    />
                  </div>
                ))}
              </div>
              <Label className={styles.TournamentPairingsPage_Form_CompetitorsHeader}>Opponents</Label>
              <SortableGrid
                className={styles.TournamentPairingsPage_Form_CompetitorsGrid}
                items={flattenPairings(pairings)}
                columns={2}
                onChange={handleChange}
                renderItem={(id, state) => renderCompetitorCard(id, state, tournamentCompetitors)}
              />
            </div>
          </div>
          <ConfirmationDialog
            id={confirmChangePairingMethodDialogId}
            title="Confirm Change Pairing Method"
            description="Are you sure you want to change the pairing method? The existing pairings will be replaced."
          />
          <ConfirmationDialog
            id={confirmResetPairingsDialogId}
            title="Confirm Reset Pairings"
            description="Are you sure you want to reset? The existing pairings will be replaced."
          />
          <ConfirmPairingsDialog
            id={confirmPairingsDialogId}
            pairings={pairings}
            competitors={tournamentCompetitors}
            onConfirm={handleConfirm}
          />
        </TournamentCompetitorsProvider>
      </TournamentProvider>
    </PageWrapper>
  );
};
