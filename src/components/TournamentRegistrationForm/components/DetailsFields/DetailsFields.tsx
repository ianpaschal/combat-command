import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Select } from '@ianpaschal/combat-command-components';
import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Tournament } from '~/api';
import { FormField } from '~/components/generic/Form';
import { FormData } from '../../TournamentRegistrationForm.schema';

import styles from './DetailsFields.module.scss';

export interface DetailsFieldsProps {
  className?: string;
  tournament: Tournament;
}

export const DetailsFields = ({
  className,
  tournament,
}: DetailsFieldsProps): JSX.Element => {
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

  const showAlignmentField = tournament.registrationDetails?.alignment;
  const showFactionField = tournament.registrationDetails?.faction;

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
