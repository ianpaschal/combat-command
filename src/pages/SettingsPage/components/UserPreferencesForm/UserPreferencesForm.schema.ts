import { DeepPartial } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const userPreferencesFormSchema = z.object({
  theme: z.union([z.literal('light'), z.literal('dark'), z.literal('system')]),
});

export const userPreferencesFormResolver = zodResolver(userPreferencesFormSchema);

export type UserPreferencesFormData = z.infer<typeof userPreferencesFormSchema>;

export const defaultValues: DeepPartial<UserPreferencesFormData> = {
  theme: 'light',
};
