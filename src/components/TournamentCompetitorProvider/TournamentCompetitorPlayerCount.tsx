import { Users } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Tag } from '~/components/generic/Tag';
import { useTournament } from '~/components/TournamentProvider';

export interface TournamentCompetitorPlayerCountProps {
  className?: string;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorPlayerCount = ({
  className,
  tournamentCompetitor,
}: TournamentCompetitorPlayerCountProps): JSX.Element => {
  const tournament = useTournament();
  return (
    <Tag className={className}>
      <Users />{`${tournamentCompetitor?.activeRegistrationCount ?? 0}/${tournament.competitorSize}`}
    </Tag>
  );
};
