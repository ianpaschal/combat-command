import { getNames } from 'i18n-iso-countries';

import { InputSelectOption } from '~/components/generic/InputSelect';
import { getCountryName } from '~/utils/common/getCountryName';

export const getCountryOptions = (): InputSelectOption<string>[] => {

  const isoCountriesWithoutBritain = Object.entries(getNames('en', { select: 'alias' })).reduce((acc, [code, name]) => {
    if (code !== 'GB') {
      return [...acc, { label: name,value: code.toLowerCase() }];
    }
    return acc;
  }, [] as InputSelectOption<string>[]);

  const britishCountries = ['gb-eng', 'gb-wls', 'gb-sct', 'gb-nir'].map((code) => ({ label: getCountryName(code) || 'Unknown Country', value: code }));
  
  return [
    ...isoCountriesWithoutBritain,
    ...britishCountries,
  ].sort((a, b) => a.label.localeCompare(b.label));
};

export const getEtcCountryOptions = (): InputSelectOption<string>[] => [
  'at',
  'au',
  'be',
  'ca',
  'ch',
  'de',
  'dk',
  'es',
  'fi',
  'fr',
  'gb-eng',
  'gb-nir',
  'gb-sct',
  'gb-wls',
  'gr',
  'ie',
  'is',
  'it',
  'nl',
  'nz',
  'pl',
  'pt',
  'ro',
  'se',
  'us',
].map(
  (code) => ({ label: getCountryName(code) || 'Unknown Country', value: code }),
).sort(
  (a, b) => a.label.localeCompare(b.label),
);
