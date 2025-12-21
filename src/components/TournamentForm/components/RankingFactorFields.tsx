import { useFormContext } from 'react-hook-form';
import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { X } from 'lucide-react';

import { RankingFactor } from '~/api';
import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';

import styles from './RankingFactorFields.module.scss';

const isValidFactor = (factor: string | number | null | undefined): factor is RankingFactor => !!factor;

export interface RankingFactorFieldsProps {
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const RankingFactorFields = ({
  status = 'draft',
}: RankingFactorFieldsProps): JSX.Element => {
  const { watch, setValue } = useFormContext<TournamentFormData>();
  const rankingFactors = watch('rankingFactors');

  const gameSystem = watch('gameSystem');
  const { getRankingFactorOptions } = getGameSystem(gameSystem);

  const handleChange = (i: number, factor: string | number | null | undefined): void => {
    if (isValidFactor(factor)) {
      setValue('rankingFactors', [
        ...rankingFactors.slice(0, i),
        factor,
        ...rankingFactors.slice(i + 1),
      ]);
    }
  };

  const handleRemove = (i: number) => {
    setValue('rankingFactors', [
      ...rankingFactors.slice(0, i),
      ...rankingFactors.slice(i + 1),
    ]);
  };

  // Once a tournament is active, lock some fields
  const allowedEditStatuses = ['draft', 'published'];
  const disableFields = !allowedEditStatuses.includes(status);

  return (
    <div className={styles.RankingFactorFields}>
      {[...rankingFactors, ''].map((factor, i) => (
        <div key={i} className={styles.RankingFactorFields_Selector}>
          <span className={styles.RankingFactorFields_Selector_Index}>
            {i + 1}
          </span>
          <InputSelect
            disabled={disableFields}
            options={getRankingFactorOptions()}
            value={factor}
            onChange={(value) => handleChange(i, value)}
          />
          {rankingFactors.length > 1 && i < rankingFactors.length && (
            <Button
              disabled={disableFields}
              icon={<X />}
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                handleRemove(i);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
