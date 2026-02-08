import { MouseEvent } from 'react';
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
import { Table } from '@ianpaschal/combat-command-components';
import { TournamentPairingConfig } from '@ianpaschal/combat-command-game-systems/common';

import { DraftTournamentPairing, TournamentId } from '~/api';
import { Button } from '~/components/generic/Button';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Pulsar } from '~/components/generic/Pulsar';
import { SortableGrid } from '~/components/generic/SortableGrid';
import { Warning } from '~/components/generic/Warning';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentPairingConfigForm } from '~/components/TournamentPairingConfigForm';
import { TournamentProvider } from '~/components/TournamentProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { getTableColumns } from '~/pages/TournamentPairingsPage/components/ConfirmPairingsDialog/ConfirmPairingsDialog.utils';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import {
  useCreateTournamentPairings,
  useGenerateDraftTournamentPairings,
  useGenerateTableAssignments,
} from '~/services/tournamentPairings';
import { useGetTournament } from '~/services/tournaments';
import { MAX_WIDTH, PATHS } from '~/settings';
import { FormData, schema } from './TournamentPairingsPage.schema';
import {
  flattenPairings,
  getDefaultValues,
  getPairingsStatuses,
  renderCompetitorCard,
  updatePairings,
} from './TournamentPairingsPage.utils';

import styles from './TournamentPairingsPage.module.scss';

export const TournamentPairingsPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();

  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const lastRound = tournament?.lastRound ?? -1;
  const nextRound = lastRound + 1;

  const { open: openConfirmRegenerateDialog } = useDialogInstance();
  const { open: openConfirmCancelDialog } = useDialogInstance();
  const { open: openConfirmCreateDialog } = useDialogInstance();

  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId,
    rankingRound: lastRound,
  });

  const existingValues = getDefaultValues(tournament);

  const { action: generateTournamentPairings } = useGenerateDraftTournamentPairings({
    onSuccess: (pairings): void => form.reset({ pairings }),
  });
  const { action: generateTableAssignments } = useGenerateTableAssignments({
    onSuccess: (pairings): void => openConfirmCreateDialog({
      title: 'Confirm Pairings',
      disablePadding: true,
      content: (
        <>
          <p className={styles.ConfirmPairingsDialog_Content}>
            The following pairings will be created:
          </p>
          <Table
            className={styles.ConfirmPairingsDialog_Table}
            columns={getTableColumns(tournamentCompetitors ?? [])}
            rows={pairings}
          />
          <Warning className={styles.ConfirmPairingsDialog_Content}>
            Once created, pairings cannot be edited. Please ensure all competitors are present and ready to play!
          </Warning>
        </>
      ),
      actions: [{
        text: 'Create',
        onClick: async () => await handleConfirmCreate(pairings),
      }],
    }),
  });
  const { mutation: createTournamentPairings } = useCreateTournamentPairings({
    onSuccess: (): void => {
      toast.success(`Round ${nextRound + 1} pairings created!`);
      navigate(`${generatePath(PATHS.tournamentDetails, { id: tournamentId })}?tab=pairings`);
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pairings: [],
    },
    mode: 'onSubmit',
  });
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

  const handleRegenerate = async (config: TournamentPairingConfig): Promise<void> => {
    const onConfirm = async (): Promise<void> => {
      await generateTournamentPairings({
        tournamentId: tournament._id,
        round: nextRound,
        config,
      });
    };
    if (form.formState.isDirty) {
      openConfirmRegenerateDialog({
        title: 'Regenerate Pairings',
        actions: [
          {
            intent: 'danger',
            onClick: onConfirm,
            text: 'Regenerate',
          },
        ],
      });
    } else {
      onConfirm();
    }
  };

  const handleCancel = (_e: MouseEvent): void => {
    const onConfirm = () => navigate(-1);
    if (form.formState.isDirty) {
      openConfirmCancelDialog({
        title: 'Are you sure you want to cancel?',
        content: 'Your current pairings will be lost.',
        actions: [
          {
            intent: 'danger',
            onClick: onConfirm,
            text: 'Cancel',
          },
        ],
      });
    } else {
      onConfirm();
    }
  };

  const handleProceed = async (_: MouseEvent): Promise<void> => {
    await generateTableAssignments({
      tournamentId,
      pairings,
    });
  };

  const handleConfirmCreate = async (pairings: DraftTournamentPairing[]): Promise<void> => {
    await createTournamentPairings({
      tournamentId: tournament._id,
      round: nextRound,
      pairings,
    });
  };

  const pairingStatuses = getPairingsStatuses(existingValues, tournamentCompetitors, pairings);

  return (
    <PageWrapper
      title={`Set Up Round ${nextRound + 1}`}
      maxWidth={MAX_WIDTH}
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
            disabled={pairings.length < 1}
          />
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
          <div className={styles.TournamentPairingsPage}>
            <div className={styles.TournamentPairingsPage_Config}>
              <h2>Configuration</h2>
              <TournamentPairingConfigForm
                id="tournament-pairing-config-form"
                existingValues={existingValues}
                onSubmit={handleRegenerate}
              />
              <Button
                className={styles.TournamentPairingsPage_Config_Submit}
                text={!form.formState.isDirty ? 'Regenerate' : 'Generate'}
                variant="primary"
                type="submit"
                form="tournament-pairing-config-form"
              />
            </div>
            <div className={styles.TournamentPairingsPage_Pairings}>
              <h2>Pairings</h2>
              <div className={styles.TournamentPairingsPage_Pairings_Grid}>
                <div className={styles.TournamentPairingsPage_Pairings_Alerts}>
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
                <Label className={styles.TournamentPairingsPage_Pairings_TableHeader}>Table</Label>
                <div className={styles.TournamentPairingsPage_Pairings_TableInputs}>
                  {fields.map((field, i) => (
                    <div key={field.id} className={styles.TournamentPairingsPage_Pairings_TableInput}>
                      <InputSelect
                        options={tableOptions}
                        name={`pairings.${i}.table`}
                        value={pairings[i].table ?? -1}
                        onChange={(value) => form.setValue(`pairings.${i}.table`, value as number, { shouldDirty: true })}
                      />
                    </div>
                  ))}
                </div>
                <Label className={styles.TournamentPairingsPage_Pairings_CompetitorsHeader}>Opponents</Label>
                <SortableGrid
                  className={styles.TournamentPairingsPage_Pairings_CompetitorsGrid}
                  items={flattenPairings(pairings)}
                  columns={2}
                  onChange={handleChange}
                  renderItem={(id, state) => renderCompetitorCard(id, state, tournamentCompetitors)}
                />
              </div>
            </div>
          </div>
        </TournamentCompetitorsProvider>
      </TournamentProvider>
    </PageWrapper>
  );
};
