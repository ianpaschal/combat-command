import { Plus } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { PageWrapper } from '~/components/PageWrapper';

export const MatchResultsPage = (): JSX.Element => {
  const { user } = useAuth();
  const showAddMatchResultButton = !!user;
  return (
    <PageWrapper title="Match Results">
      Hello world
      {showAddMatchResultButton && (
        <CheckInMatchDialog>
          <FloatingActionButton>
            <Plus />
          </FloatingActionButton>
        </CheckInMatchDialog>
      )}
    </PageWrapper>
  );
};