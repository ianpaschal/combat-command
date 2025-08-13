import {
  FieldValues,
  Path,
  UseFormSetError,
} from 'react-hook-form';
import { ZodTypeAny } from 'zod';

export const validateForm = <T extends ZodTypeAny>(
  schema: T,
  formData: unknown,
  setError: UseFormSetError<FieldValues>,
): ReturnType<T['parse']> | void => {
  const result = schema.safeParse(formData);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const fieldPath = issue.path.join('.') as Path<FieldValues>;
      setError(fieldPath, { message: issue.message });
    });
  }
  return result.data;
};
