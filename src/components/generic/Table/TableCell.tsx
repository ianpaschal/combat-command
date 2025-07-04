import { isValidElement, ReactElement } from 'react';
import clsx from 'clsx';

import { ColumnDef, RowData } from './Table.types';

import styles from './Table.module.scss';

export interface TableCellProps<T extends RowData> {
  column: ColumnDef<T>;
  row?: T;
  index: number;
}

export const TableCell = <T extends RowData>({
  column,
  row,
  index,
}: TableCellProps<T>): JSX.Element => {
  const className = clsx(styles.Table_Cell, column.className);
  const renderInner = (): ReactElement | null => {
    if (!row) {
      if (column.renderHeader) {
        const el = column.renderHeader();
        return isValidElement(el) ? el : <h3>{el}</h3>;
      }
      return <h3>{column?.label ?? ''}</h3>;
    }
    if (row) {
      if (column.renderCell) {
        const el = column.renderCell(row, index);
        return isValidElement(el) ? el : <span className={styles.Table_Cell_Text}>{el}</span>;
      }
      return <span className={styles.Table_Cell_Text}>{`${row?.[column.key]}`}</span>;
    }
    return null;
  };

  return (
    <div className={className} data-align={column.align ?? 'left'}>
      {renderInner()}
    </div>
  );
};
