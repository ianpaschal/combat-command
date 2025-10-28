import {
  MouseEvent,
  useCallback,
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
import { getTournamentPairingMethodOptions, TournamentPairingMethod } from '@ianpaschal/combat-command-game-systems/common';

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
import { useCreateTournamentPairings, useGetDraftTournamentPairings } from '~/services/tournamentPairings';
import { useGetTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import {
  FormData,
  sanitize,
  schema,
} from './TournamentPairingsPage.schema';
import {
  flattenPairings,
  getPairingsStatuses,
  renderCompetitorCard,
  updatePairings,
} from './TournamentPairingsPage.utils';

import styles from './TournamentPairingsPage.module.scss';

const WIDTH = 800;

export const TournamentPairingsPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();

  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const lastRound = tournament?.lastRound ?? -1;

  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId,
    includeRankings: lastRound,
  });
  const isFirstRound = (tournament?.lastRound ?? -1) < 0;
  const defaultPairingMethod = isFirstRound ? (
    TournamentPairingMethod.Random
  ) : (
    tournament?.pairingMethod ?? TournamentPairingMethod.Adjacent
  );
  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod>(defaultPairingMethod);

  const round = lastRound + 1;
  const { data: generatedPairings } = useGetDraftTournamentPairings(tournament ? {
    tournamentId,
    round,
    method: pairingMethod,
  } : 'skip');

  const { mutation: createTournamentPairings } = useCreateTournamentPairings({
    onSuccess: (): void => {
      toast.success(`Round ${round + 1} pairings created!`);
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
      pairings: sanitize(generatedPairings),
    },
    mode: 'onSubmit',
  });
  const reset = useCallback((pairings: unknown[]) => form.reset({
    pairings: sanitize(pairings),
  }), [form]);
  useEffect(() => {
    if (tournament && generatedPairings) {
      reset(generatedPairings);
    }
  }, [tournament, generatedPairings, reset]);
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

  const tableCount = Math.ceil(tournament.maxCompetitors / 2);
  const tableOptions = [
    ...Array.from({ length: tableCount }).map((_, i) => ({
      label: String(i + 1),
      value: i,
    })),
    { label: 'Auto', value: -1 },
  ];

  const handleChange = (items: UniqueIdentifier[]): void => {
    updatePairings(items, form.reset);
  };

  const handleChangePairingMethod = (value: TournamentPairingMethod): void => {
    if (form.formState.isDirty) {
      openConfirmChangePairingMethodDialog({
        onConfirm: () => setPairingMethod(value),
      });
    } else {
      setPairingMethod(value);
    }
  };

  const handleReset = (): void => {
    if (generatedPairings) {
      if (form.formState.isDirty) {
        openConfirmResetPairingsDialog({
          onConfirm: () => reset(generatedPairings),
        });
      } else {
        reset(generatedPairings);
      }
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
    await createTournamentPairings({ tournamentId, round, pairings });
  };

  const pairingStatuses = getPairingsStatuses(tournamentCompetitors, pairings);

  return (
    <PageWrapper
      title={`Set Up Round ${round + 1}`}
      maxWidth={WIDTH}
      showBackButton
      footer={
        <>
          <Button
            key="cancel"
            text="Cancel"
            variant="secondary"
            onClick={handleCancel}
          />
          <Button
            key="proceed"
            text="Proceed"
            onClick={handleProceed}
          />
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
          <div className={styles.TournamentPairingsPage}>
            <div className={styles.TournamentPairingsPage_Header}>
              <Label>Pairing Method</Label>
              <InputSelect
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onChange={handleChangePairingMethod}
                options={getTournamentPairingMethodOptions()}
                value={pairingMethod}
                disabled={isFirstRound}
              />
              <Button
                disabled={!form.formState.isDirty}
                text="Reset"
                variant="secondary"
                onClick={handleReset}
              />
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
                      onChange={(value) => form.setValue(`pairings.${i}.table`, value as number, { shouldDirty: true })}
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
