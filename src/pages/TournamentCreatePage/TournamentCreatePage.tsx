import {
  generatePath,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentForm, TournamentFormSubmitData } from '~/components/TournamentForm';
import { useCreateTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';

const WIDTH = 960;
const FORM_ID = 'tournament-create-form';

export const TournamentCreatePage = (): JSX.Element => {
  const user = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { mutation: createTournament, loading } = useCreateTournament({
    onSuccess: (id): void => {
      toast.success('Tournament created!');
      navigate(generatePath(PATHS.tournamentDetails, { id }));
    },
  });

  const handleCancel = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };

  const handleCreate = (data: TournamentFormSubmitData): void => {
    createTournament({
      ...data,
      organizerUserIds: [user!._id],
    });
  };

  return (
    <PageWrapper
      title="Create Tournament"
      showBackButton
      maxWidth={WIDTH}
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel} key={0} disabled={loading}>Cancel</Button>
          <Button type="submit" form={FORM_ID} key={1} disabled={loading}>Create</Button>
        </>
      }
    >
      <TournamentForm id={FORM_ID} onSubmit={handleCreate} />
    </PageWrapper>
  );
};
