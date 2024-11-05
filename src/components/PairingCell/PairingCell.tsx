import { ReactNode } from 'react';
import clsx from 'clsx';

import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { UserPortrait, UserPortraitProps } from '~/components/UserPortrait/UserPortrait';
import { TournamentCompetitorDeep, TournamentPairingDeep } from '~/types/db';
import { getCountryName } from '~/utils/getCountryName';
import { getUserDisplayName } from '~/utils/getUserDisplayName';

import styles from './PairingCell.module.scss';

const renderCompetitorProfile = (c: TournamentCompetitorDeep, props: Partial<UserPortraitProps>): ReactNode => {

  console.log(c.players.length, c.country_code);
  // Is a team:
  if (c.players.length > 1) {
    if (c.country_code) {
      const name = getCountryName(c.country_code);
      console.log('rendering', c.country_code, name);
      return (
        <UserPortrait displayName={name} {...props}>
          <FlagCircle code={c.country_code} />
        </UserPortrait>
      );
    }
    if (!c.country_code && c.team_name) {
      return (
        <UserPortrait displayName={c.team_name} {...props}>
          <span>Derp</span>
        </UserPortrait>
      );
    }
  }

  // Is single player:
  if (c.players.length === 1) {
    return (
      <UserPortrait displayName={getUserDisplayName(c.players[0].profile)} {...props}>
        <Avatar />
      </UserPortrait>
    );
  }
};

interface PairingCellProps {
  data: TournamentPairingDeep;
}

export const PairingCell = ({
  data,
}: PairingCellProps): JSX.Element => (
  <div className={clsx('PairingCell', styles.Root)}>
    {renderCompetitorProfile(data.competitor_0, { size: '1.5rem', orientation: 'horizontal', reversed: true })}
    <span className={styles.Separator}>vs.</span>
    {renderCompetitorProfile(data.competitor_1, { size: '1.5rem', orientation: 'horizontal' })}
  </div>
);

// const isTeamPairing = competitor0.user_ids.length > 0 || competitor1.user_ids.length;

// TODO: Move this to the user profile and rename

