import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import {
  MatchResult,
  TournamentPairingId,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { FowV4MatchResultDetails } from '~/components/FowV4MatchResultDetails';
import { Form } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { useAsyncState } from '~/hooks/useAsyncState';
import { useCreateMatchResult, useUpdateMatchResult } from '~/services/matchResults';
import { useGetActiveTournamentPairingsByUser } from '~/services/tournamentPairings';
import { getTournamentPairingDisplayName } from '~/utils/common/getTournamentPairingDisplayName';
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

const confirmMatchResultDialogId = 'confirm-match-result';

export interface FowV4MatchResultFormProps {
  id: string;
  className?: string;
  matchResult?: MatchResult;
  tournamentPairingId?: TournamentPairingId;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  matchResult,
  tournamentPairingId: forcedTournamentPairingId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const user = useAuth();

  const [
    tournamentPairingId,
    setTournamentPairingId,
  ] = useAsyncState<TournamentPairingId | 'single'>('single', forcedTournamentPairingId ?? matchResult?.tournamentPairingId);

  const {
    open: openConfirmMatchResultDialog,
    close: closeConfirmMatchResultDialog,
  } = useConfirmationDialog(confirmMatchResultDialogId);

  const {
    data: tournamentPairings,
    loading: tournamentPairingsLoading,
  } = useGetActiveTournamentPairingsByUser(user ? { userId: user._id } : 'skip');

  const {
    mutation: createMatchResult,
    loading: createMatchResultLoading,
  } = useCreateMatchResult({
    onSuccess,
  });
  const {
    mutation: updateMatchResult,
    loading: updateMatchResultLoading,
  } = useUpdateMatchResult({
    onSuccess,
  });

  const form = useForm<FowV4MatchResultFormData>({
    resolver: zodResolver(fowV4MatchResultFormSchema),
    defaultValues: {
      ...defaultValues,
      ...(matchResult ? fowV4MatchResultFormSchema.parse(matchResult) : {}),
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<FowV4MatchResultFormData> = (formData): void => {
    const { data } = fowV4MatchResultFormSchema.safeParse(formData);
    if (!data) {
      throw new Error('Failed to parse form schema!');
    }
    if (matchResult) {
      updateMatchResult({ ...data, id: matchResult._id, playedAt: matchResult.playedAt });
    } else {
      if (tournamentPairingId !== 'single') {
        openConfirmMatchResultDialog();
      } else {
        createMatchResult({ ...data });
      }
    }
  };

  const handleConfirm = (): void => {
    closeConfirmMatchResultDialog();
    const { data } = fowV4MatchResultFormSchema.safeParse(form.watch());
    if (!data) {
      throw new Error('Failed to parse form schema!');
    }
    createMatchResult({
      ...data,
      tournamentPairingId: tournamentPairingId as TournamentPairingId,
    });
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

  const disableSubmit = createMatchResultLoading || updateMatchResultLoading;

  if (tournamentPairingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.FowV4MatchResultForm, className)}>
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
        onConfirm={handleConfirm}
        disabled={disableSubmit}
      >
        <FowV4MatchResultDetails
          className={styles.FowV4MatchResultForm_ConfirmDialogDetails}
          matchResult={form.watch()}
        />
      </ConfirmationDialog>
    </Form>
  );
};
