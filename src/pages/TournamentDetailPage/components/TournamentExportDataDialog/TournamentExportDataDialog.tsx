import { useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { useTournament } from '~/components/TournamentProvider';
import { useExportFowV4TournamentMatchData } from '~/services/tournaments';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';
import { useTournamentExportDataDialog } from './TournamentExportDataDialog.hooks';

export const TournamentExportDataDialog = (): JSX.Element => {
  const tournament = useTournament();
  const { id, close } = useTournamentExportDataDialog();
  const exportData = useExportFowV4TournamentMatchData();

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleRequestUrl = async (): Promise<void> => {
    const url = await exportData({ tournamentId: tournament._id });
    setDownloadUrl(url);
  };

  const handleDownload = async () => {
    if (!downloadUrl) {
      return;
    }
    const response = await fetch(downloadUrl); // or external URL
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const fileName = `${getTournamentDisplayName(tournament).toLowerCase().replace(' ', '_')}_${new Date().toISOString()}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // file name user sees
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleCloseComplete = (): void => {
    setDownloadUrl(null);
  };

  const loading = false;

  return (
    <ControlledDialog id={id} disabled={loading} width="small" onCloseComplete={handleCloseComplete}>
      <DialogHeader title="Create Team" onCancel={close} />
      <div>
        {downloadUrl ? (
          <Button onClick={handleDownload}>
            Download<Download />
          </Button>
        ) : (
          <Button onClick={handleRequestUrl}>
            Prepare Download
          </Button>
        )}
      </div>
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Close</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
