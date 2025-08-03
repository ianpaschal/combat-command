import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  fowV4EraOptions,
  fowV4LessonsFromTheFrontVersionOptions,
  fowV4MissionPackOptions,
  getFowV4MissionMatrixOptionsByMissionPackId,
} from '~/api';
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
  const { watch } = useFormContext();
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(showAdvancedOptions);
  // TODO: get dynamic points version for era
  // const dynamicPointsVersionOptions = getDynamicPointsVersionOptions(era);
  // Show the drop down if options are available

  const missionPackId = watch(`${formPath}.missionPackId`);

  const missionMatrixOptions = getFowV4MissionMatrixOptionsByMissionPackId(missionPackId);

  return (
    <div className={styles.Root}>
      <div className={styles.CoreConfig}>
        <FormField name={`${formPath}.points`} label="Points">
          <InputText type="number" />
        </FormField>
        <FormField name={`${formPath}.eraId`} label="Era">
          <InputSelect options={fowV4EraOptions} />
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
            <FormField name={`${formPath}.lessonsFromTheFrontVersionId`} label="Lessons from the Front Version" disabled={fowV4LessonsFromTheFrontVersionOptions.length < 2}>
              <InputSelect options={fowV4LessonsFromTheFrontVersionOptions} />
            </FormField>
          </div>
          <div className={styles.Missions}>
            <FormField name={`${formPath}.missionPackId`} label="Mission Pack" disabled={fowV4MissionPackOptions.length < 2}>
              <InputSelect options={fowV4MissionPackOptions} />
            </FormField>
            <FormField name={`${formPath}.missionMatrixId`} label="Mission Matrix" disabled={missionMatrixOptions.length < 2}>
              <InputSelect options={missionMatrixOptions} />
            </FormField>
            <FormField name={`${formPath}.useExperimentalMissions`} label="Prefer experimental missions">
              <Switch />
            </FormField>
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
