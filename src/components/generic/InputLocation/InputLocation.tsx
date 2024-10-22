import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Search } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { useFetchLocation } from '~/hooks/services/useFetchLocation';
import { useLocationSearch } from '~/hooks/services/useLocationSearch';
import { useDebounce } from '~/hooks/useDebounce';

import './InputDate.scss';

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

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(value);

  const { data: locations } = useLocationSearch(searchTerm);
  const { data: selectedPlace } = useFetchLocation(selectedPlaceId);

  const handleSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value));

  useEffect(() => {
    if (onChange && selectedPlaceId) {
      onChange(selectedPlaceId);
    }
  }, [onChange, selectedPlaceId]);

  console.log(locations);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button ref={ref} variant="outlined" {...props}>
          {selectedPlace?.length ? selectedPlace[0].display_name : 'Search...'}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="InputDatePopoverContent" align="start">
          <InputText
            slotBefore={<Search />}
            // value={searchTerm}
            onChange={handleSearch}
          />
          {locations && locations.slice(0, 10).map((location) => (
            <Popover.Close key={location.place_id} asChild >
              <Button variant="outlined" onClick={() => setSelectedPlaceId(`${location.osm_type.substring(0, 1).toUpperCase()}${location.osm_id}`)}>
                {location.display_name}
              </Button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
InputLocation.displayName = 'InputLocation';