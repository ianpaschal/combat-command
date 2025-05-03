import { useState } from 'react';

import { TournamentPairingMethod, tournamentPairingMethodOptions } from '~/api';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
// import { useTournament } from '~/components/TournamentProvider';
import { PairingGrid } from './PairingsGrid';

import styles from './PairingsStep.module.scss';

export const PairingsStep = (): JSX.Element => {
  // const tournament = useTournament();
  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod>('random'); // TODO: Auto set based on tournament info

  const handleChangePairingMethod = (value: TournamentPairingMethod): void => {
    // If dirty, show a warning before changing
    setPairingMethod(value);
  };

  return (
    <div className={styles.PairingStep}>
      <div>
        <Label>Pairing Method</Label>
        <InputSelect
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={handleChangePairingMethod}
          options={tournamentPairingMethodOptions}
          value={pairingMethod}
        />
      </div>
      <Separator />
      <PairingGrid />
    </div>
  );
};
