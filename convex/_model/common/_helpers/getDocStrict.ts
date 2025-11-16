import { GenericDatabaseReader } from 'convex/server';
import { ConvexError, GenericId } from 'convex/values';

import {
  DataModel,
  Doc,
  TableNames,
} from '../../../_generated/dataModel';

/**
 * Fetches a document by ID, throwing a `ConvexError` if it doesn't exist.
 *
 * @param ctx - A context object with a database reader.
 * @param id - The ID of the document to fetch.
 * @returns The document.
 * @throws {ConvexError} If no document exists with the given ID.
 */
export const getDocStrict = async <T extends TableNames>(
  ctx: { db: GenericDatabaseReader<DataModel> },
  id: GenericId<T>,
): Promise<Doc<T>> => {
  const doc = await ctx.db.get(id);
  if (!doc) {
    throw new ConvexError({ message: `Document not found: ${id}`, code: 'DOCUMENT_NOT_FOUND' });
  }
  return doc;
};
