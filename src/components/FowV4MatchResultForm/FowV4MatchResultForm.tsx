import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';

import {
  MatchResult,
  TournamentPairingId,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { FowV4MatchResultDetails } from '~/components/FowV4MatchResultDetails';
import { Form, FormStatus } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { useAsyncState } from '~/hooks/useAsyncState';
import { useCreateMatchResult, useUpdateMatchResult } from '~/services/matchResults';
import { useGetActiveTournamentPairingsByUser } from '~/services/tournamentPairings';
import { getTournamentPairingDisplayName } from '~/utils/common/getTournamentPairingDisplayName';
import { validateForm } from '~/utils/validateForm';
import { CommonFields } from './components/CommonFields';
import { GameConfigFields } from './components/GameConfigFields';
import { SingleMatchPlayersFields } from './components/SingleMatchPlayersFields';
import { TournamentPlayersFields } from './components/TournamentPlayersFields';
import { calculateFowV4MatchResultScore } from '../../../convex/_model/fowV4/calculateFowV4MatchResultScore';
import { usePlayerDisplayNames } from './FowV4MatchResultForm.hooks';
import {
  defaultValues,
  FowV4MatchResultFormData,
  fowV4MatchResultFormSchema,
} from './FowV4MatchResultForm.schema';

import styles from './FowV4MatchResultForm.module.scss';

const confirmMatchResultDialogId = 'confirm-match-result';

export interface FowV4MatchResultFormProps {
  id: string;
  className?: string;
  matchResult?: MatchResult;
  tournamentPairingId?: TournamentPairingId;
  onSuccess?: () => void;
  onStatusChange?: (status: FormStatus) => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  matchResult,
  tournamentPairingId: forcedTournamentPairingId,
  onSuccess,
  onStatusChange,
}: FowV4MatchResultFormProps): JSX.Element => {
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

  const disabled = createMatchResultPending || updateMatchResultPending;

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({ disabled });
    }
  }, [onStatusChange, disabled]);

  const form = useForm<FowV4MatchResultFormData>({
    defaultValues: {
      ...defaultValues,
      ...(matchResult ? fowV4MatchResultFormSchema.parse(matchResult) : {}),
    },
    mode: 'onSubmit',
  });

  const playerNames = usePlayerDisplayNames(form.watch());

  const onSubmit: SubmitHandler<FowV4MatchResultFormData> = (formData): void => {
    const data = validateForm(fowV4MatchResultFormSchema, formData, form.setError);
    if (data) {
      if (matchResult) {
        updateMatchResult({ ...data, id: matchResult._id, playedAt: matchResult.playedAt });
      } else {
        if (tournamentPairingId !== 'single') {
          const score = calculateFowV4MatchResultScore(data.details);
          openConfirmMatchResultDialog({
            children: (
              <FowV4MatchResultDetails
                className={styles.FowV4MatchResultForm_ConfirmDialogDetails}
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
      label: getTournamentPairingDisplayName(pairing),
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

  if (tournamentPairingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      id={id}
      form={form}
      onSubmit={onSubmit}
      className={clsx(styles.FowV4MatchResultForm, className)}
      disabled={disabled}
    >
      {!matchResult && !forcedTournamentPairingId && (
        <>
          <div className={styles.FowV4MatchResultForm_ResultForSection}>
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
      <ConfirmationDialog
        id={confirmMatchResultDialogId}
        title="Are all details correct?"
        description="This match is for a tournament, so after you submit it the game configuration and outcome can no longer be changed!"
      />
    </Form>
  );
};
