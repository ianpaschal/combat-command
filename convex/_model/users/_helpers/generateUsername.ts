import {
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const generateUsername = (): string => {
  const base = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: '',
    style: 'capital',
    length: 2,
  });
  const number = Math.floor(Math.random() * 90) + 10;
  return `${base}${number}`;
};
