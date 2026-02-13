import { Button } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { Download } from 'lucide-react';

import { List } from '~/api';
import { useGetFileMetadata } from '~/services/files';

import styles from './ListDetails.module.scss';

export interface ListDetailsProps {
  className?: string;
  list: Pick<List, 'storageId'>;
  canManage?: boolean;
}

export const ListDetails = ({
  className,
  list,
}: ListDetailsProps): JSX.Element => {
  const { data: file } = useGetFileMetadata({
    id: list.storageId,
  });
  return (
    <div className={clsx(styles.ListDetails, className)}>
      {file && (
        <>
          <embed className={styles.ListForm_Pdf} src={file.url} type="application/pdf" width="100%" height="600px" />
          <div>
            <Button text="Download" icon={<Download />} />
          </div>
        </>
      )}
    </div>
  );
};
