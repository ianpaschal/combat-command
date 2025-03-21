import clsx from 'clsx';

import { FormField } from '~/components/generic/Form';
import { InputDateTime } from '~/components/generic/InputDateTime';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { InputSingleFile } from '~/components/InputSingleFile/InputSingleFile';

import styles from './GeneralFields.module.scss';

export interface GeneralFieldsProps {
  className?: string;
}

export const GeneralFields = ({
  className,
}: GeneralFieldsProps): JSX.Element => (
  <div className={clsx(styles.GeneralFields, className)}>
    <FormField name="title" label="Title" description="Avoid including points and other rules in the title.">
      <InputText type="text" />
    </FormField>
    <FormField name="description" label="Description">
      <InputTextArea />
    </FormField>
    <FormField name="rulesPackUrl" label="Rules Pack URL">
      <InputText type="text" placeholder="http://" />
    </FormField>
    <FormField name="location" label="Location">
      <InputLocation />
    </FormField>
    <div className={styles.Stackable}>
      <FormField name="startsAt" label="Starts">
        <InputDateTime />
      </FormField>
      <FormField name="endsAt" label="Ends">
        <InputDateTime />
      </FormField>
    </div>
    <Separator />
    <FormField name="logoFile" label="Logo">
      <InputSingleFile name="logoFile" />
    </FormField>
    <FormField name="bannerFile" label="Banner Background">
      <InputSingleFile name="bannerFile" />
    </FormField>
  </div>
);
