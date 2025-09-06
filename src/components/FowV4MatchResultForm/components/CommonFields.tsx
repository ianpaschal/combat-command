import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getMission } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { useAuth } from '~/components/AuthProvider';
import { FowV4MatchResultFormData } from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.schema';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
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
  const user = useAuth();
  const { watch, setValue, resetField } = useFormContext<FowV4MatchResultFormData>();
  const [showScoreOverride, setShowScoreOverride] = useState<boolean>(false);
  const [missionPackVersion, details] = watch(['gameSystemConfig.missionPackVersion', 'details']);

  const missionOptions = useMissionOptions();
  const outcomeTypeOptions = useOutcomeTypeOptions();
  const playerOptions = usePlayerOptions();
  const winnerOptions = [...playerOptions, { label: 'None', value: -1 }];

  const selectedMission = getMission(missionPackVersion, details?.mission);

  // Auto-fill attacker, if possible
  const autoAttacker = computeAttacker(selectedMission, [details?.player0BattlePlan, details?.player1BattlePlan]);
  const disableAttackerField = autoAttacker !== undefined;
  useEffect(() => {
    if (autoAttacker !== undefined && details?.attacker !== autoAttacker) {
      setValue('details.attacker', autoAttacker);
    }
  }, [details, autoAttacker, setValue]);

  // Auto-fill firstTurn, if possible
  const autoFirstTurn = computeFirstTurn(selectedMission, details?.attacker);
  const disableFirstTurnField = autoFirstTurn !== undefined;
  useEffect(() => {
    if (autoFirstTurn !== undefined && details?.firstTurn !== autoFirstTurn) {
      setValue('details.firstTurn', autoFirstTurn);
    }
  }, [details, autoFirstTurn, setValue]);

  // Auto-fill winner, if possible
  const autoWinner = computeWinner(selectedMission, details?.attacker, details?.outcomeType);
  const disableWinner = autoWinner !== undefined;
  useEffect(() => {
    if (autoWinner !== undefined && details?.winner !== autoWinner) {
      setValue('details.winner', autoWinner);
    }
  }, [details, autoWinner, setValue]);

  const handleToggleScoreOverride = (checked: boolean): void => {
    if (!checked) {
      resetField('details.scoreOverride', undefined);
    }
    setShowScoreOverride(checked);
  };

  const getScoreOverrideLabel = (i: number): string => {
    const userId = watch(`player${i}UserId` as keyof FowV4MatchResultFormData);
    if (userId && userId === user?._id) {
      return 'Your Score';
    }
    return `${playerOptions[i].label}'s Score`;
  };

  return (
    <div className={styles.CommonFields}>
      <FormField name="details.mission" label="Mission">
        <InputSelect options={missionOptions} />
      </FormField>
      <FormField name="details.attacker" label="Attacker" disabled={disableAttackerField}>
        <InputSelect options={playerOptions} />
      </FormField>
      <FormField name="details.firstTurn" label="First Turn" disabled={disableFirstTurnField}>
        <InputSelect options={playerOptions} />
      </FormField>
      <div className={styles.CommonFields_OutcomeSection}>
        <FormField name="details.turnsPlayed" label="Turns Played">
          <InputText type="number" />
        </FormField>
        <FormField name="details.outcomeType" label="Outcome Type">
          <InputSelect options={outcomeTypeOptions} />
        </FormField>
      </div>
      <FormField name="details.winner" label="Winner" disabled={disableWinner}>
        <InputSelect options={winnerOptions} />
      </FormField>
      <FormField label="Use Custom Score">
        <Switch checked={showScoreOverride} onCheckedChange={handleToggleScoreOverride} />
      </FormField>
      {showScoreOverride && (
        <div className={styles.CommonFields_ScoreOverrideSection}>
          {([0, 1] as const).map((i) => (
            <FormField name={`details.scoreOverride.player${i}Score`} label={getScoreOverrideLabel(i)}>
              <InputText type="number" />
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};
