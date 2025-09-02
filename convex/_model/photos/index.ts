import { Id } from '../../_generated/dataModel';

export type PhotoId = Id<'photos'>;

export {
  createPhoto,
  createPhotoArgs,
} from './mutations/createPhoto';
export {
  getPhoto,
  getPhotoArgs,
} from './queries/getPhoto';
