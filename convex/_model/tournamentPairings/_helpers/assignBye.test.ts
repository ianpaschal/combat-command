import {
  describe,
  expect,
  it,
} from 'vitest';

import { createMockTournamentCompetitors } from '../../../_fixtures/createMockTournamentCompetitor';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { assignBye } from './assignBye';

describe('assignBye', () => {
  it('Returns null and all competitors if no bye is needed (even number of competitors).', () => {
    // ---- Arrange ----
    const competitors = createMockTournamentCompetitors(4);

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeNull();
    expect(remaining).toEqual(competitors);
  });

  it('Assigns a bye to the lowest-ranked competitor who has not had one.', () => {
    // ---- Arrange ----
    const competitors = createMockTournamentCompetitors(5);

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeDefined();
    expect(bye!._id).toBe(competitors[4]._id); // Lowest-ranked competitor
    expect(remaining.length).toBe(4);
    expect(remaining).not.toContain(bye);
  });

  it('Assigns a bye to the lowest-ranked competitor if all have had byes.', () => {
    // ---- Arrange ----
    const competitors = createMockTournamentCompetitors(5);
    competitors.forEach((c) => (c.byeRounds = [1])); // All competitors have had a bye

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeDefined();
    expect(bye!._id).toBe(competitors[4]._id); // Lowest-ranked competitor
    expect(remaining.length).toBe(4);
    expect(remaining).not.toContain(bye);
  });

  it('Handles a single competitor correctly.', () => {
    // ---- Arrange ---
    const competitors = createMockTournamentCompetitors(1);

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeDefined();
    expect(bye?._id).toBe(competitors[0]._id);
    expect(remaining).toEqual([]);
  });

  it('Handles an empty list of competitors.', () => {
    // ---- Arrange ---
    const competitors: DeepTournamentCompetitor[] = [];

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeNull();
    expect(remaining).toEqual([]);
  });

  it('Does not change the order of returned competitors.', () => {
    // ---- Arrange ----
    const competitors = createMockTournamentCompetitors(5);

    // Assign bye to all but middle competitor:
    for (let i = 0; i < competitors.length; i++) {
      if (i !== 2) {
        competitors[i].byeRounds = [1];
      }
    }

    // ---- Act ----
    const [bye, remaining] = assignBye(competitors);

    // ---- Assert ----
    expect(bye).toBeDefined();
    expect(bye!._id).toBe(competitors[2]._id);
    expect(remaining).not.toContain(bye);
    expect(remaining.length).toBe(4);
    expect(remaining.map((c) => c._id)).toEqual(
      competitors.filter((c) => c._id !== bye!._id).map((c) => c._id),
    );
  });
});
