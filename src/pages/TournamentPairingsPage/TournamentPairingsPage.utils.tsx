import { ReactElement } from 'react';
import { UseFormReset } from 'react-hook-form';
import { UniqueIdentifier } from '@dnd-kit/core';

import {
  TournamentCompetitor,
  TournamentCompetitorId,
  TournamentPairingOptions,
  TournamentPairingStatus,
  validateTournamentPairing,
} from '~/api';
import { FactionIndicator } from '~/components/FactionIndicator';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorIdentity } from '~/components/TournamentCompetitorIdentity';
import { FormData, TournamentPairingFormItem } from './TournamentPairingsPage.schema';

import styles from './TournamentPairingsPage.module.scss';

export const updatePairings = (items: UniqueIdentifier[], reset: UseFormReset<FormData>): void => reset(({ pairings }) => ({
  pairings: pairings.map((p, i) => {
    const tournamentCompetitor0Id = items[i * 2] === 'bye' ? null : items[i * 2] as TournamentCompetitorId;
    const tournamentCompetitor1Id = items[i * 2 + 1] === 'bye' ? null : items[i * 2 + 1] as TournamentCompetitorId;
    return {
      ...p,
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
    result.push(pairing.tournamentCompetitor0Id ?? 'bye');
    result.push(pairing.tournamentCompetitor1Id ?? 'bye');
  }
  return result;
};

/**
 * Validates all pairings and returns statuses for each.
 *
 * @param rankedCompetitors - List of all competitors
 * @param pairings - List of pairings to validate
 * @returns Array of TournamentPairingStatus for each pairing
 */
export const getPairingsStatuses = (
  options: TournamentPairingOptions,
  rankedCompetitors: TournamentCompetitor[],
  pairings: TournamentPairingFormItem[],
): TournamentPairingStatus[] => {
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
    const competitorA = rankedCompetitors.find((c) => c._id === pairing.tournamentCompetitor0Id) ?? null;
    const competitorB = rankedCompetitors.find((c) => c._id === pairing.tournamentCompetitor1Id) ?? null;

    // Check duplicate table assignments first (requires context of all pairings)
    if (hasDuplicateTableAssignments[i]) {
      return {
        status: 'error',
        message: 'This table is assigned more than once.',
      };
    }

    // Use universal validator for all other checks
    return validateTournamentPairing(options, competitorA, competitorB, pairing.table);
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
        <TournamentCompetitorIdentity
          className={styles.TournamentPairingsPage_Form_CompetitorCard_Identity}
          placeholder={{ displayName: 'Bye' }}
        />
      </div>
    );
  }

  const rank = (rankedCompetitor.rank ?? -1) < 0 ? '-' : rankedCompetitor.rank + 1;

  return (
    <div className={styles.TournamentPairingsPage_Form_CompetitorCard}>
      <div className={styles.TournamentPairingsPage_Form_CompetitorCard_Rank}>
        {rank}
      </div>
      <TournamentCompetitorIdentity
        className={styles.TournamentPairingsPage_Form_CompetitorCard_Identity}
        tournamentCompetitor={rankedCompetitor}
      />
      <FactionIndicator {...rankedCompetitor.details} />
    </div>
  );
};
