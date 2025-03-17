import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
} from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { get, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { Upload } from 'lucide-react';

import { Label } from '~/components/generic/Label';

import styles from './InputFile.module.scss';

interface InputFileProps extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'accept'> {
  label?: string;
  accept?: Accept;
  name: string;
  description?: string;
}

export const InputFile = ({
  accept,
  name,
  label,
  description,
  className,
  ...props
}: InputFileProps): JSX.Element => {
  const {
    register,
    unregister,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);
  const files: File[] = watch(name);
  const onDrop = (droppedFiles: File[]) => {
    setValue(name, droppedFiles, { shouldValidate: true });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });
  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);
  return (
    <div className={clsx(styles.InputFile, className)} {...getRootProps()}>
      {label && (
        <Label htmlFor={name}>{label}</Label>
      )}
      <input {...props} id={name} {...getInputProps()} />
      <div data-active={isDragActive} className={styles.Dropzone}>
        <Upload />
        <span>Drag and drop files here, or click to browse...</span>
      </div>
      {description && (
        <div className={styles.Description}>{description}</div>
      )}
      {!!error && (
        <div className={styles.Error}>{error?.message as string}</div>
      )}
      <div className={styles.FilePreviewList}>
        {(files || []).map((file) => (
          <div key={file.name} className={styles.FilePreview}>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
