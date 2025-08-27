import { v } from 'convex/values';

export const location = v.object({
  mapboxId: v.optional(v.string()),
  name: v.string(),
  placeFormatted: v.string(), // Provided by Mapbox, handy so we don't have to think about formatting
  timeZone: v.string(),

  // This information could be retrieved later, but putting it in the model makes us backwards
  // compatible if we eventually look up address info differently, or want to let the user edit it
  address: v.optional(v.string()),
  neighborhood: v.optional(v.string()),
  locality: v.optional(v.string()),
  district: v.optional(v.string()), // US county
  city: v.optional(v.string()), // Mapbox calls this "place"
  postcode: v.optional(v.string()),
  region: v.optional(v.object({ // US state
    code: v.string(), // e.g. MI
    name: v.string(), // e.g. Michigan
  })),
  countryCode: v.string(),

  // Needed for timezone look up
  coordinates: v.object({
    lat: v.number(),
    lon: v.number(),
  }),
});
