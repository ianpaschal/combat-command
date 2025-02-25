import { FetchMatchResultItem } from '~/services/matchResults/fetchMatchResult';
import { calculateMatchScore } from './calculateMatchScore';
import { getTotalPointsByUserProfileId } from './getTotalPointsByUserProfileId';

jest.mock('./calculateMatchScore');

describe('getTotalPointsByUserProfileId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the total points for a profile playing as player_0', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } } },
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user3' } } },
    ] as FetchMatchResultItem[];
    
    (calculateMatchScore as jest.Mock).mockReturnValueOnce([8, 1]).mockReturnValueOnce([6, 3]);

    expect(getTotalPointsByUserProfileId(matchResults, 'user1')).toBe(14);
  });

  it('should return the total points for a profile playing as player_1', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } } },
      { player_0: { user_profile: { id: 'user3' } }, player_1: { user_profile: { id: 'user2' } } },
    ] as FetchMatchResultItem[];
    
    (calculateMatchScore as jest.Mock).mockReturnValueOnce([8, 1]).mockReturnValueOnce([6, 3]);

    expect(getTotalPointsByUserProfileId(matchResults, 'user2')).toBe(4);
  });

  it('should return 0 when the profile has no matches', () => {
    expect(getTotalPointsByUserProfileId([], 'user1')).toBe(0);
  });

  it('should return 0 when the profile is not found in any matches', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user3' } }, player_1: { user_profile: { id: 'user4' } } },
    ] as FetchMatchResultItem[];
    
    (calculateMatchScore as jest.Mock).mockReturnValueOnce([8, 1]);
    
    expect(getTotalPointsByUserProfileId(matchResults, 'user1')).toBe(0);
  });
});
