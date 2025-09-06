import {
  describe,
  expect,
  it,
} from 'vitest';

import { calculateFowV4MatchResultScore } from './calculateFowV4MatchResultScore';
import { FowV4MatchResultDetails } from './fowV4MatchResultDetails';

describe('calculateFowV4MatchResultScore', () => {
  it('should return [8, 1] when player 0 wins with less than 2 units lost.', () => {
    const details = {
      winner: 0,
      player0UnitsLost: 1,
      player1UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([8, 1]);
  });

  it('should return [7, 2] when player 0 wins with 2 units lost.', () => {
    const details = {
      winner: 0,
      player0UnitsLost: 2,
      player1UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([7, 2]);
  });

  it('should return [6, 3] when player 0 wins with 3 or more units lost.', () => {
    const details = {
      winner: 0,
      player0UnitsLost: 3,
      player1UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([6, 3]);
  });

  it('should return [1, 8] when player 1 wins with less than 2 units lost.', () => {
    const details = {
      winner: 1,
      player1UnitsLost: 1,
      player0UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([1, 8]);
  });

  it('should return [2, 7] when player 1 wins with 2 units lost.', () => {
    const details = {
      winner: 1,
      player1UnitsLost: 2,
      player0UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([2, 7]);
  });

  it('should return [3, 6] when player 1 wins with 3 or more units lost', () => {
    const details = {
      winner: 1,
      player1UnitsLost: 3,
      player0UnitsLost: 5,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([3, 6]);
  });

  it('should return a draw score based on units lost', () => {
    const details = {
      winner: -1,
      player0UnitsLost: 2,
      player1UnitsLost: 3,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([3, 2]);
  });

  it('should cap the draw score at 3 for units lost greater than 3', () => {
    const details = {
      winner: -1,
      player0UnitsLost: 5,
      player1UnitsLost: 4,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([3, 3]);
  });

  it('should floor the draw score at 1 for units lost less than 1', () => {
    const details = {
      winner: -1,
      player0UnitsLost: 0,
      player1UnitsLost: -1,
    } as FowV4MatchResultDetails;
    expect(calculateFowV4MatchResultScore(details)).toEqual([1, 1]);
  });

  describe('scoreOverride', () => {
    it('should return override scores when scoreOverride is provided.', () => {
      const details = {
        winner: 0,
        player0UnitsLost: 1,
        player1UnitsLost: 5,
        scoreOverride: {
          player0Score: 10,
          player1Score: 0,
        },
      } as FowV4MatchResultDetails;
      expect(calculateFowV4MatchResultScore(details)).toEqual([10, 0]);
    });

    it('should return override scores even when winner would normally give different scores.', () => {
      const details = {
        winner: 1,
        player0UnitsLost: 5,
        player1UnitsLost: 1,
        scoreOverride: {
          player0Score: 5,
          player1Score: 5,
        },
      } as FowV4MatchResultDetails;
      expect(calculateFowV4MatchResultScore(details)).toEqual([5, 5]);
    });

    it('should return override scores even for draw scenarios.', () => {
      const details = {
        winner: -1,
        player0UnitsLost: 2,
        player1UnitsLost: 3,
        scoreOverride: {
          player0Score: 7,
          player1Score: 3,
        },
      } as FowV4MatchResultDetails;
      expect(calculateFowV4MatchResultScore(details)).toEqual([7, 3]);
    });

    it('should return override scores with zero values.', () => {
      const details = {
        winner: 0,
        player0UnitsLost: 1,
        player1UnitsLost: 5,
        scoreOverride: {
          player0Score: 0,
          player1Score: 0,
        },
      } as FowV4MatchResultDetails;
      expect(calculateFowV4MatchResultScore(details)).toEqual([0, 0]);
    });

    it('should return override scores with negative values.', () => {
      const details = {
        winner: 1,
        player0UnitsLost: 5,
        player1UnitsLost: 1,
        scoreOverride: {
          player0Score: -1,
          player1Score: 9,
        },
      } as FowV4MatchResultDetails;
      expect(calculateFowV4MatchResultScore(details)).toEqual([-1, 9]);
    });
  });
});
