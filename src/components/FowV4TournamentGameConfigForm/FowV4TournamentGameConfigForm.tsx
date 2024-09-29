import { UseFormReturn } from 'react-hook-form';

import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { Tournament } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './FowV4TournamentGameConfigForm.scss';

const cn = bem('FowV4TournamentGameConfigForm');

export interface FowV4TournamentGameConfigFormProps {
  form: UseFormReturn<Tournament>;
  loading?: boolean;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const FowV4TournamentGameConfigForm = ({
  form,
  loading = false,
  disabled = false,
  // eslint-disable-next-line arrow-body-style
}: FowV4TournamentGameConfigFormProps): JSX.Element => {

  // TODO: Enable this
  // const [restrictFormations, setRestrictFormations] = useState<boolean>(false);
  // const handleToggleRestrictFormations = (checked: boolean): void => {
  //   // // If changing from team to solos, convert total players back to teams of 1
  //   // if (useTeams && !checked) {
  //   //   form.reset((prev) => ({
  //   //     ...prev,
  //   //     competitor_size: 1,
  //   //     competitor_count: totalPlayers,
  //   //   }));
  //   // }
  //   setRestrictFormations(checked);
  // };

  return (
    <div className={cn()}>
      <div className={cn('PointsEra')}>
        <FormField name="game_system_config.points" label="Points">
          <InputText type="number" />
        </FormField>
        <FormField name="game_system_config.era" label="Era">
          <InputSelect options={fowV4EraOptions} />
        </FormField>
      </div>
      {/* TODO: Enable later */}
      {/* <Animate show={form.watch().game_system_config?.era === 'mw'}>
        <FormField name="game_system_config.mid_war_monsters" label="Allow Mid-War Monsters?">
          <InputSelect
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'combat', label: 'Yes, but only ones which saw combat' },
              { value: 'no', label: 'No' },
            ]}
          />
        </FormField>
      </Animate>
      <Animate show={form.watch().game_system_config?.era === 'mw'}>
        <FormField name="game_system_config.dynamic_points" label="Use dynamic points?">
          <Checkbox />
        </FormField>
      </Animate> */}
      {/* TODO: Enable later */}
      {/* <Separator />
      <Stack orientation="horizontal" verticalAlign="center">
        <Switch id="restrictFormations" checked={restrictFormations} onCheckedChange={handleToggleRestrictFormations} />
        <Label htmlFor="restrictFormations">Restrict Formations</Label>
      </Stack> */}
      <Separator />
      <div className={cn('RuleAddOns')}>
        <FormField name="game_system_config.lessons_from_the_front_version" label="Lessons from the Front Version">
          <InputSelect
            options={[
              { value: '2020-12', label: 'December 2018' },
              { value: '2019-10', label: 'October 2019' },
              { value: '2020-10', label: 'October 2020' },
              { value: '2023-03', label: 'March 2023' },
              { value: '2024-03', label: 'March 2024 (Latest)' },
            ]}
          />
        </FormField>
        <FormField name="game_system_config.mission_pack_version" label="Mission Pack Version">
          <InputSelect
            options={[
              { value: '2021-03', label: 'March 2021' },
              { value: '2022-06', label: 'June 2022' },
              { value: '2023-04', label: 'April 2023 (Latest)' },
            ]}
          />
        </FormField>
      </div>
    </div>
  );
};
