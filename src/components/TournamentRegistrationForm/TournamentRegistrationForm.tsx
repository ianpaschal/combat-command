import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { Form, FormField } from '~/components/generic/Form';
import { InputSelect, InputSelectItem } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { TournamentMatchFormData, tournamentMatchFormSchema } from '~/types/Match';

import styles from './TournamentRegistrationForm.module.scss';

export interface TournamentRegistrationFormProps {
  id: string;
  className?: string;
  tournamentId?: string;
  onSuccess?: () => void;
}

export const TournamentRegistrationForm = ({
  id,
  className,
  tournamentId,
}: TournamentRegistrationFormProps): JSX.Element => {

  const { data: tournament } = useFetchTournamentFull(tournamentId);

  const form = useForm<TournamentMatchFormData>({
    resolver: zodResolver(tournamentMatchFormSchema),
    defaultValues: {
      tournament_pairing_id: undefined,
      attacker: undefined,
      first_turn: undefined,
      mission_id: undefined,
      outcome_type: undefined,
      player_0_id: undefined,
      player_0_stance: undefined,
      player_0_units_lost: undefined,
      player_1_id: undefined,
      player_1_stance: undefined,
      player_1_units_lost: undefined,
      turns_played: undefined,
      winner: undefined,
    },
    mode: 'onSubmit',
  });
  // const { watch, handleSubmit, setValue } = form;

  const onSubmit: SubmitHandler<TournamentMatchFormData> = (data: TournamentMatchFormData): void => {
    console.log(data);
  };

  const competitorOptions = (tournament?.competitors || []).reduce((acc, competitor) => {
    if (tournament && (competitor.players.length < tournament?.competitor_size)) {
      const label = `${competitor.team_name || 'Unknown Team'} (${competitor.players.length}/${tournament.competitor_size})`;
      return [...acc, {
        value: competitor.id, label,
      }];
    }
    return acc;
  }, [] as InputSelectItem<string>[]);

  const isTeamTournament = tournament && tournament.competitor_size > 1;
  // const allowNewTeams = isTeamTournament && !tournament.use_national_teams && (competitors.length < tournament.competitor_count);

  // const isGroupedTournament = tournament && tournament.competitor_groups?.length > 1;

  /*

    const areSeatsAvailable = () => {
      if (isTeamTournament) {
        return competitors.some((c) => (
          c.players.length < tournament.competitor_size
        ))
      }
      return competitors.length < tournament.competitor_count
    }

  */
  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(className)}>
      <div className={styles.Root}>
        {isTeamTournament && (
          <div className={styles.TeamSection}>
            <FormField name="competitor" label="Team" disabled={!competitorOptions.length}>
              <InputSelect options={competitorOptions} />
            </FormField>
            <Separator text="foo" />
            <FormField name="new_team_name" label="Enter New Team Name">
              <InputText />
            </FormField>
          </div>
        )}

        {/* If tournament uses groups, select group */}

        {/* {!isTeamTournament && !isGroupedTournament && (
          <div>
            Hello
          </div>
        )} */}
      </div>
    </Form>
  );
};