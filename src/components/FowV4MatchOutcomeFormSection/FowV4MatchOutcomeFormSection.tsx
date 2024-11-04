import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  getAttackerOptions,
  getMissionOptions,
  missions,
} from '~/components/FowV4MatchOutcomeFormSection/missions';
import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { FowV4MatchOutcomeFormData } from '~/types/fowV4/fowV4MatchOutcomeSchema';
import { fowV4OutcomeTypeOptions } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';
import { fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';

import styles from './FowV4MatchOutcomeFormSection.module.scss';

export interface FowV4MatchOutcomeFormSectionProps {
  fieldName?: string;
  player0Select: ReactNode;
  player1Select: ReactNode;
  playerLabels: string[];
}
export const FowV4MatchOutcomeFormSection = ({
  fieldName = 'outcome',
  player0Select,
  player1Select,
  playerLabels,
}: FowV4MatchOutcomeFormSectionProps) => {
  const { watch } = useFormContext();
  const {
    player_0_stance,
    player_1_stance,
    mission_id,
    // attacker,
    outcome_type,
  } = watch()[fieldName] as FowV4MatchOutcomeFormData;
  // const defender = attacker === 0 ? 1 : 0;

  const selectedMission = missions.find((mission) => mission.id === mission_id);

  // // Automatically set attacker based on mission and stances
  // useEffect(() => {
  //   if (player_0_stance && player_1_stance && selectedMission) {
  //     const roles = getRolesByStances(player_0_stance, player_1_stance);
  //     if (roles && selectedMission.attacker !== 'roll') {
  //       setValue(`${fieldName}.attacker`, roles.attacker);
  //     }
  //   } else {
  //     setValue(`${fieldName}.attacker`, undefined);
  //   }
  // }, [fieldName, setValue, selectedMission, player_0_stance, player_1_stance]);

  // // Automatically set firstTurn based on mission and attacker
  // useEffect(() => {
  //   if (attacker !== undefined) {
  //     if (selectedMission && selectedMission.firstTurn !== 'roll') {
  //       setValue(`${fieldName}.firstTurn`, selectedMission.firstTurn === 'attacker' ? attacker : defender);
  //     }
  //   }
  // }, [fieldName, setValue, selectedMission, attacker, defender]);

  // // Automatically set winner depending on outcome type
  // useEffect(() => {
  //   if (outcome_type === 'objective_taken' && !selectedMission?.objectives.defender) {
  //     setValue(`${fieldName}.winner`, attacker);
  //   }
  //   if (outcome_type === 'objective_defended') {
  //     setValue(`${fieldName}.winner`, defender);
  //   }
  //   if (outcome_type === 'time_out') {
  //     setValue(`${fieldName}.winner`, null);
  //   }
  // }, [fieldName, setValue, outcome_type, selectedMission, attacker, defender]);

  // // Automatically set outcome type depending on mission and winner
  // useEffect(() => {
  //   const attackerHasObjectives = selectedMission?.objectives.attacker;
  //   const defenderHasObjectives = selectedMission?.objectives.defender;
  //   if (attackerHasObjectives && defenderHasObjectives && outcome_type === 'objective_defended') {
  //     setValue(`${fieldName}.outcome_type`, null);
  //   }
  // }, [fieldName, setValue, outcome_type, selectedMission, attacker, defender]);

  const missionOptions = getMissionOptions(player_0_stance, player_1_stance, {
    matrixId: 'mission_pack_2023_04_extended_battle_plans',
    useAlternates: true,
  });
  const attackerOptions = getAttackerOptions([
    { label: playerLabels[0], stance: player_0_stance },
    { label: playerLabels[1], stance: player_1_stance },
  ], selectedMission?.id);
  const playerOptions = playerLabels.map((label, i) => ({ value: i, label }));

  // const disableWinnerField = playerOptions.length < 2 || !['objective_taken', 'force_broken'].includes(outcome_type);
  const winnerOptions = outcome_type === 'time_out' ? [{ value: null, label: 'None' }] : playerOptions;

  return (
    <div className={styles.Root}>
      <div className={styles.OpponentsSection}>
        <div className={styles.Player0Section}>
          {player0Select}
          <FormField name="outcome.player_0_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="outcome.player_0_units_lost" label="Units Lost">
            <InputNumber min={0} />
          </FormField>
        </div>
        <Separator orientation="vertical" />
        <div className={styles.Player1Section}>
          {player1Select}
          <FormField name="outcome.player_1_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="outcome.player_1_units_lost" label="Units Lost">
            <InputNumber min={0} />
          </FormField>
        </div>
      </div>
      <Separator />
      <div className={styles.ResultsSection}>
        <FormField name="outcome.mission_id" label="Mission">
          <InputSelect options={missionOptions} />
        </FormField>
        {/* <Animate show={showAttacker}> */}
        <FormField name="outcome.attacker" label="Attacker">
          <InputSelect options={attackerOptions} />
        </FormField>
        {/* </Animate> */}
        {/* <Animate show={showFirstTurn}> */}
        <FormField name="outcome.firstTurn" label="First Turn">
          <InputSelect options={playerOptions} />
        </FormField>
        {/* </Animate> */}
        <div className={styles.OutcomeSection}>
          <FormField name="outcome.turns_played" label="Rounds" >
            <InputText type="number" min={0} />
          </FormField>
          <FormField name="outcome.outcome_type" label="Outcome Type">
            <InputSelect options={fowV4OutcomeTypeOptions} />
          </FormField>
        </div>
        <FormField name="outcome.winner" label="Winner">
          <InputSelect options={winnerOptions} />
        </FormField>
      </div>
    </div>
  );
};