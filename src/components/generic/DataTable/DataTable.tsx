import { cloneElement, ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Cog, Search } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { DefaultCell } from './DefaultCell';

import styles from './DataTable.module.scss';

export interface ColumnDef<T> {
  header: string;
  width?: number | string;
  render: (data: T, iRow: number, iCol: number) => ReactElement;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  maxHeight?: number;
  includeLineNumbers?: boolean;
}

export const DataTable = <T,>({
  data,
  columns,
  maxHeight,
  includeLineNumbers = false,
}: DataTableProps<T>): JSX.Element => {
  const gridTemplateColumns = columns.reduce((acc, col) => {
    if (col.width && typeof col.width === 'number') {
      return `${acc} ${col.width}px`;
    }
    if (col.width && typeof col.width === 'string') {
      return `${acc} ${col.width}`;
    }
    return `${acc} 1fr`;
  }, includeLineNumbers ? '2rem' : '');
  return (
    <div className={styles.Root}>
      <div className={styles.Controls}>
        <InputText placeholder="Filter..." slotBefore={<Search />} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outlined">
              <Cog />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className={styles.PopoverContent} align="end">
              Checkboxes
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div className={styles.Table} style={{ maxHeight: maxHeight || undefined }}>
        <div className={styles.Header} style={{ gridTemplateColumns }}>
          {includeLineNumbers && (
            <div className={clsx(styles.HeaderCell, styles.IndexCell)} />
          )}
          {columns.map((column) => (
            <div className={styles.HeaderCell} key={`DataTable_HeaderCell-${column.header.toLocaleLowerCase()}`}>
              {column.header}
            </div>
          ))}
        </div>
        <ScrollArea className={styles.Body}>
          <div>
            {data.map((row, i) => (
              <div className={styles.Row} key={`DataTable_Row-${i}`} style={{ gridTemplateColumns }}>
                {includeLineNumbers && (
                  <DefaultCell className={styles.IndexCell} value={i + 1} />
                )}
                {columns.map((column, j) => cloneElement(column.render(row, i, j), {
                  key: `DataTable_Cell-${i}-${j}`,
                }))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};