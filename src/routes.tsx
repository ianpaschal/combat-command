import { ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
} from 'react-router-dom';

import { AccountSettings } from '~/components/AccountSettings';
import { App } from '~/components/App';
import { NavLink } from '~/components/generic/NavLinks';
import { PreventAuth } from '~/components/PreventAuth';
import { RequireAuth } from '~/components/RequireAuth';
import { UserProfileForm } from '~/components/UserProfileForm';
import { DashboardPage } from '~/pages/DashboardPage';
// import { ForgotPasswordPage } from '~/pages/ForgotPasswordPage';
import { LandingPage } from '~/pages/LandingPage';
import { MatchResultDetailPage } from '~/pages/MatchResultDetailPage';
import { MatchResultsPage } from '~/pages/MatchResultsPage';
import { SettingsPage } from '~/pages/SettingsPage';
import { SignInPage } from '~/pages/SignInPage';
import { SignUpPage } from '~/pages/SignUpPage';

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
  // {
  //   path: '/tournaments',
  //   title: 'Tournaments',
  //   element: <TournamentsPage />,
  // },
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
  ...protectRoutes(mainRoutes),

  // {
  //   path: '/tournaments/:id',
  //   title: 'View Tournament',
  //   visibility: [],
  //   element: <TournamentDetailPage />,
  // },
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
  // {
  //   path: '/tournaments/create',
  //   title: 'Create Tournament',
  //   element: (
  //     <RequireAuth>
  //       <CreateTournamentPage />
  //     </RequireAuth>
  //   ),
  // },

  {
    path: '/match-results/:id',
    visibility: [],
    element: <MatchResultDetailPage />,
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
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    title: 'Sign Up',
    element: <SignUpPage />,
  },
  // {
  //   path: '/forgot-password',
  //   title: 'Forgot Password',
  //   visibility: [],
  //   element: <ForgotPasswordPage />,
  // },
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
}]);
