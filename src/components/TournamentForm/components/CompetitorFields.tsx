import { useFormContext } from 'react-hook-form';
import { Select } from '@ianpaschal/combat-command-components';
import { TournamentPairingMethod } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { Checkbox } from '~/components/generic/Checkbox';
import { FormField } from '~/components/generic/Form';
import { InputCurrency } from '~/components/generic/InputCurrency';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { Switch } from '~/components/generic/Switch';
import { TournamentFormData } from '~/components/TournamentForm/TournamentForm.schema';

import styles from './CompetitorFields.module.scss';

export interface CompetitorFieldsProps {
  className?: string;
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export const CompetitorFields = ({
  className,
  status = 'draft',
}: CompetitorFieldsProps): JSX.Element => {
  const { reset, watch } = useFormContext<TournamentFormData>();
  const { maxCompetitors, competitorSize, pairingMethod } = watch();

  // TODO: Implement later
  // const { fields: competitorGroupFields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'competitorGroups',
  // });

  // const handleAddGroup = (e: MouseEvent): void => {
  //   e.preventDefault();
  //   append({ name: '', size: 0 });
  // };

  // const handleRemoveGroup = (e: MouseEvent, i: number): void => {
  //   e.preventDefault();
  //   remove(i);
  // };

  const handleToggleIsTeam = (checked: boolean): void => {
    // If changing from team to solos, convert total players back to teams of 1
    if (!checked) {
      reset((prev) => ({
        ...prev,
        competitorSize: 1,
        maxCompetitors: totalPlayers,
        useNationalTeams: false,
        roundStructure: {
          ...prev.roundStructure,
          pairingTime: 0,
        },
      }));
    } else {
      reset((prev) => ({
        ...prev,
        competitorSize: 2,
        maxCompetitors: Math.ceil(totalPlayers / 2),
        roundStructure: {
          ...prev.roundStructure,
          pairingTime: 30,
        },
      }));
    }
  };

  const useTeams = competitorSize > 1;
  const totalPlayers = maxCompetitors * competitorSize;

  const getCompetitorLabel = (plural = true) => {
    if (competitorSize > 1) {
      return plural ? 'Teams' : 'Team';
    }
    return plural ? 'Players' : 'Player';
  };

  // Once a tournament is published, lock some fields
  const allowedEditStatuses = ['draft'];
  const disableFields = !allowedEditStatuses.includes(status);
  const disableAlignmentField = pairingMethod === TournamentPairingMethod.AdjacentAlignment;

  return (
    <div className={clsx(styles.CompetitorFields, className)}>
      <FormField label="Is team tournament?" disabled={disableFields}>
        <Switch checked={useTeams} onCheckedChange={handleToggleIsTeam} />
      </FormField>
      <div className={styles.Stackable}>
        <FormField name="maxCompetitors" label={`Total ${getCompetitorLabel()}`} disabled={disableFields}>
          <InputText type="number" />
        </FormField>
        <Animate show={useTeams}>
          <FormField name="competitorSize" label="Team Size" disabled={disableFields}>
            <InputText type="number" />
          </FormField>
        </Animate>
      </div>
      <Animate show={useTeams}>
        <FormField name="useNationalTeams" label="Use National Teams" disabled={disableFields}>
          <Switch />
        </FormField>
      </Animate>
      <h3>Total Players: {totalPlayers}</h3>
      <Separator />
      <FormField name="competitorFee" label={`Price per ${getCompetitorLabel(false)}`}>
        <InputCurrency />
      </FormField>
      <Separator />
      <h3>Registration Questions</h3>
      <FormField
        name="registrationDetails.alignment"
        label="Alignment"
        description="e.g. Axis & Allies or NATO & Warsaw Pact"
        disabled={disableAlignmentField}
      >
        <Select options={[
          { label: 'Required', value: 'required' },
          { label: 'Optional', value: 'optional' },
          { label: 'Do Not Ask', value: null },
        ]} />
      </FormField>
      <FormField name="alignmentsRevealed" label="Alignments Visible to Players" description="You can always change this later.">
        <Switch />
      </FormField>
      <FormField name="registrationDetails.faction" label="Faction" description="e.g. United States, Germany, Soviet Union, etc.">
        <Select options={[
          { label: 'Required', value: 'required' },
          { label: 'Optional', value: 'optional' },
          { label: 'Do Not Ask', value: null },
        ]} />
      </FormField>
      <FormField name="factionsRevealed" label="Factions Visible to Players" description="You can always change this later.">
        <Switch />
      </FormField>
      <FormField name="requireRealNames" label="Require Real Names?" description="Users will be prompted to set their name visibility to 'Tournaments' when registering.">
        <Checkbox />
      </FormField>
    </div>
  );
};
