import { aggregateCompetitorResults } from './aggregateCompetitorResults';
import { calculateMatchScore } from './calculateMatchScore';
import { getOpponentsByProfileId } from './getOpponentsByUserProfileId';
import { getTotalPointsByProfileId } from './getTotalPointsByUserProfileId';
import { getTotalUnitsDestroyedByProfileId } from './getTotalUnitsDestroyedByProfileId';
import { getTotalUnitsLostByProfileId } from './getTotalUnitsLostByProfileId';
import { getTotalWinsByProfileId } from './getTotalWinsByUserProfileId';

const flamesOfWarV4Utils = {
  aggregateCompetitorResults,
  calculateMatchScore,
  getOpponentsByProfileId,
  getTotalPointsByProfileId,
  getTotalUnitsDestroyedByProfileId,
  getTotalUnitsLostByProfileId,
  getTotalWinsByProfileId,
};

export default flamesOfWarV4Utils;