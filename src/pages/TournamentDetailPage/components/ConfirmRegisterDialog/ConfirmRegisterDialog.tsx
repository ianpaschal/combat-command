import clsx from 'clsx';

import { ConfirmationDialog } from '~/components/ConfirmationDialog';
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
      <span>{`${tournament.title} requires that all players' real names are visible to organizers and other players.`}</span>
      <strong>Your name visibility will be updated to 'Tournaments', making it visible to organizers and other players.</strong>
      {/* TODO: Add a preview avatar? */}
    </ConfirmationDialog>
  );
};
