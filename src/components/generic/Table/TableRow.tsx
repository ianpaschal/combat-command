import clsx from 'clsx';

import {
  ColumnDef,
  Row,
  RowData,
} from './Table.types';
import { TableCell } from './TableCell';

import styles from './Table.module.scss';

export interface TableRowProps<T extends RowData> {
  className?: string;
  columns: ColumnDef<T>[];
  row?: Row<T>;
}

export const TableRow = <T extends RowData>({
  className,
  columns,
  row,
}: TableRowProps<T>): JSX.Element => {
  const gridTemplateColumns = columns.map(c => c.width ? `${c.width}px` : '1fr').join(' ');
  if (!row) {
    return (
      <div className={clsx(styles.Table_HeaderRow, className)} style={{ gridTemplateColumns }}>
        {columns.map((c) => (
          <TableCell key={`cell_head_${String(c.key)}`} column={c} />
        ))}
      </div>
    );
  } else {
    const [r, i] = row;
    return (
      <div key={`row_${i}`} className={clsx(styles.Table_Row, className)} style={{ gridTemplateColumns }}>
        {columns.map((c) => (
          <TableCell key={`cell_${i}_${String(c.key)}`} column={c} row={r} />
        ))}
      </div>
    );
  }
};
