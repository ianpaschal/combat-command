import { MouseEvent, useState } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
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
import { Form } from '~/components/generic/Form';
import { FormTextAreaField } from '~/components/generic/FormTextAreaField';
import { FormTextField } from '~/components/generic/FormTextField';
import { IconButton } from '~/components/generic/IconButton';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';

import './CreateTournamentForm.scss';

const formSchema = z.object({
  title: z.string(),
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  rules_pack_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  location: z.string(),
  organizer_id: z.string(),
  competitor_size: z.coerce.number(),
  start_time: z.string(),
  end_time: z.string(),
  competitor_count: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitor_groups: z.array(z.object({
    name: z.string().min(1).max(20),
    size: z.coerce.number().min(1),
  })),
});

type FormInput = z.infer<typeof formSchema>;

const cn = (className: string): string => `CreateTournamentForm${className}`;

export const CreateTournamentForm = (): JSX.Element => {
  const user = useAuth();
  const [loading] = useState<boolean>(false);
  const [isTeam, setIsTeam] = useState<boolean>(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      rules_pack_url: '',
      organizer_id: user?.id,
      location: '',
      start_time: '09:00',
      end_time: '18:00',
      competitor_count: 2,
      competitor_size: 1,
      competitor_groups: [{
        name: 'All Competitors',
        size: 10,
      }],
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'competitor_groups',
  });

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput): Promise<void> => {
    console.log(data);
  };

  // const { watch } = form;
  // const { detailed_result, tournament_pairing_id } = watch();
  // const showGameConfigSection = tournament_pairing_id === 'NONE';
  // const showWinnerField = !!detailed_result.outcome_type && detailed_result.outcome_type !== 'time_out';

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
          <FormTextField name="title" label="Title" type="text" description="Avoid including points and other rules in the title." />
          <FormTextAreaField name="description" label="Description" />
          <FormTextField name="rules_pack_url" label="Rules Pack URL" type="text" placeholder="http://" />
          <FormTextField name="location" label="Location" type="text" />
          <Stack className="DateTimeSection" orientation="horizontal">
            <div className={cn('DateTimeStart')}>
              <FormTextField name="detailed_result.turns_played" label="Start Date" type="text" />
              <FormTextField name="start_time" label="Start Time" type="time" slotBefore={<Clock />} />
            </div>
            <div className={cn('DateTimeEnd')}>
              <FormTextField name="detailed_result.turns_played" label="End Date" type="text" />
              <FormTextField name="end_time" label="End Time" type="time" slotBefore={<Clock />} />
            </div>
          </Stack>
        </Stack>
      </Card>
      <Card title="Players & Teams" description="Ranking and pairing configuration as well as player tasks can be configured after creation.">
        <Stack>
          <Stack orientation="horizontal">
            <Switch id="isTeam" checked={isTeam} onCheckedChange={handleToggleIsTeam} />
            <Label htmlFor="isTeam">Team Tournament</Label>
          </Stack>
          <FormTextField name="competitor_count" label={`Total ${competitorLabel}`} type="number" />
          <Animate show={isTeam}>
            <FormTextField className={cn('CompetitorSizeInput')} name="competitor_size" label="Team Size" type="number" />
          </Animate>
          {/* {isTeam && (
            <FormTextField className={cn('CompetitorSizeInput')} name="competitor_size" label="Team Size" type="number" />
          )} */}
          <h3>Total Players: {totalPlayers}</h3>
        </Stack>
      </Card>
      <Card
        className={clsx(cn('GroupsCard'))}
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel} such as 'Axis' and 'Allies'.`}
      >
        <Stack horizontalAlign="end" gap="0.5rem">
          {fields.map((_field, i) => (
            <Stack orientation="horizontal" gap="0.5rem" className="RegistrationGroup">
              <Stack gap={0}>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronUp /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small" disabled={fields.length < 2}><X /></IconButton>
                <IconButton onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronDown /></IconButton>
              </Stack>
              <FormTextField name={`competitor_groups.${i}.name`} label="Name" type="text" />
              <FormTextField name={`competitor_groups.${i}.size`} label={competitorLabel} type="number" className="CompetitorGroupSizeInput" />
            </Stack>
          ))}
          <Button variant="solid-muted" onClick={handleAddGroup}>Add Group</Button>
        </Stack>
      </Card>
      <Button type="submit" disabled={loading}>Create</Button>
    </Form >
  );
};
