import {
  describe,
  expect,
  it,
} from 'vitest';

import { isValidOpponent } from './isValidOpponent';
import { DraftPairing } from './pairingTypes';
import { generateMockCompetitor } from './testHelpers';

describe('isValidOpponent', () => {
  it('returns false if a competitor is compared with themselves', () => {
    const competitor = generateMockCompetitor('competitor_1', []);
    const pairings: DraftPairing[] = [];

    expect(isValidOpponent(competitor, competitor, pairings)).toBe(false);
  });

  it('returns false if competitors have already played against each other', () => {
    const competitorA = generateMockCompetitor('competitor_1', ['competitor_2']);
    const competitorB = generateMockCompetitor('competitor_2', ['competitor_1']);
    const pairings: DraftPairing[] = [];

    expect(isValidOpponent(competitorA, competitorB, pairings)).toBe(false);
  });

  it('returns false if one of the competitors is already paired elsewhere', () => {
    const competitorA = generateMockCompetitor('competitor_1', []);
    const competitorB = generateMockCompetitor('competitor_2', []);
    const pairings: DraftPairing[] = [
      [generateMockCompetitor('competitor_1', []), generateMockCompetitor('competitor_3', [])],
    ];

    expect(isValidOpponent(competitorA, competitorB, pairings)).toBe(false);
  });

  it('returns true if competitors are valid opponents and not paired elsewhere', () => {
    const competitorA = generateMockCompetitor('competitor_1', []);
    const competitorB = generateMockCompetitor('competitor_2', []);
    const pairings: DraftPairing[] = [];

    expect(isValidOpponent(competitorA, competitorB, pairings)).toBe(true);
  });

  it('returns true if competitors have no prior matches and are not paired elsewhere', () => {
    const competitorA = generateMockCompetitor('competitor_1', []);
    const competitorB = generateMockCompetitor('competitor_2', []);
    const pairings: DraftPairing[] = [
      [generateMockCompetitor('competitor_3', []), generateMockCompetitor('competitor_4', [])],
    ];

    expect(isValidOpponent(competitorA, competitorB, pairings)).toBe(true);
  });
});
