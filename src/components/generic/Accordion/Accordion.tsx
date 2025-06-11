import { ReactNode, useState } from 'react';

import { AccordionContext } from './Accordion.context';

import styles from './Accordion.module.scss';

export interface AccordionProps {
  children: ReactNode;
}

export const Accordion = ({
  children,
}: AccordionProps): JSX.Element => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };
  return (
    <div className={styles.Accordion}>
      <AccordionContext.Provider value={{ toggle, openKey }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};
