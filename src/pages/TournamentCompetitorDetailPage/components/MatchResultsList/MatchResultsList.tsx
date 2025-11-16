import { useState } from 'react';
import clsx from 'clsx';
import { Swords } from 'lucide-react';

import { TournamentCompetitorId } from '~/api';
import { EmptyState } from '~/components/EmptyState';
import { InputSelect } from '~/components/generic/InputSelect';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PaginatedList } from '~/components/PaginatedList';
import { useTournament } from '~/components/TournamentProvider';
import { useGetMatchResults } from '~/services/matchResults';

import styles from './MatchResultsList.module.scss';

export interface MatchResultsListProps {
  className?: string;
  tournamentCompetitorId?: TournamentCompetitorId;
}

export const MatchResultsList = ({
  className,
  // tournamentCompetitorId,
}: MatchResultsListProps): JSX.Element => {
  const tournament = useTournament();
  const [round, setRound] = useState<number>(tournament.lastRound ?? 0);
  const roundOptions = Array.from({
    length: (tournament.currentRound ?? tournament.lastRound ?? 0) + 1,
  }, (_, i) => ({
    label: `Round ${i + 1}`,
    value: i,
  }));

  const query = useGetMatchResults({});

  return (
    <div className={clsx(styles.MatchResultsList, className)}>
      <div className={styles.MatchResultsList_Header}>
        <InputSelect
          options={roundOptions}
          value={round}
          onChange={(selected) => setRound(selected as number)}
          disabled={query.loading}
        />
      </div>
      <ScrollArea indicators={{ top: { border: true } }}>
        <PaginatedList
          className={styles.MatchResultsList_List}
          query={query}
          render={(matchResult) => <MatchResultCard matchResult={matchResult} />}
          emptyState={<EmptyState icon={<Swords />} />}
        />
      </ScrollArea>
    </div>
  );
};
