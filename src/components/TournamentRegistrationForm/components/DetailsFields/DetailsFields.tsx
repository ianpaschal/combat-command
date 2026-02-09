import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Select } from '@ianpaschal/combat-command-components';
import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Tournament, TournamentRegistration } from '~/api';
import { FormField } from '~/components/generic/Form';
import { FormData } from '../../TournamentRegistrationForm.schema';

import styles from './DetailsFields.module.scss';

export interface DetailsFieldsProps {
  className?: string;
  tournament: Tournament;
  existingValues?: TournamentRegistration;
}

export const DetailsFields = ({
  className,
  tournament,
  existingValues,
}: DetailsFieldsProps): JSX.Element | null => {
  const {
    getFactionOptions,
    getAlignmentOptions,
    getFactionAlignment,
  } = getGameSystem(tournament.gameSystem);
  const { setValue, watch } = useFormContext<FormData>();
  const declaredFaction = watch('details.faction');

  useEffect(() => {
    if (declaredFaction) {
      setValue('details.alignment', getFactionAlignment(declaredFaction) ?? null);
    }
  }, [declaredFaction, getFactionAlignment, setValue]);

  const showAlignmentField = !!(existingValues || tournament.registrationDetails?.alignment);
  const showFactionField = !!(existingValues || tournament.registrationDetails?.faction);

  if (![showAlignmentField, showFactionField].some(Boolean)) {
    return null;
  }

  return (
    <div className={clsx(styles.FactionFields, className)}>
      {showAlignmentField && (
        <FormField
          name="details.alignment"
          label="Alignment"
          disabled={!!declaredFaction}
        >
          <Select options={getAlignmentOptions()} clearable />
        </FormField>
      )}
      {showFactionField && (
        <FormField name="details.faction" label="Faction">
          <Select options={getFactionOptions()} clearable />
        </FormField>
      )}
    </div>
  );
};
