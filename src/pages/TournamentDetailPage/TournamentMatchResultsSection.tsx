import { Card } from '~/components/generic/Card';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';

import styles from './TournamentMatchResultsSection.module.scss';

export const TournamentMatchResultsSection = (): JSX.Element => (
  <Card className={styles.Root} title="Match Results" disablePadding>
    <div className={styles.Controls}>
      <Label>Round</Label>
      <InputSelect options={[{ value: 'all', label: 'All' }, { value: 'current', label: 'Current' }, '-', { value: 'round_0', label: 'Round 1' }]} />
    </div>
    <ScrollArea indicatorBorder="top">
      <div className={styles.ItemList}>
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
        <MatchResultCard />
      </div>
    </ScrollArea>
  </Card>
);