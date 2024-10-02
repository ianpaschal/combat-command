import { createBrowserRouter } from 'react-router-dom';

import { App } from '~/components/App';
import {
  NavLink,
  RouteConfig,
  Visibility,
} from '~/components/generic/NavLinks';
import { AccessPage } from '~/pages/AccessPage';
import { ComponentTestPage } from '~/pages/ComponentTestPage';
import { CreateTournamentPage } from '~/pages/CreateTournamentPage';
import { DashboardPage } from '~/pages/DashboardPage';
import { LandingPage } from '~/pages/LandingPage';
import { StatisticsPage } from '~/pages/StatisticsPage';
import { TournamentDetailPage } from '~/pages/TournamentDetailPage';
import { TournamentsPage } from '~/pages/TournamentsPage';

export const routes: RouteConfig[] = [
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
    path: '/statistics',
    title: 'Statistics',
    visibility: [], // TODO: Add to 'main' later
    element: <StatisticsPage />,
  },
  {
    path: '/auth',
    title: 'Sign In or Sign Up',
    visibility: [],
    element: <AccessPage />,
  },
  {
    path: '/auth/sign-in',
    title: 'Sign In',
    visibility: [],
    element: <AccessPage />,
  },
  {
    path: '/auth/sign-up',
    title: 'Sign Up',
    visibility: [],
    element: <AccessPage />,
  },
  {
    path: '/test',
    title: 'Test',
    visibility: [],
    element: <ComponentTestPage />,
  },
];

export const getNavLinks = (visibility: Visibility): NavLink[] => (
  routes.filter((route) => (
    route.visibility.includes(visibility)
  )).map(({ path, title }) => ({
    path, title,
  }))
);

export const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '', element: <LandingPage /> },
    ...routes.map(({ path, element }) => ({ path, element })),
  ],
}]);

// export const routes: RouteConfig[] = [
//   {
//     icon: <HomeIcon />,
//     title: 'Dashboard',
//     path: '/dashboard',
//     element: <DashboardPage />,
//   },
//   {
//     icon: <Swords />,
//     title: 'Tournaments',
//     path: '/tournaments',
//     element: <TournamentsPage />,
//   },
//   {
//     path: '/tournaments/create',
//     title: 'Create Tournaments',
//     element: <CreateTournamentPage />,
//     hidden: true,
//   },
//   {
//     path: '/users/:id',
//     title: 'Profile',
//     element: <UserProfilePage />,
//     hidden: true,
//     subRoutes: [
//       {
//         path: '/users/:id/tournaments',
//         title: 'Tournaments',
//         element: <UserProfilePage />,
//         hidden: true,
//       },
//     ],
//   },
//   {
//     icon: <Settings />,
//     title: 'Settings',
//     path: '/settings',
//     element: <SettingsPage />,
//     // subRoutes: [
//     //   {
//     //     icon: <UserIcon />,
//     //     title: 'Profile',
//     //     path: '/profile',
//     //     element: <ProfileSettingsPage />,
//     //   },
//     //   {
//     //     title: 'Account',
//     //     path: '/account',
//     //     element: <AccountSettingsPage />,
//     //   },
//     // ],
//   },
//   {
//     icon: <ChartColumnBig />,
//     title: 'Statistics',
//     path: '/statistics',
//     element: <StatisticsPage />,
//   },
//   {
//     icon: <LogIn />,
//     title: 'Sign In',
//     path: '/sign-in',
//     element: <AccessPage />,
//     hidden: true,
//   },
//   {
//     icon: <LogIn />,
//     title: 'Sign Up',
//     path: '/sign-up',
//     element: <AccessPage />,
//     hidden: true,
//   },
//   {
//     icon: <Wrench />,
//     title: 'Test',
//     path: '/test',
//     element: <ComponentTestPage />,
//   },
// ];

// const routesNew = [
//   { path: '/dashboard', element: <DashboardPage /> },

//   { path: '/users/:id', element: <UserProfilePage /> },
//   { path: '/users/:id/matches', element: <UserTournamentsPage /> }, // <- Maybe just a tab?
//   { path: '/users/:id/tournaments', element: <UserTournamentsPage /> }, // <- Maybe just a tab?
//   { path: '/users/:id/lists', element: <UserListsPage /> }, // <- Maybe just a tab?

//   { path: '/settings', element: <SettingsPage /> },
//   { path: '/settings/profile', element: <ProfileSettingsPage /> }, // <- Maybe just a tab?
//   { path: '/settings/account', element: <AccountSettingsPage /> }, // <- Maybe just a tab?
//   { path: '/sign-up', element: <SignUpPage /> },
//   { path: '/forgot-password', element: <ForgotPasswordPage /> },
// ];

//       <Route element={<AccountPage />} path="/account" />
//       <Route element={<SettingsPage />} path="/settings" />

//       <Route element={<ListsPage />} path="/lists" /> 
// {/lists/create 
// {//lists/import  }
// {//lists/{id}  }

// {/<Route element={<TournamentsPage />} path="/tournaments" />
//       <Route element={<CreateTournamentPage />} path="/tournaments/create" />
//       <Route element={<TournamentDetailPage />} path="/tournaments/:id" /> }

// {/* /{userId}/profile }
// {/* /{userId}/lists  }
// {/* /{userId}/tournaments  }

//       <Route element={<SignUpPage />} path="/sign-up" /> }

