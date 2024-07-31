import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form } from '~/components/generic/Form';
import { FormSelectField } from '~/components/generic/FormSelectField';
import { FormTextField } from '~/components/generic/FormTextField';
import { Separator } from '~/components/generic/Separator';
import { PlayerSelect } from '~/components/PlayerSelect';
import { UserPortrait } from '~/components/UserPortrait';
import { InputSelectOption } from '../generic/InputSelect';
import { InputSelectItem } from '../generic/InputSelect/InputSelect';
import {
  fowV4MatchConfigSchema,
  fowV4MatchResultSchema,
  Stance,
} from './FowV4MatchResultForm.schema';

import './FowV4MatchResultForm.scss';

const formSchema = z.object({
  game_system_id: z.string(),
  player_0_id: z.string(),
  player_0_list_id: z.string(),
  player_1_id: z.string(),
  player_1_list_id: z.string(),
  tournament_pairing_id: z.optional(z.string()),
  detailed_config: fowV4MatchConfigSchema,
  detailed_result: fowV4MatchResultSchema,
});

type FormInput = z.infer<typeof formSchema>;

const eraOptions: InputSelectOption[] = [
  { label: 'Early War', value: 'ew' },
  { label: 'Mid-War', value: 'mw' },
  { label: 'Late War', value: 'lw' },
];

const stanceOptions: InputSelectOption[] = [
  { label: 'Attack', value: 'attack' },
  { label: 'Maneuver', value: 'maneuver' },
  { label: 'Defend', value: 'defend' },
];

const missionOptions: InputSelectOption[] = [
  { label: 'Annihilation', value: 'annihilation' },
  { label: 'Breakthrough', value: 'breakthrough' },
  { label: 'Bridgehead', value: 'bridgehead' },
  { label: 'Bypass', value: 'bypass' },
  { label: 'Cornered', value: 'cornered' },
  { label: 'Counterattack', value: 'counterattack' },
  { label: 'Counterstrike', value: 'counterstrike' },
  { label: 'Covering Force', value: 'covering_force' },
  { label: 'Dogfight', value: 'dogfight' },
  { label: 'Dust-Up', value: 'dust_up' },
  { label: 'Encirclement', value: 'encirclement' },
  { label: 'Encounter', value: 'encounter' },
  { label: 'Escape', value: 'escape' },
  { label: 'Fighting Withdrawal', value: 'fighting_withdrawal' },
  { label: 'Free for All', value: 'free_for_all' },
  { label: 'Gauntlet', value: 'gauntlet' },
  { label: 'Hold the Pocket', value: 'hold_the_pocket' },
  { label: 'It\'s a Trap', value: 'its_a_trap' },
  { label: 'Killing Ground', value: 'killing_ground' },
  { label: 'No Retreat', value: 'no_retreat' },
  { label: 'Outflanked', value: 'outflanked' },
  { label: 'Outmanoeuvred', value: 'outmanoeuvred' },
  { label: 'Probe (Contact)', value: 'probe' },
  { label: 'Scouts Out', value: 'scouts_out' },
  { label: 'Spearpoint', value: 'spearpoint' },
  { label: 'Valley of Death', value: 'valley_of_death' },
  { label: 'Vanguard', value: 'vanguard' },
];

const outcomeOptions: InputSelectOption[] = [
  { label: 'Objective Taken', value: 'objective_taken' },
  { label: 'Objective Defended', value: 'objective_defended' },
  { label: 'Draw / Time Out', value: 'time_out' },
  { label: 'Force Broken', value: 'force_broken' },
];

export const FowV4MatchResultForm = (): JSX.Element => {
  const user = useAuth();
  const [loading] = useState<boolean>(false);
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      game_system_id: 'fow_v4', // Hidden
      player_0_id: user?.id,
      player_0_list_id: '', // TODO
      player_1_id: 'UNKNOWN',
      player_1_list_id: '', // TODO
      tournament_pairing_id: 'NONE',
      detailed_config: { // Auto-filled & disabled if tournament pairing ID is not undefined
        era: 'lw',
        points: 100,
        rule_add_ons: ['lessons_from_the_front_2024-04'], // Hidden
        mission_pack: 'fow_v4_missions_2023-04', // Hidden
      },
      detailed_result: {
        mission_id: undefined,
        outcome_type: undefined,
        winner: undefined, // Select field, values populated based on player IDs
        turns_played: 1,
        attacker: undefined, // Select field, values populated based on player IDs
        player_0_stance: stanceOptions[0].value as Stance,
        player_0_units_lost: 0,
        player_1_stance: stanceOptions[0].value as Stance,
        player_1_units_lost: 0,
      },
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput): Promise<void> => {
    console.log(data);
  };

  const pairingOptions: InputSelectItem[] = [
    { label: 'Single Match', value: 'NONE' },
    '-' as const,
    { label: 'Operation Bagration', value: 'foo' },
    { label: 'Operation Overlord', value: 'bar' },
  ];
  const playerOptions: InputSelectOption[] = [
    { label: 'Player 0', value: '0' },
    { label: 'Player 1', value: '1' },
    { label: 'Draw', value: 'NONE' },
  ];

  const { watch } = form;
  const { detailed_result, tournament_pairing_id } = watch();
  const showGameConfigSection = tournament_pairing_id === 'NONE';
  const showWinnerField = !!detailed_result.outcome_type && detailed_result.outcome_type !== 'time_out';

  return (
    <Form form={form} onSubmit={onSubmit} className="FowV4MatchResultForm">
      <div className="GameMetaSection">
        <FormSelectField name="tournament_pairing_id" label="Result for" options={pairingOptions} />
      </div>
      <Separator />
      {showGameConfigSection && (
        <div className="GameConfigSection" data-state={showGameConfigSection ? 'open' : 'closed'}>
          <div className="GameConfigFields">
            <FormSelectField className="GameConfigEra" name="detailed_config.era" label="Era" options={eraOptions} />
            <FormTextField className="GameConfigPoints" name="detailed_config.points" label="Points" type="number" />
          </div>
          <Separator />
        </div>
      )}
      <div className="OpponentsSection">
        <div className="Player0Section">
          <UserPortrait username="FooBar" givenName="Ian" familyName="Paschal" />
          <FormSelectField name="detailed_result.player_0_stance" label="Stance" options={stanceOptions} />
          <FormTextField name="detailed_result.player_0_units_lost" label="Units Lost" type="number" />
        </div>
        <Separator orientation="vertical" />
        <div className="Player1Section">
          <PlayerSelect
            players={[{ id: 'foo', given_name: 'Ian', surname: 'Paschal', avatar_url: '' }]}
            onSelect={(id) => console.log(id)}
            variant="outlined"
          />
          <FormSelectField name="detailed_result.player_1_stance" label="Stance" options={stanceOptions} />
          <FormTextField name="detailed_result.player_1_units_lost" label="Units Lost" type="number" min={0} />
        </div>
      </div>
      <Separator />
      <div className="ResultsSection">
        <FormSelectField name="detailed_result.mission_id" label="Mission" options={missionOptions} />
        <FormSelectField name="detailed_result.attacker" label="Attacker" options={playerOptions} />
        <FormTextField name="detailed_result.turns_played" label="Turns Played" type="number" min={0} />
        <FormSelectField name="detailed_result.outcome_type" label="Outcome Type" options={outcomeOptions} />
        {showWinnerField && (
          <FormSelectField name="detailed_result.winner" label="Winner" options={playerOptions} />
        )}
      </div>

      {/* 
      mission_id: 'free_for_all',
      outcome_type: 'objective_taken',
      winner: undefined, // Select field, values populated based on player IDs
      attacker: 0, // Select field, values populated based on player IDs */}
      <Button type="submit" disabled={loading}>Register</Button>
    </Form>
  );
};