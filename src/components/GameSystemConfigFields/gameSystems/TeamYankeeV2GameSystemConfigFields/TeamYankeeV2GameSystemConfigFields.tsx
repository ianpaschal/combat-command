import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  getEraOptions,
  getFieldManual101VersionOptions,
  getMissionMatrixOptions,
  getMissionPackVersionOptions,
  MissionMatrix,
} from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Switch } from '~/components/generic/Switch';
import { useAutoFillSelect } from '~/hooks/useAutoFillSelect';
import { CompatibleFormData } from '../../GameSystemConfigFields.types';

import styles from './TeamYankeeV2GameSystemConfigFields.module.scss';

export interface TeamYankeeV2GameSystemConfigFieldsProps {
  className?: string;
}

export const TeamYankeeV2GameSystemConfigFields = ({
  className,
}: TeamYankeeV2GameSystemConfigFieldsProps): JSX.Element => {
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(false);

  const { getValues, setValue } = useFormContext<CompatibleFormData>();
  const { gameSystemConfig } = getValues();

  const eraOptions = getEraOptions();
  const missionMatrixOptions = getMissionMatrixOptions(gameSystemConfig.missionPackVersion);
  const fieldManual101VersionOptions = getFieldManual101VersionOptions();
  const missionPackVersionOptions = getMissionPackVersionOptions();

  useAutoFillSelect(
    missionMatrixOptions,
    gameSystemConfig?.missionMatrix,
    (value: MissionMatrix) => setValue('gameSystemConfig.missionMatrix', value),
  );

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
            // disabled={fieldManual101VersionOptions.length < 2}
            >
              <InputSelect options={fieldManual101VersionOptions} />
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
