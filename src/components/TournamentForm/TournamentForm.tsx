import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { TournamentId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { GameConfigFields } from '~/components/FowV4MatchResultForm/components/GameConfigFields';
import { Card } from '~/components/generic/Card';
import { Form } from '~/components/generic/Form';
import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';
import { useFileFromUrl } from '~/hooks/useFileFromUrl';
import { useCreateTournament } from '~/services/tournaments/useCreateTournament';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';
import { useUpdateTournament } from '~/services/tournaments/useUpdateTournament';
import { useUploadConvexImage } from '~/services/useUploadConvexFile';
import { CompetitorFields } from './components/CompetitorFields';
import { FormatFields } from './components/FormatFields';
import { GeneralFields } from './components/GeneralFields';
import {
  defaultValues,
  TournamentFormData,
  tournamentFormSchema,
} from './TournamentForm.schema';

import styles from './TournamentForm.module.scss';

export interface TournamentFormProps {
  id: string;
  className?: string;
  tournamentId?: TournamentId;
  onSuccess?: (id: string) => void;
}

export const TournamentForm = ({
  id,
  className,
  onSuccess,
  tournamentId,
}: TournamentFormProps): JSX.Element => {
  const user = useAuth();
  const { data: tournament } = useFetchTournament(tournamentId);
  const { mutation: createTournament } = useCreateTournament({ onSuccess });
  const { mutation: updateTournament } = useUpdateTournament({ onSuccess });
  const { mutation: uploadConvexImage } = useUploadConvexImage();

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      ...defaultValues,
      ...tournament,
    },
    mode: 'onSubmit',
  });
  const blocker = useBlocker(() => form.formState.isDirty); // FIXME: This is broken in RHF

  // Async load images as files
  const existingLogoFile = useFileFromUrl(tournament?.logoUrl);
  useEffect(() => {
    if (existingLogoFile && !form.watch('logoFile')) {
      form.setValue('logoFile', existingLogoFile);
    }
  }, [form, existingLogoFile]);
  const existingBannerFile = useFileFromUrl(tournament?.bannerUrl);
  useEffect(() => {
    if (existingBannerFile && !form.watch('bannerFile')) {
      form.setValue('bannerFile', existingBannerFile);
    }
  }, [form, existingBannerFile]);

  const onSubmit: SubmitHandler<TournamentFormData> = async (formData) => {
    const { data } = tournamentFormSchema.safeParse(formData);
    if (!data) {
      throw new Error('Failed to parse form schema!');
    }

    const { logoFile, bannerFile, ...restData } = data;
    let logoStorageId;
    if (form.formState.dirtyFields.logoFile) {
      if (logoFile) {
        logoStorageId = await uploadConvexImage(logoFile);
      } else {
        logoStorageId = null;
      }
    }
    let bannerStorageId;
    if (form.formState.dirtyFields.bannerFile) {
      if (bannerFile) {
        bannerStorageId = await uploadConvexImage(bannerFile);
      } else {
        bannerStorageId = null;
      }
    }
    if (tournament) {
      updateTournament({
        id: tournament._id,
        ...restData,
        logoStorageId,
        bannerStorageId,
      });
    } else {
      createTournament({
        ...restData,
        logoStorageId,
        bannerStorageId,
        organizerUserIds: [user!._id],
      });
    }
  };

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.TournamentForm, className)}>
      <UnsavedChangesDialog blocker={blocker} />
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>General</h2>
        <GeneralFields />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Game System Configuration</h2>
        {/* TODO: Add game system selection & render appropriate fields */}
        <GameConfigFields showAdvancedOptions />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Competitors</h2>
        <CompetitorFields />
      </Card>
      <Card className={styles.TournamentForm_SectionCard}>
        <h2>Format</h2>
        <FormatFields />
      </Card>
    </Form >
  );
};
