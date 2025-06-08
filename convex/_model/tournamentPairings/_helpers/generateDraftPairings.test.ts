import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { Id } from '../../../_generated/dataModel';
import { errors } from '../../../common/errors';
import { TournamentCompetitorRanked } from '../../tournaments';
import { generateDraftPairings } from './generateDraftPairings';

// Helper to create mock competitors
function makeCompetitors(n: number): TournamentCompetitorRanked[] {
  return Array.from({ length: n }, (_, i) => ({
    id: (`C${i + 1}`) as Id<'tournamentCompetitors'>,
    rank: i + 1,
    opponentIds: [],
    playedTables: [],
    byeRounds: [],
    stats: {} as TournamentCompetitorRanked['stats'],
  }));
}

describe('generateDraftPairings', () => {
  it('Handles 2 players (trivial pair).', () => {
    const competitors = makeCompetitors(2);
    const pairings = generateDraftPairings(competitors);
    expect(pairings.length).toBe(1);
    expect(pairings[0][1]).not.toBeNull();
  });

  describe('When there is an uneven number of competitors:', () => {
    const competitorCount = 5;
    let competitors: ReturnType<typeof makeCompetitors>;

    beforeEach(() => {
      competitors = makeCompetitors(competitorCount);
    });

    it('Assigns a bye.', () => {
      // ---- Act ----
      const pairings = generateDraftPairings(competitors);
      const byePairings = pairings.filter(([ _, b ]) => b === null);

      // ---- Assert ----
      expect(pairings.length).toBe(3); // 2 pairings + 1 bye
      expect(byePairings.length).toBe(1);
    });

    it('Assigns a bye to the lowest-ranked competitor who has not had one.', () => {
      // ---- Arrange ----
      // Lowest ranked competitor has already had a bye:
      competitors[competitorCount - 1].byeRounds.push(1);

      // ---- Act ----
      const pairings = generateDraftPairings(competitors);
      const byeCompetitor = pairings.find(([ _, b ]) => b === null)?.[0];

      // ---- Assert ----
      expect(byeCompetitor?.id).toBe(competitors[competitorCount - 2]?.id);
    });
  
    it('Assigns a bye to the lowest-ranked competitor if all have had byes.', () => {
      // ---- Arrange ----
      // All competitors have already had a bye:
      competitors.forEach(p => (p.byeRounds = [ 1 ]));
  
      // ---- Act ----
      const pairings = generateDraftPairings(competitors);
      const byeCompetitor = pairings.find(([ _, b ]) => b === null)?.[0];

      // ---- Assert ----
      expect(byeCompetitor?.id).toBe(competitors[competitorCount - 1]?.id);
    });
  });

  describe('When all competitors have already played each other:', () => {
    let competitors: ReturnType<typeof makeCompetitors>;

    beforeEach(() => {
      competitors = makeCompetitors(4);

      // Every competitor has played every other competitor at least once:
      for (const c of competitors) {
        c.opponentIds = competitors.filter((p) => p.id !== c.id).map((p) => p.id);
      }
    });

    it('Does not allow repeat pairings by default.', () => {
      // ---- Act & Assert ----
      expect(() => generateDraftPairings(competitors)).toThrow(errors.NO_VALID_PAIRINGS_POSSIBLE_WITHOUT_REPEAT);
    });

    it('Does allow repeat pairings when explicitly enabled.', () => {
      // ---- Act ----
      const pairings = generateDraftPairings(competitors, true);

      // ---- Assert ----
      expect(pairings.length).toBe(2);
    });
  });

  it('Can pair without repeats or jams for up to 32 competitors over 8 rounds.', () => {
    // ---- Arrange ----
    const roundCount = 8;
    const competitorCount = 32;
    const competitors = makeCompetitors(competitorCount);

    // Simulate 8 rounds, updating opponentIds
    for (let round = 0; round < roundCount; round++) {

      // ---- Act ----
      const pairings = generateDraftPairings(competitors);
      for (const [ a, b ] of pairings) {
        if (b) {
          a.opponentIds.push(b.id);
          b.opponentIds.push(a.id);
        } else {
          a.byeRounds.push(round);
        }
      }

      // ---- Assert ----
      expect(pairings.length).toBe(competitorCount / 2);
      pairings.forEach(([ a, b ]) => {
        expect(a).toBeDefined();
        expect(b).not.toBeNull();
      });

      // Check no repeats happened
      for (const c of competitors) {
        const unique = new Set(c.opponentIds);
        expect(unique.size).toBe(c.opponentIds.length);
      }
    }
  });
});
