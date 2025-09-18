import { BattlePlan } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';
import { Statistic, WLD } from './types';

const initialize2DStats = <X extends Record<string, string>, Y extends Record<string, string>, Z extends number|WLD>(
  x: X,
  y: Y,
  defaultValue: Z,
): Record<X[keyof X], Record<Y[keyof Y], Z>> => Object.values(x).reduce(
  (primaryAcc, ownBattlePlan) => ({
    ...primaryAcc,
    [ownBattlePlan]: Object.values(y).reduce(
      (secondaryAcc, opponentBattlePlan) => ({
        ...secondaryAcc,
        [opponentBattlePlan]: defaultValue,
      }), {} as Record<Y[keyof Y], Z>,
    ),
  }), {} as Record<X[keyof X], Record<Y[keyof Y], Z>>,
);

const flatten2DStats = <X extends string, Y extends string, I extends number|WLD, O extends number|WLD>(
  stats: Record<X, Record<Y, I>>,
  transform: (value: I) => O,
): Statistic<[X, Y], O>[] => Object.entries(stats).reduce<Statistic<[X, Y], O>[]>((acc, [xKey, values]) => {
  const xEntries = Object.entries(values as Record<Y, I>).map(([yKey, wldValue]) => ({
    key: [xKey as X, yKey as Y],
    value: transform(wldValue as I),
  } as Statistic<[X, Y], O>));
  return [...acc, ...xEntries];
}, []);

export const getBattlePlanVsBattlePlanStats = async (
  matchResults: Doc<'matchResults'>[],
): Promise<Statistic<[BattlePlan, BattlePlan], WLD>[]> => {

  const stats = initialize2DStats(BattlePlan, BattlePlan, {
    win: 0,
    loss: 0,
    draw: 0,
  });

  // Count wins, losses, and draws for each battle plan combination:
  for (const matchResult of matchResults) {
    const { details } = matchResult;
  
    if (details.player0BattlePlan === details.player1BattlePlan) {
      // If battle plans match, only count wins and draws (interpreted as non-draw vs. draw):
      if (details.winner === -1) {
        stats[details.player0BattlePlan][details.player1BattlePlan].draw += 1;
      } else {
        stats[details.player0BattlePlan][details.player1BattlePlan].win += 1;
      }
    } else {
      if (details.winner === 0) {
        stats[details.player0BattlePlan][details.player1BattlePlan].win += 1;
        stats[details.player1BattlePlan][details.player0BattlePlan].loss += 1;
      }
      if (details.winner === 1) {
        stats[details.player1BattlePlan][details.player0BattlePlan].win += 1;
        stats[details.player0BattlePlan][details.player1BattlePlan].loss += 1;
      }
      if (details.winner === -1) {
        stats[details.player0BattlePlan][details.player1BattlePlan].draw += 1;
        stats[details.player1BattlePlan][details.player0BattlePlan].draw += 1;
      }
    }
  }

  return flatten2DStats(stats, ({ win, loss, draw }: WLD): WLD => {
    const total = win + loss + draw;
    return {
      win: win / total,
      loss: loss / total,
      draw: draw / total,
    };
  });
};
