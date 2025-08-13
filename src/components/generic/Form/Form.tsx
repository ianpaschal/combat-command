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

import { Dialog } from '~/components/generic/Dialog';
import { FormStatusContext } from './Form.context';

export interface FormProps<T extends FieldValues> {
  id?: string;
  form: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  className?: string;
  useBlocker?: boolean;
  disabled?: boolean;
}

export const Form = <T extends FieldValues>({
  id,
  form,
  children,
  className,
  useBlocker: block = true,
  onSubmit,
  disabled = false,
}: FormProps<T>) => {
  const { dirtyFields } = form.formState;
  const blockNavigation = useRef(true);
  const navigation = useNavigation();
  const isDirty = Object.keys(dirtyFields).length > 0;
  const blocker = useBlocker(() => block && isDirty && blockNavigation.current);
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
      <Dialog
        open={blocker.state === 'blocked'}
        title="You have unsaved changes"
        description="Are you sure you want to navigate away? Unsaved changes will be lost."
        width="small"
        onCancel={blocker.reset}
        actions={[
          { label: 'Cancel', onClick: blocker.reset, variant: 'secondary' },
          { label: 'Continue', onClick: blocker.proceed, variant: 'primary', intent: 'danger' },
        ]}
      />
      <form onSubmit={handleSubmit} className={className} id={id}>
        <FormStatusContext.Provider value={{ disabled }}>
          {children}
        </FormStatusContext.Provider>
      </form>
    </FormProvider>
  );
};
