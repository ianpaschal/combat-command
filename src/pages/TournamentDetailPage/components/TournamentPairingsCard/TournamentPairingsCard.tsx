import {
  ReactElement,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { Zap } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { ConfirmConfigureRoundDialog, ConfirmConfigureRoundDialogHandle } from '~/components/TournamentContextMenu';
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
  const { _id: tournamentId, lastRound } = useTournament();

  const roundIndexes = lastRound !== undefined ? Array.from({ length: lastRound + 2 }, (_, i) => i) : [0];
  const [round, setRound] = useState<number>(roundIndexes.length - 1);
  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId,
    round,
  });

  const confirmConfigureRoundDialogRef = useRef<ConfirmConfigureRoundDialogHandle>(null);
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

  const handleConfigure = (): void => {
    confirmConfigureRoundDialogRef.current?.open();
  };

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
              <Button onClick={handleConfigure}>
                {`Configure Round ${round + 1}`}
              </Button>
            </TournamentTabEmptyState>
          ) : (
            <Table columns={columns} rows={rows} rowClassName={styles.TournamentPairingsCard_Row} />
          )
        )}

      </TournamentDetailCard>
      <ConfirmConfigureRoundDialog ref={confirmConfigureRoundDialogRef} />
    </>
  );
};
