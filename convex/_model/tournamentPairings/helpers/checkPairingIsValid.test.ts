import {
  describe,
  expect,
  it,
} from 'vitest';

import { checkAllPairingsValidity,checkPairingIsValid } from './checkPairingIsValid';
import { DraftPairing } from './pairingTypes';
import { generateMockCompetitor } from './testHelpers';

describe('checkPairingIsValid', () => {
  it('returns false if competitors are the same', () => {
    const pairing: DraftPairing = [
      generateMockCompetitor('competitor_1', []),
      generateMockCompetitor('competitor_1', []),
    ];
    expect(checkPairingIsValid(pairing)).toBe(false);
  });

  it('returns false if competitors have already played against each other', () => {
    const pairing: DraftPairing = [
      generateMockCompetitor('competitor_1', ['competitor_2']),
      generateMockCompetitor('competitor_2', ['competitor_1']),
    ];
    expect(checkPairingIsValid(pairing)).toBe(false);
  });

  it('returns true if competitors have not played against each other', () => {
    const pairing: DraftPairing = [
      generateMockCompetitor('competitor_1', ['competitor_3']),
      generateMockCompetitor('competitor_2', ['competitor_4']),
    ];
    expect(checkPairingIsValid(pairing)).toBe(true);
  });
});

describe('checkAllPairingsValidity', () => {
  it('returns false if any pairing is invalid', () => {
    const pairings: DraftPairing[] = [
      [
        generateMockCompetitor('competitor_1', ['competitor_2']),
        generateMockCompetitor('competitor_2', ['competitor_1']),
      ],
      [
        generateMockCompetitor('competitor_3', ['competitor_4']),
        generateMockCompetitor('competitor_4', ['competitor_5']),
      ],
    ];
    expect(checkAllPairingsValidity(pairings)).toBe(false);
  });

  it('returns true if all pairings are valid', () => {
    const pairings: DraftPairing[] = [
      [
        generateMockCompetitor('competitor_1', ['competitor_3']),
        generateMockCompetitor('competitor_2', ['competitor_4']),
      ],
      [
        generateMockCompetitor('competitor_5', ['competitor_6']),
        generateMockCompetitor('competitor_7', ['competitor_8']),
      ],
    ];
    expect(checkAllPairingsValidity(pairings)).toBe(true);
  });

  it('returns false if a pairing includes an already paired competitor', () => {
    const pairings: DraftPairing[] = [
      [
        generateMockCompetitor('competitor_1', ['competitor_2']),
        generateMockCompetitor('competitor_2', ['competitor_1']),
      ],
      [
        generateMockCompetitor('competitor_1', ['competitor_3']),
        generateMockCompetitor('competitor_3', ['competitor_1']),
      ],
    ];
    expect(checkAllPairingsValidity(pairings)).toBe(false);
  });

  it('returns true for an empty list of pairings', () => {
    const pairings: DraftPairing[] = [];
    expect(checkAllPairingsValidity(pairings)).toBe(true);
  });
});
