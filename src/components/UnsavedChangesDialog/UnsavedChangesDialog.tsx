import { Blocker } from 'react-router-dom';

import { Dialog } from '~/components/generic/Dialog';

export interface UnsavedChangesDialogProps {
  blocker: Blocker;
}

export const UnsavedChangesDialog = ({
  blocker,
}: UnsavedChangesDialogProps) => (
  <Dialog
    open={blocker.state === 'blocked'}
    title="You have unsaved changes"
    description="Are you sure you want to navigate away? Unsaved changes will be lost."
    width="small"
    onCancel={() => {
      // console.log('cancel');
      if (blocker.reset) {
        blocker.reset();
      }
    }}
    actions={[
      // {
      // label: 'Cancel', onClick: () => {
      //   console.log('cancel');
      //   if (blocker.reset) {
      //     blocker.reset();
      //   }
      // },
      //   muted: true,
      // },
      { label: 'Continue', onClick: blocker.proceed, variant: 'primary', intent: 'danger' },
    ]}
  />
);
