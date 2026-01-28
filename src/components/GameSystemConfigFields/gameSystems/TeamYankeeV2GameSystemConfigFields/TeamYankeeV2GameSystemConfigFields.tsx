import { useFormContext } from 'react-hook-form';
import {
  getDynamicPointsVersionOptions,
  getEraOptions,
  getFieldManual101VersionOptions,
  getMissionMatrixOptions,
  getMissionPackVersionOptions,
} from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
import { useAutoFillSelect } from '~/hooks/useAutoFillSelect';
import { CompatibleFormData } from './TeamYankeeV2GameSystemConfigFields.types';

import styles from './TeamYankeeV2GameSystemConfigFields.module.scss';

export interface TeamYankeeV2GameSystemConfigFieldsProps {
  advancedOptionsVisible: boolean;
  className?: string;
  setAdvancedOptionsVisible: (visible: boolean) => void;
}

export const TeamYankeeV2GameSystemConfigFields = ({
  advancedOptionsVisible,
  className,
  setAdvancedOptionsVisible,
}: TeamYankeeV2GameSystemConfigFieldsProps): JSX.Element => {

  const { getValues, setValue } = useFormContext<CompatibleFormData>();
  const { gameSystemConfig } = getValues();

  const eraOptions = getEraOptions();
  useAutoFillSelect(eraOptions, gameSystemConfig.era, (v) => setValue('gameSystemConfig.era', v));

  const fieldManual101VersionOptions = getFieldManual101VersionOptions();
  useAutoFillSelect(fieldManual101VersionOptions, gameSystemConfig.fieldManual101Version, (v) => setValue('gameSystemConfig.fieldManual101Version', v));

  const dynamicPointsVersionOptions = getDynamicPointsVersionOptions(gameSystemConfig.era);
  useAutoFillSelect(dynamicPointsVersionOptions, gameSystemConfig.dynamicPointsVersion, (v) => setValue('gameSystemConfig.dynamicPointsVersion', v));

  const missionPackVersionOptions = getMissionPackVersionOptions();
  useAutoFillSelect(missionPackVersionOptions, gameSystemConfig.missionPackVersion, (v) => setValue('gameSystemConfig.missionPackVersion', v));

  const missionMatrixOptions = getMissionMatrixOptions(gameSystemConfig.missionPackVersion);
  useAutoFillSelect(missionMatrixOptions, gameSystemConfig.missionMatrix, (v) => setValue('gameSystemConfig.missionMatrix', v));

  return (
    <div className={clsx(styles.TeamYankeeV2GameSystemConfigFields, className)}>
      <div className={styles.TeamYankeeV2GameSystemConfigFields_CoreConfig}>
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
        <div className={styles.TeamYankeeV2GameSystemConfigFields_AdvancedOptions}>
          <div className={styles.TeamYankeeV2GameSystemConfigFields_Rules}>
            <FormField
              name="gameSystemConfig.fieldManual101Version"
              label="Field Manual 101 Version"
              disabled={fieldManual101VersionOptions.length < 2}
            >
              <InputSelect options={fieldManual101VersionOptions} />
            </FormField>
            <FormField
              name="gameSystemConfig.dynamicPointsVersion"
              label="Dynamic Points Version"
              disabled={dynamicPointsVersionOptions.length < 2}
            >
              <InputSelect options={dynamicPointsVersionOptions} />
            </FormField>
          </div>
          <div className={styles.TeamYankeeV2GameSystemConfigFields_Missions}>
            <FormField
              name="gameSystemConfig.missionPackVersion"
              label="Mission Pack"
            // disabled={missionPackVersionOptions.length < 2}
            >
              <InputSelect options={missionPackVersionOptions} />
            </FormField>
            <FormField
              name="gameSystemConfig.missionMatrix"
              label="Mission Matrix"
            // disabled={missionMatrixOptions.length < 2}
            >
              <InputSelect options={missionMatrixOptions} />
            </FormField>
          </div>
        </div>
      </Animate>
    </div>
  );
};
