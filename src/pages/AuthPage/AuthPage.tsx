import { Outlet } from 'react-router-dom';

import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { PreventAuth } from '~/components/PreventAuth';

export const AuthPage = (): JSX.Element => (
  <PreventAuth>
    <PageWrapperHalf>
      <Outlet />
    </PageWrapperHalf>
  </PreventAuth>
);
