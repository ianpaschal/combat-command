import { ReactNode } from 'react';
import { country, subdivision } from 'iso-3166-2';

import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { UserPortrait } from '~/components/UserPortrait';
import { UserPortraitProps } from '~/components/UserPortrait/UserPortrait';
import { createCn } from '~/utils/componentLib/createCn';

import './PairingCard.scss';

interface PairingCardProps {
  id: string;
}

const cn = createCn('PairingCard');
export const PairingCard = ({
  id,
}: PairingCardProps): JSX.Element => {
  const pairing = {
    round_index: 2,
    table_index: 1,
  };
  const competitor0 = {
    user_ids: ['foo', 'bar'],
    country_code: 'be',
    team_name: null,
  };
  const competitor1 = {
    user_ids: ['foo', 'bar'],
    country_code: 'nl',
    team_name: null,
  };

  const isTeamPairing = competitor0.user_ids.length > 0 || competitor1.user_ids.length;

  // TODO: Move this to the user profile and rename
  const renderCompetitorProfile = (c: typeof competitor1, props: Partial<UserPortraitProps>): ReactNode => {

    // Is a national team:
    if (c.user_ids.length > 0) {
      if (c.country_code && !c.team_name) {
        const countryData = c.country_code.includes('-') ? subdivision(c.country_code) : country(c.country_code);
        return (
          <UserPortrait name={countryData!.name} {...props}>
            <FlagCircle code={c.country_code} />
          </UserPortrait>
        );
      }
      if (!c.country_code && c.team_name) {
        return (
          <UserPortrait name={c.team_name} {...props}>
            <span>Derp</span>
          </UserPortrait>
        );
      }
    }

    // If single player team:
    if (c.user_ids.length === 1) {
      const displayName = 'Bob';
      return (
        <UserPortrait name={displayName} {...props}>
          <Avatar />
        </UserPortrait>
      );
    }
  };

  return (
    <Card className={cn()} disablePadding>
      <div className={cn('_AdditionalSection')}>
        <div className={cn('_RoundSection')}>Round {pairing.round_index + 1}</div>
        <div className={cn('_TableSection')}>{isTeamPairing ? 'Table Row' : 'Table'} {pairing.table_index + 1}</div>
      </div>
      <div className={cn('_MainSection')}>
        <UserPortrait name="Belgium" orientation="horizontal" className={cn('_Competitor0')} reversed>
          <FlagCircle code={competitor0.country_code} />
        </UserPortrait>
        <span className={cn('_Separator')}>vs.</span>
        <UserPortrait name="Netherlands" orientation="horizontal" className={cn('_Competitor1')}>
          <FlagCircle code={competitor1.country_code} />
        </UserPortrait>
      </div>
    </Card>
  );
};