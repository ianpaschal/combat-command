import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { UserPortrait } from '~/components/UserPortrait';
import { createCn } from '~/utils/componentLib/createCn';

import './PairingCard.scss';

const cn = createCn('PairingCard');
export const PairingCard = (): JSX.Element => (
  <Card className={cn()} disablePadding>
    <div className={cn('_MainSection')}>
      <UserPortrait name="Belgium" orientation="horizontal" className={cn('_Competitor0')} reversed>
        <FlagCircle code="be" />
      </UserPortrait>
      <span className={cn('_Separator')}>vs.</span>
      <UserPortrait name="Netherlands" orientation="horizontal" className={cn('_Competitor1')}>
        <FlagCircle code="nl" />
      </UserPortrait>
    </div>
  </Card>
);