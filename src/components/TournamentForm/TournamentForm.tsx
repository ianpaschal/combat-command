import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import { useQuery } from 'convex/react';

import { api, TournamentId } from '~/api';
import { FowV4TournamentGameConfigForm } from '~/components/FowV4TournamentGameConfigForm';
import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { InputDate } from '~/components/generic/InputDate';
import { convertUTCStringToLocalString } from '~/components/generic/InputDateTime';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';
import { createCn } from '~/utils/componentLib/createCn';
import {
  defaultValues,
  TournamentFormData,
  tournamentFormResolver,
} from './TournamentForm.utils';

import './TournamentForm.scss';

const cn = createCn('TournamentForm');

export interface TournamentFormProps {
  tournamentId?: TournamentId;
  defaultValues?: Partial<TournamentFormData>;
  loading?: boolean;
  onSubmit: SubmitHandler<TournamentFormData>;
}

export const TournamentForm = ({
  tournamentId,
  loading = false,
  onSubmit,
}: TournamentFormProps): JSX.Element => {

  const tournament = useQuery(api.tournaments.fetchTournament.fetchTournament, tournamentId ? { id: tournamentId } : 'skip');

  const [useTeams, setUseTeams] = useState<boolean>(false);
  // const [forceNationalTeams, setForceNationalTeams] = useState<boolean>(false);
  const [timeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const existingValues = tournament ? {
    ...tournament,

    // Convert UTC times to local times for better UX
    startsAtLocal: convertUTCStringToLocalString(tournament.startsAt, tournament.location),
    endsAtLocal: convertUTCStringToLocalString(tournament.endsAt, tournament.location),
    registrationClosesAtLocal: convertUTCStringToLocalString(tournament.registrationClosesAt, tournament.location),
  } : {};

  const form = useForm<TournamentFormData>({
    resolver: tournamentFormResolver,
    defaultValues: { ...defaultValues, ...existingValues },
    mode: 'onBlur',
  });

  const blocker = useBlocker(() => form.formState.isDirty);

  // const { fields: competitorGroupFields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'competitor_groups',
  // });

  // const handleAddGroup = (e: MouseEvent): void => {
  //   e.preventDefault();
  //   append({ name: '', size: 0 });
  // };

  // const handleRemoveGroup = (e: MouseEvent, i: number): void => {
  //   e.preventDefault();
  //   remove(i);
  // };

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

  const { competitorCount, competitorSize } = form.watch();

  const competitorLabel = useTeams ? 'Teams' : 'Players';
  const totalPlayers = competitorCount * competitorSize;

  const game_system_options = [
    { value: '1e307db7-207b-4493-b563-8056535616cc', label: 'Flames of War (4th Ed.)' },
  ];

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
          <FormField name="rulesPackUrl" label="Rules Pack URL">
            <InputText type="text" placeholder="http://" />
          </FormField>
          <FormField name="locationId" label="Location">
            <InputLocation />
          </FormField>
          <div className={cn('_DateTimeSection')}>
            <FormField name="startsAtLocal" label="Starts">
              <InputDate />
            </FormField>
            {/* <FormField name="startsAtLocal" label="Start Time" >
              <InputText type="time" slotBefore={<Clock />} />
            </FormField> */}
            <FormField name="endsAtLocal" label="Ends">
              <InputDate />
            </FormField>
            {/* <FormField name="endsAtLocal" label="End Time" >
              <InputText type="time" slotBefore={<Clock />} />
            </FormField> */}
          </div>
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
      {/* <Card
        className={clsx(cn('_GroupsCard'))}
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel.toLocaleLowerCase()} such as 'Axis' and 'Allies' or 'Imperium' and 'Xenos'.`}
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
      </Card> */}
      <Button type="submit" disabled={loading}>Create</Button>
    </Form >
  );
};
