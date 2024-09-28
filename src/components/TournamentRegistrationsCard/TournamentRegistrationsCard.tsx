import clsx from 'clsx';

import { Card } from '~/components/generic/Card';
import {
  ColumnDef,
  CountryCell,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';
import { bem } from '~/utils/componentLib/bem';

interface TournamentRegistrationsCardProps {
  tournamentId: string;
  className?: string;
}

type RegistrationRow = { teamName: string; playerName: string; };

const cn = bem('TournamentRegistrationsCard');

export const TournamentRegistrationsCard = ({
  // tournamentId,
  className,
}: TournamentRegistrationsCardProps): JSX.Element => {
  const tournament = {
    use_national_teams: true,
    competitor_size: 6,
  };

  const tournamentCompetitors: { player_names: string[]; team_name: string; }[] = [
    { team_name: 'nl', player_names: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'] },
    { team_name: 'be', player_names: ['George', 'Hannah', 'Isaac', 'Jack', 'Kara', 'Liam'] },
    { team_name: 'de', player_names: ['Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ruby'] },
    { team_name: 'us', player_names: ['Sarah', 'Tom', 'Uma', 'Vince', 'Wendy', 'Xander'] },
    { team_name: 'fr', player_names: ['Yara', 'Zane', 'Aaron', 'Bella', 'Caleb', 'Daphne'] },
    { team_name: 'es', player_names: ['Elijah', 'Freya', 'Gavin', 'Hazel', 'Ian', 'Jade'] },
    { team_name: 'pt', player_names: ['Kevin', 'Lily', 'Mason', 'Nina', 'Owen', 'Piper'] },
    { team_name: 'nz', player_names: ['Quincy', 'Rose', 'Sam', 'Tina', 'Ursula', 'Victor'] },
    { team_name: 'fi', player_names: ['Will', 'Xena', 'Yuri', 'Zara', 'Adam', 'Becca'] },
    { team_name: 'is', player_names: ['Cody', 'Delilah', 'Evan', 'Faith', 'Greg', 'Holly'] },
    { team_name: 'dk', player_names: ['Ivy', 'Jon', 'Kylie', 'Logan', 'Maya', 'Nate'] },
    { team_name: 'ch', player_names: ['Opal', 'Peter', 'Quincy', 'Raven', 'Scott', 'Tess'] },
    { team_name: 'at', player_names: ['Ulysses', 'Val', 'Willow', 'Xavier', 'Yvonne', 'Zeke'] },
    { team_name: 'it', player_names: ['Amber', 'Ben', 'Carmen', 'Drew', 'Ella', 'Felix'] },
    { team_name: 'gr', player_names: ['Grace', 'Henry', 'Iris', 'Jason', 'Kim', 'Lara'] },
    { team_name: 'gb-eng', player_names: ['Matt', 'Nora', 'Oscar', 'Paige', 'Quinn', 'Rachel'] },
    { team_name: 'gb-nir', player_names: ['Steve', 'Tori', 'Una', 'Violet', 'Wyatt', 'Ximena'] },
    { team_name: 'gb-wls', player_names: ['Yasmine', 'Zack', 'Abby', 'Blake', 'Cora', 'Dean'] },
    { team_name: 'gb-sct', player_names: ['Elle', 'Finn', 'Gia', 'Hank', 'Irene', 'Jake'] },
    { team_name: 'by', player_names: ['Lana', 'Miles', 'Nico', 'Olga', 'Phil', 'Quinn'] },
    { team_name: 'ie', player_names: ['Ruby', 'Shawn', 'Tara', 'Ugo', 'Vera', 'Will'] },
    { team_name: 'pl', player_names: ['Xia', 'Yasmin', 'Zion', 'Aiden', 'Brynn', 'Claire'] },
  ]; // Get competitors where tourney ID = tournamentId; join in user data

  const isTeamTournament = tournament.competitor_size > 1;
  const useNationalTeams = tournament.use_national_teams;

  const rows = tournamentCompetitors.reduce((acc, competitor) => {
    const playerRows = competitor.player_names.map((playerName) => (
      { playerName, teamName: competitor.team_name }
    ));
    return [...acc, ...playerRows];
  }, [] as RegistrationRow[]);

  const columns: ColumnDef<RegistrationRow>[] = [
    ...(isTeamTournament ? [{
      header: 'Team',
      render: (data: RegistrationRow) => useNationalTeams ? (
        <CountryCell code={data.teamName} />
      ) : (
        <DefaultCell value={data.teamName} />
      ),
      width: '1fr',
    }] : []),
    {
      header: 'Player',
      render: (data) => <DefaultCell value={data.playerName} />,
      width: '1fr',
    },
  ];

  return (
    <Card className={clsx(cn(), className)} title="Registrations">
      <DataTable data={rows} columns={columns} includeLineNumbers />
    </Card>
  );
};