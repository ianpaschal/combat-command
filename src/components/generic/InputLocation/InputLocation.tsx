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

type Location = {
  lat: number;
  lon: number;
  placeId: string;
};

export interface InputLocationProps {
  value?: Location,
  onChange?: (location?: Location) => void;
}

export const InputLocation = forwardRef<HTMLButtonElement, InputLocationProps>(({
  value,
  onChange,
  ...props
}, ref): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchTerm, 500); // Delay by 500ms
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(value?.placeId);

  const { data: suggestions } = useSuggestLocation(debouncedSearch);
  const { data: selectedPlace } = useRetrieveLocation(selectedPlaceId);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value);

  const handleSelect = (placeId: string): void => {
    setSelectedPlaceId(placeId);
  };

  const handleClear = (): void => {
    setSelectedPlaceId(undefined);
    if (onChange) {
      onChange(undefined);
    }
  };

  useEffect(() => {
    if (value && value.placeId !== selectedPlaceId) {
      setSelectedPlaceId(selectedPlaceId);
    }
  }, [selectedPlaceId, setSelectedPlaceId, value]);

  useEffect(() => {
    if (selectedPlace && onChange) {
      const placeId = selectedPlace.properties.mapbox_id;
      const [lat, lon] = selectedPlace.geometry.coordinates;
      onChange({ placeId, lat, lon });
    }
  }, [selectedPlace, onChange]);

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
