import { MouseEvent, useState } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import clsx from 'clsx';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from 'lucide-react';

import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { IconButton } from '~/components/generic/IconButton';
import { InputDate } from '~/components/generic/InputDate';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Label } from '~/components/generic/Label';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';
import { Tournament, tournamentResolver } from '~/types/Tournament';
import { createCn } from '~/utils/componentLib/createCn';

import './TournamentForm.scss';

const cn = createCn('TournamentForm');

const defaultValues: Partial<Tournament> = {
  competitor_count: 10,
  competitor_groups: [{ name: 'All Competitors', size: 10 }],
  competitor_size: 1,
  description: '',
  end_date: '',
  end_time: '18:00',
  location: '',
  organizer_ids: [],
  rules_pack_url: '',
  start_date: '',
  start_time: '09:00',
  title: '',
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
  const [isTeam, setIsTeam] = useState<boolean>(false);

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
    if (isTeam && !checked) {
      form.reset((prev) => ({
        ...prev,
        competitor_size: 1,
        competitor_count: totalPlayers,
      }));
    }
    setIsTeam(checked);
  };

  const { competitor_count, competitor_size } = form.watch();

  const competitorLabel = isTeam ? 'Teams' : 'Players';
  const totalPlayers = competitor_count * competitor_size;

  return (
    <Form form={form} onSubmit={onSubmit} className={cn()}>
      <UnsavedChangesDialog blocker={blocker} />
      <Card className={cn('__GameMetaSection')} title="General">
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
          <Stack className={cn('__DateTimeSection')} orientation="horizontal">
            <div className={cn('__DateTimeStart')}>
              <FormField name="start_date" label="Start Date">
                <InputDate />
              </FormField>
              <FormField name="start_time" label="Start Time" >
                <InputText type="time" slotBefore={<Clock />} />
              </FormField>
            </div>
            <div className={cn('__DateTimeEnd')}>
              <FormField name="end_date" label="End Date">
                <InputDate />
              </FormField>
              <FormField name="end_time" label="End Time" >
                <InputText type="time" slotBefore={<Clock />} />
              </FormField>
            </div>
          </Stack>
        </Stack>
      </Card>
      <Card
        title="Players & Teams"
        description="Ranking and pairing configuration as well as player tasks can be configured after creation."
      >
        <Stack>
          <Stack orientation="horizontal" verticalAlign="center">
            <Switch id="isTeam" checked={isTeam} onCheckedChange={handleToggleIsTeam} />
            <Label htmlFor="isTeam">Team Tournament</Label>
          </Stack>
          <div className={cn('__CompetitorsInputs')}>
            <FormField name="competitor_count" label={`Total ${competitorLabel}`}>
              <InputText type="number" />
            </FormField>
            <Animate show={isTeam}>
              <FormField className={cn('__CompetitorSizeInput')} name="competitor_size" label="Team Size">
                <InputText type="number" />
              </FormField>
            </Animate>
          </div>
          <h3>Total Players: {totalPlayers}</h3>
        </Stack>
      </Card>
      <Card
        className={clsx(cn('__GroupsCard'))}
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel} such as 'Axis' and 'Allies'.`}
      >
        <Stack horizontalAlign="end" gap="0.5rem">
          {competitorGroupFields.map((_field, i) => (
            <Stack orientation="horizontal" gap="0.5rem" className={cn('__RegistrationGroup')} verticalAlign="center">
              <Stack gap={0}>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronUp /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small" disabled={competitorGroupFields.length < 2}><X /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronDown /></IconButton>
              </Stack>
              <FormField name={`competitor_groups.${i}.name`} label="Name">
                <InputText type="text" />
              </FormField>
              <FormField name={`competitor_groups.${i}.size`} label={competitorLabel} className={cn('__CompetitorGroupSizeInput')}>
                <InputText type="number" />
              </FormField>
            </Stack>
          ))}
          <Button variant="solid" muted onClick={handleAddGroup}>Add Group</Button>
        </Stack>
      </Card>
      <Button type="submit" disabled={loading}>Create</Button>
    </Form>
  );
};
