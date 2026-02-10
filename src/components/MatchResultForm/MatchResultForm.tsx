import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  GameSystem,
  getGameSystem,
  getGameSystemOptions,
} from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import {
  MatchResult,
  TournamentPairingId,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { GameSystemConfig, GameSystemConfigFields } from '~/components/GameSystemConfigFields';
import {
  Form,
  FormField,
  FormStatus,
} from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { MatchResultDetailFields } from '~/components/MatchResultDetailFields';
import { MatchResultDetails } from '~/components/MatchResultDetails';
import { useAsyncState } from '~/hooks/useAsyncState';
import { useCreateMatchResult, useUpdateMatchResult } from '~/services/matchResults';
import { useGetActiveTournamentPairingsByUser } from '~/services/tournamentPairings';
import { useGetTournamentByTournamentPairing } from '~/services/tournaments';
import { validateForm } from '~/utils/validateForm';
import { SingleMatchPlayerFields } from './components/SingleMatchPlayerFields';
import { TournamentPlayerFields } from './components/TournamentPlayerFields';
import { usePlayerDisplayNames } from './MatchResultForm.hooks';
import {
  defaultValues,
  getMatchResultFormSchema,
  MatchResultFormData,
} from './MatchResultForm.schema';

import styles from './MatchResultForm.module.scss';

const confirmMatchResultDialogId = 'confirm-match-result';

export interface MatchResultFormProps {
  id: string;
  className?: string;
  matchResult?: MatchResult;
  tournamentPairingId?: TournamentPairingId;
  onSuccess?: () => void;
  onStatusChange?: (status: FormStatus) => void;
}

// TODO: This component needs to handle separate game systems more elegantly!
export const MatchResultForm = ({
  id,
  className,
  matchResult,
  tournamentPairingId: forcedTournamentPairingId,
  onSuccess,
  onStatusChange,
}: MatchResultFormProps): JSX.Element => {
  const user = useAuth();

  const [
    tournamentPairingId,
    setTournamentPairingId,
  ] = useAsyncState<TournamentPairingId | 'single'>('single', forcedTournamentPairingId ?? matchResult?.tournamentPairingId);

  const {
    open: openConfirmMatchResultDialog,
  } = useConfirmationDialog(confirmMatchResultDialogId);

  const {
    data: tournamentPairings,
    loading: tournamentPairingsLoading,
  } = useGetActiveTournamentPairingsByUser(user ? { userId: user._id } : 'skip');
  const {
    data: tournament,
    loading: tournamentLoading,
  } = useGetTournamentByTournamentPairing(tournamentPairingId !== 'single' ? {
    tournamentPairingId,
  } : 'skip');

  const {
    mutation: createMatchResult,
    loading: createMatchResultPending,
  } = useCreateMatchResult({
    onSuccess,
  });
  const {
    mutation: updateMatchResult,
    loading: updateMatchResultPending,
  } = useUpdateMatchResult({
    onSuccess,
  });

  const disabled = createMatchResultPending || updateMatchResultPending || tournamentLoading;

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({ disabled });
    }
  }, [onStatusChange, disabled]);

  const form = useForm<MatchResultFormData>({
    defaultValues: {
      ...defaultValues,
      ...(matchResult ? (() => {
        const result = getMatchResultFormSchema(matchResult.gameSystem as GameSystem).safeParse(matchResult);
        if (!result.success) {
          console.error('MatchResultForm schema parsing failed:', result.error);
          console.error('MatchResult data:', matchResult);
        }
        return result.success ? result.data : {};
      })() : {}),
    } as MatchResultFormData,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (tournament) {
      form.setValue('gameSystem', tournament.gameSystem as GameSystem);
      form.setValue('gameSystemConfig', tournament.gameSystemConfig as GameSystemConfig);
    }
  }, [tournament, form]);

  const playerNames = usePlayerDisplayNames(form.watch());
  const selectedGameSystem = form.watch('gameSystem');

  const onSubmit: SubmitHandler<MatchResultFormData> = (formData): void => {
    const schema = getMatchResultFormSchema(selectedGameSystem as GameSystem);
    const data = validateForm(schema, formData, form.setError);
    if (data) {
      if (matchResult) {
        updateMatchResult({ ...data, id: matchResult._id, playedAt: matchResult.playedAt });
      } else {
        if (tournamentPairingId !== 'single' && selectedGameSystem) {
          const score = getGameSystem(data.gameSystem).calculateMatchResultScore(data.details);
          openConfirmMatchResultDialog({
            children: (
              <MatchResultDetails
                gameSystem={selectedGameSystem}
                className={styles.MatchResultForm_ConfirmDialogDetails}
                details={data.details}
                playerNames={playerNames}
                score={score}
              />
            ),
            onConfirm: () => {
              createMatchResult({
                ...data,
                tournamentPairingId: tournamentPairingId as TournamentPairingId,
              });
            },
          });
        } else {
          createMatchResult({ ...data });
        }
      }
    }
  };

  const resultForOptions = [
    { value: 'single', label: 'Single Match' },
    ...(tournamentPairings || []).filter((pairing) => pairing.matchResultsProgress.submitted < pairing.matchResultsProgress.required).map((pairing) => ({
      value: pairing._id,
      label: pairing.displayName,
    })),
  ];

  const handleChangeResultFor = (value?: SelectValue): void => {
    if (value) {
      setTournamentPairingId(value as TournamentPairingId);
      if (user && value === 'single') {
        form.setValue('player0UserId', user._id);
        form.setValue('player1UserId', '' as UserId);
      }
    }
  };

  const gameSystemOptions = getGameSystemOptions();

  const isTournament = tournamentPairingId !== 'single';

  if (tournamentPairingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      id={id}
      form={form}
      onSubmit={onSubmit}
      className={clsx(styles.MatchResultForm, className)}
      disabled={disabled}
    >
      {!matchResult && !forcedTournamentPairingId && (
        <>
          <div className={styles.MatchResultForm_ResultForSection}>
            <Label>
              Result For
            </Label>
            <InputSelect
              options={resultForOptions}
              value={tournamentPairingId}
              onChange={handleChangeResultFor}
              disabled={!!forcedTournamentPairingId || !!matchResult}
            />
          </div>
          <Separator />
        </>
      )}
      {isTournament ? (
        <TournamentPlayerFields
          tournament={tournament}
          tournamentPairingId={tournamentPairingId}
        />
      ) : (
        <>
          <FormField name="gameSystem" label="Game System" disabled={gameSystemOptions.length < 2}>
            <InputSelect options={gameSystemOptions} />
          </FormField>
          <GameSystemConfigFields />
          <Separator />
          <SingleMatchPlayerFields />
        </>
      )}
      <MatchResultDetailFields />
      <ConfirmationDialog
        id={confirmMatchResultDialogId}
        title="Are all details correct?"
        description="This match is for a tournament, so after you submit it the game configuration and outcome can no longer be changed!"
      />
      {/* <pre>{JSON.stringify(form.formState.errors)}</pre> */}
    </Form>
  );
};
