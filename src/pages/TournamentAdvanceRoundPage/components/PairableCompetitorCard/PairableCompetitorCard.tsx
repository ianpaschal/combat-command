import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import {
  TournamentCompetitor,
  TournamentCompetitorId,
  TournamentId,
} from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';

import styles from './PairableCompetitorCard.module.scss';

type PairableCompetitorCardRef = ElementRef<typeof motion.div>;
type PairableCompetitorCardProps = ComponentPropsWithoutRef<typeof motion.div> & {
  competitorId: TournamentCompetitorId;
  rank: number;
  className?: string;
};

export const PairableCompetitorCard = forwardRef<PairableCompetitorCardRef, PairableCompetitorCardProps>(({
  className,
  competitorId,
  rank,
  ...props
}, ref) => {
  const ids = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'];
  const countryOptions = getEtcCountryOptions().map((option) => option.value);
  const teamIndex = ids.indexOf(competitorId);
  const competitor: TournamentCompetitor = {
    _id: competitorId,
    _creationTime: 0,
    teamName: countryOptions[teamIndex],
    players: [
      {
        active: true,
        user: null,
      },
      {
        active: true,
        user: null,
      },
    ],
    tournamentId: 'foo' as TournamentId,
  };
  return (
    <motion.div ref={ref} className={clsx(styles.PairableCompetitorCard, className)} {...props}>
      <IdentityBadge competitor={competitor} className={styles.PairableCompetitorCard_Identity} />
      <div className={styles.PairableCompetitorCard_Rank}>
        {rank}
      </div>
    </motion.div>
  );
});
