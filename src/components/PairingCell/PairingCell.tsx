import { ReactNode } from 'react';
import clsx from 'clsx';
import { country, subdivision } from 'iso-3166-2';

import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { UserPortrait } from '~/components/UserPortrait';
import { UserPortraitProps } from '~/components/UserPortrait/UserPortrait';
import { TournamentPairing } from '~/types/TournamentPairing';
import { createCn } from '~/utils/componentLib/createCn';

import styles from './PairingCell.module.scss';

interface PairingCellProps {
  data: TournamentPairing;
}

const cn = createCn('PairingCell');
export const PairingCell = ({
  data,
}: PairingCellProps): JSX.Element => {
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
    <div className={clsx('PairingCell', styles.Root)}>
      <div className={styles.Competitor0}>
        Belgium
      </div>
      <FlagCircle code={competitor0.country_code} size="1.5rem" className={styles.Competitor0Avatar} />
      <span className={styles.Separator}>vs.</span>
      <FlagCircle code={competitor1.country_code} size="1.5rem" className={styles.Competitor1Avatar} />
      <div className={styles.Competitor1}>
        Kingdom of the Netherlands
      </div>
    </div>
  );
};