import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { Form } from '~/components/generic/Form';
import { InputFile } from '~/components/InputFile/InputFile';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useAddPhotoToMatchResult } from '~/services/photos/useAddPhotoToMatchResult';
import { useMatchResultPhotoUploadDialog } from './MatchResultPhotoUploadDialog.hooks';
import {
  defaultValues,
  MatchResultPhotoUploadFormData,
  matchResultPhotoUploadFormSchema,
} from './MatchResultPhotoUploadDialog.schema';

import styles from './MatchResultPhotoUploadDialog.module.scss';

export const MatchResultPhotoUploadDialog = (): JSX.Element => {
  const matchResult = useMatchResult();
  const { id, close } = useMatchResultPhotoUploadDialog(matchResult._id);

  const form = useForm<MatchResultPhotoUploadFormData>({
    resolver: zodResolver(matchResultPhotoUploadFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const { addPhotoToMatchResult, loading } = useAddPhotoToMatchResult({ onSuccess: close });
  const onSubmit: SubmitHandler<MatchResultPhotoUploadFormData> = (data) => {
    data.files.forEach((file: File) => {
      addPhotoToMatchResult(matchResult._id, file, {
        onError: (error) => {
          console.error('Error uploading photo:', error);
        },
        onSuccess: () => {
          console.info('Success with file', file);
        },
      });
    });
  };
  return (
    <ControlledDialog id={id}>
      <DialogHeader title="Upload Photos" onCancel={close} />
      <Form className={styles.Form} onSubmit={onSubmit} id="match-result-photo-form" form={form}>
        <InputFile name="files" />
      </Form>
      <DialogActions>
        <Button disabled={loading} text="Cancel" variant="secondary" onClick={close} />
        <Button form="match-result-photo-form" loading={loading} text="Save" type="submit" />
      </DialogActions>
    </ControlledDialog>
  );
};
