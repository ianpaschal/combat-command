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
    actions={[
      { label: 'Cancel', onClick: blocker.reset, muted: true },
      { label: 'Continue', onClick: blocker.proceed, intent: 'danger' },
    ]}
  >
    Are you sure you want to navigate away? Unsaved changes will be lost.
  </Dialog>
);