import { mutation, query } from './_generated/server';
import * as model from './_model/files';

export const getFileUrl = query({
  args: model.getFileUrlArgs,
  handler: model.getFileUrl,
});

export const generateFileUploadUrl = mutation({
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});
