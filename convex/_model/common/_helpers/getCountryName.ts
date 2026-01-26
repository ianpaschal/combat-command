import { country, subdivision } from 'iso-3166-2';

export const getCountryName = (code: string | undefined): string | undefined => {
  if (!code) {
    return undefined;
  }
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
    try {
      return subdivision(code)?.name;
    } catch {
      return undefined;
    }
  }
  try {
    return country(code)?.name;
  } catch {
    return undefined;
  }
};
