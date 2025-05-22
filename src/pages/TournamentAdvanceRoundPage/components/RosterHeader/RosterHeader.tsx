import { MouseEvent } from 'react';
import { UserPen } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog/TournamentCompetitorEditDialog.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { useToggleTournamentCompetitorActive } from '~/services/tournamentCompetitors/useToggleTournamentCompetitorActive';

import styles from './RosterHeader.module.scss';

export interface RosterHeaderProps {
  tournamentCompetitor: TournamentCompetitor;
}

export const RosterHeader = ({
  tournamentCompetitor,
}: RosterHeaderProps): JSX.Element => {
  const { _id: id, active } = tournamentCompetitor;
  const { useTeams } = useTournament();
  const { open } = useTournamentCompetitorEditDialog();
  const { mutation: toggleTournamentCompetitorActive, loading } = useToggleTournamentCompetitorActive();
  const handleToggleActive = (e: MouseEvent): void => {
    e.stopPropagation();
    toggleTournamentCompetitorActive({ id });
  };
  const handleSubstitutePlayer = (e: MouseEvent): void => {
    e.stopPropagation();
    open({ tournamentCompetitor });
  };
  return (
    <div className={styles.RosterHeader}>
      <IdentityBadge competitor={tournamentCompetitor} />
      <div className={styles.RosterHeader_Actions}>
        <Label>Checked In</Label>
        <Switch onClick={handleToggleActive} checked={active} disabled={loading} />
        {useTeams && (
          <Button variant="secondary" onClick={handleSubstitutePlayer}>
            <UserPen />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
