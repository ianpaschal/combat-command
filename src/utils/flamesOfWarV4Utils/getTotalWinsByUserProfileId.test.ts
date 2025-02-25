import { FetchMatchResultItem } from '~/services/matchResults/fetchMatchResult';
import { getTotalWinsByUserProfileId } from './getTotalWinsByUserProfileId';

describe('getTotalWinsByUserProfileId', () => {
  it('should return the total number of wins for a user playing as player_0.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } }, details: { winner: 0 } },
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user3' } }, details: { winner: 0 } },
    ] as FetchMatchResultItem[];
    
    expect(getTotalWinsByUserProfileId(matchResults, 'user1')).toBe(2);
  });

  it('should return the total number of wins for a user playing as player_1.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } }, details: { winner: 1 } },
      { player_0: { user_profile: { id: 'user3' } }, player_1: { user_profile: { id: 'user2' } }, details: { winner: 1 } },
    ] as FetchMatchResultItem[];
    
    expect(getTotalWinsByUserProfileId(matchResults, 'user2')).toBe(2);
  });

  it('should return 0 when the user has no wins.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } }, details: { winner: 0 } },
    ] as FetchMatchResultItem[];
    
    expect(getTotalWinsByUserProfileId(matchResults, 'user2')).toBe(0);
  });

  it('should return 0 when the user has no matches.', () => {
    expect(getTotalWinsByUserProfileId([], 'user1')).toBe(0);
  });
});
