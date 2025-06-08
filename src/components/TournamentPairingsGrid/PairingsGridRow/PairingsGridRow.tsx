import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, CircleX } from 'lucide-react';

import { DraftTournamentPairing, TournamentCompetitorRanked } from '~/api';
import { Draggable } from '../Draggable';
import { Droppable } from '../Droppable/Droppable';
import { PairableCompetitorCard } from '../PairableCompetitorCard';
import { checkDraftPairingIsValid } from './PairingsGridRow.utils';

import styles from './PairingsGridRow.module.scss';

const iconVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.05 } },
};

export interface PairingsGridRowProps {
  index: number;
  pairing?: Partial<DraftTournamentPairing>;
  activeCompetitor?: TournamentCompetitorRanked | null;
}

export const PairingsGridRow = ({
  index,
  pairing,
  activeCompetitor,
}: PairingsGridRowProps): JSX.Element => {
  const isValid = pairing && pairing[0] && pairing[1] ? checkDraftPairingIsValid(pairing) : undefined;
  return (
    <div className={styles.PairingsGridRow}>
      <div className={styles.PairingsGridRow_Indicator} data-valid={isValid}>
        <AnimatePresence mode="wait">
          {isValid && (
            <motion.div
              key="check"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CircleCheck />
            </motion.div>
          )}
          {isValid === false && (
            <motion.div
              key="x"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CircleX />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {[0, 1].map((j) => {
        const competitor = pairing && pairing[j];
        const slotId = `${index}_${j}`;
        const oppositeCompetitor = j === 0 ? (pairing && pairing[1]) : (pairing && pairing[0]);
        const invalid = !!(activeCompetitor && oppositeCompetitor) && activeCompetitor.opponentIds.includes(oppositeCompetitor.id);
        const style = {
          gridColumn: j === 0 ? '1 / 2' : '3 / 4',
          gridRow: '1 / 2',
        };
        return (
          <Droppable key={slotId} id={slotId} invalid={invalid} style={style} className={styles.PairingsGridRow_Droppable}>
            {competitor && (
              <Draggable id={competitor.id} key={competitor.id}>
                <PairableCompetitorCard competitorId={competitor.id} rank={competitor.rank} />
              </Draggable>
            )}
          </Droppable>
        );
      })}
    </div>
  );
};
