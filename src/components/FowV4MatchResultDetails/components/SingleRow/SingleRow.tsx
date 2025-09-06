import styles from '../../FowV4MatchResultDetails.module.scss';

export interface SingleRowProps {
  label: string;
  value: string | number;
}

export const SingleRow = ({
  label,
  value,
}: SingleRowProps): JSX.Element => (
  <div className={styles.FowV4MatchResultDetails_Row}>
    <span className={styles.FowV4MatchResultDetails_Label}>{label}</span>
    <span className={styles.FowV4MatchResultDetails_Value}>{value}</span>
  </div>
);
