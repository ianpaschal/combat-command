import { renderHook } from '@testing-library/react';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { CurrentUser, Tournament } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useTournament } from '~/components/TournamentProvider';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { useLastVisibleRound } from './TournamentRankingsCard.hooks';

vi.mock('~/components/AuthProvider');
vi.mock('~/components/TournamentProvider');
vi.mock('~/utils/common/isUserTournamentOrganizer');

describe('useLastVisibleRound', () => {
  const mockUseAuth = vi.mocked(useAuth);
  mockUseAuth.mockReturnValue({} as CurrentUser); // Doesn't matter because TO check is mocked
  const mockUseTournament = vi.mocked(useTournament);
  const mockIsUserTournamentOrganizer = vi.mocked(isUserTournamentOrganizer);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns last round when not final round.', () => {
    mockUseTournament.mockReturnValue({
      lastRound: 1,
      roundCount: 3,
    } as Tournament);
    mockIsUserTournamentOrganizer.mockReturnValue(false);

    const { result } = renderHook(() => useLastVisibleRound());
    expect(result.current).toBe(1);
  });

  it('returns last round after the final round, when user is a TO.', () => {
    mockUseTournament.mockReturnValue({
      lastRound: 2,
      roundCount: 3,
    } as Tournament);
    mockIsUserTournamentOrganizer.mockReturnValue(true);

    const { result } = renderHook(() => useLastVisibleRound());
    expect(result.current).toBe(2);
  });

  it('returns round before last after the final round, when user is not a TO.', () => {
    mockUseTournament.mockReturnValue({
      lastRound: 2,
      roundCount: 3,
    } as Tournament);
    mockIsUserTournamentOrganizer.mockReturnValue(false);

    const { result } = renderHook(() => useLastVisibleRound());
    expect(result.current).toBe(1);
  });

  it('does not return negative values on first round.', () => {
    mockUseTournament.mockReturnValue({
      lastRound: 0,
      roundCount: 1,
    } as Tournament);
    mockIsUserTournamentOrganizer.mockReturnValue(false);

    const { result } = renderHook(() => useLastVisibleRound());
    expect(result.current).toBe(0);
  });

  it('handles undefined lastRound as 0', () => {
    mockUseTournament.mockReturnValue({
      lastRound: undefined,
      roundCount: 3,
    } as Tournament);
    mockIsUserTournamentOrganizer.mockReturnValue(false);

    const { result } = renderHook(() => useLastVisibleRound());
    expect(result.current).toBe(0);
  });
});
