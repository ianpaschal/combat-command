import { BaseSyntheticEvent, ReactNode } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

export interface FormProps<T extends FieldValues> {
  id?: string;
  form: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

export const Form = <T extends FieldValues>({
  id,
  form,
  children,
  className,
  onSubmit,
}: FormProps<T>) => {
  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    return form.handleSubmit(onSubmit)(e);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className} id={id}>
        {children}
      </form>
    </FormProvider>
  );
};
