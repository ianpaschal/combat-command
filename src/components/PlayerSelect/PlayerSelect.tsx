import { useEffect, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Search, UserSearch } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Dialog } from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { UserPortrait } from '~/components/UserPortrait';

import styles from './PlayerSelect.module.scss';

export interface PlayerOption {
  avatar_url?: string | null;
  label: string;
  username?: string | null;
  value: string;
}

export interface PlayerSelectProps {
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  onChange: (id: string | null) => void;
  options: PlayerOption[];
  value?: string | null;
}

export const PlayerSelect = ({
  className,
  hasError,
  onChange,
  options = [],
  value,
}: PlayerSelectProps): JSX.Element => {
  const [filterText, setFilterText] = useState<string>('');
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(filterText.toLowerCase()),
  ).sort(
    (a, b) => a.label.localeCompare(b.label),
  );

  useEffect(() => {
    if (options.length === 1) {
      onChange(options[0].value);
    }
  }, [options, onChange]);

  return (
    <Dialog
      title="Select Player"
      trigger={
        <div className={clsx(styles.Trigger, { [styles['Trigger-hasError']]: hasError }, className)}>
          {value ? (
            <UserPortrait displayName={selectedOption?.label}>
              <Avatar />
            </UserPortrait>
          ) : (
            <UserPortrait displayName="Select player...">
              <div className={styles.PlaceholderAvatar}>
                <UserSearch />
              </div>
            </UserPortrait>
          )}
        </div>
      }
      width="small"
      height={600}
    >
      <div className={styles.Toolbar}>
        <InputText
          slotAfter={<Search />}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <ScrollArea indicatorBorder="top" className={styles.ScrollArea}>
        <div className={styles.PlayerList}>
          {filteredOptions.map((option) => (
            <DialogClose key={option.value} asChild>
              <Button
                className={styles.PlayerListItem}
                onClick={() => {
                  onChange(option.value === value ? null : option.value);
                }}
                variant={option.value === value ? 'solid' : 'ghost'}
                size={'large'}
              >
                <Avatar />
                {option.label}
                {option.username && (
                  <span>{option.username}</span>
                )}
              </Button>
            </DialogClose>
          ))}
        </div>
      </ScrollArea>
    </Dialog >
  );
};
