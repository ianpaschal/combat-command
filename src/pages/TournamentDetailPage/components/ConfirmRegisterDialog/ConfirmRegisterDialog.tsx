import clsx from 'clsx';

import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { Warning } from '~/components/generic/Warning';
import { useTournament } from '~/components/TournamentProvider';
import { useConfirmRegisterDialog } from './ConfirmRegisterDialog.hooks';

import styles from './ConfirmRegisterDialog.module.scss';

export interface ConfirmRegisterDialogProps {
  className?: string;
  onConfirm?: () => void;
}

export const ConfirmRegisterDialog = ({
  className,
  onConfirm,
}: ConfirmRegisterDialogProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const { id } = useConfirmRegisterDialog();
  return (
    <ConfirmationDialog
      id={id}
      className={clsx(styles.ConfirmRegisterDialog, className)}
      title="Change Name Visibility"
      confirmLabel="Confirm"
      onConfirm={onConfirm}
    >
      <Warning>
        {`${tournament.title} requires that all players' real names are visible to organizers and other players.`}
      </Warning>
      <span>Your name visibility will be changed from <strong>{user?.nameVisibility}</strong> to <strong>Tournaments</strong>, making it visible to organizers and other players.</span>
    </ConfirmationDialog>
  );
};
