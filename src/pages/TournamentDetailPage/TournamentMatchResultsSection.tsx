import { useState } from 'react';

import { Card } from '~/components/generic/Card';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';
import { useGetMatchesByTournamentId } from '~/services/matchResults/getMatchesByTournamentId';

import styles from './TournamentMatchResultsSection.module.scss';

export interface TournamentMatchResultsSectionProps {
  tournamentId: string;
}

export const TournamentMatchResultsSection = ({
  tournamentId,
}: TournamentMatchResultsSectionProps): JSX.Element => {
  const [round, setRound] = useState<number | null | undefined>(undefined);
  const { data: matches } = useGetMatchesByTournamentId({ tournamentId, round });
  const roundOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Round 1' },
    { value: 1, label: 'Round 2' },
    { value: 2, label: 'Round 3' },
    { value: 3, label: 'Round 4' },
    { value: 4, label: 'Round 5' },
  ];
  return (
    <Card title="Match Results" disablePadding>
      <div className={styles.Controls}>
        <Label>Round</Label>
        <InputSelect options={roundOptions} value={round} onChange={setRound} />
      </div>
      <ScrollArea indicatorBorder="top">
        <div className={styles.ItemList}>
          {(matches || []).map((match) => (
            <MatchResultCard key={match.id} matchData={match} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};