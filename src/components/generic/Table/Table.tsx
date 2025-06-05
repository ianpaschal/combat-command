import clsx from 'clsx';

import { ScrollArea } from '~/components/generic/ScrollArea';
import { ColumnDef, RowData } from './Table.types';
import { TableRow } from './TableRow';

import styles from './Table.module.scss';

export interface TableProps<T extends RowData> {
  className?: string;
  columns: ColumnDef<T>[];
  rowClassName?: string;
  rows: T[];
}

export const Table = <T extends RowData>({
  className,
  columns,
  rowClassName,
  rows,
}: TableProps<T>): JSX.Element => (
  <div className={clsx(styles.Table, className)}>
    <TableRow columns={columns} className={rowClassName} />
    <ScrollArea className={styles.Table_ScrollArea}>
      <div className={styles.Table_Inner}>
        {rows.map((r, i) => (
          <TableRow key={`row_${i}`} columns={columns} row={[r, i]} className={rowClassName} />
        ))}
      </div>
    </ScrollArea>
  </div>
);
