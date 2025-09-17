import clsx from 'clsx';
import { Construction, Download } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { Button } from '~/components/generic/Button';
import { Card, CardHeader } from '~/components/generic/Card';
import { TournamentExportDataDialog, useTournamentExportDataDialog } from '~/pages/TournamentDetailPage/components/TournamentExportDataDialog';

export interface TournamentStatsCardProps {
  className?: string;
}

export const TournamentStatsCard = ({
  className,
}: TournamentStatsCardProps): JSX.Element => {
  const user = useAuth();
  const { open: openTournamentExportDataDialog } = useTournamentExportDataDialog();
  return (
    <>
      <Card className={clsx(className)}>
        <CardHeader title="Stats">
          {!!user && (
            <Button
              key="export-data"
              icon={<Download />}
              text="Export Data"
              onClick={openTournamentExportDataDialog}
            />
          )}
        </CardHeader>
        <EmptyState icon={<Construction />} message="Under Construction" />
      </Card>
      <TournamentExportDataDialog />
    </>
  );
};
