import { useAuth } from '~/components/AuthProvider';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentForm } from '~/components/TournamentForm';

export const CreateTournamentPage = (): JSX.Element => {
  const { user } = useAuth();
  return (
    <PageWrapper title="Create Tournament" showBackButton maxWidth={960}>
      <TournamentForm
        defaultValues={{ creator_id: user?.id }}
        onSubmit={(data) => console.log(data)}
      />
    </PageWrapper>
  );
};
