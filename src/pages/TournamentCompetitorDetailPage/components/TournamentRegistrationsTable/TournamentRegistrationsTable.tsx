import { Table } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';

import { TournamentRegistration } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import {
  TournamentRegistrationActiveToggle,
  TournamentRegistrationContextMenu,
  TournamentRegistrationProvider,
} from '~/components/TournamentRegistrationProvider';

import styles from './TournamentRegistrationsTable.module.scss';

export interface TournamentRegistrationsTableProps {
  className?: string;
  registrations: TournamentRegistration[];
}

export const TournamentRegistrationsTable = ({
  className,
  registrations,
}: TournamentRegistrationsTableProps): JSX.Element => (
  <Table
    className={clsx(styles.TournamentRegistrationsTable, className)}
    rows={registrations}
    columns={[
      {
        key: 'active',
        label: 'Active',
        renderCell: (r) => (
          <TournamentRegistrationProvider tournamentRegistration={r}>
            <TournamentRegistrationActiveToggle />
          </TournamentRegistrationProvider>
        ),
      },
      {
        key: 'identity',
        label: 'Player',
        width: '1fr',
        xAlign: 'left',
        renderCell: ({ user }) => (
          <IdentityBadge user={user} />
        ),
      },
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
          <TournamentRegistrationProvider tournamentRegistration={r}>
            <TournamentRegistrationContextMenu />
          </TournamentRegistrationProvider>
        ),
      },
    ]}
  />
);
