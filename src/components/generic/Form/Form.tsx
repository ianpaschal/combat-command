import {
  BaseSyntheticEvent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { useBlocker, useNavigation } from 'react-router-dom';

import { UnsavedChangesDialog } from '~/components/UnsavedChangesDialog';

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
  const { isDirty } = form.formState;
  const blockNavigation = useRef(true);
  const navigation = useNavigation();
  const blocker = useBlocker(() => isDirty && blockNavigation.current);
  const handleSubmit = async (e: BaseSyntheticEvent): Promise<void> => {
    e.stopPropagation();
    blockNavigation.current = false;
    await form.handleSubmit(onSubmit)(e);
  };
  useEffect(() => {
    if (navigation.state === 'idle') {
      blockNavigation.current = true;
    }
  }, [navigation.state]);
  return (
    <FormProvider {...form}>
      <UnsavedChangesDialog blocker={blocker} />
      <form onSubmit={handleSubmit} className={className} id={id}>
        {children}
      </form>
    </FormProvider>
  );
};
