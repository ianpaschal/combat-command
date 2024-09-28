import { country, subdivision } from 'iso-3166-2';

import { FlagCircle } from '~/components/generic/FlagCircle';
import { bem } from '~/utils/componentLib/bem';

import './DataTable.scss';

export interface CountryCellProps {
  code: string;
}

const cn = bem('CountryCell');
export const CountryCell = ({
  code,
}: CountryCellProps): JSX.Element => (
  <div className={cn()}>
    <FlagCircle className={cn('Flag')} code={code} size="1.5rem" />
    <span className={cn('Name')}>
      {code.includes('-') ? subdivision(code)?.name : country(code)?.name}
    </span>
  </div>
);