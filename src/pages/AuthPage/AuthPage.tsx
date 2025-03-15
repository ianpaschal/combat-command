import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { PreventAuth } from '~/components/PreventAuth';
import { AuthFlowContext } from './AuthPage.context';

export const AuthPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  return (
    <PreventAuth>
      <PageWrapperHalf>
        <AuthFlowContext.Provider value={{ email, setEmail }}>
          <Outlet />
        </AuthFlowContext.Provider>
      </PageWrapperHalf>
    </PreventAuth>
  );
};
