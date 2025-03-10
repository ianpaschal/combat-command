import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TournamentId, TournamentPairingId } from '~/api';
import { Dialog } from '~/components/generic/Dialog';
import { Form } from '~/components/generic/Form';
import { Separator } from '~/components/generic/Separator';
import { useCreateMatchResult } from '~/services/matchResults/useCreateMatchResult';
import { CommonFields } from './components/CommonFields';
import { GameConfigFields } from './components/GameConfigFields';
import { SingleMatchPlayersFields } from './components/SingleMatchPlayersFields';
import { TournamentPlayersFields } from './components/TournamentPlayersFields';
import {
  defaultValues,
  FowV4MatchResultFormData,
  fowV4MatchResultFormSchema,
} from './FowV4MatchResultForm.schema';

import styles from './FowV4MatchResultForm.module.scss';

export interface FowV4MatchResultFormProps {
  id: string;
  className?: string;
  tournamentId?: TournamentId;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  // tournamentId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const [tournamentPairingId] = useState<TournamentPairingId | 'single'>('single');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const { createMatchResult } = useCreateMatchResult({
    onSuccess,
  });

  const form = useForm<FowV4MatchResultFormData>({
    resolver: zodResolver(fowV4MatchResultFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });
  const { handleSubmit, reset } = form;

  // TODO: If the tournament pairing changes, auto-fill the game config fields
  useEffect(() => {

  }, [tournamentPairingId, reset]);

  const onSubmit: SubmitHandler<FowV4MatchResultFormData> = (data: FowV4MatchResultFormData): void => {
    if (tournamentPairingId === 'single') {
      createMatchResult({
        player0Placeholder: data.player0Placeholder,
        player0UserId: data.player0UserId,
        player1Placeholder: data.player1Placeholder,
        player1UserId: data.player1UserId,
        playedAt: new Date().toISOString(),
        details: {
          attacker: data.attacker,
          firstTurn: data.firstTurn,
          missionId: data.missionId,
          outcomeType: data.outcomeType,
          player0BattlePlan: data.player0BattlePlan,
          player0UnitsLost: data.player0UnitsLost,
          player1BattlePlan: data.player1BattlePlan,
          player1UnitsLost: data.player1UnitsLost,
          turnsPlayed: data.turnsPlayed,
          winner: data.winner,
        },
        gameSystemConfig: {
          era: data.era,
          points: data.points,
          dynamicPointsVersion: data.dynamicPointsVersion,
          lessonsFromTheFrontVersion: data.lessonsFromTheFrontVersion,
          missionPackId: data.missionPackId,
          missionMatrixId: data.missionMatrixId,
        },
        gameSystem: data.gameSystem,
      });
    } else {
      setConfirmDialogOpen(true);
    }
  };

  const onConfirmSubmit: SubmitHandler<FowV4MatchResultFormData> = async (_data: FowV4MatchResultFormData): Promise<void> => {
    // const { gameSystemConfig } = tournament;
    // addMatchResult.mutate({ match: { ...data, game_system_config_id }, tournamentId: tournament.id }, {
    //   onSuccess: () => {
    //     setConfirmDialogOpen(false);
    //     if (onSuccess) {
    //       onSuccess();
    //     }
    //   },
    // });
    if (onSuccess) {
      onSuccess();
    }
  };

  // const resultForOptions = [
  //   { value: 'single', label: 'Single Match' },
  //   // { value: 'foo', label: 'Belgian Nationals | Ian vs Rob' },
  // ];

  // const handleChangeResultFor = (value?: SelectValue): void => {
  //   if (value) {
  //     // TODO: Remove cast
  //     setTournamentPairingId(value as TournamentPairingId);
  //   }
  // };

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={className}>
      <div className={styles.Root}>
        {/* TODO: Enable for tournaments eventually */}
        {/* <FormField label="Result For">
          <InputSelect
            options={resultForOptions}
            value={tournamentPairingId}
            onChange={handleChangeResultFor}
          />
        </FormField>
        <Separator /> */}
        {tournamentPairingId !== 'single' ? (
          <TournamentPlayersFields tournamentPairingId={tournamentPairingId} />
        ) : (
          <>
            <SingleMatchPlayersFields />
            <Separator />
            <GameConfigFields />
          </>
        )}
        <Separator />
        <CommonFields />
      </div>

      <Dialog
        title="Are all details correct?"
        description="After you submit the match you will still be able to add notes and photos, but the game configuration and outcome can no longer be changed!"
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        width="small"
        actions={[
          { label: 'Cancel', muted: true, onClick: () => setConfirmDialogOpen(false) },
          { label: 'Submit Match', onClick: handleSubmit(onConfirmSubmit) },
        ]}
      >
        <pre>
          {JSON.stringify(form.watch(), null, 2)}
        </pre>
      </Dialog>
    </Form>
  );
};
