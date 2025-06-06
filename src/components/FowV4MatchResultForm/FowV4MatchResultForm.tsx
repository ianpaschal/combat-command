import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { MatchResultId, TournamentPairingId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
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
  ] = useAsyncState<TournamentPairingId | 'single'>('single', matchResult?.tournamentPairingId);

  // const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

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
    if (tournamentPairingId !== 'single') {
      // setConfirmDialogOpen(true);
    } else {
      if (matchResult) {
        updateMatchResult({ ...data, id: matchResult._id, playedAt });
      } else {
        createMatchResult({ ...data, playedAt });
      }
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

  const resultForOptions = [
    { value: 'single', label: 'Single Match' },
    ...(tournamentPairings || []).map((pairing) => ({
      value: pairing._id,
      label: getTournamentPairingDisplayName(pairing),
    })),
  ];

  const handleChangeResultFor = (value?: SelectValue): void => {
    if (value) {
      // TODO: Remove cast
      setTournamentPairingId(value as TournamentPairingId);
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
