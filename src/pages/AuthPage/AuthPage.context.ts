import { createContext } from 'react';

export type AuthFlowContextValue = {
  email: string;
  setEmail: (email: string) => void;
};

export const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);
