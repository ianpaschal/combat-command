import { ReactNode } from 'react';
import { v4 } from 'uuid';

import { Droppable } from '~/pages/TournamentCreatePairingsPage/Droppable';
import styles from '~/pages/TournamentCreatePairingsPage/TournamentCreatePairingsPage.module.scss';

// List of 20 unique first names
const names = [
  'Valerie', 'Ronald', 'Jessica', 'Edward', 'Michael',
  'Sarah', 'Emily', 'James', 'Alice', 'Laura',
  'Oliver', 'Sophia', 'Daniel', 'Charlotte', 'William',
  'Amelia', 'Henry', 'Mia', 'Elijah', 'Isabella',
];

// Generate the list of competitors
export const generateCompetitors = () => {
  console.log('regenerating competitors');
  const competitors = names.map((name, rank) => ({
    id: v4(),
    rank,
    name,
    previousCompetitors: [],
  }));

  competitors.forEach(competitor => {
    let availableIds = competitors
      .filter(c => c.id !== competitor.id) // Exclude the current competitor
      .map(c => c.id);

    // Select 3 unique IDs randomly
    while (competitor.previousCompetitors.length < 3) {
      const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
      if (!competitor.previousCompetitors.includes(randomId)) {
        competitor.previousCompetitors.push(randomId);
        availableIds = availableIds.filter((id) => id !== randomId);
      }
    }
  });

  return competitors;
};

export const createPairingRows = (competitorCount: number): ReactNode[] => {
  const rows = [];

  for (let i = 0; i < competitorCount; i += 2) {
    const id = `row-${i / 2}`;
    rows.push(
      <div key={id} className={styles.PairingRow}>
        <Droppable id={`slot-${i}`}>
          {parent === `${id}-a` ? draggableMarkup : undefined}
        </Droppable>
        <span className={styles.PairingRowSeparator}>vs.</span>
        <Droppable id={`slot-${i + 1}`}>
          {parent === `${id}-b` ? draggableMarkup : undefined}
        </Droppable>
      </div>,
    );
  }

  return rows;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderCompetitor = (competitors: any[], pairings: any[], slotId: string) => {

  pairings.find((pairing) => pairing.competitors.includes());
};