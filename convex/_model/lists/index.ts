import { Id } from '../../_generated/dataModel';

export type ListId = Id<'lists'>;

export {
  type DeepList,
} from './_helpers/deepenList';
export {
  createList,
  createListArgs,
} from './mutations/createList';
export {
  getList,
  getListArgs,
} from './queries/getList';
export {
  getListsByTournamentRegistration,
  getListsByTournamentRegistrationArgs,
} from './queries/getListsByTournamentRegistration';
