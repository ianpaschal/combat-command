import {
  FieldValues,
  Path,
  UseFormSetError,
} from 'react-hook-form';
import { ZodTypeAny } from 'zod';

import { toast } from '~/components/ToastProvider';

export const validateForm = <T extends ZodTypeAny, TFieldValues extends FieldValues = FieldValues>(
  schema: T,
  formData: unknown,
  setError: UseFormSetError<TFieldValues>,
): ReturnType<T['parse']> | void => {
  const result = schema.safeParse(formData);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const fieldPath = issue.path.join('.') as Path<TFieldValues>;
      setError(fieldPath, { message: issue.message });
      toast.error('Error', { description: issue.message });
    });
  }
  return result.data;
};
