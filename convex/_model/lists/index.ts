import { Id } from '../../_generated/dataModel';

export type ListId = Id<'lists'>;

export {
  type DeepList,
} from './_helpers/deepenList';

// Mutations
export {
  createList,
  createListArgs,
} from './mutations/createList';
export {
  toggleListApproval,
  toggleListApprovalArgs,
} from './mutations/toggleListApproval';
export {
  updateList,
  updateListArgs,
} from './mutations/updateList';

// Queries
export {
  getList,
  getListArgs,
} from './queries/getList';
export {
  getListsByTournamentRegistration,
  getListsByTournamentRegistrationArgs,
} from './queries/getListsByTournamentRegistration';
export {
  getListsByUser,
  getListsByUserArgs,
} from './queries/getListsByUser';
