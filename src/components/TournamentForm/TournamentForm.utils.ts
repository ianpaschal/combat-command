import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const convertEpochToDate = (epoch: number, timezone: string): Date => {
  // Create a Date object from the epoch (this will be in UTC)
  const utcDate = new Date(epoch);
  
  // Convert from UTC to the specified timezone
  // This gives us the local time representation in that timezone
  return fromZonedTime(utcDate, timezone);
};

export const convertDateToEpoch = (date: Date, timezone: string): number => {
  // Convert the local date to UTC using the provided timezone
  const utcDate = toZonedTime(date, timezone);
  
  // Return the epoch timestamp
  return utcDate.getTime();
};

export const convertStringToDate = (dateString: string, timezone: string): Date => {
  // Parse the ISO date string and convert to the specified timezone
  const date = new Date(dateString);
  return fromZonedTime(date, timezone);
};

export const convertDateToString = (date: Date, timezone: string): string => {
  // Convert the local date to UTC using the provided timezone
  const utcDate = toZonedTime(date, timezone);
  
  // Return as ISO string
  return utcDate.toISOString();
};
