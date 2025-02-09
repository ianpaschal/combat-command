import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';
import { TournamentRegistrationForm } from '~/components/TournamentRegistrationForm/TournamentRegistrationForm';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';

import styles from './TournamentRegisterPage.module.scss';

export const TournamentRegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = (): void => {
    if (tournamentId) {
      navigate(`/tournaments/${tournamentId}`);
    }
  };
  const { data: tournament } = useFetchTournamentFull(tournamentId);

  return (
    <RequireAuth>
      <PageWrapper title={`Register for ${tournament?.title}`} showBackButton maxWidth={960}>
        <Card>
          {/* <pre>
          {JSON.stringify(tournament, null, 2)}
        </pre> */}
          <TournamentRegistrationForm id="tournament-registration-form" tournamentId={tournament?.id} />
          <div className={styles.FormActions}>
            <Button form="tournament-registration-form" type="submit">Register</Button>
          </div>
        </Card>
      </PageWrapper>
    </RequireAuth>
  );
};
