import { MatchResult, User } from '~/api';

export type FowV4MatchResultDetailsData = Pick<MatchResult, 'player0User' | 'player0UserId' | 'player0Placeholder' | 'player1User' | 'player1UserId' | 'player1Placeholder'> & {
  player0User?: User;
  player1User?: User;
  details: Omit<MatchResult['details'], 'missionName'> & {
    missionName?: string;
  }
};

export type FowV4MatchResultOutcomeDetails = Pick<MatchResult['details'], 'winner' | 'outcomeType'>;
