import { missionPacks } from './missionPacks';
import { FowV4Mission, FowV4MissionPack } from './missionPacks.types';

export const getMissionPack = (id: string): FowV4MissionPack | undefined => missionPacks.find(
  (missionPack) => missionPack.id === id,
);

export const getMission = (id: string): FowV4Mission | undefined => missionPacks.reduce(
  (acc: FowV4Mission[], missionPack) => [
    ...acc,
    ...missionPack.missions,
  ], [],
).find(
  (mission) => mission.id === id,
);
