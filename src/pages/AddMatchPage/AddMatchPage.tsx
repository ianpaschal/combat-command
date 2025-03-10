import { useNavigate, useParams } from 'react-router-dom';

import { FowV4MatchResultForm } from '~/components/FowV4SingleMatchResultForm';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';

import styles from './AddMatchPage.module.scss';

export const AddMatchPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const handleSuccess = (): void => {
    if (tournamentId) {
      navigate(`/tournaments/${tournamentId}`);
    }
  };
  const { data: tournament } = useFetchTournamentFull(tournamentId);
  return (
    <PageWrapper title={tournament ? `Check-In Match for ${tournament.title}` : 'Check-In Match'} showBackButton maxWidth={960}>
      <Card>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          tournamentId={tournamentId}
          onSuccess={handleSuccess}
        />
        <div className={styles.FormActions}>
          <Button form="fow-v4-match-result-form" type="submit">Check-In Match</Button>
        </div>
      </Card>
    </PageWrapper>
  );
};
