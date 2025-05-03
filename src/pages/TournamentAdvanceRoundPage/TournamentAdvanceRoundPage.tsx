import { useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TournamentId } from '~/api';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentProvider } from '~/components/TournamentProvider';
import { PairingsStep } from '~/pages/TournamentAdvanceRoundPage/components/PairingsStep';
import { RosterStep } from '~/pages/TournamentAdvanceRoundPage/components/RosterStep';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';

export const TournamentAdvanceRoundPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useFetchTournament(tournamentId);

  const [view, setView] = useState<'roster' | 'pairings'>('roster');

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  const handleProceed = (): void => {
    // TODO: Handle if proceeding is not possible
    setView('pairings');
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const title = view === 'roster' ? 'Round 2 Players' : 'Round 2 Pairings';

  return (
    <PageWrapper
      title={title}
      footer={
        <>
          <Button muted onClick={handleCancel} key={0}>Cancel</Button>
          {view === 'roster' && (
            <Button key={1} onClick={handleProceed}>Proceed</Button>
          )}
          {view === 'pairings' && (
            <Button type="submit" key={2}>Save Pairings</Button>
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
