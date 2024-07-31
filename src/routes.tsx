import {
  ChartColumnBig,
  HomeIcon,
  LogIn,
  SettingsIcon,
  Wrench,
} from 'lucide-react';

// import { LandingPage } from '~/pages/LandingPage/LandingPage';
// import { ListsPage } from '~/pages/ListsPage';
// import { SettingsPage } from '~/pages/SettingsPage';
import { AccessPage } from '~/pages/AccessPage';
// import { AppBar } from '~/components/AppBar/AppBar';
// import { RouteConfig } from '~/components/AppRoutes';
// import { AccountPage } from '~/pages/AccountPage';
import { ComponentTestPage } from '~/pages/ComponentTestPage';
// import { CreateTournamentPage } from '~/pages/CreateTournamentPage';
import { DashboardPage } from '~/pages/DashboardPage';
// import { SignUpPage } from '~/pages/SignUpPage';
import { StatisticsPage } from '~/pages/StatisticsPage';
import { RouteConfig } from './components/generic/NavLinks';
// import { SignInForm } from './components/SignInForm';
// import { SignUpForm } from './components/SignUpForm';
import { SettingsPage } from './pages/SettingsPage';
// import { UserPage } from './pages/UserPage';
import { UserProfilePage } from './pages/UserProfilePage';
// import { TournamentDetailPage } from '~/pages/TournamentDetailPage';
// import { TournamentsPage } from '~/pages/TournamentsPage';

export const routes: RouteConfig[] = [
  {
    icon: <HomeIcon />,
    title: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/users/:id',
    title: 'Profile',
    element: <UserProfilePage />,
    hidden: true,
    subRoutes: [
      {
        path: '/users/:id/tournaments',
        title: 'Tournaments',
        element: <UserProfilePage />,
        hidden: true,
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    title: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
    // subRoutes: [
    //   {
    //     icon: <UserIcon />,
    //     title: 'Profile',
    //     path: '/profile',
    //     element: <ProfileSettingsPage />,
    //   },
    //   {
    //     title: 'Account',
    //     path: '/account',
    //     element: <AccountSettingsPage />,
    //   },
    // ],
  },
  {
    icon: <ChartColumnBig />,
    title: 'Statistics',
    path: '/statistics',
    element: <StatisticsPage />,
  },
  {
    icon: <LogIn />,
    title: 'Sign In',
    path: '/sign-in',
    element: <AccessPage />,
    hidden: true,
  },
  {
    icon: <LogIn />,
    title: 'Sign Up',
    path: '/sign-up',
    element: <AccessPage />,
    hidden: true,
  },
  {
    icon: <Wrench />,
    title: 'Test',
    path: '/test',
    element: <ComponentTestPage />,
  },
];

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

