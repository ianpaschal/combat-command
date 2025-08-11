import { Migrations } from '@convex-dev/migrations';
import { Faction } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { components } from './_generated/api.js';
import { DataModel } from './_generated/dataModel.js';
import { FowV4FactionId } from './_model/fowV4/fowV4MatchResultDetails.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

const valueMap: {
  factions: Record<FowV4FactionId, Faction>;
} = {
  factions: {
    ['flames_of_war_v4::faction::germany']: Faction.Germany,
    ['flames_of_war_v4::faction::soviet_union']: Faction.SovietUnion,
    ['flames_of_war_v4::faction::united_states']: Faction.UnitedStates,
    ['flames_of_war_v4::faction::great_britain']: Faction.GreatBritain,
    ['flames_of_war_v4::faction::australia']: Faction.Australia,
    ['flames_of_war_v4::faction::italy']: Faction.Italy,
    ['flames_of_war_v4::faction::finland']: Faction.Finland,
    ['flames_of_war_v4::faction::hungary']: Faction.Hungary,
    ['flames_of_war_v4::faction::romania']: Faction.Romania,
    ['flames_of_war_v4::faction::japan']: Faction.Japan,
    ['flames_of_war_v4::faction::france']: Faction.France,
  },
};

export const migration172MatchResults = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {
    details: {
      ...doc.details,

      player0FactionId: undefined,
      player0Faction: doc.details.player0FactionId ? valueMap.factions[doc.details.player0FactionId] : undefined,

      player1FactionId: undefined,
      player1Faction: doc.details.player1FactionId ? valueMap.factions[doc.details.player1FactionId] : undefined,
    },
  }),
});
