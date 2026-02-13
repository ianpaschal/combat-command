import { v } from 'convex/values';

import {
  action,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/files';

export const getFileUrl = query({
  args: model.getFileUrlArgs,
  handler: model.getFileUrl,
});

export const getFileMetadata = query({
  args: model.getFileMetadataArgs,
  handler: model.getFileMetadata,
});

export const generateFileUploadUrl = mutation({
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const convertImageToPdf = action({
  args: model.convertImageToPdfArgs,
  handler: model.convertImageToPdf,
  returns: v.id('_storage'),
});
