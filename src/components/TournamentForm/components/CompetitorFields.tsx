import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { Animate } from '~/components/generic/Animate';
import { FormField } from '~/components/generic/Form';
import { InputCurrency } from '~/components/generic/InputCurrency';
import { InputDateTime } from '~/components/generic/InputDateTime';
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
  const { maxCompetitors, competitorSize } = watch();

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
      <div className={styles.Stackable}>
        <FormField name="competitorFee" label={`Price per ${getCompetitorLabel(false)}`}>
          <InputCurrency />
        </FormField>
        <FormField name="registrationClosesAt" label="Registration Closes">
          <InputDateTime />
        </FormField>
      </div>
    </div>
  );
};
