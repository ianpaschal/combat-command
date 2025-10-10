import { MouseEvent } from 'react';
import { useWatch } from 'react-hook-form';
import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';
import { Trash } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { useTournament } from '~/components/TournamentProvider';
import { getRoundOptions } from '~/utils/common/getRoundOptions';
import { scoreAdjustmentSchema } from './ScoreAdjustmentFormItem.schema';
import { formatScoreAdjustment } from './ScoreAdjustmentFormItem.utils';

import styles from './ScoreAdjustmentFormItem.module.scss';

export interface ScoreAdjustmentFormItemProps {
  className?: string;
  disabled?: boolean;
  index: number;
  onRemove: (index: number) => void;
}

export const ScoreAdjustmentFormItem = ({
  className,
  disabled = false,
  index,
  onRemove,
}: ScoreAdjustmentFormItemProps): JSX.Element => {
  const tournament = useTournament();
  const watched = useWatch({ name: `scoreAdjustments.${index}` });
  const result = scoreAdjustmentSchema.safeParse(watched);

  const safeValue = result.success ? result.data : undefined;

  const roundOptions = getRoundOptions(tournament.roundCount);

  const { getRankingFactorOptions } = getGameSystem(tournament.gameSystem);
  const factorOptions = getRankingFactorOptions().filter(({ value }) => (
    tournament.rankingFactors.includes(value)
  ));

  const handleRemove = (e: MouseEvent): void => {
    e.preventDefault();
    onRemove(index);
  };

  return (
    <div className={clsx(styles.ScoreAdjustmentFormItem, className)}>
      <FormField name={`scoreAdjustments.${index}.amount`} label="Amount">
        <InputText type="number" />
      </FormField>
      <FormField name={`scoreAdjustments.${index}.rankingFactor`} label="Ranking Factor">
        <InputSelect options={factorOptions} />
      </FormField>
      <FormField className={styles.ScoreAdjustmentFormItem_Round} name={`scoreAdjustments.${index}.round`} label="Applied to Round">
        <InputSelect options={roundOptions} />
      </FormField>
      <FormField className={styles.ScoreAdjustmentFormItem_Reason} name={`scoreAdjustments.${index}.reason`} label="Reason">
        <InputText />
      </FormField>
      <div className={styles.ScoreAdjustmentFormItem_Effect}>
        <FormField label="Effect">
          {(safeValue && safeValue.amount !== 0) ? (
            <span>{formatScoreAdjustment(tournament.gameSystem, safeValue, tournament.useTeams)}</span>
          ) : (
            <span>Please add an amount.</span>
          )}
        </FormField>
        <Button
          className={styles.ScoreAdjustmentFormItem_RemoveButton}
          disabled={disabled}
          icon={<Trash />}
          intent="danger"
          variant="ghost"
          onClick={handleRemove}
        />
      </div>
    </div>
  );
};
