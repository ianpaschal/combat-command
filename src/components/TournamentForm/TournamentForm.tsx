import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { StorageId, TournamentId } from '~/api';
import { GameConfigFields } from '~/components/FowV4MatchResultForm/components/GameConfigFields';
import { Card } from '~/components/generic/Card';
import { Form } from '~/components/generic/Form';
import { useGetTournament } from '~/services/tournaments';
import { CompetitorFields } from './components/CompetitorFields';
import { FormatFields } from './components/FormatFields';
import { GeneralFields } from './components/GeneralFields';
import {
  defaultValues,
  TournamentFormData,
  tournamentFormSchema,
} from './TournamentForm.schema';

import styles from './TournamentForm.module.scss';

export type TournamentFormSubmitData = Omit<TournamentFormData, 'logoFile' | 'bannerFile'> & {
  logoStorageId?: StorageId | null;
  bannerStorageId?: StorageId | null;
};

export interface TournamentFormProps {
  id: string;
  className?: string;
  tournamentId?: TournamentId;
  onSubmit: (data: TournamentFormSubmitData) => void;
}

export const TournamentForm = ({
  id,
  className,
  onSubmit: handleSubmit,
  tournamentId,
}: TournamentFormProps): JSX.Element => {
  const { data: tournament } = useGetTournament(tournamentId ? { id: tournamentId } : 'skip');
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      ...defaultValues,
      ...tournament,
    },
    mode: 'onSubmit',
  });
  const onSubmit: SubmitHandler<TournamentFormData> = async (formData) => {
    handleSubmit(formData);
  };
  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.TournamentForm, className)}>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>General</h2>
        <GeneralFields status={tournament?.status} />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Game System Configuration</h2>
        {/* TODO: Add game system selection & render appropriate fields */}
        <GameConfigFields showAdvancedOptions />
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
