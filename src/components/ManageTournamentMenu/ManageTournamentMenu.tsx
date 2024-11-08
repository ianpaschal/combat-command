import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import {
  ArrowRightToLine,
  CircleCheckBig,
  CircleOff,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Rocket,
  TimerOff,
  Trash,
} from 'lucide-react';

import { AdvanceRoundDialog } from '~/components/AdvanceRoundDialog/AdvanceRoundDialog';
import { MenuItem } from '~/components/generic/MenuItem';
import { GetTournamentsListItem } from '~/services/tournaments/getTournamentsList';
import { useUpdateTournament } from '~/services/tournaments/updateTournament';

import styles from './ManageTournamentMenu.module.scss';

export interface ManageTournamentMenuProps {
  tournament: GetTournamentsListItem;
  trigger: ReactElement;
}

export const ManageTournamentMenu = ({
  tournament,
  trigger,
}: ManageTournamentMenuProps): JSX.Element => {
  const navigate = useNavigate();
  const updateTournament = useUpdateTournament();
  // const createTournamentTimer = useCreateTournamentTimer();

  const [advanceRoundDialogOpen, setAdvanceRoundDialogOpen] = useState<boolean>(false);

  // const timer = useTournamentTimer(tournament.id, tournament.current_round);

  const handleClickEdit = (): void => {
    navigate(`/tournaments/${tournament.id}/edit`);
  };

  const handleClickPublish = (): void => {
    updateTournament.mutate({ id: tournament.id, status: 'published' });
  };

  const handleClickAddMatchResult = (): void => {
    navigate(`/tournaments/${tournament.id}/add-match`);
  };

  const handleClickAdvanceRound = (): void => {
    setAdvanceRoundDialogOpen(true);
  };

  const handleClickStartTournament = (): void => {
    setAdvanceRoundDialogOpen(true);
  };

  // const handleClickStartRound = (): void => {
  //   // TODO: Decide on one format or another
  //   if (!tournament.current_round && tournament.current_round !== 0) {
  //     throw Error('Can not start round timer without current round!');
  //   }
  //   createTournamentTimer.mutate({
  //     tournament_id: tournament.id,
  //     round_index: tournament.current_round,
  //     duration: 9000, // 2.5h in seconds
  //   });
  // };

  // TODO: Add with warning dialog
  // const handleClickResetRound = (): void => {
  //   updateTimer.mutate({ timer, action: 'reset' });
  // };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          {trigger}
        </Popover.Trigger>
        <Popover.Content className={styles.Content} align="end">
          <Popover.Close asChild>
            <MenuItem
              label="Edit"
              icon={<Pencil />}
              visible={['draft', 'published'].includes(tournament.status)}
              onClick={handleClickEdit}
            />
          </Popover.Close>
          <Popover.Close asChild>
            <MenuItem
              label="Publish"
              icon={<Eye />}
              visible={tournament.status === 'draft'}
              onClick={handleClickPublish}
            />
          </Popover.Close>
          <Popover.Close asChild>
            <MenuItem
              label="Add match result"
              icon={<Plus />}
              visible={tournament.status === 'active' && tournament.current_round !== undefined}
              onClick={handleClickAddMatchResult}
            />
          </Popover.Close>
          <Popover.Close asChild>
            <MenuItem
              label="Start tournament"
              icon={<Rocket />}
              visible={tournament.status === 'published' && !tournament.registrations_open}
              onClick={handleClickStartTournament}
            />
          </Popover.Close>
          {/* <MenuItem label="Open registrations" icon={<UserRoundPen />} visible={tournament.status === 'published' && tournament.registrations_open} /> */}
          {/* <MenuItem label="Close registrations" icon={<UserRoundX />} visible={tournament.status === 'published' && !tournament.registrations_open} /> */}
          {/* <Popover.Close asChild>
            <MenuItem
              label="Generate new pairings"
              icon={<Swords />}
              visible={tournament.status === 'active' && tournament.current_round !== undefined}
              onClick={handleClickGeneratePairings}
            />
          </Popover.Close> */}
          <Popover.Close asChild>
            <MenuItem
              label="Advance to next round"
              icon={<ArrowRightToLine />}
              visible={tournament.status === 'active'} // TODO: Add check that submitted match count for this round = competitor count / 2
              onClick={handleClickAdvanceRound}
            />
          </Popover.Close>
          {/* <Popover.Close asChild>
            <MenuItem
              label={`Start round ${tournament.current_round}`}
              icon={<ArrowRightToLine />}
              visible={tournament.status === 'active'} // TODO: Add check that pairings have been generated
              onClick={handleClickStartRound}
            />
          </Popover.Close> */}
          {/* <Popover.Close asChild>
            <MenuItem
              label="Pause round"
              icon={<ArrowRightToLine />}
              visible={tournament.status === 'active' && !!timer && !timer.isPaused}
              onClick={timer?.toggle}
            />
          </Popover.Close>
          <Popover.Close asChild>
            <MenuItem
              label="Resume round"
              icon={<ArrowRightToLine />}
              visible={tournament.status === 'active' && !!timer && timer.isPaused}
              onClick={timer?.toggle}
            />
          </Popover.Close> */}
          <MenuItem label="Complete tournament" icon={<CircleCheckBig />} visible={tournament.status === 'active' && tournament.current_round === undefined} />
          <MenuItem label="Delete" icon={<Trash />} visible={tournament.status === 'draft'} />
          <MenuItem label="Un-publish" icon={<EyeOff />} visible={tournament.status === 'published'} />
          <MenuItem label="Cancel event" icon={<CircleOff />} visible={tournament.status === 'published'} />
          <MenuItem label="End round early" icon={<TimerOff />} visible={tournament.status === 'active' && tournament.current_round !== undefined} />
        </Popover.Content>
      </Popover.Root>
      <AdvanceRoundDialog
        tournamentId={tournament.id}
        open={advanceRoundDialogOpen}
        onOpenChange={setAdvanceRoundDialogOpen}
      />
    </>
  );
};

/*
  once a tournament is set to active, you can generate pairings

  There needs to be two fields: current_round and round_active
  current_round should never be null

  When a round ends (because the timer counted down), round_active should be set to false.

  When all matches are in, org can press "Advance to next round"
  - Current_round++
  - Pairings generated for the new round

  If pairings.length * 2 === competitors.length (everyone matched), org can press "Begin round ${i}"

  - round_active = true (or timer created)

  IDEA: Option to hide pairings until round_active === true?

  timers:
  - started_at
  - duration
  - paused_at
  - stoppage_time
  - tournament_id
  - round_index

  // (re)Start timer:
  - started_at: now
  - duration: some number
  - paused_at: null
  - stoppage_time: 0

  // Pause timer:
  - paused_at: now

  // Resume timer:
  - stoppage_time: += now - paused_at
  - paused_at: null

*/