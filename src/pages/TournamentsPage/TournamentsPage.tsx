import { useNavigate } from 'react-router-dom';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { IconButton } from '~/components/generic/IconButton';
import { InputText } from '~/components/generic/InputText';
import { Stack } from '~/components/generic/Stack';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/generic/Tabs';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';

import './TournamentsPage.scss';

export const TournamentsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleClickCreateTournament = (): void => {
    navigate('/tournaments/create');
  };
  return (
    <PageWrapper title="Tournaments">
      <Stack orientation="horizontal">
        <InputText slotBefore={<Search />} placeholder="Search..." />
        <Button slotBefore={<ListFilter />} variant="outlined">Filter</Button>
        <IconButton onClick={handleClickCreateTournament}><Plus /></IconButton>
      </Stack>
      <Tabs defaultValue="all">
        <TabsList width="min">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="all" tabIndex={-1}>
          <Stack orientation="vertical" gap="0.5rem">
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
            <TournamentCard tournamentId="foo" />
          </Stack>
        </TabsContent>
        <TabsContent value="future" tabIndex={-1}>
          V1
          <Card className="TournamentsListView">
            Future Tournaments
          </Card>
        </TabsContent>
        <TabsContent value="past" tabIndex={-1}>
          V2
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};