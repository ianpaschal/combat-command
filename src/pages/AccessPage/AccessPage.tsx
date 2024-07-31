import { Navigate } from 'react-router-dom';

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
import { useRoutedTabs } from './AccessPage.hooks';

import './AccessPage.scss';

export const AccessPage = (): JSX.Element => {
  const user = useAuth();

  const [activeTab, setActiveTab] = useRoutedTabs(['sign-in', 'sign-up']);

  // If logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="AccessPage">
      <Card className="AccessPageCard">
        LOGO
        <Tabs value={activeTab} onValueChange={setActiveTab} className="AccessPageTabs">
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
