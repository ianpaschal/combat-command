import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { Upload } from 'lucide-react';

import { List, StorageId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Form } from '~/components/generic/Form';
import { ListDetails } from '~/components/ListDetails';
import { useUploadDocument } from '~/services/files';
import { validateForm } from '~/utils/validateForm';
import {
  defaultValues,
  FormData,
  schema,
  SubmitData,
} from './ListForm.schema';

import styles from './ListForm.module.scss';

const FILE_ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export interface ListFormProps {
  className?: string;
  disabled?: boolean;
  forcedValues: Omit<SubmitData, 'storageId'> & {
    storageId?: StorageId;
  };
  id?: string;
  loading?: boolean;
  onSubmit: (data: SubmitData) => void;
  setDirty?: (dirty: boolean) => void;
  existingValues?: List | null;
}

export const ListForm = ({
  className,
  disabled = false,
  forcedValues,
  id,
  onSubmit,
  setDirty,
  existingValues,
}: ListFormProps): JSX.Element => {
  const user = useAuth();
  const form = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      ...existingValues,
      ...forcedValues,
    },
    mode: 'onSubmit',
  });

  const { formState: { isDirty } } = form;
  useEffect(() => {
    setDirty?.(isDirty);
    return () => setDirty?.(false);
  }, [isDirty, setDirty]);

  const handleSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    const validFormData = validateForm(schema, {
      ...formData,
      ...forcedValues,
      userId: user?._id,
    }, form.setError);
    if (validFormData) {
      onSubmit(validFormData);
    }
  };

  // const { getForceDiagramOptions } = getGameSystem(forcedValues.gameSystem);

  // File upload
  const { mutation: uploadFile } = useUploadDocument({
    onSuccess: (id) => {
      if (id) {
        form.setValue('storageId', id, { shouldDirty: true });
      }
    },
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: FILE_ACCEPT,
    onDrop: async (files) => {
      if (files[0]) {
        await uploadFile(files[0]);
      }
    },
  });
  // const handleReplace = async (files: FileList): Promise<void> => {
  //   if (files[0]) {
  //     await uploadFile(files[0]);
  //   }
  // };

  // File render
  // const storageId = form.watch('storageId');
  // const { data: file } = useGetFileMetadata(storageId ? { id: storageId } : 'skip');

  // const handleReplace = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
  //   if (!event.target.files || event.target.files.length === 0) {
  //     throw new Error('You must select an image to upload.');
  //   }
  //   const file = event.target.files[0];
  //   if (user && file) {
  //     await uploadFile(file);
  //   }
  // };

  // const handleDownload = async (): Promise<void> => {
  //   if (!file) {
  //     return;
  //   }
  //   try {
  //     const response = await fetch(file.url);
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `list.${file.url.split('.').pop()}`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //   }
  // };

  // FUTURE: Add formations array
  // const { fields: formationFields, append: appendFormation, remove: removeFormation } = useFieldArray({
  //   control: form.control,
  //   name: 'data.formations',
  // });
  // const handleAddFormation = (e: MouseEvent): void => {
  //   e.preventDefault();
  //   appendFormation({
  //     id: nanoid(),
  //     sourceId: PLACEHOLDER_UNIT_OPTIONS[0].value,
  //   });
  // };

  const storageId = form.watch('storageId');

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.ListForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      {storageId && (
        <ListDetails list={{ storageId }} />
      )}
      <div
        className={styles.ListForm_FileDropzone}
        data-active={isDragActive}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Upload />
        <span>Drag files here or click to browse...</span>
      </div>
    </Form>
  );
};
