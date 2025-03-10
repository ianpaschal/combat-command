import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';

import { api, TournamentId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FowV4TournamentGameConfigForm } from '~/components/FowV4TournamentGameConfigForm';
import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import {
  convertLocalStringToUTCString,
  convertUTCStringToLocalString,
  InputDateTime,
} from '~/components/generic/InputDateTime';
import { InputLocation } from '~/components/generic/InputLocation';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputTextArea } from '~/components/generic/InputTextArea';
import { Separator } from '~/components/generic/Separator';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { toast } from '~/components/ToastProvider';
import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';
import {
  defaultValues,
  TournamentFormData,
  tournamentFormResolver,
} from './TournamentForm.utils';

import styles from './TournamentForm.module.scss';

export interface TournamentFormProps {
  tournamentId?: TournamentId;
  defaultValues?: Partial<TournamentFormData>;
  loading?: boolean;
}

export const TournamentForm = ({
  tournamentId,
  loading = false,
}: TournamentFormProps): JSX.Element => {
  const user = useAuth();
  const createTournament = useMutation(api.tournaments.createTournament.createTournament);
  const updateTournament = useMutation(api.tournaments.updateTournament.updateTournament);
  const tournament = useQuery(api.tournaments.fetchTournament.fetchTournament, tournamentId ? { id: tournamentId } : 'skip');

  const [useTeams, setUseTeams] = useState<boolean>(false);

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
    mode: 'onSubmit',
  });

  const blocker = useBlocker(() => form.formState.isDirty);

  // TODO: Implement later
  // const { fields: competitorGroupFields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'competitorGroups',
  // });

  // const handleAddGroup = (e: MouseEvent): void => {
  //   e.preventDefault();
  //   append({ name: '', size: 0 });
  // };

  // const handleRemoveGroup = (e: MouseEvent, i: number): void => {
  //   e.preventDefault();
  //   remove(i);
  // };

  const onSubmit: SubmitHandler<TournamentFormData> = (data) => {
    const {
      startsAtLocal,
      endsAtLocal,
      registrationClosesAtLocal,
      ...restData
    } = data;
    // if (tournament) {
    //   updateTournament({
    //     id: tournament._id,
    //     ...tournament,
    //     ...data,
    //   });
    // }
    createTournament({
      ...restData,
      organizerIds: [user!._id],
      registrationClosesAt: new Date().toISOString(),
      status: 'draft',
      startsAt: convertLocalStringToUTCString(startsAtLocal, data.location),
      endsAt: convertLocalStringToUTCString(endsAtLocal, data.location),
    }).then(() => {
      toast.success('Tournament successfully created!');
    });
  };

  const handleToggleIsTeam = (checked: boolean): void => {
    // If changing from team to solos, convert total players back to teams of 1
    if (useTeams && !checked) {
      form.reset((prev) => ({
        ...prev,
        competitorSize: 1,
        competitorCount: totalPlayers,
        useNationalTeams: false,
      }));
    }
    setUseTeams(checked);
  };

  const { competitorCount, competitorSize } = form.watch();

  const competitorLabel = useTeams ? 'Teams' : 'Players';
  const totalPlayers = competitorCount * competitorSize;

  const gameSystemOptions = [
    { value: 'flames_of_war_4th_edition', label: 'Flames of War (4th Ed.)' },
  ];

  console.log('errors', form.formState.errors);
  return (
    <Form form={form} onSubmit={onSubmit} className={styles.Root}>
      <UnsavedChangesDialog blocker={blocker} />
      <Card title="General">
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
          <FormField name="location" label="Location">
            <InputLocation />
          </FormField>
          <div className={styles.DateTimeSection}>
            <FormField name="startsAtLocal" label="Starts">
              <InputDateTime />
            </FormField>
            <FormField name="endsAtLocal" label="Ends">
              <InputDateTime />
            </FormField>
          </div>
        </Stack>
      </Card>
      <Card title="Game Rules">
        <div className={styles.GameSystemFields}>
          {gameSystemOptions.length > 1 && (
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
          <div className={styles.CompetitorsInputs}>
            <FormField name="competitorCount" label={`Total ${competitorLabel}`}>
              <InputText type="number" />
            </FormField>
            <Animate show={useTeams}>
              <div className={styles.CompetitorTeamSection}>
                <FormField className={styles.CompetitorSizeInput} name="competitorSize" label="Team Size">
                  <InputText type="number" />
                </FormField>
                <FormField className={styles.UseNationalTeamsInput} name="useNationalTeams" label="Use National Teams">
                  <Switch />
                </FormField>
              </div>
            </Animate>
          </div>
          <h3>Total Players: {totalPlayers}</h3>
        </Stack>
      </Card>
      {/* TODO: Implement later!  */}
      {/* <Card
        title="Registration Groups"
        description={`Use groups to create different sets of ${competitorLabel.toLocaleLowerCase()} such as 'Axis' and 'Allies' or 'Imperium' and 'Xenos'.`}
      >
        <Stack horizontalAlign="end" gap="0.5rem">
          {competitorGroupFields.map((_field, i) => (
            <Stack key={i} orientation="horizontal" gap="0.5rem" className={styles.RegistrationGroup} verticalAlign="center">
              <Stack gap={0}>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronUp /></Button>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small" disabled={competitorGroupFields.length < 2}><X /></Button>
                <Button onClick={(e) => handleRemoveGroup(e, i)} variant="ghost" size="small"><ChevronDown /></Button>
              </Stack>
              <FormField name={`competitorGroups.${i}.name`} label="Name">
                <InputText type="text" />
              </FormField>
              <FormField name={`competitorGroups.${i}.size`} label={competitorLabel} className={cn('_CompetitorGroupSizeInput')}>
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
