import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { UserPortrait } from '~/components/UserPortrait';
import { createCn } from '~/utils/componentLib/createCn';

import './MatchResultCard.scss';

const cn = createCn('MatchResultCard');
export const MatchResultCard = (): JSX.Element => {
  const matchResult = {

  };
  return (
    <Card disablePadding className={cn()}>
      <div>
        <span>Attack</span>
        <span>Defend</span>
      </div>
      <div className={cn('_MainSection')}>
        <UserPortrait name="Foo" orientation="vertical" className={cn('_Player0Profile')}>
          <Avatar />
        </UserPortrait>
        <UserPortrait name="Bar" orientation="vertical" className={cn('_Player1Profile')}>
          <Avatar />
        </UserPortrait>
        <div className={cn('_Score')}>
          <span className={cn('_ScorePlayer0')}>6</span>
          <span className={cn('_ScoreSeparator')}>:</span>
          <span className={cn('_ScorePlayer1')}>3</span>
        </div>
      </div>
      <div>
        <span>Objective Taken</span>
      </div>
    </Card>
  );
};