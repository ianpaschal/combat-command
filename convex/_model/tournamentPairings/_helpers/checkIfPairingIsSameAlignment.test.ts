import { Alignment } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { createMockTournamentCompetitor } from '../../../_fixtures/createMockTournamentCompetitor';
import { checkIfPairingIsSameAlignment } from './checkIfPairingIsSameAlignment';

describe('checkIfPairingIsSameAlignment', () => {
  it('returns false if competitor A is flexible.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = ['flexible'];
    b.details.alignments = [Alignment.Allies];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(false);
  });

  it('returns false if competitor B is flexible.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [Alignment.Axis];
    b.details.alignments = ['flexible'];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(false);
  });

  it('returns false if competitor A has multiple alignments.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [Alignment.Allies, Alignment.Axis];
    b.details.alignments = [Alignment.Allies];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(false);
  });

  it('returns false if competitor B has multiple alignments.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [Alignment.Allies];
    b.details.alignments = [Alignment.Allies, Alignment.Axis];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(false);
  });

  it('returns false if both have single but different alignments.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [Alignment.Allies];
    b.details.alignments = [Alignment.Axis];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(false);
  });

  it('returns true if both have the same single alignment.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [Alignment.Allies];
    b.details.alignments = [Alignment.Allies];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(true);
  });

  it('returns true if both have empty alignments.', () => {
    const a = createMockTournamentCompetitor({ id: 'A' });
    const b = createMockTournamentCompetitor({ id: 'B' });
    a.details.alignments = [];
    b.details.alignments = [];

    expect(checkIfPairingIsSameAlignment(a, b)).toBe(true);
  });
});
