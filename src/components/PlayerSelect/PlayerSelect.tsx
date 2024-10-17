import { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Search, UserSearch } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Dialog } from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { UserPortrait } from '~/components/UserPortrait';
import { User } from '~/types/User';
import { getUserDisplayName } from '~/utils/getUserDisplayName';

import styles from './PlayerSelect.module.scss';

interface PlayerOption {
  id: string;
  given_name: string;
  family_name: string;
  username: string;
  avatar_url: string;
}

export interface PlayerSelectProps {
  className?: string;
  value?: string;
  hasError?: boolean;
  onChange: (id: string | null) => void;
}

export const PlayerSelect = ({
  value,
  onChange,
  hasError,
  className,
}: PlayerSelectProps): JSX.Element => {

  const [filterText, setFilterText] = useState<string>('');

  const players: PlayerOption[] = [
    {
      'id': '143f4b07-98b6-4525-9c5f-f03f2a750854',
      'given_name': 'John',
      'family_name': 'Moore',
      'username': 'john_shadow369',
      'avatar_url': '',
    },
    {
      'id': '8e574241-e191-4d70-b6a5-93373217ebf5',
      'given_name': 'Robert',
      'family_name': 'Williams',
      'username': 'robert_gamer715',
      'avatar_url': '',
    },
    {
      'id': '453e8a74-d88c-4191-bcea-13d6f25c80ce',
      'given_name': 'David',
      'family_name': 'Jones',
      'username': 'david_ninja599',
      'avatar_url': '',
    },
    {
      'id': '3e059d06-c3c8-47f7-8e56-d8255c6a45e7',
      'given_name': 'John',
      'family_name': 'Jones',
      'username': 'john_gamer888',
      'avatar_url': '',
    },
    {
      'id': '10a45d69-0193-4d14-b7aa-f66e79571410',
      'given_name': 'Daniel',
      'family_name': 'Johnson',
      'username': 'daniel_hunter337',
      'avatar_url': '',
    },
    {
      'id': '6844f8ba-a36b-4b6b-a0f5-be52c3bea1eb',
      'given_name': 'Michael',
      'family_name': 'Miller',
      'username': 'michael_storm163',
      'avatar_url': '',
    },
    {
      'id': '27458579-7155-4f9c-a64d-b91a7df3ba49',
      'given_name': 'Chris',
      'family_name': 'Williams',
      'username': 'chris_gamer778',
      'avatar_url': '',
    },
    {
      'id': '29eeda60-369d-4c6e-b1f9-b158be0eaa5e',
      'given_name': 'Michael',
      'family_name': 'Taylor',
      'username': 'michael_storm648',
      'avatar_url': '',
    },
    {
      'id': '23164771-141e-44e6-8855-c64d9ebb7557',
      'given_name': 'Robert',
      'family_name': 'Moore',
      'username': 'robert_hunter768',
      'avatar_url': '',
    },
    {
      'id': '33cbb4f2-5c09-4f9e-aef8-fa3f716cd36e',
      'given_name': 'Thomas',
      'family_name': 'Miller',
      'username': 'thomas_beast285',
      'avatar_url': '',
    },
    {
      'id': '82a30e0f-e5b5-4221-aabc-af5492193dda',
      'given_name': 'David',
      'family_name': 'Taylor',
      'username': 'david_storm404',
      'avatar_url': '',
    },
    {
      'id': '9e353a8d-a32f-4779-bb27-ab24c2a8bbfd',
      'given_name': 'Mark',
      'family_name': 'Wilson',
      'username': 'mark_shadow929',
      'avatar_url': '',
    },
    {
      'id': 'ce52326a-3de3-4ce2-aa59-0e02a2d03949',
      'given_name': 'Alex',
      'family_name': 'Taylor',
      'username': 'alex_ghost367',
      'avatar_url': '',
    },
    {
      'id': '2ca8047a-0f43-4e98-ac89-074c24af63ff',
      'given_name': 'James',
      'family_name': 'Davis',
      'username': 'james_dragon718',
      'avatar_url': '',
    },
    {
      'id': '6685cd71-6735-4305-9224-d6d49de1d9f8',
      'given_name': 'Chris',
      'family_name': 'Davis',
      'username': 'chris_wolf717',
      'avatar_url': '',
    },
    {
      'id': 'be30b2aa-731a-46a0-980d-86a144d8252f',
      'given_name': 'John',
      'family_name': 'Williams',
      'username': 'john_wolf583',
      'avatar_url': '',
    },
    {
      'id': '4b82b49e-5597-47e2-b328-cead8aa7ab83',
      'given_name': 'Alex',
      'family_name': 'Taylor',
      'username': 'alex_gamer186',
      'avatar_url': '',
    },
    {
      'id': '698ea66f-4bdf-4878-80b3-dabae1f86bcd',
      'given_name': 'James',
      'family_name': 'Jones',
      'username': 'james_wolf854',
      'avatar_url': '',
    },
    {
      'id': 'e2c7eebc-527d-4345-ab46-f064e50bdd01',
      'given_name': 'Robert',
      'family_name': 'Williams',
      'username': 'robert_warrior413',
      'avatar_url': '',
    },
    {
      'id': 'cc079202-fbac-40ad-87ce-f5d266b0a65a',
      'given_name': 'David',
      'family_name': 'Miller',
      'username': 'david_hunter913',
      'avatar_url': '',
    },
  ];

  const playerOptions = players.filter((player) => (
    player.given_name.includes(filterText) ||
    player.family_name.includes(filterText) ||
    player.username.includes(filterText) ||
    player.id === value
  ));

  return (
    <Dialog
      title="Select Player"
      trigger={
        <div className={clsx(styles.Trigger, { [styles['Trigger-hasError']]: hasError }, className)}>
          {value ? (
            <UserPortrait name={getUserDisplayName(players.find((player) => player.id === value) as User)}>
              <Avatar />
            </UserPortrait>
          ) : (
            <UserPortrait name="Select player...">
              <div className={styles.PlaceholderAvatar}>
                <UserSearch />
              </div>
            </UserPortrait>
          )}
        </div>
      }
      maxWidth={360}
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
          {playerOptions.map((player) => (
            <DialogClose key={player.id} asChild>
              <Button
                className={styles.PlayerListItem}
                onClick={() => {
                  onChange(player.id === value ? null : player.id);
                }}
                variant={player.id === value ? 'solid' : 'ghost'}
                size={null}
              >
                <Avatar />{getUserDisplayName(player as User)}
              </Button>
            </DialogClose>
          ))}
        </div>
      </ScrollArea>
    </Dialog >
  );
};
