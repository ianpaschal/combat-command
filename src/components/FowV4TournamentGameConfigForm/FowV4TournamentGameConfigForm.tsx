import { UseFormReturn } from 'react-hook-form';

import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { fowV4LFTFVersionOptions } from '~/types/fowV4/fowV4LFTFVersionSchema';
import { fowV4MissionPackVersionOptions } from '~/types/fowV4/fowV4MissionPackVersionSchema';
import { Match } from '~/types/Match';
import { Tournament } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './FowV4TournamentGameConfigForm.scss';

const cn = bem('FowV4TournamentGameConfigForm');

export interface FowV4TournamentGameConfigFormProps {
  form?: UseFormReturn<Tournament | Match>;
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
        <InputText type="number" />
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
