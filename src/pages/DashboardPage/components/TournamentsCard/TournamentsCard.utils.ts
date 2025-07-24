import {
  TournamentCompetitor,
  TournamentPairing,
  UserId,
} from '~/api';

export const getOpponent = (userId?: UserId, pairing?: TournamentPairing): TournamentCompetitor | null => {

  if (!userId || !pairing) {
    return null;
  }

  const competitor0UserIds = pairing.tournamentCompetitor0.players.map((player) => player.user._id);
  if (competitor0UserIds.includes(userId)) {
    return pairing.tournamentCompetitor1;
  }
  const competitor1UserIds = pairing.tournamentCompetitor0.players.map((player) => player.user._id);
  if (competitor1UserIds.includes(userId)) {
    return pairing.tournamentCompetitor0;
  }

  return null;
};
