import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { useRetrieveLocation } from '~/services/mapbox/useRetrieveLocation';
import { useSuggestLocation } from '~/services/mapbox/useSuggestLocation';
import { LocationButton } from './LocationButton';

import styles from './InputLocation.module.scss';

export interface InputLocationProps {
  value?: string,
  onChange?: (placeId?: string) => void;
}

export const InputLocation = forwardRef<HTMLButtonElement, InputLocationProps>(({
  value,
  onChange,
  ...props
}, ref): JSX.Element => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchTerm, 500); // Delay by 500ms
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(value);

  const { data: suggestions } = useSuggestLocation(debouncedSearch);
  const { data: selectedPlace } = useRetrieveLocation(selectedPlaceId);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value);

  const handleSelect = (id: string): void => {
    setSelectedPlaceId(id);
    if (onChange) {
      onChange(id);
    }
  };

  const handleClear = (): void => {
    setSelectedPlaceId(undefined);
    if (onChange) {
      onChange(undefined);
    }
  };

  useEffect(() => {
    if (value && value !== selectedPlaceId) {
      setSelectedPlaceId(selectedPlaceId);
    }
  }, [selectedPlaceId, setSelectedPlaceId, value]);

  return (
    <div className={styles.Root}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <LocationButton
            ref={ref}
            place={selectedPlace?.properties}
            placeholder="Search..."
            {...props}
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.InputDatePopoverContent} align="start">
            <InputText
              slotBefore={<Search />}
              value={searchTerm}
              onChange={handleSearch}
            />
            {(suggestions || []).map((location) => (
              <Popover.Close key={location.mapbox_id} asChild>
                <LocationButton place={location} onClick={() => handleSelect(location.mapbox_id)} />
              </Popover.Close>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {selectedPlaceId && (
        <Button
          onClick={handleClear}
          variant="ghost"
          className={styles.ClearButton}
        >
          <X />
        </Button>
      )}
    </div>
  );
});
InputLocation.displayName = 'InputLocation';