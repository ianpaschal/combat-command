import { useFormContext } from 'react-hook-form';
import {
  getDynamicPointsVersionOptions,
  getEraOptions,
  getLessonsFromTheFrontVersionOptions,
  getMissionMatrixOptions,
  getMissionPackVersionOptions,
} from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
import { useAutoFillSelect } from '~/hooks/useAutoFillSelect';
import { CompatibleFormData } from './FlamesOfWarV4GameSystemConfigFields.types';

import styles from './FlamesOfWarV4GameSystemConfigFields.module.scss';

export interface FlamesOfWarV4GameSystemConfigFieldsProps {
  advancedOptionsVisible: boolean;
  className?: string;
  setAdvancedOptionsVisible: (visible: boolean) => void;
}

export const FlamesOfWarV4GameSystemConfigFields = ({
  advancedOptionsVisible,
  className,
  setAdvancedOptionsVisible,
}: FlamesOfWarV4GameSystemConfigFieldsProps): JSX.Element => {

  const { watch } = useFormContext<CompatibleFormData>();
  const { era, missionPackVersion } = watch('gameSystemConfig');

  const eraOptions = getEraOptions();
  useAutoFillSelect<CompatibleFormData>(eraOptions, 'gameSystemConfig.era');

  const lessonsFromTheFrontVersionOptions = getLessonsFromTheFrontVersionOptions();
  useAutoFillSelect<CompatibleFormData>(lessonsFromTheFrontVersionOptions, 'gameSystemConfig.lessonsFromTheFrontVersion');

  const dynamicPointsVersionOptions = getDynamicPointsVersionOptions(era);
  useAutoFillSelect<CompatibleFormData>(dynamicPointsVersionOptions, 'gameSystemConfig.dynamicPointsVersion');

  const missionPackVersionOptions = getMissionPackVersionOptions();
  useAutoFillSelect<CompatibleFormData>(missionPackVersionOptions, 'gameSystemConfig.missionPackVersion');

  const missionMatrixOptions = getMissionMatrixOptions(missionPackVersion);
  useAutoFillSelect<CompatibleFormData>(missionMatrixOptions, 'gameSystemConfig.missionMatrix');

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
            <FormField
              name="gameSystemConfig.dynamicPointsVersion"
              label="Dynamic Points Version"
              disabled={dynamicPointsVersionOptions.length < 2}
            >
              <InputSelect options={dynamicPointsVersionOptions} />
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
