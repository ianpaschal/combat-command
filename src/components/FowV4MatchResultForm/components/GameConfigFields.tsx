import { useState } from 'react';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import { Separator } from '~/components/generic/Separator';
import { Switch } from '~/components/generic/Switch';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { fowV4LessonsFromTheFrontVersionOptions } from '~/types/fowV4/fowV4LessonsFromTheFrontVersionSchema';
import { fowV4MissionPackVersionOptions } from '~/types/fowV4/fowV4MissionPackVersionSchema';

import styles from './GameConfigFields.module.scss';

export const GameConfigFields = (): JSX.Element => {
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(false);
  return (
    <div className={styles.Root}>
      <div className={styles.CoreConfig}>
        <FormField name="gameSystemConfig.points" label="Points">
          <InputNumber min={0} />
        </FormField>
        <FormField name="gameSystemConfig.era" label="Era">
          <InputSelect options={fowV4EraOptions} />
        </FormField>
      </div>
      <FormField label="Show advanced options">
        <Switch checked={advancedOptionsVisible} onCheckedChange={setAdvancedOptionsVisible} />
      </FormField>
      <Animate show={advancedOptionsVisible}>
        <div className={styles.AdvancedOptions}>
          <Separator />
          <FormField name="gameSystemConfig.lessonsFromTheFrontVersion" label="Lessons from the Front Version">
            <InputSelect options={fowV4LessonsFromTheFrontVersionOptions} />
          </FormField>
          <FormField name="gameSystemConfig.missionPackVersion" label="Dynamic Points Version">
            <InputSelect options={fowV4MissionPackVersionOptions} />
          </FormField>
          {/*  TODO: When there are new mission matrix options available someday, add this in. */}
          {/* <FormField name="missionMatrix" label="Mission Pack Version">
            <InputSelect options={missionMatrixOptions} />
          </FormField>
          <FormField name="missionMatrix" label="Mission Matrix">
            <InputSelect options={missionMatrixOptions} />
          </FormField> */}
        </div>
      </Animate>
    </div>
  );
};
