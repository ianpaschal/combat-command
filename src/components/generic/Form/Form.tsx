import { ReactNode } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

export const Form = <T extends FieldValues>({
  form,
  children,
  className,
  onSubmit,
}: FormProps<T>) => (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      {children}
    </form>
  </FormProvider>
);
