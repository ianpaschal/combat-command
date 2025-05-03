import {
  describe,
  expect,
  it,
} from 'vitest';

import { Id } from '../../../../_generated/dataModel';
import { generateDraftPairings, RankedCompetitor } from './generateDraftPairings';

const generateMockId = (i: number) => `competitor_${i}` as Id<'tournamentCompetitors'>;

const generateCompetitors = (count: number, matchCount: number): RankedCompetitor[] => {
  const competitors: RankedCompetitor[] = [];

  for (let i = 0; i < count; i++) {
    const opponentPool = [...Array(count).keys()].filter((j) => j !== i);
    const opponentSample = opponentPool.sort(() => 0.5 - Math.random()).slice(0, matchCount);

    competitors.push({
      id: generateMockId(i) as Id<'tournamentCompetitors'>,
      opponentIds: opponentSample.map(generateMockId),
      rank: i + 1,
    });
  }

  return competitors;
};

describe.skip('generateDraftPairings', () => {
  for (let matchCount = 1; matchCount <= 5; matchCount++) {
    it(`generates valid pairings with 24 competitors and ${matchCount} past matches`, () => {
      const competitors = generateCompetitors(24, matchCount);
      const { pairings } = generateDraftPairings(competitors);

      // Check all pairings are between unique, unplayed competitors
      for (const [a, b] of pairings) {
        expect(a.id).not.toBe(b.id);
        expect(a.opponentIds).not.toContain(b.id);
        expect(b.opponentIds).not.toContain(a.id);
      }

      // const pairedIds = new Set(pairings.flatMap(([a, b]) => [a.id, b.id]));
      // const allIds = new Set(competitors.map(c => c.id));
      // const unpairedIds = new Set(unpairedCompetitors.map(c => c.id));

      // console.log(unpairedIds);

      //   // Check for total accounting of all competitors
      //   expect(pairedIds.size + unpairedIds.size).toBe(competitors.length);

    //   // If even number of competitors, all should be paired
    //   if (competitors.length % 2 === 0) {
    //     expect(unpairedCompetitors.length).toBe(0);
    //   } else {
    //     expect(unpairedCompetitors.length).toBe(1);
    //   }
    });
  }
});
