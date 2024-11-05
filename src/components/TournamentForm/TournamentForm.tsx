import {
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import clsx from 'clsx';
import { toZonedTime } from 'date-fns-tz';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from 'lucide-react';

import { FowV4TournamentGameConfigForm } from '~/components/FowV4TournamentGameConfigForm';
import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { InputDate } from '~/components/generic/InputDate';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';
import { useLocationSearch } from '~/services/useLocationSearch';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { Tournament, tournamentResolver } from '~/types/Tournament';
import { createCn } from '~/utils/componentLib/createCn';

import './TournamentForm.scss';

const cn = createCn('TournamentForm');

const defaultFowV4GameConfigValues: FowV4GameSystemConfig = {
  game_system_id: '',
  era: 'lw',
  points: 100,
  lessons_from_the_front_version: '2024-03',
  allow_mid_war_monsters: 'no',
  mission_pack_version: '2023-04',
};

const defaultValues: Partial<Tournament> = {
  competitor_count: 20,
  competitor_groups: [{ name: 'All Competitors', size: 10 }],
  competitor_size: 1,
  use_national_teams: false,
  description: '',
  ends_at: '',
  location: '',
  creator_id: '',
  rules_pack_url: '',
  starts_at: '',
  title: '',
  game_system_id: '1e307db7-207b-4493-b563-8056535616cc', // Flames of War 4th Ed.
  game_system_config: defaultFowV4GameConfigValues,
};

export interface TournamentFormProps {
  tournament?: Tournament;
  defaultValues?: Partial<Tournament>;
  loading?: boolean;
  onSubmit: SubmitHandler<Tournament>;
}

export const TournamentForm = ({
  tournament,
  defaultValues: defaultValueOverrides,
  loading = false,
  onSubmit,
}: TournamentFormProps): JSX.Element => {
  const [useTeams, setUseTeams] = useState<boolean>(false);
  // const [forceNationalTeams, setForceNationalTeams] = useState<boolean>(false);
  const [timeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const form = useForm<Tournament>({
    resolver: tournamentResolver,
    defaultValues: {
      ...defaultValues,
      ...defaultValueOverrides,
      ...tournament,
    },
    mode: 'onBlur',
  });
  const { fields: competitorGroupFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'competitor_groups',
  });

  const blocker = useBlocker(() => form.formState.isDirty);

  const handleAddGroup = (e: MouseEvent): void => {
    e.preventDefault();
    append({ name: '', size: 0 });
  };

  const handleRemoveGroup = (e: MouseEvent, i: number): void => {
    e.preventDefault();
    remove(i);
  };

  const handleToggleIsTeam = (checked: boolean): void => {
    // If changing from team to solos, convert total players back to teams of 1
    if (useTeams && !checked) {
      form.reset((prev) => ({
        ...prev,
        competitor_size: 1,
        competitor_count: totalPlayers,
      }));
    }
    setUseTeams(checked);
  };

  const { competitor_count, competitor_size } = form.watch();

  const competitorLabel = useTeams ? 'Teams' : 'Players';
  const totalPlayers = competitor_count * competitor_size;

  const { data: location } = useLocationSearch('bastogne');
  console.log(location);

  const game_system_options = [
    { value: '1e307db7-207b-4493-b563-8056535616cc', label: 'Flames of War (4th Ed.)' },
  ];

  const values = form.watch();
  const { starts_at, ends_at } = values;

  useEffect(() => {

    console.log('raw dates', starts_at, ends_at);

    const start_with_zone = toZonedTime(starts_at, timeZone); // In June 10am UTC is 6am in New York (-04:00)

    console.log(start_with_zone);
  }, [timeZone, starts_at, ends_at]);

  return (
    <Form form={form} onSubmit={onSubmit} className={cn()}>
      <UnsavedChangesDialog blocker={blocker} />
      <Card className={cn('_GameMetaSection')} title="General">
        <Stack>
          <FormField name="title" label="Title" description="Avoid including points and other rules in the title.">
            <InputText type="text" />
          </FormField>
          <FormField name="description" label="Description">
            <InputTextArea />
          </FormField>
          <FormField name="rules_pack_url" label="Rules Pack URL">
            <InputText type="text" placeholder="http://" />
          </FormField>
          <FormField name="location" label="Location">
            <InputText type="text" />
          </FormField>
          <InputLocation />
          <Stack className={cn('_DateTimeSection')} orientation="horizontal">
            <div className={cn('_DateTimeStart')}>
              <FormField name="starts_at" label="Start Date">
                <InputDate />
              </FormField>
              <FormField name="start_time" label="Start Time" >
                <InputText type="time" slotBefore={<Clock />} />
              </FormField>
            </div>
            <div className={cn('_DateTimeEnd')}>
              <FormField name="ends_at" label="End Date">
                <InputDate />
              </FormField>
              <FormField name="end_time" label="End Time" >
                <InputText type="time" slotBefore={<Clock />} />
              </FormField>
            </div>
          </Stack>
        </Stack>
      </Card>
      <Card title="Game Rules">
        <div className={cn('_GameSystemFields')}>
          {game_system_options.length > 1 && (
            <>
              <FormField name="game_system_id" label="Game System">
                <InputSelect options={[{ value: '1e307db7-207b-4493-b563-8056535616cc', label: 'Flames of War (4th Ed.)' }]} />
              </FormField>
              <Separator />
            </>
          )}
          <FowV4TournamentGameConfigForm />
        </div>
      </Card>
      <Card
        title="Players & Teams"
        description="Ranking and pairing configuration as well as player tasks can be configured after creation."
      >
        <Stack>
          <FormField label="Is team tournament?">
            <Switch checked={useTeams} onCheckedChange={handleToggleIsTeam} />
          </FormField>
          <div className={cn('_CompetitorsInputs')}>
            <FormField name="competitor_count" label={`Total ${competitorLabel}`}>
              <InputText type="number" />
            </FormField>
            <Animate show={useTeams}>
              <FormField className={cn('_CompetitorSizeInput')} name="competitor_size" label="Team Size">
                <InputText type="number" />
              </FormField>
            </Animate>
            {/* <Animate show={useTeams}>
              <Stack orientation="horizontal" verticalAlign="center">
                <Switch id="forceNationalTeams" checked={useTeams} onCheckedChange={handleToggleForceNationalTeams} />
                <Label htmlFor="forceNationalTeams">Force National Teams</Label>
              </Stack>
            </Animate> */}
          </div>
          <h3>Total Players: {totalPlayers}</h3>
        </Stack>
      </Card>
      <Card
        className={clsx(cn('_GroupsCard'))}
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel} such as 'Axis' and 'Allies'.`}
      >
        <Stack horizontalAlign="end" gap="0.5rem">
          {competitorGroupFields.map((_field, i) => (
            <Stack key={i} orientation="horizontal" gap="0.5rem" className={cn('_RegistrationGroup')} verticalAlign="center">
              <Stack gap={0}>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronUp /></Button>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small" disabled={competitorGroupFields.length < 2}><X /></Button>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronDown /></Button>
              </Stack>
              <FormField name={`competitor_groups.${i}.name`} label="Name">
                <InputText type="text" />
              </FormField>
              <FormField name={`competitor_groups.${i}.size`} label={competitorLabel} className={cn('_CompetitorGroupSizeInput')}>
                <InputText type="number" />
              </FormField>
            </Stack>
          ))}
          <Button variant="solid" muted onClick={handleAddGroup}>Add Group</Button>
        </Stack>
      </Card>
      <Button type="submit" disabled={loading}>Create</Button>
    </Form >
  );
};
