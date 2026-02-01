import { TournamentPairingMethod } from '@ianpaschal/combat-command-game-systems/common';

import {
  Tournament,
  TournamentId,
  TournamentPairingOptions,
} from '~/api';

export type TournamentPairingArgs = {
  method: TournamentPairingMethod;
  options: TournamentPairingOptions;
  round: number;
  tournamentId: TournamentId;
};

export const getDefaultValues = (tournament: Tournament): TournamentPairingArgs => {
  const lastRound = tournament?.lastRound ?? -1;
  const isFirstRound = (tournament?.lastRound ?? -1) < 0;
  const method = isFirstRound ? (
    TournamentPairingMethod.Random
  ) : (
    tournament?.pairingMethod ?? TournamentPairingMethod.Adjacent
  );

  return {
    tournamentId: tournament._id,
    round: lastRound + 1,
    method,
    options: {
      allowRepeats: false,
      allowSameAlignment: method !== TournamentPairingMethod.AdjacentAlignment,
    },

  };
};
