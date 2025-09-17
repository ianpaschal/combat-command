import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'clean_up_file_storage',
  { hours: 24 },
  internal.scheduledTasks.cleanUpFileStorage,
);

crons.interval(
  'clean_up_tournaments',
  { hours: 24 },
  internal.scheduledTasks.cleanUpTournaments,
);

export default crons;
