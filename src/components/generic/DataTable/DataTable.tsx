import { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Cog, Search } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { createCn } from '~/utils/componentLib/createCn';

import './DataTable.scss';

export interface ColumnDef<T> {
  header: string;
  width?: number | string;
  render: (data: T, i?: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  maxHeight?: number;
  includeLineNumbers?: boolean;
}

const cn = createCn('DataTable');
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
    <div className={cn()}>
      <div className={cn('_Controls')}>
        <InputText placeholder="Filter..." slotBefore={<Search />} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outlined">
              <Cog />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className={cn('_PopoverContent')} align="end">
              Checkboxes
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div className={cn('_Table')} style={{ maxHeight: maxHeight || undefined }}>
        <div className={cn('_Header')} style={{ gridTemplateColumns }}>
          {includeLineNumbers && (
            <div className={clsx(cn('_HeaderCell'), cn('_IndexCell'))} />
          )}
          {columns.map((column) => (
            <div className={cn('_HeaderCell')} key={`${cn('_HeaderCell')}-${column.header.toLocaleLowerCase()}`}>
              {column.header}
            </div>
          ))}
        </div>
        <ScrollArea className={cn('_Body')} >
          <div className={cn('_Rows')}>
            {data.map((row, i) => (
              <div className={cn('_Row')} key={`${cn('_Row')}-${i}`} style={{ gridTemplateColumns }}>
                {includeLineNumbers && (
                  <div className={clsx(cn('_DefaultCell'), cn('_IndexCell'))}>
                    {i + 1}
                  </div>
                )}
                {columns.map((column, j) => (
                  <div className={cn('_DefaultCell')} key={`${cn('_Cell')}-${i}-${j}`}>
                    {column.render(row, i)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
  ;