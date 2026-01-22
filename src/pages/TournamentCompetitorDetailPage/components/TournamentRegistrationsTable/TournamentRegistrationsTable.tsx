import { ColumnDef, Table } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { ShieldUser } from 'lucide-react';

import { TournamentRegistration } from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournamentCompetitor } from '~/components/TournamentCompetitorProvider';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRegistrationActiveToggle, TournamentRegistrationContextMenu } from '~/components/TournamentRegistrationProvider';

import styles from './TournamentRegistrationsTable.module.scss';

export interface TournamentRegistrationsTableProps {
  className?: string;
  registrations: TournamentRegistration[];
}

export const TournamentRegistrationsTable = ({
  className,
  registrations,
}: TournamentRegistrationsTableProps): JSX.Element => {
  const tournament = useTournament();
  const tournamentCompetitor = useTournamentCompetitor();
  return (
    <Table
      className={clsx(styles.TournamentRegistrationsTable, className)}
      rows={registrations}
      columns={[
        {
          key: 'active',
          label: 'Active',
          renderCell: (r) => (
            <TournamentRegistrationActiveToggle tournamentRegistration={r} />
          ),
        },
        {
          key: 'identity',
          label: 'Player',
          width: tournament.useTeams ? 'auto' : '1fr',
          xAlign: 'left',
          renderCell: ({ user }) => (
            <IdentityBadge user={user} />
          ),
        },
        ...(tournament.useTeams ? [
          {
            key: 'isCaptain',
            width: '1fr',
            renderCell: ({ user }) => user._id === tournamentCompetitor.captainUserId ? (
              <InfoPopover content="Captain">
                <ShieldUser className={styles.TournamentRegistrationsTable_CaptainIcon} />
              </InfoPopover>
            ) : null,
          } as ColumnDef<TournamentRegistration>,
        ] : []),
        // {
        //   key: 'lists',
        //   label: 'List',
        //   renderCell: (row) => {
        //     const isCaptain = user && (tournamentCompetitors ?? []).find((c) => c._id === row.tournamentCompetitorId)?.registrations.find((r) => r.userId === user._id);
        //     return (
        //       <TournamentRegistrationListButton tournamentRegistration={row} deadline={Date.now() - 3600} />
        //     );
        //   },
        // },
        {
          key: 'actions',
          renderCell: (r) => (
            <TournamentRegistrationContextMenu tournamentRegistration={r} />
          ),
        },
      ]}
    />
  );
};
