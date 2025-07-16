import { country, subdivision } from 'iso-3166-2';

export const getCountryName = (code: string): string | undefined => {
  if (code === 'xx-lkt') {
    return 'Landsknechte';
  }
  if (code === 'xx-mrc') {
    return 'Mercenaries';
  }
  if (code === 'xx-prt') {
    return 'Pirates';
  }
  if (code === 'un') {
    return 'United Nations';
  }
  if (code.includes('-')) {
    return subdivision(code)?.name;
  }
  return country(code)?.name;
};
