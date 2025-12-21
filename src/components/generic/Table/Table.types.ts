import { ReactNode } from 'react';

export type RowData = { [key: string]: unknown };

export type ColumnDef<T extends RowData> = {
  xAlign?: 'left' | 'center' | 'right';
  yAlign?: 'top' | 'center' | 'bottom';
  className?: string;
  key: string;
  label?: string;
  renderCell?: (row: T, position?: CellPosition) => ReactNode;
  renderHeader?: () => ReactNode;
  width?: number | string;
};

export type PositionFlag = 'first' | 'last';

export type CellPosition = {
  column?: PositionFlag[];
  row?: PositionFlag[];
};

export type Row<T extends RowData> = [T, number];
