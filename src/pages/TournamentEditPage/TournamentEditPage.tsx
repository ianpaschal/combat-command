import {
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TournamentId } from '~/api';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentForm } from '~/components/TournamentForm';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';
import { PATHS } from '~/settings';

const WIDTH = 960;
const FORM_ID = 'tournament-create-form';

export const TournamentEditPage = (): JSX.Element => {
  const { pathname } = useLocation();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useFetchTournament(tournamentId);
  const navigate = useNavigate();

  const handleSuccess = (id: string): void => {
    toast.success('Changes saved!');
    navigate(generatePath(PATHS.tournamentDetails, { id }));
  };

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }
  return (
    <PageWrapper
      title={`Editing ${tournament.title}`}
      showBackButton
      maxWidth={WIDTH}
      footer={
        <>
          <Button muted onClick={handleCancel} key={0}>Cancel</Button>
          <Button type="submit" form={FORM_ID} key={0}>Save</Button>
        </>
      }
    >
      <TournamentForm id={FORM_ID} onSuccess={handleSuccess} tournamentId={tournamentId} />
    </PageWrapper>
  );
};
