import { useWindowWidth } from '@react-hook/window-size/throttled';
import { ChevronRight } from 'lucide-react';

import { ScrollArea } from '~/components/generic/ScrollArea';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings/useGetTournamentPairings';
import { MOBILE_BREAKPOINT } from '~/settings';

import styles from './TournamentPairingsList.module.scss';

export const TournamentPairingsList = () => {

  const { _id: tournamentId, currentRound } = useTournament();

  const { data: tournamentPairings } = useGetTournamentPairings({
    tournamentId,
    round: currentRound,
  });
  const sortedPairings = (tournamentPairings || []).sort((a, b) => {
    if (a.table === null) {
      return 1;
    }
    if (b.table === null) {
      return -1;
    }
    return a.table - b.table;
  });

  const windowWidth = useWindowWidth();
  const orientation = windowWidth <= MOBILE_BREAKPOINT ? 'vertical' : 'horizontal';

  return (
    <div className={styles.TournamentPairingsList}>
      <div
        className={styles.TournamentPairingsList_Header}
        data-orientation={orientation}
      >
        <h3>Table</h3>
        <h3>Pairing</h3>
      </div>
      <ScrollArea>
        <div className={styles.TournamentPairingsList_List}>
          {sortedPairings.map((pairing, i) => (
            <div key={i} className={styles.TournamentPairingsList_Pairing}>
              <div className={styles.TournamentPairingsList_Pairing_Table}>
                {pairing.table !== null ? pairing.table + 1 : '-'}
              </div>
              <div
                className={styles.TournamentPairingsList_Pairing_Competitors}
                data-orientation={orientation}
              >
                <IdentityBadge
                  flipped={orientation === 'horizontal'}
                  competitor={pairing.tournamentCompetitor0}
                />
                <span className={styles.TournamentPairingsList_Pairing_Versus}>
                  VS
                </span>
                {pairing.tournamentCompetitor1 ? (
                  <IdentityBadge competitor={pairing.tournamentCompetitor1} />
                ) : (
                  <IdentityBadge placeholder={{ displayName: 'Bye', icon: <ChevronRight /> }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
