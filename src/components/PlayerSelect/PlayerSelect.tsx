import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Search, UserSearch } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { Stack } from '~/components/generic/Stack';
import { UserPortrait } from '~/components/UserPortrait';

import './PlayerSelect.scss';

interface PlayerOption {
  id: string;
  given_name: string;
  surname: string;
  avatar_url: string;
}

export interface PlayerSelectProps {
  className?: string;
  players: PlayerOption[];
  variant?: 'outlined' | 'ghost';
  onSelect: (id: string | null) => void;
}

export const PlayerSelect = ({
  onSelect,
  className,
  variant = 'ghost',
  players,
}: PlayerSelectProps): JSX.Element => {
  const [selectedId] = useState<string | null>(null);
  useEffect(() => {
    onSelect(selectedId);
  }, [onSelect, selectedId]);
  return (
    <Dialog>
      <DialogTrigger className={clsx('PlayerSelectTrigger', `PlayerSelectTrigger-${variant}`, className)}>
        {selectedId ? (
          <UserPortrait username="Foooby" className="PlayerSelectUserPortrait" />
        ) : (
          <Stack orientation="vertical" gap="0.5rem">
            <UserSearch className="PlayerSelectIcon" />
            <span className="PlayerSelectPlaceholder">Select User...</span>
          </Stack>
        )}
      </DialogTrigger>
      <DialogContent title="Select User">
        <InputText slotAfter={<Search />} />
        {players.map((player) => (
          <div key={player.id}>

          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

/*

to get relevant users:

1. Select pairings where active is true, and opponents includes a registration which includes this user ID.

1. Select users where user ID is in registrations which are in tournament pairings which are currently active, and also include registrations which include this user ID.

WE ARE GETTING RID OF TEAMS
Instead its registrations
each registration includes an array of user Ids and an array of list IDs

const { data, error } = await supabase.from('users').select(`
  id, 
  name, 
  registrations ( id, name )
`).where()

const { data, error } = await supabase
  .from('users')
  .select(`
    name,
    cities!inner (
      name
    )
  `)
  .or('country_id.eq.1,name.eq.Beijing', { referencedTable: 'cities' })

// New Structure

TYPES:
- user
- friendship
- tournament
- tournament_task
- tournament_competitor
- tournament_pairing
- list
- match_result
- badge
- game_system

TOURNAMENT STUFF:
- tournament has array of tournament_competitor_ids.

- tournament has array of tournament_pairing_ids.

- tournament_pairing has tuple of [tournament_competitor_id, tournament_competitor_id].

- tournament_competitor has array of user ID array and list ID array;

1. Get active pairings: Select from pairings, which are active and tournament_competitor_id includes a competitor which includes this user.

const { data, error } = await supabase.from('tournament_pairings')
  .select('*, tournament_competitors(user_ids)')
  .eq('is_active', true)
  .contains('tournament_competitors.user_ids', [userId]);

2. once a pairing is selected, take the other competitor id and query users which 

*/