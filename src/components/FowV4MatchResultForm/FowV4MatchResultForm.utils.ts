import { UseFormReset } from 'react-hook-form';

import { getRolesByStances, missions } from '~/components/FowV4MatchResultForm/missions';
import { InputSelectOption } from '~/components/generic/InputSelect';
import { TournamentDeep } from '~/types/db';
import { MatchDraft } from '~/types/db/Matches';
import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
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
  tournament?: Pick<TournamentDeep, 'pairings' | 'game_system_config' | 'game_system_config_id'>,
): MatchDraft | null => {
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
      game_system_config: tournament.game_system_config,
    });
  }
  return null;
};

type AutoFillValuesReturn = Partial<Pick<TournamentMatchFormData, 'attacker'|'first_turn'|'winner'>>;

export const autoFillValues = (
  values: TournamentMatchFormData,
  reset: UseFormReset<TournamentMatchFormData>,
): AutoFillValuesReturn => {
  const {
    player_0_stance,
    player_1_stance,
    mission_id,
    outcome_type,
  } = values;

  const autoValues: AutoFillValuesReturn = {};

  // Auto-fill "attacker" if possible
  if (player_0_stance && player_1_stance) {
    const roles = getRolesByStances(player_0_stance, player_1_stance);
    if (roles?.attacker !== undefined) {
      console.log('will set attacker');
      autoValues.attacker = roles.attacker;
    }
  }
  console.log(autoValues);

  const selectedMission = missions.find(({ id }) => id === mission_id);
  const attacker = autoValues.attacker !== undefined ? autoValues.attacker : values.attacker;
  const defender = attacker === 0 ? 1 : 0;
  
  if (selectedMission && attacker !== undefined) {
    // Auto-fill "first_turn" if possible
    if (selectedMission.firstTurn === 'attacker') {
      autoValues.first_turn = attacker;
    }
    if (selectedMission.firstTurn === 'defender') {
      autoValues.first_turn = defender;
    }

    // Auto-fill "winner" if possible
    if (outcome_type === 'time_out') {
      autoValues.winner = null;
    }
    if (outcome_type === 'objective_captured' && !selectedMission.objectives.defender) {
      autoValues.winner = autoValues.attacker;
    }
    if (outcome_type === 'attack_repelled') {
      autoValues.winner = defender;
    }
  }

  // reset((prev) => ({ ...prev, autoValues }), { keepDefaultValues: true });
  return autoValues;
};