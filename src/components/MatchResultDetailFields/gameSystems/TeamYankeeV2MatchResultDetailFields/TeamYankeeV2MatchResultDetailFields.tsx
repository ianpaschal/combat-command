import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  getBattlePlanOptions,
  getFactionOptions,
  getValidGameSystemConfig,
} from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import clsx from 'clsx';
import isEqual from 'fast-deep-equal/es6';

import { FormField } from '~/components/generic/Form';
import { InputSelect, InputSelectOption } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
import { MatchResultDetails } from '~/components/MatchResultDetailFields/MatchResultDetailFields.schema';
import { CompatibleFormData } from '../../MatchResultDetailFields.types';
import {
  computeFields,
  useMissionOptions,
  useOutcomeTypeOptions,
} from './TeamYankeeV2MatchResultDetailFields.hooks';

import styles from './TeamYankeeV2MatchResultDetailFields.module.scss';

export interface TeamYankeeV2MatchResultDetailFieldsProps {
  className?: string;
  playerOptions: InputSelectOption<number>[];
}

export const TeamYankeeV2MatchResultDetailFields = ({
  className,
  playerOptions,
}: TeamYankeeV2MatchResultDetailFieldsProps): JSX.Element => {
  const [showScoreOverride, setShowScoreOverride] = useState<boolean>(false);

  const { setValue, resetField, watch, getFieldState } = useFormContext<CompatibleFormData>();
  const values = watch();
  const { details } = values;
  const gameSystemConfig = getValidGameSystemConfig(values);

  const missionOptions = useMissionOptions(gameSystemConfig, details.player0BattlePlan, details.player1BattlePlan);

  // TODO: Don't allow winner 'None' for certain outcome types.
  const outcomeTypeOptions = useOutcomeTypeOptions(gameSystemConfig, details.mission);
  const winnerOptions = [...playerOptions, { label: 'None', value: -1 }];

  const { isDirty: player0BattlePlanChanged } = getFieldState('details.player0BattlePlan');
  const { isDirty: player1BattlePlanChanged } = getFieldState('details.player1BattlePlan');

  // Reset mission and dependent fields if battle plans were changed:
  useEffect(() => {
    if (player0BattlePlanChanged || player1BattlePlanChanged) {
      setValue('details.attacker', '' as unknown as MatchResultDetails['attacker']);
      setValue('details.firstTurn', '' as unknown as MatchResultDetails['firstTurn']);
      setValue('details.mission', '' as MatchResultDetails['mission']);
      setValue('details.outcomeType', '' as MatchResultDetails['outcomeType']);
      setValue('details.winner', '' as unknown as MatchResultDetails['winner']);
    }
  }, [player0BattlePlanChanged, player1BattlePlanChanged, setValue]);

  // Set computed details if possible:
  const computedDetails = computeFields(gameSystemConfig, details);
  useEffect(() => {
    const updatedDetails = { ...details, ...computedDetails };
    if (computedDetails && details.mission && !isEqual(details, updatedDetails)) {
      setValue('details', updatedDetails as MatchResultDetails);
    }
  }, [setValue, details, computedDetails]);

  const disableMissionField = !details.player0BattlePlan || !details.player1BattlePlan;
  const disableAttackerField = computedDetails?.attacker !== undefined;
  const disableFirstTurnField = computedDetails?.firstTurn !== undefined;
  const disableWinnerField = computedDetails?.winner !== undefined;
  const disableDetailFields = !details?.mission;

  const handleToggleScoreOverride = (checked: boolean): void => {
    if (!checked) {
      resetField('details.scoreOverride', undefined);
    }
    setShowScoreOverride(checked);
  };

  return (
    <div className={clsx(styles.TeamYankeeV2MatchResultDetailFields, className)}>
      <div className={styles.TeamYankeeV2MatchResultDetailFields_Player0Section}>
        {/*  TODO: AUTO-FILTER OPTIONS TO 1 USING LIST INFO */}
        <FormField name="details.player0Faction" label="Faction">
          <InputSelect options={getFactionOptions()} />
        </FormField>
        <FormField name="details.player0BattlePlan" label="Battle Plan">
          <InputSelect options={getBattlePlanOptions()} />
        </FormField>
        <FormField name="details.player0UnitsLost" label="Units Lost">
          <InputText type="number" />
        </FormField>
      </div>
      <div className={styles.TeamYankeeV2MatchResultDetailFields_Player1Section}>
        {/*  TODO: AUTO-FILTER OPTIONS TO 1 USING LIST INFO */}
        <FormField name="details.player1Faction" label="Faction">
          <InputSelect options={getFactionOptions()} />
        </FormField>
        <FormField name="details.player1BattlePlan" label="Battle Plan">
          <InputSelect options={getBattlePlanOptions()} />
        </FormField>
        <FormField name="details.player1UnitsLost" label="Units Lost">
          <InputText type="number" />
        </FormField>
      </div>
      <div className={styles.TeamYankeeV2MatchResultDetailFields_SharedSection}>
        <FormField name="details.mission" label="Mission" disabled={disableMissionField}>
          <InputSelect options={missionOptions} />
        </FormField>
        <FormField name="details.attacker" label="Attacker" disabled={disableDetailFields || disableAttackerField}>
          <InputSelect options={playerOptions} />
        </FormField>
        <FormField name="details.firstTurn" label="First Turn" disabled={disableDetailFields || disableFirstTurnField}>
          <InputSelect options={playerOptions} />
        </FormField>
        <div className={styles.TeamYankeeV2MatchResultDetailFields_SharedSection_Outcome}>
          <FormField name="details.turnsPlayed" label="Turns Played" disabled={disableDetailFields}>
            <InputText type="number" />
          </FormField>
          <FormField name="details.outcomeType" label="Outcome Type" disabled={disableDetailFields}>
            <InputSelect options={outcomeTypeOptions} />
          </FormField>
        </div>
        <FormField name="details.winner" label="Winner" disabled={disableDetailFields || disableWinnerField}>
          <InputSelect options={winnerOptions} />
        </FormField>
        <FormField label="Use custom score" disabled={disableDetailFields}>
          <Switch checked={showScoreOverride} onCheckedChange={handleToggleScoreOverride} />
        </FormField>
        {showScoreOverride && (
          <div className={styles.TeamYankeeV2MatchResultDetailFields_SharedSection_ScoreOverride}>
            {([0, 1] as const).map((i) => (
              <FormField
                name={`details.scoreOverride.player${i}Score`}
                label={`${playerOptions[i].label}'s Score`}
                disabled={disableDetailFields}
              >
                <InputText type="number" />
              </FormField>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
