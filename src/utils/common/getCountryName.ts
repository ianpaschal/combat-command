import { country, subdivision } from 'iso-3166-2';

export const getCountryName = (code: string): string | undefined => {
  if (code === 'merc') {
    return 'Mercenaries';
  } else {
    if (code.includes('-')) {
      return subdivision(code)?.name;
    } else {
      return country(code)?.name;
    }
  }
};