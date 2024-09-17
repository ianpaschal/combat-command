import { MouseEvent, useState } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from 'lucide-react';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
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
import { createCn } from '~/utils/createCn';

import './CreateTournamentForm.scss';

const formSchema = z.object({
  competitor_count: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitor_groups: z.array(z.object({
    name: z.string().min(1).max(20),
    size: z.coerce.number().min(1),
  })),
  competitor_size: z.coerce.number(),
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  end_date: z.string(),
  end_time: z.string(),
  location: z.string(),
  organizer_id: z.string(),
  rules_pack_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  start_date: z.string(),
  start_time: z.string(),
  title: z.string(),
});

type FormInput = z.infer<typeof formSchema>;

const cn = createCn('CreateTournamentForm');

export const CreateTournamentForm = (): JSX.Element => {
  const user = useAuth();
  const [loading] = useState<boolean>(false);
  const [isTeam, setIsTeam] = useState<boolean>(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competitor_count: 10,
      competitor_groups: [{ name: 'All Competitors', size: 10 }],
      competitor_size: 1,
      description: '',
      end_date: '',
      end_time: '18:00',
      location: '',
      organizer_id: user?.id,
      rules_pack_url: '',
      start_date: '',
      start_time: '09:00',
      title: '',
    },
    mode: 'onBlur',
  });
  const { fields: competitorGroupFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'competitor_groups',
  });

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput): Promise<void> => {
    console.log(data);
  };

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
    <Form form={form} onSubmit={onSubmit} className="FowV4MatchResultForm">
      <Card className="GameMetaSection" title="General">
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
          <Stack className="DateTimeSection" orientation="horizontal">
            <div className={cn('DateTimeStart')}>
              <FormField name="start_Date" label="Start Date">
                <InputDate />
              </FormField>
              <FormField name="start_time" label="Start Time" >
                <InputText type="time" slotBefore={<Clock />} />
              </FormField>
            </div>
            <div className={cn('DateTimeEnd')}>
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
          <div className={cn('CompetitorsInputs')}>
            <FormField name="competitor_count" label={`Total ${competitorLabel}`}>
              <InputText type="number" />
            </FormField>
            <Animate show={isTeam}>
              <FormField className={cn('CompetitorSizeInput')} name="competitor_size" label="Team Size">
                <InputText type="number" />
              </FormField>
            </Animate>
          </div>
          <h3>Total Players: {totalPlayers}</h3>
        </Stack>
      </Card>
      <Card
        className={clsx(cn('GroupsCard'))}
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel} such as 'Axis' and 'Allies'.`}
      >
        <Stack horizontalAlign="end" gap="0.5rem">
          {competitorGroupFields.map((_field, i) => (
            <Stack orientation="horizontal" gap="0.5rem" className="RegistrationGroup">
              <Stack gap={0}>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronUp /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small" disabled={competitorGroupFields.length < 2}><X /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronDown /></IconButton>
              </Stack>
              <FormField name={`competitor_groups.${i}.name`} label="Name">
                <InputText type="text" />
              </FormField>
              <FormField name={`competitor_groups.${i}.size`} label={competitorLabel} className="CompetitorGroupSizeInput">
                <InputText type="number" />
              </FormField>
            </Stack>
          ))}
          <Button variant="solid-muted" onClick={handleAddGroup}>Add Group</Button>
        </Stack>
      </Card>
      <Button type="submit" disabled={loading}>Create</Button>
    </Form >
  );
};
