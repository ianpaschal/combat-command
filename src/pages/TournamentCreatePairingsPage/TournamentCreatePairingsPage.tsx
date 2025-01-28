import { useWindowWidth } from '@react-hook/window-size/throttled';

import { Card } from '~/components/generic/Card';
import { Separator } from '~/components/generic/Separator';
import { PageWrapper } from '~/components/PageWrapper';
import { MOBILE_BREAKPOINT } from '~/settings';

import styles from './TournamentCreatePairingsPage.module.scss';

export const TournamentCreatePairingsPage = (): JSX.Element => {
  // const [items, setItems] = useState<{ [key: string]: string[] }>({
  //   droppable1: ['1', '2', '3'],
  //   droppable2: ['4', '5'],
  // });

  const width = useWindowWidth();
  const isMobile = width <= MOBILE_BREAKPOINT;

  return (
    <PageWrapper title="Create Pairings" showBackButton>
      <Card subClassNames={{ body: styles.Pairings }}>
        <h2 className={styles.UnpairedSectionHeading}>Unpaired</h2>
        <div className={styles.UnpairedSection}>
          Unpaired
        </div>
        <Separator className={styles.Separator} orientation={isMobile ? 'horizontal' : 'vertical'} />
        <h2 className={styles.PairedSectionHeading}>Paired</h2>
        <div className={styles.PairedSection}>
          <div className={styles.CompetitorSlot}>Slot</div>
          <span>vs.</span>
          <div className={styles.CompetitorSlot}>Slot</div>
          <div>Ind.</div>
          <div className={styles.CompetitorSlot}>Slot</div>
          <span>vs.</span>
          <div className={styles.CompetitorSlot}>Slot</div>
          <div>Ind.</div>
          <div className={styles.CompetitorSlot}>Slot</div>
          <span>vs.</span>
          <div className={styles.CompetitorSlot}>Slot</div>
          <div>Ind.</div>
          <div className={styles.CompetitorSlot}>Slot</div>
          <span>vs.</span>
          <div className={styles.CompetitorSlot}>Slot</div>
          <div>Ind.</div>
          <div className={styles.CompetitorSlot}>Slot</div>
          <span>vs.</span>
          <div className={styles.CompetitorSlot}>Slot</div>
          <div>Ind.</div>
        </div>
      </Card>
    </PageWrapper>
  );
};
