import { MatchResult } from '~/api';

type Player0Identity = 'player0User' | 'player0UserId' | 'player0Placeholder';
type Player1Identity = 'player1User' | 'player1UserId' | 'player1Placeholder';

export type FowV4MatchResultDetailsData = Pick<MatchResult, Player0Identity | Player1Identity> & {
  details: Omit<MatchResult['details'], 'missionName' | 'player0Score' | 'player1Score'> & {
    missionName?: string;
  }
};

export type FowV4MatchResultOutcomeDetails = Pick<MatchResult['details'], 'winner' | 'outcomeType'>;
