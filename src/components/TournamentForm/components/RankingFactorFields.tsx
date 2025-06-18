import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

import { FowV4RankingFactor, fowV4RankingFactorOptions } from '~/api';
import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';

import styles from './RankingFactorFields.module.scss';

const isValidFactor = (factor: string | number | undefined): factor is FowV4RankingFactor => (factor as FowV4RankingFactor) !== undefined;

export interface RankingFactorFieldsProps {
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const RankingFactorFields = ({
  status = 'draft',
}) => {
  const { watch, setValue } = useFormContext<TournamentFormData>();
  const rankingFactors = watch('rankingFactors');

  // TODO: Get different options depending on game system
  const options = fowV4RankingFactorOptions;

  const handleChange = (i: number, factor: string | number | undefined): void => {
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
            options={options}
            value={factor}
            onChange={(value) => handleChange(i, value)}
            disabled={disableFields}
          />
          {rankingFactors.length > 1 && i < rankingFactors.length && (
            <Button variant="ghost" disabled={disableFields} onClick={(e) => {
              e.preventDefault();
              handleRemove(i);
            }}>
              <X />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
