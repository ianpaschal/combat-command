import {
  cloneElement,
  ReactElement,
  useRef,
} from 'react';
import { DialogProps, useDialogManager } from '@ianpaschal/combat-command-components';

type UseFormDialogProps = Pick<DialogProps, 'title'> & {
  content: ReactElement;
  formId: string;
  submitLabel: string;
};
type UseFormDialogResult = {
  open: () => void;
  close: () => void;
};

export const useFormDialog = ({
  content,
  formId,
  submitLabel,
  title,
}: UseFormDialogProps): UseFormDialogResult => {
  const { open, close, setDirty } = useDialogManager();
  const dialogId = useRef<string | undefined>(undefined);
  return {
    open: () => dialogId.current = open({
      title,
      content: cloneElement(content, {
        id: formId,
        setDirty: (dirty: boolean): void => {
          if (dialogId.current) {
            setDirty(dialogId.current, dirty);
          }
        },
      }),
      onCancel: (dirty: boolean): void => {
        if (dirty) {
          open({
            title: 'Discard Changes',
            content: (
              <span>Are you sure you want to navigate away? Your changes will be lost.</span>
            ),
            actions: [{
              intent: 'danger',
              onClick: () => {
                if (dialogId.current) {
                  close(dialogId.current);
                  dialogId.current = undefined;
                }
              },
              text: 'Discard',
            }],
          });
        } else if (dialogId.current) {
          close(dialogId.current);
          dialogId.current = undefined;
        }
      },
      actions: [{
        form: formId,
        text: submitLabel,
        type: 'submit',
      }],
    }),
    close: () => {
      if (dialogId.current) {
        close(dialogId.current);
        dialogId.current = undefined;
      }
    },
  };
};
