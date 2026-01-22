import { useCallback, useRef } from 'react';
import { DialogProps, useDialogManager } from '@ianpaschal/combat-command-components';

type OpenDialogArgs = Omit<DialogProps, 'open' | 'id' | 'dirty'>;

export const useDialogInstance = (): {
  open: (props: OpenDialogArgs) => void;
  close: () => void;
} => {
  const { open, close } = useDialogManager();
  const rootIdRef = useRef<string | null>(null);

  const openConfirm = useCallback((props: OpenDialogArgs) => {
    const id = open(props);
    rootIdRef.current = id;
  }, [open]);

  const closeConfirm = useCallback(() => {
    if (rootIdRef.current) {
      close(rootIdRef.current);
      rootIdRef.current = null;
    }
  }, [close]);

  return {
    open: openConfirm,
    close: closeConfirm,
  };
};
