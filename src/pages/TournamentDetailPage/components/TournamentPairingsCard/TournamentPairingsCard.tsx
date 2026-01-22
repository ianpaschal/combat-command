import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { Zap } from 'lucide-react';

import { EmptyState } from '~/components/EmptyState';
import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { useConfigureRoundAction } from '~/components/TournamentProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings';
import { TournamentDetailCard } from '../TournamentDetailCard';
import { getTournamentPairingTableConfig } from './TournamentPairingsCard.utils';

import styles from './TournamentPairingsCard.module.scss';

export interface TournamentPairingsCardProps {
  className?: string;
}

export const TournamentPairingsCard = ({
  className,
}: TournamentPairingsCardProps): JSX.Element => {
  const navigate = useNavigate();
  const tournament = useTournament();
  const configureRoundAction = useConfigureRoundAction(tournament);

  const roundIndexes = tournament.lastRound !== undefined ? Array.from({
    length: Math.min(tournament.lastRound + 2, tournament.roundCount),
  }, (_, i) => i) : [0];
  const [round, setRound] = useState<number>(roundIndexes.length - 1);

  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId: tournament._id,
    round,
  });

  const columns = getTournamentPairingTableConfig(navigate);
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
            <EmptyState icon={<Zap />}>
              {configureRoundAction && (
                <Button
                  text={configureRoundAction.label}
                  onClick={configureRoundAction.handler}
                />
              )}
            </EmptyState>
          ) : (
            <Table className={styles.TournamentPairingsCard_Table} columns={columns} rows={rows} />
          )
        )}
      </TournamentDetailCard>
    </>
  );
};
