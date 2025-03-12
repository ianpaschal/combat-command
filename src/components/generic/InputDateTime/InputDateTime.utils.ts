import {
  format,
  fromZonedTime,
  toZonedTime,
} from 'date-fns-tz';
import tzlookup from 'tz-lookup';

export const localTimeFormat = 'yyyy-MM-dd\'T\'HH:mm:ss';

export type LatLon = {
  lat: number;
  lon: number;
};

export const convertLocalStringToUTCString = (local: string, { lat, lon }: LatLon ): string => {
  const timezone = tzlookup(lat, lon);
  return fromZonedTime(local, timezone).toISOString();
};

export const convertUTCStringToLocalString = (utc: string, { lat, lon }: LatLon): string => {
  const timezone = tzlookup(lat, lon);
  return format(toZonedTime(utc, timezone), localTimeFormat);
};

export type CreateLocalDatetimeStringInput = {
  date?: string;
  hours?: number;
  minutes?: number;
};

export const createLocalDatetimeString = (input: CreateLocalDatetimeStringInput): string => {
  const date = new Date();
  // TODO: Add some validation here
  if (input.date) {
    const [year, month, day] = input.date.split('-');
    date.setFullYear(parseInt(year, 10));
    date.setMonth(parseInt(month, 10)-1);
    date.setDate(parseInt(day, 10));
  }

  date.setHours(input?.hours || 0);
  date.setMinutes(input?.minutes || 0);
  
  return format(date, localTimeFormat);
};
