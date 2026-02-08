import { useState } from 'react';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import { Select } from '@ianpaschal/combat-command-components';
import {
  getTournamentPairingOrderMethodOptions,
  getTournamentPairingPolicyOptions,
  TournamentPairingConfig,
  TournamentPairingPolicy,
} from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { FormField } from '~/components/generic/Form';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { usePresetField } from './TournamentPairingConfigFields.hooks';

import styles from './TournamentPairingConfigFields.module.scss';

export interface TournamentPairingConfigFieldsProps<TFormValues extends FieldValues> {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  path?: FieldPathByValue<TFormValues, TournamentPairingConfig>;
}

export const TournamentPairingConfigFields = <TFormValues extends FieldValues>({
  className,
  disabled = false,
  loading = false,
  path,
}: TournamentPairingConfigFieldsProps<TFormValues>): JSX.Element => {
  const tabs = [
    { value: 'preset', label: 'Preset' },
    { value: 'advanced', label: 'Advanced' },
  ];
  const [tab, setTab] = useState<string>('preset');

  const presetFieldProps = usePresetField(path);
  const orderByOptions = getTournamentPairingOrderMethodOptions();
  // FIXME: Avoid is not yet supported on the back-end, so hide it in the front-end for now.
  const policyOptions = getTournamentPairingPolicyOptions().filter((option) => option.value !== TournamentPairingPolicy.Avoid);

  const pathPrefix = (name: string): string => path ? `${path}.${name}` : name;
  const fieldProps = { disabled, loading };
  return (
    <Tabs
      className={clsx(styles.TournamentPairingConfigFields, className)}
      value={tab}
      onValueChange={setTab}
    >
      <TabsList tabs={tabs} className={styles.TournamentPairingConfigFields_TabsList} stretch />
      <TabsContent value="preset" className={styles.TournamentPairingConfigFields_TabsContent}>
        <FormField label="Preset" {...fieldProps}>
          <Select placeholder="Custom" {...presetFieldProps} />
        </FormField>
      </TabsContent>
      <TabsContent value="advanced" className={styles.TournamentPairingConfigFields_TabsContent}>
        <FormField name={pathPrefix('orderBy')} label="Pair By" {...fieldProps}>
          <Select options={orderByOptions} />
        </FormField>
        <FormField
          name={pathPrefix('policies.repeat')}
          label="Repeat Match-Ups"
          description="Whether players can face opponents they've already played."
          orientation="horizontal"
          inputWidth="6rem"
          {...fieldProps}
        >
          <Select options={policyOptions} />
        </FormField>
        <FormField
          name={pathPrefix('policies.sameAlignment')}
          label="Blue vs. Blue Match-Ups"
          description="Whether blue vs. blue and red vs. red match-ups are allowed."
          orientation="horizontal"
          inputWidth="6rem"
          {...fieldProps}
        >
          <Select options={policyOptions} />
        </FormField>
      </TabsContent>
    </Tabs>
  );
};
