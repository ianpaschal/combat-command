import { ChangeEvent, useId } from 'react';
import { Button, ButtonProps } from '@ianpaschal/combat-command-components';

export interface FileButtonProps extends Omit<ButtonProps, 'onChange'> {
  accept?: string[];
  onChange?: (files: FileList) => void;
}

export const FileButton = ({
  accept = [],
  onChange,
  ...props
}: FileButtonProps): JSX.Element => {
  const id = useId();
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    onChange?.(event.target.files);
  };
  return (
    <>
      <label htmlFor={id}>
        <Button {...props} />
      </label>
      <input
        type="file"
        id={id}
        accept={Object.keys(accept).join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
};
