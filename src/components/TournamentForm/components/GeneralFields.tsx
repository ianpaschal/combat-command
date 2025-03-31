import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { FormField } from '~/components/generic/Form';
import { InputDateTime } from '~/components/generic/InputDateTime';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { InputSingleFile } from '~/components/InputSingleFile/InputSingleFile';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';

import styles from './GeneralFields.module.scss';

export interface GeneralFieldsProps {
  className?: string;
}

export const GeneralFields = ({
  className,
}: GeneralFieldsProps): JSX.Element => {
  const { watch } = useFormContext<TournamentFormData>();
  const status = watch('status');

  // Once a tournament is active, lock some fields
  const allowedEditStatuses = ['draft', 'published'];
  const disableFields = !allowedEditStatuses.includes(status);

  return (
    <div className={clsx(styles.GeneralFields, className)}>
      <FormField name="title" label="Title" description="Avoid including points and other rules in the title." disabled={disableFields}>
        <InputText type="text" />
      </FormField>
      <FormField name="description" label="Description" disabled={disableFields}>
        <InputTextArea />
      </FormField>
      <FormField name="rulesPackUrl" label="Rules Pack URL" disabled={disableFields}>
        <InputText type="text" placeholder="http://" />
      </FormField>
      <FormField name="location" label="Location" disabled={disableFields}>
        <InputLocation />
      </FormField>
      <div className={styles.Stackable}>
        <FormField name="startsAt" label="Starts" disabled={disableFields}>
          <InputDateTime />
        </FormField>
        <FormField name="endsAt" label="Ends" disabled={disableFields}>
          <InputDateTime />
        </FormField>
      </div>
      <Separator />
      <FormField name="logoFile" label="Logo" disabled={disableFields}>
        <InputSingleFile name="logoFile" />
      </FormField>
      <FormField name="bannerFile" label="Banner Background" disabled={disableFields}>
        <InputSingleFile name="bannerFile" />
      </FormField>
    </div>
  );
};
