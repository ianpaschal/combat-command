import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
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
  const { watch, setValue } = useFormContext();
  const missionOptions = useMissionOptions();
  const outcomeTypeOptions = useOutcomeTypeOptions();
  const playerOptions = usePlayerOptions();
  const winnerOptions = [...playerOptions, { value: '-1', label: 'None' }];

  const {
    missionId,
    player0BattlePlan,
    player1BattlePlan,
    attacker,
    firstTurn,
    winner,
  } = watch('details');

  // Auto-fill attacker, if possible
  const autoAttacker = computeAttacker(missionId, player0BattlePlan, player1BattlePlan);
  const disableAttackerField = autoAttacker !== undefined;
  useEffect(() => {
    if (attacker !== autoAttacker) {
      setValue('details.attacker', autoAttacker);
    }
  }, [attacker, autoAttacker, setValue]);

  // Auto-fill firstTurn, if possible
  const autoFirstTurn = computeFirstTurn(missionId, attacker);
  const disableFirstTurnField = autoFirstTurn !== undefined;
  useEffect(() => {
    if (firstTurn !== autoFirstTurn) {
      setValue('details.firstTurn', autoFirstTurn);
    }
  }, [firstTurn, autoFirstTurn, setValue]);

  // Auto-fill winner, if possible
  const autoWinner = computeWinner(missionId, attacker);
  const disableWinner = autoWinner !== undefined;
  useEffect(() => {
    if (winner !== autoWinner) {
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
        <FormField name="details.turnsPlayed" label="Rounds" >
          <InputNumber min={0} />
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
