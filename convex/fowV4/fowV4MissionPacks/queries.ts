import { query } from '../../_generated/server';

export const getMissionPacks = query({
  args: {},
  handler: async (ctx) => {
    const missionPacks = await ctx.db.query('fowV4MissionPacks').collect();

    return Promise.all(missionPacks.map((missionPack) => {
      const missions = ctx.db.query('fowV4Missions').withIndex(
        'by_mission_pack_id',
        (q) => q.eq('missionPackId', missionPack._id),
      ).collect();
      const matrixes = ctx.db.query('fowV4MissionMatrixes').withIndex(
        'by_mission_pack_id',
        (q) => q.eq('missionPackId', missionPack._id),
      ).collect();
      return {
        ...missionPack,
        missions,
        matrixes,
      };
    }));
  },
});
