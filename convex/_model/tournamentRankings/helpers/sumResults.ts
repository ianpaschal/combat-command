import { ResultData } from '../types';

export function sumResults(results: ResultData[]) {
  return results.reduce((acc, result) => ({
    wins: (acc.wins || 0) + result.wins,
    points: (acc.points || 0) + result.points,
    unitsDestroyed: (acc.unitsDestroyed || 0) + result.unitsDestroyed,
    unitsLost: (acc.unitsLost || 0) + result.unitsLost,
  }), {} as ResultData);
}
