import { Id } from '../../_generated/dataModel';

export type ListId = Id<'lists'>;

export {
  importListData,
  importListDataArgs,
} from './mutations/importListData';
export {
  getList,
  getListArgs,
} from './queries/getList';
