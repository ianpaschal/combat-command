import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Tournament, User } from '~/api';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { getLastVisibleTournamentRound } from './getLastVisibleTournamentRound';

vi.mock('~/utils/common/isUserTournamentOrganizer');

describe('getLastVisibleTournamentRound', () => {
  const user = {} as User;
  const mockIsUserTournamentOrganizer = vi.mocked(isUserTournamentOrganizer);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns last round when not final round.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: 1,
      roundCount: 3,
      status: 'active',
    } as Tournament, user);
    expect(result).toBe(1);
  });

  it('returns last round after the final round, when user is a TO.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(true);
    const result = getLastVisibleTournamentRound({
      lastRound: 2,
      roundCount: 3,
      status: 'active',
    } as Tournament, user);
    expect(result).toBe(2);
  });

  it('returns round before last after the final round, when user is not a TO.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: 2,
      roundCount: 3,
      status: 'active',
    } as Tournament, user);
    expect(result).toBe(1);
  });

  it('returns round before last after the final round, when user is not authenticated.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: 2,
      roundCount: 3,
      status: 'active',
    } as Tournament, null);
    expect(result).toBe(1);
  });

  it('does not return negative values on first round.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: 0,
      roundCount: 1,
      status: 'active',
    } as Tournament, user);
    expect(result).toBe(0);
  });

  it('handles undefined lastRound as 0.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: undefined,
      roundCount: 3,
      status: 'active',
    } as Tournament, user);
    expect(result).toBe(0);
  });

  it('returns last round when tournament is archived.', () => {
    mockIsUserTournamentOrganizer.mockReturnValue(false);
    const result = getLastVisibleTournamentRound({
      lastRound: 2,
      roundCount: 3,
      status: 'archived',
    } as Tournament, user);
    expect(result).toBe(2);
  });
});
