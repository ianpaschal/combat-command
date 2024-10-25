import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';

export const DialogDemo = (): JSX.Element => (
  <PageWrapper title="Dialog Demo">
    <CheckInMatchDialog>
      <Button>Open Me</Button>
    </CheckInMatchDialog>
  </PageWrapper>
);