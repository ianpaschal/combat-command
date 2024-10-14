import { ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import {
  ArrowRightToLine,
  CircleCheckBig,
  CircleOff,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Swords,
  TimerOff,
  Trash,
  UserRoundPen,
  UserRoundX,
} from 'lucide-react';

import { MenuItem } from '~/components/generic/MenuItem';
import { Tournament } from '~/types/Tournament';

import styles from './ManageTournamentMenu.module.scss';

export interface ManageTournamentMenuProps {
  tournament: Tournament;
  trigger: ReactElement;
}

export const ManageTournamentMenu = ({
  tournament,
  trigger,
}: ManageTournamentMenuProps): JSX.Element => (
  <Popover.Root>
    <Popover.Trigger asChild>
      {trigger}
    </Popover.Trigger>
    <Popover.Content className={styles.Content} align="end">
      <MenuItem label="Edit" icon={<Pencil />} visible={['draft', 'published'].includes(tournament.status)} />
      <MenuItem label="Publish" icon={<Eye />} visible={tournament.status === 'draft'} />
      <MenuItem label="Add match result" icon={<Plus />} visible={tournament.status === 'active' && tournament.current_round !== undefined} disabled />
      <MenuItem label="Open registrations" icon={<UserRoundPen />} visible={tournament.status === 'published' && tournament.registrations_open} />
      <MenuItem label="Close registrations" icon={<UserRoundX />} visible={tournament.status === 'published' && !tournament.registrations_open} />
      <MenuItem label="Generate new pairings" icon={<Swords />} visible={tournament.status === 'active' && tournament.current_round === undefined} />
      <MenuItem label="Start next round" icon={<ArrowRightToLine />} visible={tournament.status === 'active' && tournament.current_round === undefined} />
      <MenuItem label="Complete tournament" icon={<CircleCheckBig />} visible={tournament.status === 'active' && tournament.current_round === undefined} />
      <MenuItem label="Delete" icon={<Trash />} visible={tournament.status === 'draft'} />
      <MenuItem label="Un-publish" icon={<EyeOff />} visible={tournament.status === 'published'} />
      <MenuItem label="Cancel event" icon={<CircleOff />} visible={tournament.status === 'published'} />
      <MenuItem label="End round early" icon={<TimerOff />} visible={tournament.status === 'active' && tournament.current_round !== undefined} />
    </Popover.Content>
  </Popover.Root>
);

//   If status === draft:

//   Actions: Edit, Publish, Delete

// If status === published:
//   - Edit
//     - Un - publish
//     - Cancel
//     - Open Registrations(if closed)
//     - Close Registrations(if open)

// If status === active && current_round:
//   - End round early
//     - Add match result

// If status == - active:
//   - Complete tournament

// If status === active && !current_round && !pairings:
//   - Generate new pairings

// If status === active && !current_round && pairings:
//   - Start next round

// If status === archived:
//   - NOTHING! 
