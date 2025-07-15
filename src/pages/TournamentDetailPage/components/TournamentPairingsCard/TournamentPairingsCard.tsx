import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import { Zap } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournamentActions } from '~/components/TournamentActionsProvider/TournamentActionsProvider.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings';
import { TournamentDetailCard } from '../TournamentDetailCard';
import { TournamentTabEmptyState } from '../TournamentTabEmptyState';
import { getTournamentPairingTableConfig } from './TournamentPairingsCard.utils';

import styles from './TournamentPairingsCard.module.scss';

export interface TournamentPairingsCardProps {
  className?: string;
}

export const TournamentPairingsCard = ({
  className,
}: TournamentPairingsCardProps): JSX.Element => {
  const { _id: tournamentId, lastRound, roundCount } = useTournament();
  const actions = useTournamentActions();

  const roundIndexes = lastRound !== undefined ? Array.from({
    length: Math.min(lastRound + 2, roundCount),
  }, (_, i) => i) : [0];
  const [round, setRound] = useState<number>(roundIndexes.length - 1);

  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId,
    round,
  });

  const columns = getTournamentPairingTableConfig();
  const rows = (tournamentPairings || []);

  const showEmptyState = !loading && !rows.length;
  const showLoadingState = loading;

  const roundOptions = roundIndexes.map((i) => ({
    label: `Round ${i + 1}`,
    value: i,
  }));

  const getPrimaryButtons = (): ReactElement[] | undefined => [
    <InputSelect
      options={roundOptions}
      value={round}
      onChange={(selected) => setRound(selected as number)}
      disabled={showLoadingState || roundIndexes.length < 2}
    />,
  ];

  return (
    <>
      <TournamentDetailCard
        className={clsx(styles.TournamentPairingsCard, className)}
        title="Pairings"
        buttons={getPrimaryButtons()}
      >
        {showLoadingState ? (
          <div className={styles.TournamentPairingsCard_EmptyState}>
            Loading...
          </div>
        ) : (
          showEmptyState ? (
            <TournamentTabEmptyState icon={<Zap />}>
              {actions?.configureRound && (
                <Button onClick={actions.configureRound.handler}>
                  {actions.configureRound.label}
                </Button>
              )}
            </TournamentTabEmptyState>
          ) : (
            <Table columns={columns} rows={rows} rowClassName={styles.TournamentPairingsCard_Row} />
          )
        )}
      </TournamentDetailCard>
    </>
  );
};
