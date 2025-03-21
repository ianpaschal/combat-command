import { useMemo } from 'react';

import { TournamentCompetitor } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { useTournament } from '~/components/TournamentProvider';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

// TODO: Convert to hook to use useTournament?
export const useCompetitorAvatar = (tournamentCompetitor: TournamentCompetitor) => {
  const tournament = useTournament();
  return useMemo(() => {
    if (tournament.competitorSize === 1) {
      return <Avatar url={tournamentCompetitor.players[0].user?.avatarUrl} />;
    }
    if (tournament.competitorSize > 1 && tournament.useNationalTeams && tournamentCompetitor.teamName) {
      return <FlagCircle code={tournamentCompetitor.teamName} size="100%" />;
    }
    return null;
  }, [tournament, tournamentCompetitor]);
};

// TODO: Convert to hook to use useTournament?
export const useCompetitorDisplayName = (tournamentCompetitor: TournamentCompetitor) => {
  const tournament = useTournament();
  return useMemo(() => {
    if (tournament.competitorSize === 1) {
      return getUserDisplayNameString(tournamentCompetitor.players[0].user);
    }
    if (tournament.competitorSize > 1 && tournamentCompetitor.teamName) {
      if (tournament.useNationalTeams) {
        return getCountryName(tournamentCompetitor.teamName) ?? 'Unknown Team';
      }
      return tournamentCompetitor.teamName;
    }
  }, [tournament, tournamentCompetitor]);
};
