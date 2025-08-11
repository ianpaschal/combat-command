import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getMission } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { FowV4MatchResultFormData } from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.schema';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import {
  computeAttacker,
  computeFirstTurn,
  computeWinner,
  useMissionOptions,
  useOutcomeTypeOptions,
  usePlayerOptions,
} from './CommonFields.hooks';

import styles from './CommonFields.module.scss';

export const CommonFields = (): JSX.Element => {
  const { watch, setValue } = useFormContext<FowV4MatchResultFormData>();
  const [missionPackVersion, details] = watch(['gameSystemConfig.missionPackVersion', 'details']);
  const {
    mission,
    player0BattlePlan,
    player1BattlePlan,
    attacker,
    firstTurn,
    outcomeType,
    winner,
  } = details;

  const missionOptions = useMissionOptions();
  const outcomeTypeOptions = useOutcomeTypeOptions();
  const playerOptions = usePlayerOptions();
  const winnerOptions = [...playerOptions, { label: 'None', value: -1 }];

  const selectedMission = getMission(missionPackVersion, mission);

  // Auto-fill attacker, if possible
  const autoAttacker = computeAttacker(selectedMission, [player0BattlePlan, player1BattlePlan]);
  const disableAttackerField = autoAttacker !== undefined;
  useEffect(() => {
    if (autoAttacker !== undefined && attacker !== autoAttacker) {
      setValue('details.attacker', autoAttacker);
    }
  }, [attacker, autoAttacker, setValue]);

  // Auto-fill firstTurn, if possible
  const autoFirstTurn = computeFirstTurn(selectedMission, attacker);
  const disableFirstTurnField = autoFirstTurn !== undefined;
  useEffect(() => {
    if (autoFirstTurn !== undefined && firstTurn !== autoFirstTurn) {
      setValue('details.firstTurn', autoFirstTurn);
    }
  }, [firstTurn, autoFirstTurn, setValue]);

  // Auto-fill winner, if possible
  const autoWinner = computeWinner(selectedMission, attacker, outcomeType);
  const disableWinner = autoWinner !== undefined;
  useEffect(() => {
    if (autoWinner !== undefined && winner !== autoWinner) {
      setValue('details.winner', autoWinner);
    }
  }, [winner, autoWinner, setValue]);

  return (
    <div className={styles.Root}>
      <FormField name="details.missionId" label="Mission">
        <InputSelect options={missionOptions} />
      </FormField>
      <FormField name="details.attacker" label="Attacker" disabled={disableAttackerField}>
        <InputSelect options={playerOptions} />
      </FormField>
      <FormField name="details.firstTurn" label="First Turn" disabled={disableFirstTurnField}>
        <InputSelect options={playerOptions} />
      </FormField>
      <div className={styles.OutcomeSection}>
        <FormField name="details.turnsPlayed" label="Rounds">
          <InputText type="number" />
        </FormField>
        <FormField name="details.outcomeType" label="Outcome Type">
          <InputSelect options={outcomeTypeOptions} />
        </FormField>
      </div>
      <FormField name="details.winner" label="Winner" disabled={disableWinner}>
        <InputSelect options={winnerOptions} />
      </FormField>
    </div>
  );
};
