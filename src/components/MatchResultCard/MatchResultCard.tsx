import {
  Map,
  Shield,
  Sword,
} from 'lucide-react';

import { missions } from '~/components/FowV4MatchOutcomeFormSection/missions';
import { Avatar } from '~/components/generic/Avatar';
import { BadgeConfig } from '~/components/generic/Avatar/Avatar';
import { Card } from '~/components/generic/Card';
import { UserPortrait } from '~/components/UserPortrait';
import { MatchDeep } from '~/types/db/Matches';
import { fowV4MatchOutcomeTypeLabels } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';
import { getUserDisplayName } from '~/utils/common/getUserDisplayName';
import { createCn } from '~/utils/componentLib/createCn';
import flamesOfWarV4Utils from '~/utils/flamesOfWarV4Utils';
import { FlagCircle } from '../generic/FlagCircle';

import './MatchResultCard.scss';

const cn = createCn('MatchResultCard');

export type MatchData = Omit<MatchDeep, 'id' | 'created_at' | 'updated_at' | 'game_system_config' | 'game_system_config_id'>;

export interface MatchResultCardProps {
  matchId?: string;
  matchData?: MatchData
}
export const MatchResultCard = ({
  matchId,
  matchData,
}: MatchResultCardProps): JSX.Element => {
  let data: MatchData | undefined;
  if (matchId) {
    // Fetch the match
    data = {} as MatchData;
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

  const score = flamesOfWarV4Utils.calculateMatchScore(data);
  const player0Badges: BadgeConfig[] = [
    {
      element: (
        <div className={cn('_StanceBadge')}>
          {data.outcome!.attacker === 0 ? <Sword /> : <Shield />}
        </div>
      ),
      position: 'top-right',
    },
  ];
  if (data.player_0.competitor.country_code) {
    player0Badges.push({
      element: <FlagCircle size="1.5rem" code={data.player_0.competitor.country_code} />,
      position: 'bottom-left',
    });
  }
  const player1Badges: BadgeConfig[] = [
    {
      element: (
        <div className={cn('_StanceBadge')}>
          {data.outcome!.attacker === 1 ? <Sword /> : <Shield />}
        </div>
      ),
      position: 'top-right',
    },
  ];
  if (data.player_1.competitor.country_code) {
    player1Badges.push({
      element: <FlagCircle size="1.5rem" code={data.player_1.competitor.country_code} />,
      position: 'bottom-left',
    });
  }
  return (
    <Card disablePadding className={cn()}>
      <div className={cn('_MainSection')}>
        <div className={cn('_Player0Profile')}>
          <UserPortrait displayName={getUserDisplayName(data.player_0.profile)} orientation="vertical">
            <Avatar badges={player0Badges} />
          </UserPortrait>
        </div>
        <div className={cn('_Player1Profile')}>
          <UserPortrait displayName={getUserDisplayName(data.player_1.profile)} orientation="vertical">
            <Avatar className={cn('_Player1Avatar')} badges={player1Badges} />
          </UserPortrait>
        </div>
        <div className={cn('_Score')}>
          <span className={cn('_ScorePlayer0')}>{score[0]}</span>
          <span className={cn('_ScoreSeparator')}>:</span>
          <span className={cn('_ScorePlayer1')}>{score[1]}</span>
        </div>
        <div className={cn('_Turns')}>
          {data.outcome.turns_played > 1 ? `${data.outcome.turns_played} Turns` : '1 Turn'}
        </div>
      </div>
      <div className={cn('_BottomSection')}>
        <div className={cn('_MissionSection')}><Map /> {missions.find((mission) => mission.id === data.outcome.mission_id)?.label}</div>
        <div className={cn('_OutcomeSection')}>{fowV4MatchOutcomeTypeLabels[data.outcome.outcome_type]}</div>
      </div>
    </Card>
  );
};