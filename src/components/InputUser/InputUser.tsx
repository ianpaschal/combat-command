import {
  ChangeEvent,
  forwardRef,
  MouseEvent,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Popover } from '@base-ui/react/popover';
import clsx from 'clsx';
import {
  Search,
  User as UserIcon,
  X,
} from 'lucide-react';

import { User, UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useDebouncedState } from '~/hooks/useDebouncedState';
import { useGetUser, useGetUsers } from '~/services/users';

import styles from './InputUser.module.scss';

export interface InputUserProps {
  className?: string;
  value?: UserId | null;
  onChange?: (value: UserId | null) => void;
  options?: User[];
  excludeIds?: UserId[];
  loading?: boolean;
  disabled?: boolean;
  id?: string;
}

export const InputUser = forwardRef<HTMLButtonElement, InputUserProps>(({
  className,
  excludeIds,
  options: availableUsers,
  onChange,
  value: controlledValue,
  loading = false,
  disabled = false,
  id,
}, ref): JSX.Element => {

  // Refs:
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedUserRef = useRef<User | undefined>();

  // State:
  const [value, setValue] = useState<UserId | null>(controlledValue ?? null);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useDebouncedState<string>('');

  // Sync controlled value to internal state:
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  // Fetch Data
  const {
    data: searchResults,
    loadMore,
    status,
    loading: searchResultsLoading,
  } = useGetUsers(search.debouncedValue?.length && !availableUsers?.length ? {
    search: search.debouncedValue,
    excludeIds,
  } : 'skip');

  // Fetch display user and 
  const {
    data: selectedUser,
    loading: selectedUserLoading,
  } = useGetUser(value ? { id: value } : 'skip');
  if (selectedUser && selectedUser._id === value) {
    selectedUserRef.current = selectedUser;
  }

  const options = availableUsers ? availableUsers.filter((u) => (
    u.displayName.toLowerCase().includes(search.value.toLowerCase())
  )) : searchResults ?? [];

  const showLoading = !options && (search.debouncing || searchResultsLoading);
  const showResults = !showLoading && options && options.length > 0;
  const showEmptyState = !showLoading && search.debouncedValue?.length > 0 && options && options.length === 0;

  // Handle infinite scroll:
  const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 48;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    if (isNearBottom && status === 'CanLoadMore' && !showLoading) {
      loadMore();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      inputRef.current?.focus();
    } else {
      setSearch('');
    }
  };

  const handleSelect = (user: User): void => {
    selectedUserRef.current = user;
    setValue(user._id);
    onChange?.(user._id);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    selectedUserRef.current = undefined;
    setValue(null);
    onChange?.(null);
  };

  return (
    <div className={styles.InputUser}>
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger
          className={clsx(styles.InputUser_Trigger, className)}
          disabled={disabled}
          ref={ref}
          id={id}
        >
          {value ? (
            <IdentityBadge
              user={selectedUserRef.current}
              disableLink
              size="small"
              loading={loading || selectedUserLoading}
            />
          ) : (
            <IdentityBadge
              disableLink
              size="small"
              placeholder={{ icon: <UserIcon />, displayName: 'Select a user...' }}
            />
          )}

        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="start"
            collisionPadding={8}
            sideOffset={4}
            collisionAvoidance={{
              side: 'flip',
              align: 'none',
              fallbackAxisSide: 'none',
            }}
          >
            <Popover.Popup className={styles.InputUser_Popup}>
              <div className={styles.InputUser_SearchBar}>
                <Search />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search users..."
                  value={search.value}
                  onChange={handleChangeSearch}
                />
              </div>
              <ScrollArea onScroll={handleScroll}>
                {showLoading && (
                  <div className={styles.InputUser_LoadingState}>
                    Loading...
                  </div>
                )}
                {showEmptyState && (
                  <div className={styles.InputUser_EmptyState}>
                    No users found.
                  </div>
                )}
                {showResults && (
                  <div className={styles.InputUser_SearchResults}>
                    {(options ?? []).map((user) => (
                      <div
                        key={user._id}
                        className={styles.InputUser_SearchResult}
                        onClick={() => handleSelect(user)}
                      >
                        <IdentityBadge user={user} size="small" disableLink />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <Button
        className={styles.InputUser_Clear}
        icon={<X />}
        onClick={handleClear}
        variant="outlined"
        disabled={disabled || value === null}
        tabIndex={0}
      />
    </div>
  );
});
