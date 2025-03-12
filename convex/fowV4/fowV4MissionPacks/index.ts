import { defineTable } from 'convex/server';
import { v } from 'convex/values';

const fields = {
  displayName: v.string(),
  publishedAt: v.optional(v.number()),
};

const table = defineTable(fields);

export {
  fields as fowV4MissionPackFields,
  table as fowV4MissionPacks,
};
