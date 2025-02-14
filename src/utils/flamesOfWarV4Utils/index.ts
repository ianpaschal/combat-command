import { aggregateCompetitorResults } from './aggregateCompetitorResults';
import { calculateMatchScore } from './calculateMatchScore';
import { getOpponentsByUserProfileId } from './getOpponentsByUserProfileId';
import { getTotalPointsByUserProfileId } from './getTotalPointsByUserProfileId';
import { getTotalUnitsDestroyedByUserProfileId } from './getTotalUnitsDestroyedByUserProfileId';
import { getTotalUnitsLostByUserProfileId } from './getTotalUnitsLostByUserProfileId';
import { getTotalWinsByUserProfileId } from './getTotalWinsByUserProfileId';

const flamesOfWarV4Utils = {
  aggregateCompetitorResults,
  calculateMatchScore,
  getOpponentsByUserProfileId,
  getTotalPointsByUserProfileId,
  getTotalUnitsDestroyedByUserProfileId,
  getTotalUnitsLostByUserProfileId,
  getTotalWinsByUserProfileId,
};

export default flamesOfWarV4Utils;