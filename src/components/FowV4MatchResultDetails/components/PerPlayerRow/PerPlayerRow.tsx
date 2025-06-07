import styles from '../../FowV4MatchResultDetails.module.scss';

export interface PerPlayerRowProps {
  label: string;
  values: [string | number | undefined, string | number | undefined];
  playerNames: [string, string];
}

export const PerPlayerRow = ({
  label,
  values,
  playerNames,
}: PerPlayerRowProps): JSX.Element => (
  <div className={styles.FowV4MatchResultDetails_DoubleRow}>
    <span className={styles.FowV4MatchResultDetails_DoubleLabel}>{label}</span>
    <span className={styles.FowV4MatchResultDetails_Label}>{playerNames[0]}</span>
    <span className={styles.FowV4MatchResultDetails_Value}>{values[0]}</span>
    <span className={styles.FowV4MatchResultDetails_Label}>{playerNames[1]}</span>
    <span className={styles.FowV4MatchResultDetails_Value}>{values[1]}</span>
  </div>
);
