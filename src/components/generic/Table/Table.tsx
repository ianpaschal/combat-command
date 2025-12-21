import clsx from 'clsx';

import { ScrollArea } from '~/components/generic/ScrollArea';
import { useGridStyle, useScrollIndicator } from './Table.hooks';
import { ColumnDef, RowData } from './Table.types';
import { getPosition } from './Table.utils';
import { TableCell } from './TableCell';

import styles from './Table.module.scss';

export interface TableProps<T extends RowData> {
  className?: string;
  columns: ColumnDef<T>[];
  rows: T[];
}

export const Table = <T extends RowData>({
  className,
  columns,
  rows,
}: TableProps<T>): JSX.Element => {
  const { ref, updateIndicators, visible } = useScrollIndicator();
  const style = useGridStyle(columns);
  return (
    <ScrollArea
      className={clsx(styles.Table, className)}
      ref={ref}
      onScroll={updateIndicators}
      indicators={{ top: { visible: false } }}
    >
      <div className={styles.Table_Inner} style={style}>
        {columns.map((c, i) => (
          <TableCell
            key={`cell_head_${String(c.key)}`}
            column={c}
            position={{
              column: getPosition([i, columns.length]),
            }}
            showScrollIndicator={visible}
          />
        ))}
        {rows.map((r, i) => (
          columns.map((c, ii) => (
            <TableCell
              key={`cell_${i}_${String(c.key)}`}
              column={c}
              row={r}
              position={{
                row: getPosition([i, rows.length]),
                column: getPosition([ii, columns.length]),
              }}
            />
          ))
        ))}
      </div>
    </ScrollArea>
  );
}; 
