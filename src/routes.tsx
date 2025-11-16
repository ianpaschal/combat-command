import { ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
} from 'react-router-dom';

import { App } from '~/components/App';
import { NavLink } from '~/components/generic/NavLinks';
import { PreventAuth } from '~/components/PreventAuth';
import { RequireAuth } from '~/components/RequireAuth';
import {
  AuthPage,
  ForgotPasswordForm,
  ResetPasswordForm,
  SignInForm,
  SignUpForm,
} from '~/pages/AuthPage';
import { ClaimUserPage } from '~/pages/ClaimUserPage';
import { DashboardPage } from '~/pages/DashboardPage';
import { LandingPage } from '~/pages/LandingPage';
import { MatchResultDetailPage } from '~/pages/MatchResultDetailPage';
import { MatchResultsPage } from '~/pages/MatchResultsPage';
import {
  AccountSettings,
  SettingsPage,
  UserPreferencesForm,
  UserProfileForm,
} from '~/pages/SettingsPage';
import { TournamentCompetitorDetailPage } from '~/pages/TournamentCompetitorDetailPage';
import { TournamentCreatePage } from '~/pages/TournamentCreatePage';
import { TournamentDetailPage } from '~/pages/TournamentDetailPage';
import { TournamentEditPage } from '~/pages/TournamentEditPage/TournamentEditPage';
import { TournamentPairingDetailPage } from '~/pages/TournamentPairingDetailPage';
import { TournamentPairingsPage } from '~/pages/TournamentPairingsPage';
import { TournamentsPage } from '~/pages/TournamentsPage';
import { UserProfilePage } from '~/pages/UserProfilePage';
import { PATHS } from '~/settings';

export interface AppRoute {
  path: string;
  element: ReactNode;
  title: string;
  zone?: 'external' | 'internal';
  children?: AppRoute[];
}

export const mainRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    element: <DashboardPage />,
    zone: 'internal',
  },
  {
    path: '/tournaments',
    title: 'Tournaments',
    element: <TournamentsPage />,
  },
  {
    path: '/matches',
    title: 'Match Results',
    element: <MatchResultsPage />,
  },
  // {
  //   path: '/statistics',
  //   title: 'Statistics',
  //   element: <StatisticsPage />,
  //   zone: 'internal',
  // },
];

export const additionalRoutes: AppRoute[] = [
  {
    path: PATHS.tournamentCreate,
    title: 'Create Tournament',
    element: <TournamentCreatePage />,
    zone: 'internal',
  },
];

export const getVisibleAppRoutes = (
  items: AppRoute[],
  authenticated: boolean,
): AppRoute[] => items.filter((item) => {
  if (!item.zone) {
    return true;
  }
  if (authenticated) {
    return item.zone === 'internal';
  }
  return item.zone === 'external';
});

const protectRoutes = (routes: AppRoute[]): AppRoute[] => routes.map((route) => {
  let element = route.element;
  if (route.zone === 'external') {
    element = <PreventAuth>{element}</PreventAuth>;
  }
  if (route.zone === 'internal') {
    element = <RequireAuth>{element}</RequireAuth>;
  }
  return { ...route, element };
});

export const routes = [
  ...protectRoutes([
    ...mainRoutes,
    ...additionalRoutes,
  ]),
  {
    path: PATHS.claim,
    visibility: [],
    element: <ClaimUserPage />,
  },

  // {
  //   path: '/tournaments/:tournamentId/add-match',
  //   title: 'Check-In Match',
  //   visibility: [],
  //   element: <AddMatchPage />,
  // },
  // {
  //   path: '/tournaments/:tournamentId/register',
  //   title: 'Register for Tournament',
  //   visibility: [],
  //   element: <TournamentRegisterPage />,
  // },
  // {
  //   path: '/tournaments/:tournamentId/create-pairings',
  //   title: 'Check-In Match',
  //   visibility: [],
  //   element: <TournamentCreatePairingsPage />,
  // },
  {
    path: PATHS.matchResultDetails,
    visibility: [],
    element: <MatchResultDetailPage />,
  },
  {
    path: PATHS.tournamentDetails,
    visibility: [],
    element: <TournamentDetailPage />,
  },
  {
    path: PATHS.tournamentPairings,
    visibility: [],
    element: <TournamentPairingsPage />,
  },
  {
    path: PATHS.tournamentPairingDetails,
    visibility: [],
    element: <TournamentPairingDetailPage />,
  },
  {
    path: PATHS.tournamentEdit,
    visibility: [],
    element: <TournamentEditPage />,
  },
  {
    path: PATHS.tournamentCompetitorDetails,
    visibility: [],
    element: <TournamentCompetitorDetailPage />,
  },
  {
    path: PATHS.userProfile,
    visibility: [],
    element: <UserProfilePage />,
  },
  {
    path: '/settings',
    title: 'Settings',
    location: 'accountMenu',
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
        element: <AccountSettings />,
      },
      {
        path: '/settings/preferences',
        title: 'Preferences',
        element: <UserPreferencesForm />,
      },
    ],
  },
  {
    path: PATHS.auth,
    title: 'Authentication',
    element: <AuthPage />,
    children: [
      {
        index: true, // This will match "/auth"
        element: <Navigate to="sign-in" replace />, // Redirect to "/auth/sign-in"
      },
      {
        path: PATHS.authSignIn,
        title: 'Sign In',
        element: <SignInForm />,
      },
      {
        path: PATHS.authSignUp,
        title: 'Sign Up',
        element: <SignUpForm />,
      },
      {
        path: PATHS.authForgotPassword,
        title: 'Forgot Password',
        element: <ForgotPasswordForm />,
      },
      {
        path: PATHS.authResetPassword,
        title: 'Reset Password',
        element: <ResetPasswordForm />,
      },
    ],
  },
];

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

interface RouteInfo {
  path: string;
  title: string;
}

export const getRouteTitles = (routes: (AppRoute | RouteObject)[]): RouteInfo[] => routes.reduce((acc: RouteInfo[], route) => {
  if ('title' in route && typeof route.title === 'string' && !!route.path) {
    acc.push({ path: route.path, title: route.title });
  }
  if (route.children) {
    acc.push(...getRouteTitles(route.children));
  }
  return acc;
}, []);

export const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '', element: <LandingPage /> },
    ...routes,
  ],
}], {
  future: {
    v7_relativeSplatPath: true,
  },
});
