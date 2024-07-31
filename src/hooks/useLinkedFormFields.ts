import { useEffect } from 'react';
import {
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';

export const useLinkedFormFields = <T extends FieldValues>(form: UseFormReturn<T>, fieldNames: Path<T>[]): void => {
  const { trigger, watch, formState: { dirtyFields } } = form;
  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      const fieldsAreDirty = fieldNames.every((fieldName) => dirtyFields[fieldName] === true);
      if (name && fieldNames.includes(name) && fieldsAreDirty) {
        void trigger(fieldNames);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger, dirtyFields, fieldNames]);
};