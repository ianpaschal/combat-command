import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'clean_up_file_storage',
  { hours: 24 },
  internal.scheduledTasks.cleanUpFileStorage,
);

export default crons;
