/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';
import { FileText, Link } from 'lucide-react';

import { StorageId, TournamentRegistrationId } from '~/api';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { useUploadFile } from '~/services/files';
import {
  useCreateList,
  useExtractListData,
  useImportList,
} from '~/services/lists';
import { useListCreateDialog } from './ListCreateDialog.hooks';

import styles from './ListCreateDialog.module.scss';

export interface ListCreateDialogProps {
  className?: string;
  gameSystem: GameSystem;
}

export const ListCreateDialog = ({
  className,
  gameSystem,
}: ListCreateDialogProps): JSX.Element => {
  const { id, close, data } = useListCreateDialog();
  const tournamentRegistrationId = data?.tournamentRegistrationId;

  const tabs = [
    { value: 'pdf', label: 'PDF', icon: <FileText /> },
    { value: 'forces_official', label: 'Link', icon: <Link /> },
  ];
  const [tab, setTab] = useState<string>('pdf');

  // TODO: Maybe someday turn these into form fields?
  const [storageId, setStorageId] = useState<StorageId | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');

  const { mutation: uploadFile } = useUploadFile({
    onSuccess: setStorageId,
  });
  const { action: importList } = useImportList({
    onSuccess: setStorageId,
  });

  const { action: extractListData } = useExtractListData({
    onSuccess: ({ fileType, data }) => {
      setFileType(fileType);
      // Set form values from data
    },
  });

  const { mutation: createList, loading: isCreateListLoading } = useCreateList();

  const actionsDisabled = isCreateListLoading;

  const handleTabChange = (value: string) => {
    // if dirty, show warning dialog
    setTab(value);
  };

  const handleUpload = async (file: Blob): Promise<void> => {
    await uploadFile(file);
  };

  const handleImport = async (identifier: string): Promise<void> => {
    await importList({
      gameSystem,
      url,
    });
  };

  const handleSubmit = (data: object): void => {
    // createList({
    //   data,
    //   gameSystem,
    //   rawStorageId: storageId,
    //   tournamentRegistrationId,
    // });
  };

  return (
    <ControlledDialog id={id} className={clsx(styles.ListCreateDialog, className)}>
      <DialogHeader title="Submit Army List" onCancel={close} />
      <Separator />
      <ScrollArea className={styles.MatchResultCreateDialog_ScrollArea}>
        <Tabs className={styles.TournamentDetailPage_Tabs} value={tab} onValueChange={handleTabChange}>
          <TabsList tabs={tabs} className={styles.TournamentDetailPage_TabBar} />
          <TabsContent value="pdf">
            File upload
          </TabsContent>
          <TabsContent value="forces_official">
            JSON import
          </TabsContent>
        </Tabs>
        {gameSystem === GameSystem.FlamesOfWarV4 && (
          <div>
            <div>
              Extracted data
            </div>
            {fileType === 'pdf' && (
              <div>PDF Preview</div>
            )}
            {fileType === 'json' && (
              <div>JSON Preview</div>
            )}
          </div>
        )}
      </ScrollArea>
      <Separator />
      <DialogActions>
        <Button
          disabled={actionsDisabled}
          text="Cancel"
          variant="secondary"
          onClick={close}
        />
        <Button
          disabled={actionsDisabled}
          text="Submit"
          onClick={handleSubmit}
        />
      </DialogActions>
    </ControlledDialog>
  );
};
