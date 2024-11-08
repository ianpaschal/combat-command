import { InputSelectOption } from '~/components/generic/InputSelect';
import {
  MatchResultDraft,
  TournamentDeep,
  TournamentPairingDeep,
} from '~/types/db';
import { TournamentMatchFormData } from '~/types/Match';
import { getCompetitorDisplay } from '~/utils/common/getCompetitorDisplay';

export const getPairingOptions = (
  pairings: TournamentPairingDeep[],
  currentRound: number,
): InputSelectOption<string>[] => (
  pairings.filter((pairing) => pairing.round_index === currentRound).map((pairing) => {
    const [competitor0Name] = getCompetitorDisplay(pairing.competitor_0);
    const [competitor1Name] = getCompetitorDisplay(pairing.competitor_1);
    return {
      value: pairing.id,
      label: `${competitor0Name} vs. ${competitor1Name}`,
    };
  })
);

export const getSelectedPairing = (
  tournamentPairingId: string | null,
  pairings: TournamentPairingDeep[],
): TournamentPairingDeep | undefined => (
  pairings.find(
    (pairing) => pairing.id === tournamentPairingId,
  )
);

export const getDraftMatch = (
  data: TournamentMatchFormData,
  tournament?: Pick<TournamentDeep, 'pairings' | 'game_system_config_id'>,
): MatchResultDraft | null => {
  const { player_0_id, player_1_id, tournament_pairing_id } = data;
  if (!tournament) {
    return null;
  }
  const { pairings, game_system_config_id } = tournament;
  const selectedPairing = getSelectedPairing(tournament_pairing_id, pairings);
  if (game_system_config_id && selectedPairing && player_0_id && player_1_id ) {
    return ({
      ...data,
      game_system_config_id,
      player_0: {
        profile: selectedPairing.competitor_0.players.find((player) => player.id === player_0_id)!.profile,
        competitor: selectedPairing.competitor_0,
      },
      player_1: {
        profile: selectedPairing.competitor_1.players.find((player) => player.id === player_1_id)!.profile,
        competitor: selectedPairing.competitor_1,
      },
    });
  }
  return null;
}; 