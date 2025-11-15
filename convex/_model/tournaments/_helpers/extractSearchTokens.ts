import { Doc } from '../../../_generated/dataModel';

const keys: (keyof Doc<'tournaments'>)[] = [
  'title',
  'editionYear',
  'description',
  'location',
  'gameSystem',
] as const;

export const extractSearchTokens = (doc: Doc<'tournaments'>): string => keys.map((key) => {
  if (key === 'location') {
    const { name, placeFormatted, countryCode } = doc[key];
    return [name, placeFormatted, countryCode].join(' ');
  }
  if (key === 'gameSystem') {
    return doc[key].replace(/[._-]/g, ' ');
  }
  return `${doc[key]}`;
}).map((token) => token.toLowerCase().replace(/[._-]/g, ' ')).join(' ');
