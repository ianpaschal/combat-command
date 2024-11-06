import { aggregatePlayerResults } from './aggregatePlayerResults';
import { calculateMatchScore } from './calculateMatchScore';
import { getOpponentsByProfileId } from './getOpponentsByProfileId';
import { getTotalPointsByProfileId } from './getTotalPointsByProfileId';
import { getTotalUnitsDestroyedByProfileId } from './getTotalUnitsDestroyedByProfileId';
import { getTotalUnitsLostByProfileId } from './getTotalUnitsLostByProfileId';
import { getTotalWinsByProfileId } from './getTotalWinsByProfileId';

const flamesOfWarV4Utils = {
  aggregatePlayerResults,
  calculateMatchScore,
  getOpponentsByProfileId,
  getTotalPointsByProfileId,
  getTotalUnitsDestroyedByProfileId,
  getTotalUnitsLostByProfileId,
  getTotalWinsByProfileId,
};

export default flamesOfWarV4Utils;