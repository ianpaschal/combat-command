import { useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { Spinner } from '~/components/generic/Spinner';
import { useTournament } from '~/components/TournamentProvider';
import { useExportFowV4TournamentMatchData } from '~/services/tournaments';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';
import { useTournamentExportDataDialog } from './TournamentExportDataDialog.hooks';

import styles from './TournamentExportDataDialog.module.scss';

export const TournamentExportDataDialog = (): JSX.Element => {
  const tournament = useTournament();
  const { id, close } = useTournamentExportDataDialog();
  const { action: exportData, loading } = useExportFowV4TournamentMatchData();

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleRequestUrl = async (): Promise<void> => {
    const url = await exportData({ tournamentId: tournament._id });
    // TODO: Show error if url is missing
    if (url) {
      setDownloadUrl(url);
    }
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

  return (
    <ControlledDialog id={id} disabled={loading} width="small" onCloseComplete={handleCloseComplete}>
      <DialogHeader title="Export Tournament Data" onCancel={close} />
      <div className={styles.TournamentExportDataDialog_Content}>
        {downloadUrl ? (
          <Button onClick={handleDownload} disabled={loading}>
            <Download />Download
          </Button>
        ) : (
          <Button onClick={handleRequestUrl} disabled={loading}>
            {loading && (
              <Spinner />
            )}
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
