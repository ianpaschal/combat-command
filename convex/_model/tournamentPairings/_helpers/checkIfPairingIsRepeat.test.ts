import {
  describe,
  expect,
  it,
} from 'vitest';

import { createMockTournamentCompetitor } from '../../../_fixtures/createMockTournamentCompetitor';
import { Id } from '../../../_generated/dataModel';
import { checkIfPairingIsRepeat } from './checkIfPairingIsRepeat';

describe('checkIfPairingIsRepeat', () => {
  it('returns true if competitor A has played competitor B.', () => {
    const a = createMockTournamentCompetitor({ id: 'A', opponentIds: ['B'] as Id<'tournamentCompetitors'>[] });
    const b = createMockTournamentCompetitor({ id: 'B' });

    expect(checkIfPairingIsRepeat(a, b)).toBe(true);
  });

  it('returns true if competitor B has played competitor A.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B', opponentIds: ['A'] as Id<'tournamentCompetitors'>[] });

    expect(checkIfPairingIsRepeat(a, b)).toBe(true);
  });

  it('returns false if neither competitor has played the other.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });

    expect(checkIfPairingIsRepeat(a, b)).toBe(false);
  });
});
