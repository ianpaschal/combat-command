import { z } from 'zod';

export const appearanceFormSchema = z.object({
  user_id: z.string(),
  language_code: z.string(),
  use_dark_mode: z.boolean(),
  color_scheme: z.string(),
});

export type AppearanceFormData = z.infer<typeof appearanceFormSchema> ;
