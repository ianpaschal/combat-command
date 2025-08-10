import { Migrations } from '@convex-dev/migrations';
import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import {
  DynamicPointsVersion,
  Era,
  LessonsFromTheFrontVersion,
  MissionName,
  MissionPackVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { components } from './_generated/api.js';
import { DataModel } from './_generated/dataModel.js';
import { FowV4DynamicPointsVersionId } from './static/fowV4/dynamicPointsVersions.js';
import { FowV4EraId } from './static/fowV4/eras.js';
import { FowV4LessonsFromTheFrontVersionId } from './static/fowV4/lessonsFromTheFrontVersions.js';
import {
  FowV4MissionId,
  FowV4MissionMatrixId,
  FowV4MissionPackId,
} from './static/fowV4/missionPacks.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

const valueMap: {
  dynamicPointsVersion: Record<FowV4DynamicPointsVersionId, DynamicPointsVersion>;
  era: Record<FowV4EraId, Era>;
  lessonsFromTheFrontVersion: Record<FowV4LessonsFromTheFrontVersionId, LessonsFromTheFrontVersion>;
  missionMatrix: Record<FowV4MissionMatrixId, 'default' | 'extended'>;
  missionPackVersion: Record<FowV4MissionPackId, MissionPackVersion>;
  mission: Record<FowV4MissionId, MissionName>;
} = {
  dynamicPointsVersion: {
    ['flames_of_war_v4::dynamic_points_version::2023']: DynamicPointsVersion.MW2023,
    ['flames_of_war_v4::dynamic_points_version::2024']: DynamicPointsVersion.MW2024,
    ['flames_of_war_v4::dynamic_points_version::2025']: DynamicPointsVersion.MW2025,
  },
  era: {
    ['flames_of_war_v4::era::early_war']: Era.EW,
    ['flames_of_war_v4::era::mid_war']: Era.MW,
    ['flames_of_war_v4::era::late_war']: Era.LW,
  },
  lessonsFromTheFrontVersion:  {
    ['flames_of_war_v4::lessons_from_the_front_version::2018_12']: LessonsFromTheFrontVersion.Dec2018,
    ['flames_of_war_v4::lessons_from_the_front_version::2019_10']: LessonsFromTheFrontVersion.Oct2019,
    ['flames_of_war_v4::lessons_from_the_front_version::2023_03']: LessonsFromTheFrontVersion.Mar2023,
    ['flames_of_war_v4::lessons_from_the_front_version::2024_03']: LessonsFromTheFrontVersion.Mar2024,
  },
  missionMatrix: {
    ['flames_of_war_v4::mission_matrix::2023_04_extended']: 'extended',
  },
  missionPackVersion: {
    ['flames_of_war_v4::mission_pack::2023_04']: MissionPackVersion.Apr2023,
  },
  mission: {
    ['flames_of_war_v4::mission::2023_04_annihilation']: MissionName.Annihilation,
    ['flames_of_war_v4::mission::2023_04_breakthrough']: MissionName.Breakthrough,
    ['flames_of_war_v4::mission::2023_04_bridgehead']: MissionName.Bridgehead,
    ['flames_of_war_v4::mission::2023_04_bypass']: MissionName.Bypass,
    ['flames_of_war_v4::mission::2023_04_cornered']: MissionName.Cornered,
    ['flames_of_war_v4::mission::2023_04_counterattack']: MissionName.Counterattack,
    ['flames_of_war_v4::mission::2023_04_counterstrike']: MissionName.Counterstrike,
    ['flames_of_war_v4::mission::2023_04_covering_force']: MissionName.CoveringForce,
    ['flames_of_war_v4::mission::2023_04_dog_fight']: MissionName.Dogfight,
    ['flames_of_war_v4::mission::2023_04_dust_up']: MissionName.DustUp,
    ['flames_of_war_v4::mission::2023_04_encirclement']: MissionName.Encirclement,
    ['flames_of_war_v4::mission::2023_04_encounter']: MissionName.Encounter,
    ['flames_of_war_v4::mission::2023_04_escape']: MissionName.Escape,
    ['flames_of_war_v4::mission::2023_04_fighting_withdrawal']: MissionName.FightingWithdrawal,
    ['flames_of_war_v4::mission::2023_04_free_for_all']: MissionName.FreeForAll,
    ['flames_of_war_v4::mission::2023_04_gauntlet']: MissionName.Gauntlet,
    ['flames_of_war_v4::mission::2023_04_hold_the_pocket']: MissionName.HoldThePocket,
    ['flames_of_war_v4::mission::2023_04_its_a_trap']: MissionName.ItsATrap,
    ['flames_of_war_v4::mission::2023_04_killing_ground']: MissionName.KillingGround,
    ['flames_of_war_v4::mission::2023_04_no_retreat']: MissionName.NoRetreat,
    ['flames_of_war_v4::mission::2023_04_outflanked']: MissionName.Outflanked,
    ['flames_of_war_v4::mission::2023_04_outmaneuvered']: MissionName.Outmaneuvered,
    ['flames_of_war_v4::mission::2023_04_probe']: MissionName.Probe,
    ['flames_of_war_v4::mission::2023_04_scouts_out']: MissionName.ScoutsOut,
    ['flames_of_war_v4::mission::2023_04_spearpoint']: MissionName.Spearpoint,
    ['flames_of_war_v4::mission::2023_04_valley_of_death']: MissionName.ValleyOfDeath,
    ['flames_of_war_v4::mission::2023_04_vanguard']: MissionName.Vanguard,
  },
};

export const migration172Tournaments = migrations.define({
  table: 'tournaments',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {

    // 1. Migrate game system:
    gameSystemId: undefined,
    gameSystem: GameSystem.FlamesOfWarV4,

    // 2. Migrate game system config:
    gameSystemConfig: {
      ...doc.gameSystemConfig,
      
      dynamicPointsVersionId: undefined,
      dynamicPointsVersion: doc.gameSystemConfig.dynamicPointsVersionId ? valueMap.dynamicPointsVersion[doc.gameSystemConfig.dynamicPointsVersionId] : undefined,
      
      eraId: undefined,
      era: doc.gameSystemConfig.eraId ? valueMap.era[doc.gameSystemConfig.eraId] : undefined,

      lessonsFromTheFrontVersionId: undefined,
      lessonsFromTheFrontVersion: doc.gameSystemConfig.lessonsFromTheFrontVersionId ? valueMap.lessonsFromTheFrontVersion[doc.gameSystemConfig.lessonsFromTheFrontVersionId]: undefined,

      missionPackId: undefined,
      missionPackVersion: MissionPackVersion.Apr2023,

      missionMatrixId: undefined,
      missionMatrix: 'extended',
    },
  }),
});

export const migration172MatchResults = migrations.define({
  table: 'matchResults',
  migrateOne: async (ctx, doc) => await ctx.db.patch(doc._id, {

    // 1. Migrate game system:
    gameSystemId: undefined,
    gameSystem: GameSystem.FlamesOfWarV4,

    // 2. Migrate game system config:
    gameSystemConfig: {
      ...doc.gameSystemConfig,
      
      dynamicPointsVersionId: undefined,
      dynamicPointsVersion: doc.gameSystemConfig.dynamicPointsVersionId ? valueMap.dynamicPointsVersion[doc.gameSystemConfig.dynamicPointsVersionId] : undefined,
      
      eraId: undefined,
      era: doc.gameSystemConfig.eraId ? valueMap.era[doc.gameSystemConfig.eraId] : undefined,

      lessonsFromTheFrontVersionId: undefined,
      lessonsFromTheFrontVersion: doc.gameSystemConfig.lessonsFromTheFrontVersionId ? valueMap.lessonsFromTheFrontVersion[doc.gameSystemConfig.lessonsFromTheFrontVersionId] : undefined,

      missionPackId: undefined,
      missionPackVersion: MissionPackVersion.Apr2023,

      missionMatrixId: undefined,
      missionMatrix: 'extended',
    },

    // 3. Migrate details
    details: {
      ...doc.details,

      missionId: undefined,
      mission: doc.details.missionId ? valueMap.mission[doc.details.missionId] : undefined,
    },
  }),
});
