import { DeepPartial } from 'react-hook-form';
import {
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { z } from 'zod';

export const createSchema = () => z.object({
  givenName: z.string(),
  familyName: z.string(),
  email: z.string(),
});

export type UserSubmitData = z.infer<ReturnType<typeof createSchema>>;

export type UserFormData = Partial<UserSubmitData>;

export const getDefaultValues = (): DeepPartial<UserSubmitData> => ({
  givenName: '',
  familyName: '',
  email: '',
});

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
