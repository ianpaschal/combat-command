import {
  ChangeEvent,
  forwardRef,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Search, X } from 'lucide-react';
import tzLookup from 'tz-lookup';
import { useDebounce } from 'use-debounce';

import { Location } from '~/api';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { retrieveLocation } from '~/services/mapbox/useRetrieveLocation';
import { useSuggestLocation } from '~/services/mapbox/useSuggestLocation';
import { LocationButton } from './LocationButton';

import styles from './InputLocation.module.scss';

export interface InputLocationProps {
  value?: Location,
  hasError?: boolean;
  onChange?: (location?: Location) => void;
}

export const InputLocation = forwardRef<HTMLButtonElement, InputLocationProps>(({
  value,
  onChange,
  // hasError = false,
  ...props
}, ref): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchTerm, 500); // Delay by 500ms

  const { data: suggestions } = useSuggestLocation(debouncedSearch);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value);

  const handleSelect = async (mapboxPlaceId: string): Promise<void> => {
    const place = await retrieveLocation(mapboxPlaceId);
    if (place) {
      const [lon, lat] = place.geometry.coordinates;
      if (onChange) {
        onChange({
          mapboxId: place.properties.mapbox_id,

          name: place.properties.name,
          placeFormatted: place.properties.place_formatted,

          // This information could be retrieved later, but putting it in the model makes us backwards
          // compatible if we eventually look up address info differently, or want to let the user edit it
          address: place.properties.context.address?.name ?? '',
          locality: place.properties.context.locality?.name,
          district: place.properties.context.district?.name,
          city: place.properties.context.place?.name,
          postcode: place.properties.context.postcode?.name,
          region: place.properties.context.region ? { // US state
            code: place.properties.context.region.region_code.toLowerCase(),
            name: place.properties.context.region.name,
          } : undefined,
          countryCode: place.properties.context.country?.country_code.toLowerCase() ?? '',

          coordinates: { lat, lon },
          timeZone: tzLookup(lat, lon),
        });
      }
    }
  };

  const handleClear = (): void => {
    if (onChange) {
      onChange(undefined);
    }
  };

  return (
    <div className={styles.Root}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <LocationButton
            ref={ref}
            place={value}
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
                <LocationButton place={{
                  name: location.name,
                  placeFormatted: location.place_formatted,
                }} onClick={() => handleSelect(location.mapbox_id)} />
              </Popover.Close>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {value && (
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
