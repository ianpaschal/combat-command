import { bem } from '~/utils/componentLib/bem';

import './DataTable.scss';

export interface DefaultCellProps {
  value: string | number;
}

const cn = bem('DefaultCell');
export const DefaultCell = ({
  value,
}: DefaultCellProps): JSX.Element => (
  <div className={cn()}>
    {value}
  </div>
);