import {
  Map,
  Shield,
  Sword,
} from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { UserPortrait } from '~/components/UserPortrait';
import { fowV4MatchOutcomeTypeLabels } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';
import { Match } from '~/types/Match';
import { createCn } from '~/utils/componentLib/createCn';
import { FlagCircle } from '../generic/FlagCircle';

import './MatchResultCard.scss';

const cn = createCn('MatchResultCard');

export interface MatchResultCardProps {
  matchId?: string;
  matchData?: Match;
}
export const MatchResultCard = ({
  matchId,
  matchData,
}: MatchResultCardProps): JSX.Element => {
  let data;
  if (matchId) {
    // Fetch the match
    data = {} as Match;
  } else if (matchData) {
    data = matchData;
  }
  if (!data) {
    return (
      <Card disablePadding className={cn()}>
        Not found...
      </Card>
    );
  }
  return (
    <Card disablePadding className={cn()}>
      <div className={cn('_MainSection')}>
        <div className={cn('_Player0Profile')}>
          <UserPortrait name={data.players[0].user_id} orientation="vertical">
            <Avatar
              badges={[
                {
                  element: (
                    <div className={cn('_StanceBadge')}>
                      {data.outcome.attacker === 0 ? <Sword /> : <Shield />}
                    </div>
                  ),
                  position: 'top-right',
                },
                {
                  element: <FlagCircle size="1.5rem" code="be" />,
                  position: 'bottom-left',
                },
              ]}
            />
          </UserPortrait>
        </div>
        <div className={cn('_Player1Profile')}>
          <UserPortrait name={data.players[1].user_id} orientation="vertical">
            <Avatar
              className={cn('_Player1Avatar')}
              badges={[
                {
                  element: (
                    <div className={cn('_StanceBadge')}>
                      {data.outcome.attacker === 1 ? <Sword /> : <Shield />}
                    </div>
                  ),
                  position: 'top-left',
                },
                {
                  element: <FlagCircle size="1.5rem" code="nl" />,
                  position: 'bottom-right',
                },
              ]}
            />
          </UserPortrait>
        </div>
        <div className={cn('_Score')}>
          <span className={cn('_ScorePlayer0')}>6</span>
          <span className={cn('_ScoreSeparator')}>:</span>
          <span className={cn('_ScorePlayer1')}>3</span>
        </div>
        <div className={cn('_Turns')}>
          {`${data.outcome.turns_played} Turns`}
        </div>
      </div>
      <div className={cn('_BottomSection')}>
        <div className={cn('_MissionSection')}><Map /> {data.outcome.mission_id}</div>
        <div className={cn('_OutcomeSection')}>{fowV4MatchOutcomeTypeLabels[data.outcome.outcome_type]}</div>
      </div>
    </Card>
  );
};