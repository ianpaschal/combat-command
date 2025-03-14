import { missionPacks } from '../../static/fowV4/missionPacks';
import { FowV4Mission } from '../../static/fowV4/missionPacks.types';

export const getMission = (id: string): FowV4Mission | undefined => missionPacks.reduce(
  (acc: FowV4Mission[], missionPack) => [
    ...acc,
    ...missionPack.missions,
  ], [],
).find(
  (mission) => mission.id === id,
);
