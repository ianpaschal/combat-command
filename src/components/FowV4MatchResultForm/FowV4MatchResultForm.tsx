import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { missions } from '~/components/FowV4MatchResultForm/missions';
import { FowV4TournamentGameConfigForm } from '~/components/FowV4TournamentGameConfigForm';
import { Animate } from '~/components/generic/Animate';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelectOption } from '~/components/generic/InputSelect';
import { InputSelect, InputSelectItem } from '~/components/generic/InputSelect/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { PlayerSelect } from '~/components/PlayerSelect';
import { UserPortrait } from '~/components/UserPortrait';
import { fowV4LFTFVersionOptions } from '~/types/fowV4/fowV4LFTFVersionSchema';
import { fowV4MissionPackVersionOptions } from '~/types/fowV4/fowV4MissionPackVersionSchema';
import { fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';
import { fowV4MatchConfigSchema, fowV4MatchResultSchema } from './FowV4MatchResultForm.schema';

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

const outcomeOptions: InputSelectOption[] = [
  { label: 'Objective Taken', value: 'objective_taken' },
  { label: 'Objective Defended', value: 'objective_defended' },
  { label: 'Draw / Time Out', value: 'time_out' },
  { label: 'Force Broken', value: 'force_broken' },
];

export interface FowV4MatchResultFormProps {
  className?: string;
  tournamentId?: string;
  matchResultId?: string;
}

export const FowV4MatchResultForm = ({
  className,
  tournamentId,
  matchResultId,
}: FowV4MatchResultFormProps): JSX.Element => {
  const user = useAuth();
  const [loading] = useState<boolean>(false);

  // If tournamentId !== undefined, get the correct pairing which includes this user

  // If matchresultId !== populate all default values from that (editing)

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
        lessons_from_the_front_version: [...fowV4LFTFVersionOptions].pop()?.value,
        mission_pack_version: [...fowV4MissionPackVersionOptions].pop()?.value,
      },
      detailed_result: {
        mission_id: undefined,
        outcome_type: undefined,
        winner: undefined, // Select field, values populated based on player IDs
        turns_played: 1,
        attacker: undefined, // Select field, values populated based on player IDs
        firstTurn: undefined,
        player_0_stance: undefined,
        player_0_units_lost: 0,
        player_1_stance: undefined,
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
    { label: 'Player 1', value: '0' },
    { label: 'Player 2', value: '1' },
  ];
  const winnerOptions: InputSelectOption[] = [
    ...playerOptions,
  ];

  const { watch } = form;
  const { detailed_result, tournament_pairing_id } = watch();
  const showGameConfigSection = tournament_pairing_id === 'NONE';
  const showWinnerField = !!detailed_result.outcome_type && detailed_result.outcome_type !== 'time_out';

  const showAttacker = missions.find((mission) => mission.id === detailed_result.mission_id)?.attacker === 'roll';
  const showFirstTurn = missions.find((mission) => mission.id === detailed_result.mission_id)?.firstTurn === 'roll';

  return (
    <Form form={form} onSubmit={onSubmit} className={clsx('FowV4MatchResultForm', className)}>
      <div className="GameMetaSection">
        <FormField name="tournament_pairing_id" label="Result for" disabled={!!tournamentId}>
          <InputSelect options={pairingOptions} />
        </FormField>
      </div>
      <Separator />
      <Animate show={showGameConfigSection}>
        <div className="GameConfigSection" data-state={showGameConfigSection ? 'open' : 'closed'}>
          <FowV4TournamentGameConfigForm fieldName="detailed_config" hideRuleAddOns />
          <Separator />
        </div>
      </Animate>
      <div className="OpponentsSection">
        <div className="Player0Section">
          <UserPortrait name="FooBar">
            <Avatar />
          </UserPortrait>
          <FormField name="detailed_result.player_0_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="detailed_result.player_0_units_lost" label="Units Lost">
            <InputText type="number" min={0} />
          </FormField>
        </div>
        <Separator orientation="vertical" />
        <div className="Player1Section">
          <PlayerSelect
            onSelect={(id) => console.log(id)}
          />
          <FormField name="detailed_result.player_1_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="detailed_result.player_1_units_lost" label="Units Lost">
            <InputText type="number" min={0} />
          </FormField>
        </div>
      </div>
      <Separator />
      <div className="ResultsSection">
        <FormField name="detailed_result.mission_id" label="Mission">
          <InputSelect options={missions.map(({ label, id }) => ({ label, value: id }))} />
        </FormField>
        <Animate show={showAttacker}>
          <FormField name="detailed_result.attacker" label="Attacker">
            <InputSelect options={playerOptions} />
          </FormField>
        </Animate>
        <Animate show={showFirstTurn}>
          <FormField name="detailed_result.firstTurn" label="First Turn">
            <InputSelect options={playerOptions} />
          </FormField>
        </Animate>
        <div className="OutcomeSection">
          <FormField name="detailed_result.turns_played" label="Rounds Played" >
            <InputText type="number" min={0} />
          </FormField>
          <FormField name="detailed_result.outcome_type" label="Outcome Type">
            <InputSelect options={outcomeOptions} />
          </FormField>
        </div>
        <Animate show={showWinnerField}>
          <FormField name="detailed_result.winner" label="Winner" >
            <InputSelect options={winnerOptions} />
          </FormField>
        </Animate>
      </div>
      <Button type="submit" disabled={loading} className="SubmitButton">Check In Match</Button>
    </Form>
  );
};