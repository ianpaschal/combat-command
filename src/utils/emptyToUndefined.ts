import z from 'zod';

// Helper to convert empty strings and null to undefined
export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => (val === '' || val === null ? undefined : val), schema);
