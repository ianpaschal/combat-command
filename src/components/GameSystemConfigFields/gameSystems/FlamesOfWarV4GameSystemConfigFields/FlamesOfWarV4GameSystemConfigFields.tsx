import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  getEraOptions,
  getLessonsFromTheFrontVersionOptions,
  getMissionMatrixOptions,
  getMissionPackVersionOptions,
  MissionMatrix,
} from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
import { useAutoFillSelect } from '~/hooks/useAutoFillSelect';
import { CompatibleFormData } from '../../GameSystemConfigFields.types';

import styles from './FlamesOfWarV4GameSystemConfigFields.module.scss';

export interface FlamesOfWarV4GameSystemConfigFieldsProps {
  className?: string;
}

export const FlamesOfWarV4GameSystemConfigFields = ({
  className,
}: FlamesOfWarV4GameSystemConfigFieldsProps): JSX.Element => {
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(false);

  const { getValues, setValue } = useFormContext<CompatibleFormData>();
  const { gameSystemConfig } = getValues();

  const eraOptions = getEraOptions();
  const missionMatrixOptions = getMissionMatrixOptions(gameSystemConfig.missionPackVersion);
  const lessonsFromTheFrontVersionOptions = getLessonsFromTheFrontVersionOptions();
  const missionPackVersionOptions = getMissionPackVersionOptions();

  useAutoFillSelect(
    missionMatrixOptions,
    gameSystemConfig?.missionMatrix,
    (value: MissionMatrix) => setValue('gameSystemConfig.missionMatrix', value),
  );

  return (
    <div className={clsx(styles.FlamesOfWarV4GameSystemConfigFields, className)}>
      <div className={styles.FlamesOfWarV4GameSystemConfigFields_CoreConfig}>
        <FormField name="gameSystemConfig.points" label="Points">
          <InputText type="number" />
        </FormField>
        <FormField name="gameSystemConfig.era" label="Era" disabled={eraOptions.length < 2}>
          <InputSelect options={eraOptions} />
        </FormField>
      </div>
      <FormField label="Show advanced options">
        <Switch checked={advancedOptionsVisible} onCheckedChange={setAdvancedOptionsVisible} />
      </FormField>
      <Animate show={advancedOptionsVisible}>
        <div className={styles.FlamesOfWarV4GameSystemConfigFields_AdvancedOptions}>
          <div className={styles.FlamesOfWarV4GameSystemConfigFields_Rules}>
            <FormField
              name="gameSystemConfig.lessonsFromTheFrontVersion"
              label="Lessons from the Front Version"
              disabled={lessonsFromTheFrontVersionOptions.length < 2}
            >
              <InputSelect options={lessonsFromTheFrontVersionOptions} />
            </FormField>
          </div>
          <div className={styles.FlamesOfWarV4GameSystemConfigFields_Missions}>
            <FormField
              name="gameSystemConfig.missionPackVersion"
              label="Mission Pack"
              disabled={missionPackVersionOptions.length < 2}
            >
              <InputSelect options={missionPackVersionOptions} />
            </FormField>
            <FormField
              name="gameSystemConfig.missionMatrix"
              label="Mission Matrix"
              disabled={missionMatrixOptions.length < 2}
            >
              <InputSelect options={missionMatrixOptions} />
            </FormField>
          </div>
        </div>
      </Animate>
    </div>
  );
};
