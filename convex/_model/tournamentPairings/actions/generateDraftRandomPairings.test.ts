import {
  describe,
  expect,
  it,
} from 'vitest';

import { RankedCompetitor } from '../helpers/pairingTypes';
import { generateMockCompetitor } from '../helpers/testHelpers';
import { generateDraftRandomPairings } from './generateDraftRandomPairings';

describe('generateDraftRandomPairings', () => {
  it('generates valid pairings for an even number of competitors', () => {
    const competitors: RankedCompetitor[] = [
      generateMockCompetitor('competitor_1', [], 1),
      generateMockCompetitor('competitor_2', [], 2),
      generateMockCompetitor('competitor_3', [], 3),
      generateMockCompetitor('competitor_4', [], 4),
    ];

    const { pairings, unpairedCompetitors } = generateDraftRandomPairings(competitors);

    expect(pairings.length).toBe(2); // 4 competitors should result in 2 pairings
    expect(unpairedCompetitors.length).toBe(0); // No unpaired competitors
    pairings.forEach(([c1, c2]) => {
      expect(c1.id).not.toBe(c2.id); // Competitors in a pairing should not be the same
    });
  });

  it('handles an odd number of competitors by leaving one unpaired', () => {
    const competitors: RankedCompetitor[] = [
      generateMockCompetitor('competitor_1', [], 1),
      generateMockCompetitor('competitor_2', [], 2),
      generateMockCompetitor('competitor_3', [], 3),
    ];

    const { pairings, unpairedCompetitors } = generateDraftRandomPairings(competitors);

    expect(pairings.length).toBe(1); // 3 competitors should result in 1 pairing
    expect(unpairedCompetitors.length).toBe(1); // 1 competitor should be unpaired
  });

  it('does not pair competitors who have already played against each other', () => {
    const competitors: RankedCompetitor[] = [
      generateMockCompetitor('competitor_1', ['competitor_2'], 1),
      generateMockCompetitor('competitor_2', ['competitor_1'], 2),
      generateMockCompetitor('competitor_3', [], 3),
      generateMockCompetitor('competitor_4', [], 4),
    ];

    const { pairings } = generateDraftRandomPairings(competitors);

    pairings.forEach(([c1, c2]) => {
      expect(c1.opponentIds).not.toContain(c2.id); // Competitors in a pairing should not have played against each other
    });
  });

  it('returns no pairings and all competitors unpaired if input is empty', () => {
    const competitors: RankedCompetitor[] = [];

    const { pairings, unpairedCompetitors } = generateDraftRandomPairings(competitors);

    expect(pairings.length).toBe(0); // No pairings should be generated
    expect(unpairedCompetitors.length).toBe(0); // No unpaired competitors
  });

  it('ensures all competitors are included in pairings or unpaired list', () => {
    const competitors: RankedCompetitor[] = [
      generateMockCompetitor('competitor_1', [], 1),
      generateMockCompetitor('competitor_2', [], 2),
      generateMockCompetitor('competitor_3', [], 3),
      generateMockCompetitor('competitor_4', [], 4),
      generateMockCompetitor('competitor_5', [], 5),
    ];

    const { pairings, unpairedCompetitors } = generateDraftRandomPairings(competitors);

    const pairedCompetitorIds = pairings.flatMap(([c1, c2]) => [c1.id, c2.id]);
    const unpairedCompetitorIds = unpairedCompetitors.map((c) => c.id);

    const allCompetitorIds = competitors.map((c) => c.id);
    const processedCompetitorIds = [...pairedCompetitorIds, ...unpairedCompetitorIds];

    expect(processedCompetitorIds.sort()).toEqual(allCompetitorIds.sort()); // All competitors should be accounted for
  });
});
