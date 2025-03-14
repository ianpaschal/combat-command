import { missionPacks } from '../../static/fowV4/missionPacks';
import { FowV4MissionPack } from '../../static/fowV4/missionPacks.types';

export const getMissionPack = (id: string): FowV4MissionPack | undefined => missionPacks.find(
  (missionPack) => missionPack.id === id,
);
