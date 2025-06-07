import { ReactNode, useState } from 'react';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Dialog } from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './CheckInMatchDialog.module.scss';

export interface CheckInMatchDialogProps {
  children?: ReactNode;
  trigger?: ReactNode;
}

export const CheckInMatchDialog = ({
  children,
  trigger,
}: CheckInMatchDialogProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || children}
      title="Add Match Result"
      actions={[
        { label: 'Cancel', variant: 'secondary', onClick: () => setOpen(false), cancel: true },
        { label: 'Save Match', type: 'submit', form: 'fow-v4-match-result-form' },
      ]}
    >
      <ScrollArea type="scroll" indicatorBorders={['top', 'bottom']}>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          className={styles.Form}
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Dialog>
  );
};
