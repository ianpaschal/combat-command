import { useFormContext } from 'react-hook-form';
import { getTournamentPairingMethodOptions } from '@ianpaschal/combat-command-game-systems/common';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { RankingFactorFields } from '~/components/TournamentForm/components/RankingFactorFields';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';
import { TournamentRoundStructure } from '~/components/TournamentRoundStructure';

import styles from './FormatFields.module.scss';

export interface FormatFieldsProps {
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const FormatFields = ({
  status = 'draft',
}: FormatFieldsProps): JSX.Element => {
  const { watch } = useFormContext<TournamentFormData>();
  const { roundStructure, competitorSize } = watch();
  const isTeam = competitorSize > 1;

  // Once a tournament is active, lock some fields
  const allowedEditStatuses = ['draft', 'published'];
  const disableFields = !allowedEditStatuses.includes(status);

  return (
    <div className={styles.FormatFields}>
      <div className={styles.FormatFields_RoundsSection}>
        <div className={styles.FormatFields_RoundsOverview}>
          <FormField name="roundCount" label="Rounds" disabled={disableFields}>
            <InputText type="number" />
          </FormField>
          <TournamentRoundStructure structure={{
            ...roundStructure,
            pairingTime: isTeam ? roundStructure.pairingTime : undefined,
          }} />
        </div>
        <div className={styles.FormatFields_RoundStructureFields}>
          <Animate show={isTeam}>
            <FormField name="roundStructure.pairingTime" label="Pairing Time" description="In minutes">
              <InputText type="number" />
            </FormField>
          </Animate>
          <FormField name="roundStructure.setUpTime" label="Set-Up Time" description="In minutes">
            <InputText type="number" />
          </FormField>
          <FormField name="roundStructure.playingTime" label="Playing Time" description="In minutes">
            <InputText type="number" />
          </FormField>
        </div>
      </div>
      <Separator />
      <div className={styles.FormatFields_PairingSection}>
        <div className={styles.FormatFields_PairingMethod}>
          <FormField name="pairingMethod" label="Pairing Method" disabled={disableFields}>
            <InputSelect options={getTournamentPairingMethodOptions()} />
          </FormField>
          <p>Combat Command uses a system of progressive tie breakers. Competitors are ranked according to the first ranking factor. If they are tied, the next ranking factor is compared until the tie is broken.</p>
        </div>
        <div className={styles.FormatFields_RankingFactors}>
          <Label>Ranking Factors</Label>
          <RankingFactorFields />
        </div>
      </div>
    </div>
  );
};
