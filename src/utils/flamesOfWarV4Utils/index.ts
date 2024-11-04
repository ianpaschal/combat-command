import { calculateMatchScore } from './calculateMatchScore';
import { getOpponentUserIdsByUser } from './getOpponentUserIdsByUser';
import { getTotalPointsByUser } from './getTotalPointsByUser';
import { getTotalUnitsDestroyedByUser } from './getTotalUnitsDestroyedByUser';
import { getTotalUnitsLostByUser } from './getTotalUnitsLostByUser';
import { getTotalWinsByUser } from './getTotalWinsByUser';

const flamesOfWarV4Utils = {
  calculateMatchScore,
  getOpponentUserIdsByUser,
  getTotalPointsByUser,
  getTotalUnitsDestroyedByUser,
  getTotalUnitsLostByUser,
  getTotalWinsByUser,
};

export default flamesOfWarV4Utils;