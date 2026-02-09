import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { TournamentPairingPolicy } from '@ianpaschal/combat-command-game-systems/common';

import { Label } from '~/components/generic/Label';
import { RankingFactorFields } from '~/components/TournamentForm/components/RankingFactorFields';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';
import { TournamentPairingConfigFields } from '~/components/TournamentPairingConfigForm';
import { ALLOWED_EDIT_STATUSES } from '../TournamentForm.utils';

import styles from './PairingFields.module.scss';

export interface PairingFieldsProps {
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const PairingFields = ({
  status = 'draft',
}: PairingFieldsProps): JSX.Element => {
  const { watch, setValue } = useFormContext<TournamentFormData>();
  const pairingConfig = watch('pairingConfig');

  useEffect(() => {
    if (pairingConfig.policies.sameAlignment !== TournamentPairingPolicy.Allow) {
      setValue('registrationDetails.alignment', 'required');
    }
  }, [pairingConfig, setValue]);

  const disabled = !ALLOWED_EDIT_STATUSES.includes(status);

  return (
    <div className={styles.PairingFields}>
      <div className={styles.PairingFields_Config}>
        <Label>Pairing Method</Label>
        <TournamentPairingConfigFields path="pairingConfig" disabled={disabled} />
      </div>
      <div className={styles.PairingFields_RankingFactors}>
        <Label>Ranking Factors</Label>
        <RankingFactorFields disabled={disabled} status={status} />
        <p>Combat Command uses a system of progressive tie breakers. Competitors are ranked according to the first ranking factor. If they are tied, the next ranking factor is compared until the tie is broken.</p>
      </div>
    </div>
  );
};
