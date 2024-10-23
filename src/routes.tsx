import {
  createBrowserRouter,
  Navigate,
  RouteObject,
} from 'react-router-dom';

import { AccountForm } from '~/components/AccountForm';
import { App } from '~/components/App';
import { NavLink, Visibility } from '~/components/generic/NavLinks';
import { UserProfileForm } from '~/components/UserProfileForm';
import { ComponentTestPage } from '~/pages/ComponentTestPage';
import { CreateTournamentPage } from '~/pages/CreateTournamentPage';
import { DashboardPage } from '~/pages/DashboardPage';
import { ForgotPasswordPage } from '~/pages/ForgotPasswordPage';
import { LandingPage } from '~/pages/LandingPage';
import { MatchResultsPage } from '~/pages/MatchResultsPage';
import { SettingsPage } from '~/pages/SettingsPage';
import { SignInPage } from '~/pages/SignInPage';
import { SignUpPage } from '~/pages/SignUpPage';
import { StatisticsPage } from '~/pages/StatisticsPage';
import { TournamentDetailPage } from '~/pages/TournamentDetailPage';
import { TournamentsPage } from '~/pages/TournamentsPage';
import { UserProfilePage } from '~/pages/UserProfilePage';

export interface RouteDisplay {
  visibility?: Visibility[];
  title?: string;
}

export type ExtendedRouteObject = RouteDisplay & RouteObject & {
  children?: ExtendedRouteObject[];
};

export const routes: ExtendedRouteObject[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    visibility: ['main'],
    element: <DashboardPage />,
  },
  {
    path: '/tournaments',
    title: 'Tournaments',
    visibility: ['main'],
    element: <TournamentsPage />,
  },
  {
    path: '/tournaments/:id',
    title: 'View Tournament',
    visibility: [],
    element: <TournamentDetailPage />,
  },
  {
    path: '/tournaments/create',
    title: 'Create Tournament',
    visibility: [],
    element: <CreateTournamentPage />,
  },
  {
    path: '/matches',
    title: 'Match Results',
    visibility: ['main'],
    element: <MatchResultsPage />,
  },
  {
    path: '/statistics',
    title: 'Statistics',
    visibility: [], // TODO: Add to 'main' later
    element: <StatisticsPage />,
  },
  {
    path: '/profiles/:id',
    title: 'Uhhhhh', // FIXME: How to handle dynamic title?
    visibility: [],
    element: <UserProfilePage />,
  },
  {
    path: '/settings',
    title: 'Settings',
    visibility: ['accountMenu'],
    element: <SettingsPage />,
    children: [
      {
        index: true, // This will match "/settings"
        element: <Navigate to="profile" replace />, // Redirect to "/settings/profile"
      },
      {
        path: '/settings/profile',
        title: 'Profile',
        element: <UserProfileForm />,
      },
      {
        path: '/settings/account',
        title: 'Account',
        element: <AccountForm />,
      },
      // {
      //   path: '/settings/appearance',
      //   title: 'Appearance',
      //   element: <AppearanceForm />,
      // },
    ],
  },
  {
    path: '/sign-in',
    title: 'Sign In',
    visibility: ['accountMenuExternal'],
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    title: 'Sign Up',
    visibility: ['accountMenuExternal'],
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    title: 'Forgot Password',
    visibility: [],
    element: <ForgotPasswordPage />,
  },
  {
    path: '/test',
    title: 'Test',
    visibility: [],
    element: <ComponentTestPage />,
  },
];

export const getNavLinksByVisibility = (visibility: Visibility): NavLink[] => (
  // Reduce functions as filter-and-map-in-1
  routes.reduce((acc, route) => {
    if (route.visibility?.includes(visibility) && !!route.title && !!route.path) {
      acc.push({ path: route.path, title: route.title });
    }
    return acc;
  }, [] as NavLink[])
);

export const getNavLinksByPath = (path: string): NavLink[] => {
  const route = routes.find((route) => (
    route.path === path
  ));
  if (!route || !route.children?.length) {
    return [];
  }
  // Reduce functions as filter-and-map-in-1
  return route.children.reduce((acc, route) => {
    if ('title' in route && typeof route.title === 'string' && !!route.path) {
      acc.push({ path: route.path, title: route.title });
    }
    return acc;
  }, [] as NavLink[]);
};

export const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '', element: <LandingPage /> },
    ...routes,
  ],
}]);