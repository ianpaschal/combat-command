import { mutation } from './_generated/server';

export const generateFileUploadUrl = mutation(async (ctx) => await ctx.storage.generateUploadUrl());
