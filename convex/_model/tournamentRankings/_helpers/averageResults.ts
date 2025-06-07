import { ResultData } from '../types';

export function averageResults(results: ResultData, denominator: number) {
  return Object.entries(results).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value / Math.max(denominator, 1),
  }), {} as ResultData);
}
