import {
  Map,
  Shield,
  Sword,
} from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { Tag } from '~/components/generic/Tag';
import { UserPortrait } from '~/components/UserPortrait';
import { createCn } from '~/utils/componentLib/createCn';
import { FlagCircle } from '../generic/FlagCircle';

import './MatchResultCard.scss';

const cn = createCn('MatchResultCard');
export const MatchResultCard = (): JSX.Element => {
  const matchResult = {};
  return (
    <Card disablePadding className={cn()}>
      <div className={cn('_MainSection')}>
        <UserPortrait name="Foo" orientation="vertical" className={cn('_Player0Profile')}>
          <Avatar
            badges={[{
              element: <div className={cn('_StanceBadge')}><Sword /></div>,
              position: 'top-right',
            }]}
          />
        </UserPortrait>
        <UserPortrait name="Bar" orientation="vertical" className={cn('_Player1Profile')}>
          <Avatar
            className={cn('_Player0Avatar')}
            badges={[
              {
                element: <div className={cn('_StanceBadge')}><Shield /></div>,
                position: 'top-left',
              },
              {
                element: <FlagCircle size="1.5rem" code="nl" />,
                position: 'bottom-right',
              },
            ]}
          />
        </UserPortrait>
        <div className={cn('_Score')}>
          <span className={cn('_ScorePlayer0')}>6</span>
          <span className={cn('_ScoreSeparator')}>:</span>
          <span className={cn('_ScorePlayer1')}>3</span>
        </div>
        <div className={cn('_Turns')}>
          <Tag>6 Turns</Tag>
        </div>
      </div>
      <div className={cn('_BottomSection')}>
        <div className={cn('_MissionSection')}><Map /> Bypass</div>
        <div className={cn('_OutcomeSection')}>Objective Captured</div>
      </div>
    </Card>
  );
};