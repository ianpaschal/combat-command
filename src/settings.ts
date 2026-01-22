export const MIN_WIDTH = 352; // 320px + 2 x 16px
export const MIN_WIDTH_TABLET = 688; // 2 x 320px + 3 x 16px
export const MIN_WIDTH_DESKTOP = 1024; // 3 x 320px + 4 x 16px
export const MIN_HEIGHT = 640;
export const MIN_HEIGHT_FIXED = 800;

export const MAX_WIDTH = 1280; // Beyond this point, the layout is just too stretched out;
export const MOBILE_BREAKPOINT = 480; // Start hiding button text

export const DEFAULT_PAGE_SIZE = 12; // Works well with 1, 2 or 3 columns

export const PATHS = {
  auth: '/auth',
  authForgotPassword: '/auth/forgot-password',
  authResetPassword: '/auth/reset-password',
  authSignIn: '/auth/sign-in',
  authSignUp: '/auth/sign-up',
  claim: '/claim',
  dashboard: '/dashboard',
  leagueDetails: '/leagues/:id',
  leagues: '/leagues',
  matchResultDetails: '/matches/:id',
  matchResults: '/matches',

  // Tournament Competitors
  tournamentCompetitorDetails: '/tournaments/:tournamentId/competitors/:tournamentCompetitorId',

  // Tournament Pairings
  tournamentPairingDetails: '/pairings/:id',
  tournamentPairings: '/tournaments/:id/pairings',

  // Tournaments
  tournamentCreate: '/tournaments/create',
  tournamentDetails: '/tournaments/:id',
  tournamentEdit: '/tournaments/:id/edit',
  tournaments: '/tournaments',

  userProfile: '/users/:id',
} as const;
