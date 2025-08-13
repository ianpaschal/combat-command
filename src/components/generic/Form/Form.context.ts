import { createContext } from 'react';

export type FormStatus = {
  disabled: boolean;
};

export const FormStatusContext = createContext<FormStatus>({
  disabled: false,
});
