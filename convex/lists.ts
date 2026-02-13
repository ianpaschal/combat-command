import { mutation, query } from './_generated/server';
import * as model from './_model/lists';

export const createList = mutation({
  args: model.createListArgs,
  handler: model.createList,
});

export const updateList = mutation({
  args: model.updateListArgs,
  handler: model.updateList,
});

export const getList = query({
  args: model.getListArgs,
  handler: model.getList,
});

export const getListsByTournamentRegistration = query({
  args: model.getListsByTournamentRegistrationArgs,
  handler: model.getListsByTournamentRegistration,
});
