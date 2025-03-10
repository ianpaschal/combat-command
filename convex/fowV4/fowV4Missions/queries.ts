import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { fowV4BattlePlan } from '../../common/fowV4/fowV4BattlePlan';
import { fowV4MatchOutcomeType } from '../../common/fowV4/fowV4MatchOutcomeType';
import { getRolesByStances } from './_utils';

export const getMission = query({
  args: {
    id: v.id('fowV4Missions'),
  },
  handler: async (ctx, args) => ctx.db.get(args.id), 
});

export const getMissionsByBattlePlans = query({
  args: {
    player0BattlePlan: v.optional(fowV4BattlePlan),
    player1BattlePlan: v.optional(fowV4BattlePlan),
    missionPackId: v.id('fowV4MissionPacks'),
    missionMatrixId: v.optional(v.id('fowV4MissionMatrixes')),
    useAlternates: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {

    const missions = await ctx.db.query('fowV4Missions').withIndex(
      'by_mission_pack_id',
      ((q) => q.eq('missionPackId', args.missionPackId)),
    ).collect();
    
    if (!args.player0BattlePlan || !args.player1BattlePlan || !args.missionMatrixId ) {
      return missions;
    }

    const matrix = await ctx.db.get(args.missionMatrixId);
    if (!matrix) {
      throw Error('Could not find a mission matrix with that ID!');
    }

    const matrixEntry = matrix.entries.find(({ battlePlans }) => (
      (args.player0BattlePlan === battlePlans[0] && args.player1BattlePlan === battlePlans[1])
      || (args.player1BattlePlan === battlePlans[0] && args.player0BattlePlan === battlePlans[1])
    ))!;

    const availableMissionIds = matrixEntry.missions.reduce((acc, item) => {
      if (Array.isArray(item)) {
        if (item[1] && args.useAlternates) {
          return [...acc, item[1]];
        }
        return [ ...acc, ...item];
      }
      return [ ...acc,item];
    }, [] as string[]);

    return missions.filter((m) => availableMissionIds.includes(m._id)).map((m) => {

      // Add outcome types based on objectives
      const outcomeTypes = [ 'time_out', 'force_broken' ];

      // If either player has objectives, add 'objective_taken'
      if (m.objectives.attacker || m.objectives.defender) {
        outcomeTypes.push('objective_taken');
      }
      // If the attacker has objectives but the defender doesn't, add 'attack_repelled'
      if (m.objectives.attacker && !m.objectives.defender) {
        outcomeTypes.push('attack_repelled');
      }
      return { ...m, outcomeTypes };
    });
  },
});

export const getMissionAttacker = query({
  args: {
    player0BattlePlan: v.optional(fowV4BattlePlan),
    player1BattlePlan: v.optional(fowV4BattlePlan),
    missionId: v.id('fowV4Missions'),
  },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId);
    
    // If impossible to determine, return both players
    if (!args.player0BattlePlan || !args.player1BattlePlan || !mission ) {
      return [] as const;
    }

    // If stances aren't the same, and mission doesn't use a roll-off, return array with just 1 player
    if (args.player0BattlePlan !== args.player1BattlePlan && mission.attacker !== 'roll') {

      const roles = getRolesByStances(args.player0BattlePlan, args.player1BattlePlan);
      if (roles?.attacker !== undefined) {
        return [roles.attacker] as const;
      }
    }

    // Otherwise return both players
    return [0, 1] as const;
  },
});

export const getMissionFirstTurn = query({
  args: {
    player0BattlePlan: v.optional(fowV4BattlePlan),
    player1BattlePlan: v.optional(fowV4BattlePlan),
    missionId: v.id('fowV4Missions'),
  },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId);
    
    // If impossible to determine, return both players
    if (!args.player0BattlePlan || !args.player1BattlePlan || !mission ) {
      return [0, 1] as const;
    }

    const roles = getRolesByStances(args.player0BattlePlan, args.player1BattlePlan);

    // If stances aren't the same, and mission doesn't use a roll-off, return array with just 1 player
    if (roles && (mission.firstTurn === 'attacker')) {
      return [roles.attacker] as const;
    }
    if (roles && (mission.firstTurn === 'defender')) {
      return [roles.attacker] as const;
    }

    // Otherwise return both players
    return [0, 1] as const;
  },
});

export const getMissionWinner = query({
  args: {
    player0BattlePlan: v.optional(fowV4BattlePlan),
    player1BattlePlan: v.optional(fowV4BattlePlan),
    attacker: v.optional(v.union(v.literal(0), v.literal(1))),
    outcomeType: v.optional(fowV4MatchOutcomeType),
    missionId: v.id('fowV4Missions'),
  },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId);
    
    // If impossible to determine, return both players
    if (!args.player0BattlePlan || !args.player1BattlePlan || !mission || args.attacker === undefined || !args.outcomeType) {
      return [] as const;
    }

    const defender = args.attacker === 0 ? 1 : 0;

    if (args.outcomeType === 'time_out') {
      return [null] as const;
    }
    if (args.outcomeType === 'objective_taken' && !mission.objectives.defender) {
      return [args.attacker] as const;
    }
    if (args.outcomeType === 'attack_repelled') {
      return [defender] as const;
    }

    // Otherwise return both players
    return [0, 1] as const;
  },
});
