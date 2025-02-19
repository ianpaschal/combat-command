import { MatchResultRowFilterableRow } from '~/services/matchResults/fetchMatchResultBaseQuery';
import { calculateMatchScore } from './calculateMatchScore';

describe('calculateMatchScore', () => {
  it('should return [8, 1] when player 0 wins with less than 2 units lost.', () => {
    const matchResult = {
      details: {
        winner: 0,
        player_0_units_lost: 1,
        player_1_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([8, 1]);
  });

  it('should return [7, 2] when player 0 wins with 2 units lost.', () => {
    const matchResult = {
      details: {
        winner: 0,
        player_0_units_lost: 2,
        player_1_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([7, 2]);
  });

  it('should return [6, 3] when player 0 wins with 3 or more units lost.', () => {
    const matchResult = {
      details: {
        winner: 0,
        player_0_units_lost: 3,
        player_1_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([6, 3]);
  });

  it('should return [1, 8] when player 1 wins with less than 2 units lost.', () => {
    const matchResult = {
      details: {
        winner: 1,
        player_1_units_lost: 1,
        player_0_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([1, 8]);
  });

  it('should return [2, 7] when player 1 wins with 2 units lost.', () => {
    const matchResult = {
      details: {
        winner: 1,
        player_1_units_lost: 2,
        player_0_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([2, 7]);
  });

  it('should return [3, 6] when player 1 wins with 3 or more units lost', () => {
    const matchResult = {
      details: {
        winner: 1,
        player_1_units_lost: 3,
        player_0_units_lost: 5,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([3, 6]);
  });

  it('should return a draw score based on units lost', () => {
    const matchResult = {
      details: {
        winner: null,
        player_0_units_lost: 2,
        player_1_units_lost: 3,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([3, 2]);
  });

  it('should cap the draw score at 3 for units lost greater than 3', () => {
    const matchResult = {
      details: {
        winner: null,
        player_0_units_lost: 5,
        player_1_units_lost: 4,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([3, 3]);
  });

  it('should floor the draw score at 1 for units lost less than 1', () => {
    const matchResult = {
      details: {
        winner: null,
        player_0_units_lost: 0,
        player_1_units_lost: -1,
      },
    } as MatchResultRowFilterableRow;
    expect(calculateMatchScore(matchResult)).toEqual([1, 1]);
  });
});
