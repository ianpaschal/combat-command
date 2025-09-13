import { ReactElement } from 'react';
import { UseFormReset } from 'react-hook-form';
import { Over, UniqueIdentifier } from '@dnd-kit/core';
import { CircleDashed } from 'lucide-react';
import { nanoid } from 'nanoid';

import {
  DraftTournamentPairing,
  Tournament,
  TournamentCompetitor,
  TournamentCompetitorId,
  TournamentPairing,
} from '~/api';
import { Pulsar } from '~/components/generic/Pulsar';
import { IdentityBadge } from '~/components/IdentityBadge';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { FormData, TournamentPairingFormItem } from './TournamentPairingsPage.schema';

import styles from './TournamentPairingsPage.module.scss';

export const updatePairings = (items: UniqueIdentifier[], reset: UseFormReset<FormData>): void => reset(({ pairings }) => ({
  pairings: pairings.map((p, i) => {
    const tournamentCompetitor0Id = items[i * 2] === 'bye' ? null : items[i * 2] as TournamentCompetitorId;
    const tournamentCompetitor1Id = items[i * 2 + 1] === 'bye' ? null : items[i * 2 + 1] as TournamentCompetitorId;
    return {
      table: p.table,
      tournamentCompetitor0Id,
      tournamentCompetitor1Id,
    };
  }),
}), {
  keepDefaultValues: true,
});

/**
 * 
 * @param pairings 
 * @returns 
 */
export const flattenPairings = (
  pairings: TournamentPairingFormItem[] = [],
): UniqueIdentifier[] => {
  const result: UniqueIdentifier[] = [];
  for (const pairing of pairings) {
    result.push(pairing.tournamentCompetitor0Id ?? nanoid(6));
    result.push(pairing.tournamentCompetitor1Id ?? nanoid(6));
  }
  return result;
};

export type PairingStatus = {
  status: 'error' | 'warning' | 'ok';
  message: string;
};

/**
 * 
 * @param rankedCompetitors 
 * @param pairings 
 * @returns 
 */
export const getPairingsStatuses = (
  rankedCompetitors: TournamentCompetitor[],
  pairings: TournamentPairingFormItem[],
): PairingStatus[] => {
  const tableCount: Record<number, number> = {};

  // First pass: Count table numbers:
  for (const pairing of pairings) {
    // Count up table assignments which are not null or "auto" (-1):
    if (pairing.table !== null && pairing.table !== -1) {
      tableCount[pairing.table] = (tableCount[pairing.table] || 0) + 1;
    }
  }

  // Second pass: Mark duplicates:
  const hasDuplicateTableAssignments = pairings.map((pairing) => (
    pairing.table !== null && tableCount[pairing.table] > 1
  ));

  return pairings.map((pairing, i) => {
    const competitorA = rankedCompetitors.find((c) => c._id === pairing.tournamentCompetitor0Id);
    const competitorB = rankedCompetitors.find((c) => c._id === pairing.tournamentCompetitor1Id);

    if (hasDuplicateTableAssignments[i]) {
      return {
        status: 'error',
        message: 'This table is assigned more than once.',
      };
    }
    if (competitorA && competitorB) {
      if (
        (competitorA?.opponentIds ?? []).includes(competitorB._id) ||
        (competitorB?.opponentIds ?? []).includes(competitorA._id)
      ) {
        return {
          status: 'error',
          message: 'These opponents have already played each other.',
        };
      }
    }
    if (competitorA && !competitorB && (competitorA?.byeRounds ?? []).length) {
      const displayName = getTournamentCompetitorDisplayName(competitorA);
      return {
        status: 'warning',
        message: `${displayName} has already had a bye.`,
      };
    }
    if (!competitorA && competitorB && (competitorB?.byeRounds ?? []).length) {
      const displayName = getTournamentCompetitorDisplayName(competitorB);
      return {
        status: 'warning',
        message: `${displayName} has already had a bye.`,
      };
    }
    if (pairing.table !== null && pairing.table > -1) {
      if (competitorA && (competitorA?.playedTables ?? []).includes(pairing.table)) {
        const displayName = getTournamentCompetitorDisplayName(competitorA);
        return {
          status: 'warning',
          message: `${displayName} has already played this table.`,
        };
      }
      if (competitorB && (competitorB?.playedTables ?? []).includes(pairing.table)) {
        const displayName = getTournamentCompetitorDisplayName(competitorB);
        return {
          status: 'warning',
          message: `${displayName} has already played this table.`,
        };
      }
    }

    return {
      status: 'ok',
      message: 'Pairing is valid.',
    };
  });
};

/**
 * 
 * @param id 
 * @param state 
 * @returns 
 */
export const renderCompetitorCard = (
  id: UniqueIdentifier,
  state: {
    activeId: UniqueIdentifier | null,
    isActive: boolean,
    isOverlay: boolean,
  },
  tournamentCompetitors: TournamentCompetitor[],
): ReactElement => {

  if (!tournamentCompetitors) {
    return (
      <div className={styles.TournamentPairingsPage_Form_CompetitorCard}>
        <IdentityBadge loading />
      </div>
    );
  }

  const rankedCompetitor = tournamentCompetitors.find((c) => c._id === id);

  if (!rankedCompetitor) {
    return (
      <div className={styles.TournamentPairingsPage_Form_CompetitorCard}>
        <IdentityBadge placeholder={{ displayName: 'Empty', icon: <CircleDashed /> }} />
      </div>
    );
  }

  const isValid = !!state.activeId && !(rankedCompetitor?.opponentIds ?? []).includes(state.activeId as TournamentCompetitorId);

  return (
    <div className={styles.TournamentPairingsPage_Form_CompetitorCard}>
      <IdentityBadge competitor={rankedCompetitor} />
      <div>{rankedCompetitor.rank !== undefined ? rankedCompetitor.rank + 1 : '-'}</div>
      <Pulsar color={isValid ? 'green' : 'red'} visible={!!state.activeId && !state.isActive} />
    </div>
  );
};

export const setPairings = (
  competitors: TournamentCompetitor[],
  tableCount: number,
  pairings?: (TournamentPairing | DraftTournamentPairing)[],
): DraftTournamentPairing[] => {
  const existingPairings = [...(pairings ?? [])];
  const draftPairings: DraftTournamentPairing[] = [];

  const unpairedCompetitorIds = competitors.filter((v) => v.active).map((v) => v._id);

  while (draftPairings.length < tableCount) {
    const existingPairing = existingPairings.pop();
    if (existingPairing) {
      const ids = getDraftIds(existingPairing);
      ids.forEach((v) => {
        if (v) {
          unpairedCompetitorIds.splice(unpairedCompetitorIds.indexOf(v), 1);
        }
      });
      draftPairings.push({
        table: existingPairing?.table ?? -1,
        tournamentCompetitor0Id: ids[0],
        tournamentCompetitor1Id: ids[1],
      });
    } else {
      draftPairings.push({
        table: -1,
        tournamentCompetitor0Id: unpairedCompetitorIds.pop() ?? null,
        tournamentCompetitor1Id: unpairedCompetitorIds.pop() ?? null,
      });
    }
  }
  return draftPairings;
};

export const isTournamentPairing = (
  pairing: TournamentPairing | DraftTournamentPairing,
): pairing is TournamentPairing => (
  'tournamentCompetitor0' in pairing && 'tournamentCompetitor1' in pairing
);

export const getDraftIds = (
  pairing?: TournamentPairing | DraftTournamentPairing,
): [TournamentCompetitorId | null, TournamentCompetitorId | null] => {
  if (!pairing) {
    return [null, null];
  }
  if (isTournamentPairing(pairing)) {
    return [
      pairing.tournamentCompetitor0?.active ? pairing.tournamentCompetitor0Id : null,
      pairing.tournamentCompetitor1?.active ? pairing.tournamentCompetitor1Id : null,
    ];
  }
  return [
    pairing.tournamentCompetitor0Id ?? null,
    pairing.tournamentCompetitor1Id ?? null,
  ];
};

export const createDraftPairings = (
  tableCount: number,
  tournamentCompetitors: TournamentCompetitor[],
  tournamentPairings: (TournamentPairing | DraftTournamentPairing)[],
): DraftTournamentPairing[] => {
  const existingPairings = [...(tournamentPairings ?? [])];
  const draftPairings: DraftTournamentPairing[] = [];

  const unpairedCompetitorIds = tournamentCompetitors.filter((v) => v.active).map((v) => v._id);

  while (draftPairings.length < tableCount) {
    const existingPairing = existingPairings.pop();
    if (existingPairing) {
      const ids = getDraftIds(existingPairing);
      ids.forEach((v) => {
        if (v) {
          unpairedCompetitorIds.splice(unpairedCompetitorIds.indexOf(v), 1);
        }
      });
      draftPairings.push({
        table: existingPairing?.table ?? -1,
        tournamentCompetitor0Id: ids[0],
        tournamentCompetitor1Id: ids[1],
      });
    } else {
      draftPairings.push({
        table: -1,
        tournamentCompetitor0Id: unpairedCompetitorIds.pop() ?? null,
        tournamentCompetitor1Id: unpairedCompetitorIds.pop() ?? null,
      });
    }
  }
  return draftPairings;
};

export const getSourceSlot = (pairings: DraftTournamentPairing[], id: UniqueIdentifier): {
  row: number;
  field: keyof Omit<DraftTournamentPairing, 'table'>;
} => {
  for (let i = 0; i < pairings.length; i += 1) {
    const pairing = pairings[i];
    if (pairing.tournamentCompetitor0Id === id) {
      return {
        row: i,
        field: 'tournamentCompetitor0Id',
      };
    }
    if (pairing.tournamentCompetitor1Id === id) {
      return {
        row: i,
        field: 'tournamentCompetitor1Id',
      };
    }
  }
  throw new Error('Error');
};

export const getTargetSlot = (over: Over | null): {
  row: number;
  field: keyof Omit<DraftTournamentPairing, 'table'>;
} => {
  if (!over || typeof over.id !== 'string') {
    throw new Error('Error');
  }
  const [row, col] = over.id.split('_');
  return {
    row: parseInt(row, 10),
    field: col as keyof Omit<DraftTournamentPairing, 'table'>,
  };
};
