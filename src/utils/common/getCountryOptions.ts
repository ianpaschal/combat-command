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

  console.log('foo', [
    ...isoCountriesWithoutBritain,
    ...britishCountries,
  ].sort((a, b) => a.label.localeCompare(b.label)));
  
  return [
    ...isoCountriesWithoutBritain,
    ...britishCountries,
  ].sort((a, b) => a.label.localeCompare(b.label));
};

const etcCountryCodes = [
  'nl',
  'be',
  'lu',
  'is',
  'dk',
  'de',
  'se',
  'no',
  'fi',
  'gb-sct',
  'gb-nir',
  'ie',
  'gb-wls',
  'gb-eng',
  'ch',
  'fr',
  'es',
  'pt',
  'it',
  'at',
  'nz',
  'us',
  'pl',
];

export const getEtcCountryOptions = (): InputSelectOption<string>[] => (
  etcCountryCodes.map((code) => ({
    label: getCountryName(code) || 'Unknown Country',
    value: code,
  }))
);