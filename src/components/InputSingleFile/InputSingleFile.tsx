import { forwardRef, MouseEvent } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { ImageUp, Trash } from 'lucide-react';

import { StorageId } from '~/api';
import { Button } from '~/components/generic/Button';
import { useGetFileUrl, useUploadFile } from '~/services/files';

import styles from './InputSingleFile.module.scss';

interface InputSingleFileProps {
  accept?: Accept;
  className?: string;
  name: string;
  onChange?: (value: StorageId) => void;
  onReset?: (name: string) => void;
  value?: StorageId;
  hasError?: boolean;
}

export const InputSingleFile = forwardRef<HTMLDivElement, InputSingleFileProps>(({
  accept,
  className,
  name,
  onChange,
  onReset,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasError = false,
  ...props
}, ref): JSX.Element => {
  const { data: fileUrl } = useGetFileUrl(value ? { id: value } : 'skip');
  const { mutation: uploadFile, loading: uploadFileLoading } = useUploadFile({
    onSuccess: (id) => {
      if (id && onChange) {
        onChange(id);
      }
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async ([file]) => {
      await uploadFile(file);
    },
    accept,
    maxFiles: 1,
  });

  const handleReset = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (onReset) {
      onReset(name);
    }
  };

  return (
    <div className={clsx(styles.InputSingleFile, className)}>
      <div className={styles.InputSingleFile_Preview}>
        {uploadFileLoading && (
          <p>Loading</p>
        )}
        {value && (
          <>
            <img src={fileUrl} />
            <Button className={styles.InputSingleFile_ClearButton} size="small" onClick={handleReset}>
              <Trash />
            </Button>
          </>
        )}
      </div>
      <div className={styles.InputSingleFile_Dropzone} {...getRootProps()} ref={ref}>
        <ImageUp />
        <span>Drag files here or click to browse...</span>
        <input {...props} id={name} {...getInputProps()} />
      </div>
    </div>
  );
});
