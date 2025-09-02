import { mutation, query } from './_generated/server';
import * as model from './_model/photos';

export const getPhoto = query({
  args: model.getPhotoArgs,
  handler: model.getPhoto,
});

export const createPhoto = mutation({
  args: model.createPhotoArgs,
  handler: model.createPhoto,
});
