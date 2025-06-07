import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  MatchResultId,
  TournamentId,
  TournamentPairingId,
} from '~/api';
import { Form } from '~/components/generic/Form';
import { Separator } from '~/components/generic/Separator';
import {
  useCreateMatchResult,
  useGetMatchResult,
  useUpdateMatchResult,
} from '~/services/matchResults';
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
  matchResultId?: MatchResultId;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  // tournamentId,
  matchResultId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const [tournamentPairingId] = useState<TournamentPairingId | 'single'>('single');
  // const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const user = useAuth();

  const {
    data: matchResult,
    loading: matchResultLoading,
  } = useGetMatchResult(matchResultId ? { id: matchResultId } : 'skip');

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

  const { mutation: createMatchResult } = useCreateMatchResult({
    onSuccess,
  });
  const { mutation: updateMatchResult } = useUpdateMatchResult({
    onSuccess,
  });

  const form = useForm<FowV4MatchResultFormData>({
    resolver: zodResolver(fowV4MatchResultFormSchema),
    defaultValues,
    // React-Hook-Form is stupid and doesn't allow applying a partial record to the form values
    values: { ...matchResult as FowV4MatchResultFormData },
    mode: 'onSubmit',
  });
  // const { handleSubmit } = form;

  // TODO: If the tournament pairing changes, auto-fill the game config fields
  // useEffect(() => {

  // }, [tournamentPairingId, reset]);

  const onSubmit: SubmitHandler<FowV4MatchResultFormData> = (formData): void => {
    const { data } = fowV4MatchResultFormSchema.safeParse(formData);
    if (!data) {
      throw new Error('Failed to parse form schema!');
    }
    const playedAt = new Date().toISOString();
    if (tournamentPairingId === 'single') {
      if (matchResult) {
        updateMatchResult({ ...data, id: matchResult._id, playedAt });
      } else {
        createMatchResult({ ...data, playedAt });
      }
    } else {
      // setConfirmDialogOpen(true);
    }
  };

  // const onConfirmSubmit: SubmitHandler<FowV4MatchResultFormData> = async (_data: FowV4MatchResultFormData): Promise<void> => {
  //   // const { gameSystemConfig } = tournament;
  //   // addMatchResult.mutate({ match: { ...data, game_system_config_id }, tournamentId: tournament.id }, {
  //   //   onSuccess: () => {
  //   //     setConfirmDialogOpen(false);
  //   //     if (onSuccess) {
  //   //       onSuccess();
  //   //     }
  //   //   },
  //   // });
  //   if (onSuccess) {
  //     onSuccess();
  //   }
  // };

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
  if (loading) {
    return <div>Loading...</div>;
  }
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
      {/* <Dialog
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
      </Dialog> */}
    </Form>
  );
};
