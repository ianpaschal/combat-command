import { useParams } from 'react-router-dom';

import { TournamentPairingId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { Spinner } from '~/components/generic/Spinner';
import { MatchResultCard } from '~/components/MatchResultCard';
import { MatchResultCreateDialog, useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';
import { useGetMatchResultsByTournamentPairing } from '~/services/matchResults';
import { useGetTournamentPairing } from '~/services/tournamentPairings';
import { useGetTournament } from '~/services/tournaments';
import { MAX_WIDTH } from '~/settings';

import styles from './TournamentPairingDetailPage.module.scss';

export const TournamentPairingDetailPage = (): JSX.Element => {
  const user = useAuth();
  const params = useParams();
  const tournamentPairingId = params.id! as TournamentPairingId; // Must exist or else how did we get to this route?

  const { data: tournamentPairing, loading: tournamentPairingLoading } = useGetTournamentPairing({ id: tournamentPairingId });
  const { data: tournament, loading: tournamentLoading } = useGetTournament(tournamentPairing ? {
    id: tournamentPairing.tournamentId,
  } : 'skip');
  const { data: matchResults, loading: matchResultsLoading } = useGetMatchResultsByTournamentPairing({
    tournamentPairingId: tournamentPairingId,
  });

  const { open: openMatchResultCreateDialog } = useMatchResultCreateDialog();

  const showLoading = !tournamentPairing || tournamentPairingLoading || matchResultsLoading || tournamentLoading;

  const isPlayer = user && tournamentPairing?.playerUserIds.includes(user._id);
  const isOrganizer = user && tournament?.organizerUserIds.includes(user._id);
  const isComplete = tournamentPairing && tournamentPairing.matchResultsProgress.submitted === tournamentPairing?.matchResultsProgress.required;
  const showAddMatchResult = (isPlayer || isOrganizer) && !isComplete;

  return (
    <PageWrapper showBackButton maxWidth={MAX_WIDTH} title="Pairing Details">
      <div className={styles.TournamentPairingDetailPage}>
        {showLoading ? (
          <Spinner />
        ) : (
          <>
            <div>
              <TournamentPairingRow pairing={tournamentPairing} />
            </div>
            <div>
              {`Submitted Match Results: ${tournamentPairing.matchResultsProgress.submitted}/${tournamentPairing.matchResultsProgress.required}`}
            </div>
            <Separator />
            <div>
              {(matchResults ?? []).map((matchResult) => (
                <MatchResultCard key={matchResult._id} matchResult={matchResult} />
              ))}
            </div>
            {showAddMatchResult && (
              <>
                <Separator />
                <div>
                  <Button onClick={() => openMatchResultCreateDialog({ tournamentPairingId })}>Add Match Result</Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <MatchResultCreateDialog />
    </PageWrapper>
  );
};
