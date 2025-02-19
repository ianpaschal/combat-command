import { MatchResultFilterableRow } from '~/types/db';
import { getOpponentsByUserProfileId } from './getOpponentsByUserProfileId';

describe('getOpponentsByUserProfileId', () => {
  it('should return the opponent\'s ID when the profile is player_0.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } } },
    ] as MatchResultFilterableRow[];
    expect(getOpponentsByUserProfileId(matchResults, 'user1')).toEqual(['user2']);
  });

  it('should return the opponent\'s ID when the profile is player_1.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } } },
    ] as MatchResultFilterableRow[];
    expect(getOpponentsByUserProfileId(matchResults, 'user2')).toEqual(['user1']);
  });

  it('should return multiple opponent IDs when there are multiple matches.', () => {
    const matchResults = [
      { player_0: { user_profile: { id: 'user1' } }, player_1: { user_profile: { id: 'user2' } } },
      { player_0: { user_profile: { id: 'user3' } }, player_1: { user_profile: { id: 'user1' } } },
    ] as MatchResultFilterableRow[];
    expect(getOpponentsByUserProfileId(matchResults, 'user1')).toEqual(['user2', 'user3']);
  });

  it('should return an empty array when there are no matches.', () => {
    expect(getOpponentsByUserProfileId([], 'user1')).toEqual([]);
  });
});
