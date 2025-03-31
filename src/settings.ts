export const MIN_WIDTH = 352; // 320px + 2 x 16px
export const MIN_WIDTH_TABLET = 688; // 2 x 320px + 3 x 16px
export const MIN_WIDTH_DESKTOP = 1024; // 3 x 320px + 4 x 16px
export const MIN_HEIGHT = 640;
export const MIN_HEIGHT_FIXED = 800;

export const MAX_WIDTH = 1280; // Beyond this point, the layout is just too stretched out;
export const MOBILE_BREAKPOINT = 480; // Start hiding button text

export const PATHS = {
  auth: '/auth',
  authForgotPassword: '/auth/forgot-password',
  authResetPassword: '/auth/reset-password',
  authSignIn: '/auth/sign-in',
  authSignUp: '/auth/sign-up',
  dashboard: '/dashboard',
  matchResultDetails: '/match-results/:id',
  matchResults: '/match-results',
  tournamentCreate: '/tournaments/create',
  tournamentDetails: '/tournaments/:id',
  tournamentEdit: '/tournaments/:id/edit',
  tournaments: '/tournaments',
} as const;
