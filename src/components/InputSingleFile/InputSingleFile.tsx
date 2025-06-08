import { forwardRef, MouseEvent } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { ImageUp, Trash } from 'lucide-react';

import { Button } from '~/components/generic/Button';

import styles from './InputSingleFile.module.scss';

interface InputSingleFileProps {
  accept?: Accept;
  className?: string;
  name: string;
  onChange?: (value?: File | null) => void;
  value?: File | null;
  hasError?: boolean;
}

export const InputSingleFile = forwardRef<HTMLDivElement, InputSingleFileProps>(({
  accept,
  className,
  name,
  onChange,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasError = false,
  ...props
}, ref): JSX.Element => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: ([file]) => {
      if (onChange) {
        onChange(file);
      }
    },
    accept,
    maxFiles: 1,
  });

  const handleRemove = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) {
      onChange(null);
    }
  };
  return (
    <div className={clsx(styles.InputSingleFile, className)}>
      {value && (
        <div className={styles.InputSingleFile_Preview}>
          <img src={URL.createObjectURL(value)} />
          <Button className={styles.InputSingleFile_ClearButton} size="small" onClick={handleRemove}>
            <Trash />
          </Button>
        </div>
      )}
      <div className={styles.InputSingleFile_Dropzone} {...getRootProps()} ref={ref}>
        <ImageUp />
        <span>Drag files here or click to browse...</span>
        <input {...props} id={name} {...getInputProps()} />
      </div>
    </div>
  );
});
