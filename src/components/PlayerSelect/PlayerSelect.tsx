import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Search, UserSearch } from 'lucide-react';

import { Dialog } from '~/components/generic/Dialog';
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
    <Dialog
      title="Select Player"
      trigger={
        <div className={clsx('PlayerSelectTrigger', `PlayerSelectTrigger-${variant}`, className)}>
          {selectedId ? (
            <UserPortrait username="Foooby" className="PlayerSelectUserPortrait" />
          ) : (
            <Stack orientation="vertical" gap="0.5rem">
              <UserSearch className="PlayerSelectIcon" />
              <span className="PlayerSelectPlaceholder">Select User...</span>
            </Stack>
          )}
        </div>
      }
    >
      <InputText slotAfter={<Search />} />
      {players.map((player) => (
        <div key={player.id}>

        </div>
      ))}
    </Dialog>
  );
};
