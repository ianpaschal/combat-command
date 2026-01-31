import { Alignment } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { createMockTournamentCompetitor } from '../../../_fixtures/createMockTournamentCompetitor';
import { Id } from '../../../_generated/dataModel';
import { validateTournamentPairing } from './validateTournamentPairing';

describe('validateTournamentPairing', () => {

  describe('returns error', () => {

    it('if opponents have played and repeats are not allowed.', () => {
      const a = createMockTournamentCompetitor({ id: 'A', opponentIds: ['B'] as Id<'tournamentCompetitors'>[] });
      const b = createMockTournamentCompetitor({ id: 'B' });

      const result = validateTournamentPairing({ allowRepeats: false }, a, b);

      expect(result.status).toBe('error');
      expect(result.message).toBe('These opponents have already played each other.');
    });

    it('if opponents have same alignment and same alignment is not allowed.', () => {
      const a = createMockTournamentCompetitor({ id: 'A' });
      const b = createMockTournamentCompetitor({ id: 'B' });
      a.details.alignments = [Alignment.Allies];
      b.details.alignments = [Alignment.Allies];

      const result = validateTournamentPairing({ allowSameAlignment: false }, a, b);

      expect(result.status).toBe('error');
      expect(result.message).toBe('These opponents have the same alignment.');
    });
  });

  describe('returns a warning', () => {
    it('if competitor A has already had a bye.', () => {
      const a = createMockTournamentCompetitor({ id: 'A', byeRounds: [1], displayName: 'Player A' });

      const result = validateTournamentPairing({}, a, null);

      expect(result.status).toBe('warning');
      expect(result.message).toBe('Player A has already had a bye.');
    });

    it('if competitor B has already had a bye.', () => {
      const b = createMockTournamentCompetitor({ id: 'B', byeRounds: [1], displayName: 'Player B' });

      const result = validateTournamentPairing({}, null, b);

      expect(result.status).toBe('warning');
      expect(result.message).toBe('Player B has already had a bye.');
    });

    it('if competitor A has already played the assigned table.', () => {
      const a = createMockTournamentCompetitor({ id: 'A', playedTables: [1, 2, 3], displayName: 'Player A' });
      const b = createMockTournamentCompetitor({ id: 'B' });

      const result = validateTournamentPairing({}, a, b, 2);

      expect(result.status).toBe('warning');
      expect(result.message).toBe('Player A has already played this table.');
    });

    it('if competitor B has already played the assigned table.', () => {
      const a = createMockTournamentCompetitor({ id: 'A' });
      const b = createMockTournamentCompetitor({ id: 'B', playedTables: [1, 2, 3], displayName: 'Player B' });

      const result = validateTournamentPairing({}, a, b, 3);

      expect(result.status).toBe('warning');
      expect(result.message).toBe('Player B has already played this table.');
    });
  });

  // TODO: Tests beyond here may need some clean-up:

  it('ignores table check if table is null.', () => {
    const a = createMockTournamentCompetitor({ id: 'A', playedTables: [1, 2, 3] });
    const b = createMockTournamentCompetitor({ id: 'B' });

    const result = validateTournamentPairing({}, a, b, null);

    expect(result.status).toBe('ok');
  });

  it('ignores table check if table is -1 (auto).', () => {
    const a = createMockTournamentCompetitor({ id: 'A', playedTables: [1, 2, 3] });
    const b = createMockTournamentCompetitor({ id: 'B' });

    const result = validateTournamentPairing({}, a, b, -1);

    expect(result.status).toBe('ok');
  });

  it('ignores table check if table is undefined.', () => {
    const a = createMockTournamentCompetitor({ id: 'A', playedTables: [1, 2, 3] });
    const b = createMockTournamentCompetitor({ id: 'B' });

    const result = validateTournamentPairing({}, a, b, undefined);

    expect(result.status).toBe('ok');
  });

  describe('priority order', () => {
    it('returns repeat error before same alignment error.', () => {
      const a = createMockTournamentCompetitor({ id: 'A', opponentIds: ['B'] as Id<'tournamentCompetitors'>[] });
      const b = createMockTournamentCompetitor({ id: 'B' });
      a.details.alignments = [Alignment.Allies];
      b.details.alignments = [Alignment.Allies];

      const result = validateTournamentPairing({ allowRepeats: false, allowSameAlignment: false }, a, b);

      expect(result.status).toBe('error');
      expect(result.message).toBe('These opponents have already played each other.');
    });

    it('returns error before warning.', () => {
      const a = createMockTournamentCompetitor({ id: 'A', opponentIds: ['B'] as Id<'tournamentCompetitors'>[], playedTables: [1] });
      const b = createMockTournamentCompetitor({ id: 'B' });

      const result = validateTournamentPairing({ allowRepeats: false }, a, b, 1);

      expect(result.status).toBe('error');
    });
  });

  describe('valid pairings', () => {
    it('returns ok for a valid pairing with no conflicts.', () => {
      const a = createMockTournamentCompetitor({ id: 'A' });
      const b = createMockTournamentCompetitor({ id: 'B' });
      a.details.alignments = [Alignment.Allies];
      b.details.alignments = [Alignment.Axis];

      const result = validateTournamentPairing({}, a, b);

      expect(result.status).toBe('ok');
      expect(result.message).toBe('Pairing is valid.');
    });

    it('returns ok when both competitors are null.', () => {
      const result = validateTournamentPairing({}, null, null);

      expect(result.status).toBe('ok');
    });
  });
});
