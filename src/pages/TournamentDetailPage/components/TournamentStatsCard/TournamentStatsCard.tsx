import clsx from 'clsx';
import { Download } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Card, CardHeader } from '~/components/generic/Card';
// import { useTournament } from '~/components/TournamentProvider';
import { TournamentExportDataDialog, useTournamentExportDataDialog } from '~/pages/TournamentDetailPage/components/TournamentExportDataDialog';

export interface TournamentStatsCardProps {
  className?: string;
}

export const TournamentStatsCard = ({
  className,
}: TournamentStatsCardProps): JSX.Element => {
  const user = useAuth();
  // const tournament = useTournament();
  const { open: openTournamentExportDataDialog } = useTournamentExportDataDialog();
  return (
    <>
      <Card className={clsx(className)}>
        <CardHeader title="Stats">
          {!!user && (
            <Button key="export-data" onClick={openTournamentExportDataDialog}>
              <Download />Export Data
            </Button>
          )}
        </CardHeader>
        Stats go here
      </Card>
      <TournamentExportDataDialog />
    </>
  );
};
