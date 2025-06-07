import { createContext } from 'react';

export const AccordionContext = createContext<{ toggle: (key: string) => void, openKey: string | null }>({
  toggle: (_: string) => null,
  openKey: null,
});
