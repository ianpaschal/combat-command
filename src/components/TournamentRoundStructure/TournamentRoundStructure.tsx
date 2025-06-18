import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { Label } from '~/components/generic/Label';

import styles from './TournamentRoundStructure.module.scss';

type GenericRoundStructure<T extends number | string> = {
  pairingTime?: T;
  setUpTime: T;
  playingTime: T;
};

export interface TournamentRoundStructureProps {
  className?: string;
  structure: GenericRoundStructure<number | string>;
}

export const TournamentRoundStructure = ({
  className,
  structure: rawStructure,
}: TournamentRoundStructureProps): JSX.Element => {
  const structure = Object.entries(rawStructure).reduce((acc, [stage, value]) => ({
    ...acc,
    [stage]: typeof value === 'string' ? parseInt(value, 10) : value,
  }), {} as GenericRoundStructure<number>);
  const totalRoundTime = (structure.pairingTime ?? 0) + structure.setUpTime + structure.playingTime;
  const hours = Math.floor(totalRoundTime / 60);
  const minutes = totalRoundTime % 60;
  return (
    <div className={clsx(styles.TournamentRoundStructure, className)}>
      <Label>
        {`Round Duration: ${hours}h` + (minutes ? ` ${minutes}m` : '')}
      </Label>
      <div className={styles.TournamentRoundStructure_Bar}>
        <div className={styles.TournamentRoundStructure_PairingTime} style={{ width: `${((structure.pairingTime ?? 0) / totalRoundTime) * 100}%` }} />
        <div className={styles.TournamentRoundStructure_SetUpTime} style={{ width: `${(structure.setUpTime / totalRoundTime) * 100}%` }} />
        <div className={styles.TournamentRoundStructure_PlayingTime} style={{ width: `${(structure.playingTime / totalRoundTime) * 100}%` }} />
      </div>
      <div className={styles.TournamentRoundStructure_Legend}>
        <Animate show={structure.pairingTime !== undefined}>
          <div className={styles.TournamentRoundStructure_Legend_Item}>
            <span className={styles.TournamentRoundStructure_PairingTime} />Pairing Time
          </div>
        </Animate>
        <div className={styles.TournamentRoundStructure_Legend_Item}>
          <span className={styles.TournamentRoundStructure_SetUpTime} />Set-Up Time
        </div>
        <div className={styles.TournamentRoundStructure_Legend_Item}>
          <span className={styles.TournamentRoundStructure_PlayingTime} />Playing Time
        </div>
      </div>
    </div>
  );
};
