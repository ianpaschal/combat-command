import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentForm } from '~/components/TournamentForm';
import { PATHS } from '~/settings';

const WIDTH = 960;
const FORM_ID = 'tournament-create-form';

export const TournamentCreatePage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleSuccess = (_id: string): void => {
    toast.success('Tournament created!');
    navigate(PATHS.tournaments);
    // navigate(generatePath(PATHS.tournamentDetails, { id }));
  };
  return (
    <PageWrapper
      title="Create Tournament"
      showBackButton
      maxWidth={WIDTH}
      footer={
        <Button type="submit" form={FORM_ID}>
          Create
        </Button>
      }
    >
      <TournamentForm id={FORM_ID} onSuccess={handleSuccess} />
    </PageWrapper>
  );
};
