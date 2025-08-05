import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { FormField } from '~/components/generic/Form';
import { InputDateTime } from '~/components/generic/InputDateTime';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputSelect, InputSelectOption } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { InputSingleFile } from '~/components/InputSingleFile/InputSingleFile';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

import styles from './GeneralFields.module.scss';

export interface GeneralFieldsProps {
  className?: string;
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const GeneralFields = ({
  className,
  status = 'draft',
}: GeneralFieldsProps): JSX.Element => {
  const { resetField, watch } = useFormContext<TournamentFormData>();

  // Once a tournament is active, lock some fields
  const disableFields = !['draft', 'published'].includes(status);

  const getYearOptions = () => {
    const options: InputSelectOption<string>[] = [{
      value: '0',
      label: 'None',
    }];
    for (let i = 2010; i <= new Date().getFullYear() + 1; i += 1) {
      options.push({
        value: i.toString(),
        label: i.toString(),
      });
    }
    return options;
  };

  const [title, editionYear] = watch(['title', 'editionYear']);

  return (
    <div className={clsx(styles.GeneralFields, className)}>
      <div className={styles.GeneralFields_TitleRow}>
        <FormField name="title" label="Title" description="Avoid including points and other rules in the title." disabled={disableFields}>
          <InputText type="text" />
        </FormField>
        <FormField name="editionYear" label="Year" disabled={disableFields}>
          <InputSelect options={getYearOptions()} />
        </FormField>
      </div>
      {editionYear > 0 && (
        <div className={styles.GeneralFields_Preview}>
          <p className={styles.GeneralFields_Preview_Description}>Your tournament's name will render as:</p>
          <h2>{getTournamentDisplayName({ title, editionYear })}</h2>
        </div>
      )}
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
      <FormField name="logoStorageId" label="Logo" disabled={disableFields}>
        <InputSingleFile name="logoStorageId" onReset={(name) => resetField(name as keyof TournamentFormData)} />
      </FormField>
      <FormField name="bannerStorageId" label="Banner Background" disabled={disableFields}>
        <InputSingleFile name="bannerStorageId" onReset={(name) => resetField(name as keyof TournamentFormData)} />
      </FormField>
    </div>
  );
};
