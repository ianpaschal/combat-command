import { useMemo } from 'react';

import { TournamentCompetitor } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { useTournament } from '~/components/TournamentProvider';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const useCompetitorAvatar = (tournamentCompetitor: TournamentCompetitor) => {
  const { competitorSize, useNationalTeams } = useTournament();
  return useMemo(() => {
    if (competitorSize === 1) {
      return <Avatar url={tournamentCompetitor.players[0].user?.avatarUrl} />;
    }
    if (competitorSize > 1 && tournamentCompetitor.teamName) {
      if (useNationalTeams) {
        return <FlagCircle code={tournamentCompetitor.teamName} />;
      }
      return <Avatar />;
    }
    return <Avatar />;
  }, [competitorSize, useNationalTeams, tournamentCompetitor]);
};

// TODO: Convert to hook to use useTournament?
export const useCompetitorDisplayName = (tournamentCompetitor: TournamentCompetitor) => {
  const { competitorSize, useNationalTeams } = useTournament();
  return useMemo(() => {
    if (competitorSize === 1) {
      return getUserDisplayNameString(tournamentCompetitor.players[0].user);
    }
    if (competitorSize > 1) {
      if (tournamentCompetitor.teamName) {
        if (useNationalTeams) {
          return getCountryName(tournamentCompetitor.teamName) ?? 'Unknown Country';
        }
        return tournamentCompetitor.teamName;
      }
      return 'Unknown Team';
    }
    return 'Unknown Competitor';
  }, [competitorSize, useNationalTeams, tournamentCompetitor]);
};
