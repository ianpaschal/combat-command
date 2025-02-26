import { Doc, Id } from '../convex/_generated/dataModel';
export { api } from '../convex/_generated/api';

export type User = Doc<'users'> & {
  avatarUrl?: string;
};

export type UserId = Id<'users'>;

export type StorageId = Id<'_storage'>;
