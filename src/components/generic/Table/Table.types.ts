import { ReactNode } from 'react';

export type RowData = { [key: string]: unknown };

export type ColumnDef<T extends RowData> = {
  align?: 'left' | 'center' | 'right';
  className?: string;
  key: string;
  label?: string;
  renderCell?: (row: T, index: number) => ReactNode;
  renderHeader?: () => ReactNode;
  width?: number;
};

export type Row<T extends RowData> = [T, number];
