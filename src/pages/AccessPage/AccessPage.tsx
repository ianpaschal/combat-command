import { Navigate } from 'react-router-dom';

import { AppLogo } from '~/components/AppLogo';
import { useAuth } from '~/components/AuthProvider';
import { Card } from '~/components/generic/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/generic/Tabs';
import { SignInForm } from '~/components/SignInForm';
import { SignUpForm } from '~/components/SignUpForm';
import { createCn } from '~/utils/componentLib/createCn';
import { useRoutedTabs } from './AccessPage.hooks';

import './AccessPage.scss';

const cn = createCn('AccessPage');

export const AccessPage = (): JSX.Element => {
  const user = useAuth();

  const [activeTab, setActiveTab] = useRoutedTabs(['sign-in', 'sign-up']);

  // If logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className={cn()}>
      <Card className={cn('__Card')}>
        <AppLogo className={cn('__Logo')} />
        <h1>CombatCommand</h1>
        <Tabs className={cn('__Tabs')} value={activeTab} onValueChange={setActiveTab} >
          <TabsList>
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" tabIndex={-1}>
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" tabIndex={-1}>
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
