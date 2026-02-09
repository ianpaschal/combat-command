import { useFormContext } from 'react-hook-form';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';
import { TournamentRoundStructure } from '~/components/TournamentRoundStructure';
import { ALLOWED_EDIT_STATUSES } from '../TournamentForm.utils';

import styles from './FormatFields.module.scss';

export interface FormatFieldsProps {
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const FormatFields = ({
  status = 'draft',
}: FormatFieldsProps): JSX.Element => {
  const { watch } = useFormContext<TournamentFormData>();
  const [roundStructure, competitorSize] = watch(['roundStructure', 'competitorSize']);
  const isTeam = competitorSize > 1;

  // Once a tournament is active, lock some fields
  const disableFields = !ALLOWED_EDIT_STATUSES.includes(status);

  return (
    <div className={styles.FormatFields}>
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
  );
};
