import { useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TournamentCompetitor, TournamentId } from '~/api';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentProvider } from '~/components/TournamentProvider';
import { RosterConfirmDialog, useRosterConfirmDialog } from '~/pages/TournamentAdvanceRoundPage/components/RosterConfirmDialog';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';
import { PairingsStep } from './components/PairingsStep';
import { RosterStep } from './components/RosterStep';

export const TournamentAdvanceRoundPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useFetchTournament(tournamentId);
  const { open } = useRosterConfirmDialog();
  const [view, setView] = useState<'roster' | 'pairings'>('roster');
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournamentId(tournamentId);

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  const handleBack = (): void => {
    setView('roster');
  };

  const handleProceed = (): void => {
    if (!tournament) {
      throw new Error('Tournament missing');
    }

    const sortedCompetitors = (tournamentCompetitors || []).reduce((acc, c) => {
      const key = c.active ? 'active' : 'inactive';
      acc[key].push(c);
      return acc;
    }, { active: [] as TournamentCompetitor[], inactive: [] as TournamentCompetitor[] });

    if (!sortedCompetitors.active.length) {
      throw new Error('No competitors');
    }
    if (sortedCompetitors.active.length > tournament.maxCompetitors) {
      throw new Error('Too many competitors!');
    }

    const showInactiveCompetitorsWarning = sortedCompetitors.inactive.length > 0;
    const showOddCompetitorCountWarning = sortedCompetitors.active.length % 2;

    if (showInactiveCompetitorsWarning || showOddCompetitorCountWarning) {
      open(sortedCompetitors);
    } else {
      handleConfirmRoster();
    }
  };

  const handleConfirmRoster = (): void => {
    setView('pairings');
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const roundIndex = 1;

  return (
    <PageWrapper
      title={`Advance to Round ${roundIndex + 1}`}
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel} key={0} style={{ marginRight: 'auto' }}>Cancel</Button>
          {view === 'roster' && (
            <Button key={1} onClick={handleProceed}>Proceed</Button>
          )}
          {view === 'pairings' && (
            <>
              <Button variant="secondary" key="back" onClick={handleBack}>Back</Button>
              <Button type="submit" key="submit">Save Pairings</Button>
            </>
          )}
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        {view === 'roster' && (
          <RosterStep />
        )}
        {view === 'pairings' && (
          <PairingsStep />
        )}
        <RosterConfirmDialog onConfirm={handleConfirmRoster} />
      </TournamentProvider>
    </PageWrapper>
  );
};

/*

TO Flow:

- TO selects "End Round {x} & Advance"
  - If required match results are not submitted, throw error
  - Else, proceed...
- 

Close round.
Check number of competitors and players.
  
  1. Identify missing players
  2. 

  If a competitor is understrength, TO selects resolution:
    - Pair anyway, players will get auto-wins
    - Add another player
    - Remove the competitor
  Checkbox for rest of tournament or not

Generate pairings.
Commit pairings.
Start new round + timer;

*/
