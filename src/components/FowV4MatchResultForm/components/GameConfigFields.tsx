import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  eraOptions,
  getMissionMatrixOptions,
  lessonsFromTheFrontVersionOptions,
  missionPackVersionOptions,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { Switch } from '~/components/generic/Switch';

import styles from './GameConfigFields.module.scss';

export interface GameConfigFieldsProps {
  formPath?: string;
  showAdvancedOptions?: boolean;
  showAdditionalRules?: boolean;
}

export const GameConfigFields = ({
  formPath = 'gameSystemConfig',
  showAdvancedOptions = false,
  showAdditionalRules = false,
}: GameConfigFieldsProps): JSX.Element => {
  const { watch, setValue } = useFormContext();
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(showAdvancedOptions);
  // TODO: get dynamic points version for era
  // const dynamicPointsVersionOptions = getDynamicPointsVersionOptions(era);
  // Show the drop down if options are available

  const missionPackVersion = watch(`${formPath}.missionPackVersion`);
  const missionMatrixOptions = getMissionMatrixOptions(missionPackVersion);

  // Auto-fill matrix, if possible
  useEffect(() => {
    if (missionMatrixOptions.length === 1 && watch(`${formPath}.missionMatrix`) !== missionMatrixOptions[0].value) {
      setValue(`${formPath}.missionMatrix`, missionMatrixOptions[0].value);
    }
  }, [formPath, watch, setValue, missionMatrixOptions]);

  return (
    <div className={styles.Root}>
      <div className={styles.CoreConfig}>
        <FormField name={`${formPath}.points`} label="Points">
          <InputText type="number" />
        </FormField>
        <FormField name={`${formPath}.era`} label="Era">
          <InputSelect options={eraOptions} />
        </FormField>
      </div>
      {!showAdvancedOptions && (
        <FormField label="Show advanced options">
          <Switch checked={advancedOptionsVisible} onCheckedChange={setAdvancedOptionsVisible} />
        </FormField>
      )}
      <Animate show={advancedOptionsVisible}>
        <div className={styles.AdvancedOptions}>
          <Separator />
          <div className={styles.Rules}>
            <FormField name={`${formPath}.lessonsFromTheFrontVersion`} label="Lessons from the Front Version" disabled={lessonsFromTheFrontVersionOptions.length < 2}>
              <InputSelect options={lessonsFromTheFrontVersionOptions} />
            </FormField>
          </div>
          <div className={styles.Missions}>
            <FormField name={`${formPath}.missionPackVersion`} label="Mission Pack" disabled={missionPackVersionOptions.length < 2}>
              <InputSelect options={missionPackVersionOptions} />
            </FormField>
            <FormField name={`${formPath}.missionMatrix`} label="Mission Matrix" disabled={missionMatrixOptions.length < 2}>
              <InputSelect options={missionMatrixOptions} />
            </FormField>
            {/* DISABLED BECAUSE IT'S NOT CURRENTLY USED */}
            {/* <FormField name={`${formPath}.useExperimentalMissions`} label="Prefer experimental missions">
              <Switch />
            </FormField> */}
          </div>
        </div>
      </Animate>
      {showAdditionalRules && (
        <>
          <Separator />
          Additional Rules
        </>
      )}
    </div>
  );
};
