import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { fowV4LFTFVersionOptions } from '~/types/fowV4/fowV4LFTFVersionSchema';
import { fowV4MissionPackVersionOptions } from '~/types/fowV4/fowV4MissionPackVersionSchema';
import { bem } from '~/utils/componentLib/bem';

import './FowV4TournamentGameConfigForm.scss';

const cn = bem('FowV4TournamentGameConfigForm');

export interface FowV4TournamentGameConfigFormProps {
  loading?: boolean;
  disabled?: boolean;
  fieldName?: string;
  hideRuleAddOns?: boolean;
}

export const FowV4TournamentGameConfigForm = ({
  fieldName,
  hideRuleAddOns = false,
}: FowV4TournamentGameConfigFormProps): JSX.Element => (
  <div className={cn()}>
    <div className={cn('PointsEra')}>
      <FormField name={`${fieldName}.points`} label="Points">
        <InputNumber min={0} />
      </FormField>
      <FormField name={`${fieldName}.era`} label="Era">
        <InputSelect options={fowV4EraOptions} />
      </FormField>
    </div>
    {!hideRuleAddOns && (
      <div className={cn('RuleAddOns')}>
        <FormField name={`${fieldName}.lessons_from_the_front_version`} label="Lessons from the Front Version">
          <InputSelect
            options={fowV4LFTFVersionOptions}
          />
        </FormField>
        <FormField name={`${fieldName}.mission_pack_version`} label="Mission Pack Version">
          <InputSelect
            options={fowV4MissionPackVersionOptions}
          />
        </FormField>
      </div>
    )}
  </div>
);
