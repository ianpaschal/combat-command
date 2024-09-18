import { Blocker } from 'react-router-dom';

import { Button } from '~/components/generic/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '~/components/generic/Dialog';

export interface UnsavedChangesDialogProps {
  blocker: Blocker;
}

export const UnsavedChangesDialog = ({
  blocker,
}: UnsavedChangesDialogProps) => (
  <Dialog open={blocker.state === 'blocked'}>
    <DialogContent title="You have unsaved changes" description="Are you sure you want to navigate away? Unsaved changes will be lost.">
      <DialogFooter>
        <Button onClick={blocker.reset} variant="solid-muted">
          Cancel
        </Button>
        <Button onClick={blocker.proceed} intent="danger">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);