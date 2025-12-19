import {
  ChangeEvent,
  useCallback,
  useState,
} from 'react';
import clsx from 'clsx';
import debounce from 'debounce';
import { Search, X } from 'lucide-react';

import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useGetUsers } from '~/services/users';

import styles from './UserList.module.scss';

export interface UserListProps {
  className?: string;
  excludeUserIds?: UserId[];
  onConfirm: (userId: UserId | null) => void,
  selected?: UserId;
}

export const UserList = ({
  className,
  excludeUserIds = [],
  onConfirm,
  selected,
}: UserListProps): JSX.Element => {

  // State:
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [debouncing, setDebouncing] = useState<boolean>(false);

  const debouncedSetSearch = debounce((value: string) => {
    setDebouncedSearch(value);
    setDebouncing(false);
  }, 250);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setDebouncing(true);
    debouncedSetSearch(value);
  };

  const {
    data: userList,
    loadMore,
    status,
    loading,
  } = useGetUsers({ search: debouncedSearch });

  const showLoading = debouncing || loading;

  // Handle infinite scroll:
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 48;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    if (isNearBottom && status === 'CanLoadMore' && !showLoading) {
      loadMore();
    }
  }, [loadMore, status, showLoading]);

  // Remove own user, and currently selected user from options:
  const selectableUsers = (userList || []).filter((u) => {
    const isSelected = u._id === selected;
    const isExcluded = excludeUserIds.includes(u._id);
    return !isSelected && !isExcluded;
  });
  const selectedUser = (userList || []).find((u) => u._id === selected);

  const handleSelect = (userId: UserId): void => {
    onConfirm(userId);
  };
  const handleClear = (): void => {
    onConfirm(null);
  };

  return (
    <div className={clsx(styles.UserList, className)}>
      <InputText
        className={styles.UserList_SearchBox}
        placeholder="Search"
        slotBefore={<Search />}
        size="large"
        onChange={handleChangeSearch}
        value={search}
      />
      {selectedUser && (
        <div className={styles.UserList_SelectedUser}>
          <IdentityBadge
            className={styles.UserList_SelectedUser_Badge}
            user={selectedUser}
            size="small"
            disableLink
          />
          <Button
            className={styles.UserList_SelectedUser_Clear}
            icon={<X />}
            size="small"
            variant="ghost"
            onClick={handleClear}
          />
        </div>
      )}
      <ScrollArea
        className={styles.UserList_ScrollArea}
        onScroll={handleScroll}
      >
        <div className={styles.UserList_List}>
          {selectableUsers.map((user, i) => (
            <div className={styles.UserList_ListItem} key={i}>
              <IdentityBadge user={user} size="small" disableLink />
              <Button
                text="Select"
                onClick={() => handleSelect(user?._id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
