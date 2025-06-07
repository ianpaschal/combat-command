import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { MatchResultId, TournamentPairingId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { FowV4MatchResultDetails } from '~/components/FowV4MatchResultDetails';
import { Form } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { useAsyncState } from '~/hooks/useAsyncState';
import { useCreateMatchResult } from '~/services/matchResults/useCreateMatchResult';
import { useFetchMatchResult } from '~/services/matchResults/useFetchMatchResult';
import { useUpdateMatchResult } from '~/services/matchResults/useUpdateMatchResult';
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
  matchResultId?: MatchResultId;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  matchResultId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const user = useAuth();

  const {
    data: matchResult,
    loading: matchResultLoading,
  } = useFetchMatchResult(matchResultId);

  const [
    tournamentPairingId,
    setTournamentPairingId,
  ] = useAsyncState<TournamentPairingId | undefined>(undefined, matchResult?.tournamentPairingId);

  const {
    open: openConfirmMatchResultDialog,
    close: closeConfirmMatchResultDialog,
  } = useConfirmationDialog(confirmMatchResultDialogId);

  const {
    data: tournamentPairings,
    loading: tournamentPairingsLoading,
  } = useGetActiveTournamentPairingsByUser(user ? { userId: user._id } : 'skip');

  const { createMatchResult } = useCreateMatchResult({
    onSuccess,
  });
  const { updateMatchResult } = useUpdateMatchResult({
    onSuccess,
  });

  const form = useForm<FowV4MatchResultFormData>({
    resolver: zodResolver(fowV4MatchResultFormSchema),
    defaultValues,
    // React-Hook-Form is stupid and doesn't allow applying a partial record to the form values
    values: { ...matchResult as FowV4MatchResultFormData },
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
      if (tournamentPairingId) {
        openConfirmMatchResultDialog();
      } else {
        createMatchResult({ ...data, tournamentPairingId });
      }
    }
  };

  const handleConfirm = (): void => {
    const data: FowV4MatchResultFormData = form.watch();
    closeConfirmMatchResultDialog();
    createMatchResult({ ...data, tournamentPairingId });
  };

  const resultForOptions = [
    { value: 'single', label: 'Single Match' },
    ...(tournamentPairings || []).map((pairing) => ({
      value: pairing._id,
      label: getTournamentPairingDisplayName(pairing),
    })),
  ];

  const handleChangeResultFor = (value?: SelectValue): void => {
    if (value) {
      if (value === 'single') {
        setTournamentPairingId(undefined);
      } else {
        // TODO: Remove cast
        setTournamentPairingId(value as TournamentPairingId);
      }
    }
  };

  if (tournamentPairingsLoading || matchResultLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.FowV4MatchResultForm, className)}>
      {!matchResultId && (
        <>
          <div className={styles.FowV4MatchResultForm_ResultForSection}>
            <Label>
              Result For
            </Label>
            <InputSelect
              options={resultForOptions}
              value={tournamentPairingId}
              onChange={handleChangeResultFor}
              disabled={!!matchResult}
            />
          </div>
          <Separator />
        </>
      )}
      {tournamentPairingId ? (
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
      >
        <FowV4MatchResultDetails
          className={styles.FowV4MatchResultForm_ConfirmDialogDetails}
          matchResult={form.watch()}
        />
      </ConfirmationDialog>
    </Form>
  );
};
