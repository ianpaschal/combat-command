import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { UserId } from '~/api';

export const substitutePlayerFormSchema = z.object({
  activeUserId: z.string().transform((val) => val as UserId),
  inactiveUserId: z.string().transform((val) => val as UserId),
});

export type SubstitutePlayerFormData = z.infer<typeof substitutePlayerFormSchema>;

export const defaultValues: DeepPartial<SubstitutePlayerFormData> = {
  activeUserId: '',
  inactiveUserId: '',
};
