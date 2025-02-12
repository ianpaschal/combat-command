import { useState } from 'react';

import { Card } from '~/components/generic/Card';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';
import { useFetchMatchResultList } from '~/services/matchResults/useFetchMatchResultList';

import styles from './TournamentMatchResultsSection.module.scss';

export interface TournamentMatchResultsSectionProps {
  tournamentId: string;
}

export const TournamentMatchResultsSection = ({
  tournamentId,
}: TournamentMatchResultsSectionProps): JSX.Element => {
  const [round, setRound] = useState<number | undefined>(undefined);
  const { data: matches } = useFetchMatchResultList({ tournamentId, round });

  const roundOptions = [...new Set(
    (matches || []).map(
      (match) => match.pairing?.round_index,
    ).filter(
      (roundIndex) => roundIndex !== undefined,
    ),
  )].map(round => ({
    value: round,
    label: `Round ${round + 1}`,
  }));

  const handleChangeRound = (value: null | number | string | undefined): void => {
    if (typeof value === 'number') {
      setRound(value);
    }
  };
  return (
    <Card title="Match Results" disablePadding>
      {roundOptions.length > 1 && (
        <div className={styles.Controls}>
          <Label>Round</Label>
          <InputSelect options={roundOptions} value={round} onChange={handleChangeRound} disabled={roundOptions.length < 2} />
        </div>
      )}
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