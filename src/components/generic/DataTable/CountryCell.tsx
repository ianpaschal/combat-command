import { country, subdivision } from 'iso-3166-2';

import { FlagCircle } from '~/components/generic/FlagCircle';

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
      {code.includes('-') ? subdivision(code)?.name : country(code)?.name}
    </span>
  </div>
);