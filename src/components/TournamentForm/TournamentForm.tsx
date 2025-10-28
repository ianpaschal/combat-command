import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormSetError,
} from 'react-hook-form';
import { getGameSystemOptions } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { TournamentId } from '~/api';
import { GameSystemConfigFields } from '~/components/GameSystemConfigFields';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { useGetTournament } from '~/services/tournaments';
import { validateForm } from '~/utils/validateForm';
import { CompetitorFields } from './components/CompetitorFields';
import { FormatFields } from './components/FormatFields';
import { GeneralFields } from './components/GeneralFields';
import {
  defaultValues,
  TournamentFormData,
  tournamentFormSchema,
  TournamentSubmitData,
} from './TournamentForm.schema';
import { convertDateToEpoch, convertEpochToDate } from './TournamentForm.utils';

import styles from './TournamentForm.module.scss';

export interface TournamentFormProps {
  id: string;
  className?: string;
  tournamentId?: TournamentId;
  onSubmit: (data: TournamentSubmitData) => void;
}

export const TournamentForm = ({
  id,
  className,
  onSubmit: handleSubmit,
  tournamentId,
}: TournamentFormProps): JSX.Element => {
  const { data: tournament } = useGetTournament(tournamentId ? { id: tournamentId } : 'skip');
  const form = useForm<TournamentFormData>({
    defaultValues: {
      ...defaultValues,
      ...(tournament ? {
        ...tournament,
        gameSystemConfig: tournament.gameSystemConfig,
        startsAt: convertEpochToDate(tournament.startsAt, tournament.location.timeZone),
        endsAt: convertEpochToDate(tournament.endsAt, tournament.location.timeZone),
        registrationClosesAt: convertEpochToDate(tournament.registrationClosesAt, tournament.location.timeZone),
        listSubmissionClosesAt: convertEpochToDate(tournament.listSubmissionClosesAt, tournament.location.timeZone),
      } : {}),
    },
    mode: 'onSubmit',
  });
  const onSubmit: SubmitHandler<TournamentFormData> = async (formData) => {
    const data = validateForm(tournamentFormSchema, formData, form.setError as UseFormSetError<FieldValues>);
    if (data) {
      handleSubmit({
        ...data,
        startsAt: convertDateToEpoch(data.startsAt, data.location.timeZone),
        endsAt: convertDateToEpoch(data.endsAt, data.location.timeZone),
        registrationClosesAt: convertDateToEpoch(data.registrationClosesAt, data.location.timeZone),
        listSubmissionClosesAt: convertDateToEpoch(data.listSubmissionClosesAt, data.location.timeZone),
      });
    }
  };
  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.TournamentForm, className)}>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>General</h2>
        <GeneralFields status={tournament?.status} />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Game System Configuration</h2>
        <FormField name="gameSystem" label="Game System">
          <InputSelect options={getGameSystemOptions()} />
        </FormField>
        <GameSystemConfigFields />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Competitors</h2>
        <CompetitorFields status={tournament?.status} />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Format</h2>
        <FormatFields status={tournament?.status} />
      </Card>
    </Form>
  );
};
