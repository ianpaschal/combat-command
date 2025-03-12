import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';

import styles from './CountryCell.module.scss';

export interface CountryCellProps {
  code: string;
}

export const CountryCell = ({
  code,
}: CountryCellProps): JSX.Element => (
  <div className={styles.Root}>
    <FlagCircle code={code} size="1.5rem" />
    <span>
      {getCountryName(code)}
    </span>
  </div>
);
