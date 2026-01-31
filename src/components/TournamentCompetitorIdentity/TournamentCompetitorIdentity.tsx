import { MouseEvent, ReactElement } from 'react';
import { getStyleClassNames } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { Ghost, Users } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { TournamentCompetitorAvatar } from '~/components/IdentityBadge';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';

import styles from './TournamentCompetitorIdentity.module.scss';

export interface TournamentCompetitorIdentityProps {
  className?: string;
  loading?: boolean;
  placeholder?: Pick<TournamentCompetitor, 'displayName'>;
  tournamentCompetitor?: TournamentCompetitor | null;
  tournamentCompetitorId?: TournamentCompetitorId;
  onClick?: (id?: TournamentCompetitorId) => void;
  size?: 'small' | 'normal' | 'large';
}

export const TournamentCompetitorIdentity = ({
  className,
  loading = false,
  placeholder,
  tournamentCompetitor,
  tournamentCompetitorId,
  onClick,
  size = 'normal',
}: TournamentCompetitorIdentityProps): JSX.Element => {
  const fetch = !tournamentCompetitor && tournamentCompetitorId;
  const { data, loading: dataLoading } = useGetTournamentCompetitor(fetch ? {
    id: tournamentCompetitorId,
  } : 'skip');

  const showLoading = dataLoading || loading;

  const { displayName } = tournamentCompetitor ?? data ?? placeholder ?? { displayName: 'Unknown Competitor', details: { alignments: [], factions: [] } };

  let avatar: ReactElement | null;

  if (tournamentCompetitor || data) {
    avatar = (
      <TournamentCompetitorAvatar
        className={clsx(getStyleClassNames({ size: size }), styles.TournamentCompetitorIdentity_Avatar)}
        data-size={size}
        tournamentCompetitor={tournamentCompetitor ?? data}
      />
    );
  } else {
    avatar = (
      <Avatar
        className={clsx(getStyleClassNames({ size: size }), styles.TournamentCompetitorIdentity_Avatar)}
        data-size={size}
        icon={placeholder ? <Users /> : <Ghost />}
        muted
      />
    );
  }

  const showDisabled = !tournamentCompetitor && !data;

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault(); // Prevent submit if in a form
    onClick?.();
  };

  return (
    <button
      className={clsx(...getStyleClassNames({
        variant: 'ghost',
        corners: 'normal',
      }), styles.TournamentCompetitorIdentity, className)}
      onClick={handleClick}
      disabled={showDisabled}
      data-clickable={!!onClick}
    >
      {showLoading ? (
        <>
          <Avatar
            className={clsx(getStyleClassNames({ size: size }), styles.TournamentCompetitorIdentity_Avatar)}
            loading
            data-size={size}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {avatar}
          <span>{displayName}</span>
        </>
      )}
    </button>
  );
};
