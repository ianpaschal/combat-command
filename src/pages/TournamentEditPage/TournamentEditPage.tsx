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
import { TournamentForm, TournamentFormSubmitData } from '~/components/TournamentForm';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';
import { useUpdateTournament } from '~/services/tournaments/useUpdateTournament';
import { PATHS } from '~/settings';

const WIDTH = 960;
const FORM_ID = 'tournament-edit-form';

export const TournamentEditPage = (): JSX.Element => {
  const { pathname } = useLocation();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useFetchTournament(tournamentId);
  const navigate = useNavigate();

  const { mutation: updateTournament, loading } = useUpdateTournament({
    onSuccess: (): void => {
      toast.success('Changes saved!');
      navigate(generatePath(PATHS.tournamentDetails, { id: tournamentId }));
    },
  });

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  const handleUpdate = (data: TournamentFormSubmitData): void => {
    updateTournament({
      id: tournamentId,
      ...data,
    });
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
          <Button variant="secondary" onClick={handleCancel} key={0} disabled={loading}>Cancel</Button>
          <Button type="submit" form={FORM_ID} key={1} disabled={loading}>Save</Button>
        </>
      }
    >
      <TournamentForm id={FORM_ID} onSubmit={handleUpdate} tournamentId={tournamentId} />
    </PageWrapper>
  );
};
