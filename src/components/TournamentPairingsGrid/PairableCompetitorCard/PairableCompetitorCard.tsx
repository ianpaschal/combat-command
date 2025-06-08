import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { TournamentCompetitorId } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';

import styles from './PairableCompetitorCard.module.scss';

type PairableCompetitorCardRef = ElementRef<typeof motion.div>;
type PairableCompetitorCardProps = ComponentPropsWithoutRef<typeof motion.div> & {
  competitorId: TournamentCompetitorId;
  rank: number | null;
  className?: string;
};

export const PairableCompetitorCard = forwardRef<PairableCompetitorCardRef, PairableCompetitorCardProps>(({
  className,
  competitorId,
  rank,
  ...props
}, ref) => {
  const { data: competitor, loading } = useGetTournamentCompetitor({ id: competitorId });
  return (
    <motion.div ref={ref} className={clsx(styles.PairableCompetitorCard, className)} {...props}>
      <IdentityBadge competitor={competitor} loading={loading} className={styles.PairableCompetitorCard_Identity} />
      <div className={styles.PairableCompetitorCard_Rank}>
        {rank === null ? '-' : rank + 1}
      </div>
    </motion.div>
  );
});
