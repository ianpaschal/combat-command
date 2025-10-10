import clsx from 'clsx';

import styles from './MatchResultDetailRow.module.scss';

export interface MatchResultDetailRowProps {
  className?: string;
  label: string;
  playerNames?: string[];
  values: (number | string)[];
}

export const MatchResultDetailRow = ({
  className,
  label,
  playerNames,
  values,
}: MatchResultDetailRowProps): JSX.Element => {

  // Per-player row:
  if (values.length > 1 && playerNames && playerNames?.length > 1) {
    if (values.length > playerNames.length) {
      console.warn('<MatchResultDetailRow/> received more values than player names!');
    }
    if (values.length < playerNames.length) {
      console.warn('<MatchResultDetailRow/> received more player names than details!');
    }
    return (
      <div className={clsx(styles.MatchResultDetailRow, className)}>
        <span className={styles.MatchResultDetailRow_Label}>
          {label}
        </span>
        {playerNames?.map((playerName, i) => (
          <>
            <span key={`label_${i}`} className={styles.MatchResultDetailRow_SubLabel}>
              {playerName}
            </span>
            <span key={`label_${i}`} className={styles.MatchResultDetailRow_Value}>
              {values[i] ?? '?'}
            </span>
          </>
        ))}
      </div>
    );
  }

  // Single row:
  if (values.length < 1) {
    throw new Error('<MatchResultDetailRow/> requires at least 1 value to render!');
  }
  return (
    <div className={clsx(styles.MatchResultDetailRow, className)}>
      <span className={styles.MatchResultDetailRow_Label}>
        {label}
      </span>
      <span className={styles.MatchResultDetailRow_Value}>
        {values[0]}
      </span>
    </div>
  );
};
