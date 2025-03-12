import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import {
  useAttackerOptions,
  useFirstTurnOptions,
  useMissionOptions,
  useOutcomeTypeOptions,
  useWinnerOptions,
} from './CommonFields.hooks';

import styles from './CommonFields.module.scss';

export const CommonFields = (): JSX.Element => {
  const missionOptions = useMissionOptions();
  const attackerOptions = useAttackerOptions();
  const firstTurnOptions = useFirstTurnOptions();
  const outcomeTypeOptions = useOutcomeTypeOptions();
  const winnerOptions = useWinnerOptions();
  return (
    <div className={styles.Root}>
      <FormField name="missionId" label="Mission">
        <InputSelect options={missionOptions} />
      </FormField>
      <FormField name="attacker" label="Attacker" disabled={attackerOptions.length < 2}>
        <InputSelect options={attackerOptions} />
      </FormField>
      <FormField name="firstTurn" label="First Turn" disabled={firstTurnOptions.length < 2}>
        <InputSelect options={firstTurnOptions} />
      </FormField>
      <div className={styles.OutcomeSection}>
        <FormField name="turnsPlayed" label="Rounds" >
          <InputNumber min={0} />
        </FormField>
        <FormField name="outcomeType" label="Outcome Type" disabled={outcomeTypeOptions.length < 2}>
          <InputSelect options={outcomeTypeOptions} />
        </FormField>
      </div>
      <FormField name="winner" label="Winner" disabled={winnerOptions.length < 2}>
        <InputSelect options={winnerOptions} />
      </FormField>
    </div>
  );
};
