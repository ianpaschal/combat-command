import { MouseEvent } from 'react';
import { UserPen } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournament } from '~/components/TournamentProvider';
import { useRosterEditCompetitorPlayersDialog } from '~/pages/TournamentAdvanceRoundPage/components/RosterEditCompetitorPlayersDialog';
import { useToggleTournamentCompetitorActive } from '~/services/tournamentCompetitors/useToggleTournamentCompetitorActive';

import styles from './RosterHeader.module.scss';

export interface RosterHeaderProps {
  competitor: TournamentCompetitor;
}

export const RosterHeader = ({
  competitor,
}: RosterHeaderProps): JSX.Element => {
  const { useTeams } = useTournament();
  const { open } = useRosterEditCompetitorPlayersDialog();
  const { mutation: toggleTournamentCompetitorActive, loading } = useToggleTournamentCompetitorActive();
  const handleToggleActive = (e: MouseEvent): void => {
    e.stopPropagation();
    toggleTournamentCompetitorActive({ id: competitor._id });
  };
  const handleSubstitutePlayer = (e: MouseEvent): void => {
    e.stopPropagation();
    open({ competitor });
  };
  return (
    <div className={styles.RosterHeader}>
      <IdentityBadge competitor={competitor} />
      <div className={styles.RosterHeader_Actions}>
        <Label>Checked In</Label>
        <Switch onClick={handleToggleActive} checked={competitor.active} disabled={loading} />
        {useTeams && (
          <Button variant="secondary" onClick={handleSubstitutePlayer}>
            <UserPen />
            Replace Player
          </Button>
        )}
      </div>
    </div>
  );
};
