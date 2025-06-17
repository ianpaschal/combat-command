import { ReactNode, useState } from 'react';
import clsx from 'clsx';

import { AccordionContext } from './Accordion.context';

import styles from './Accordion.module.scss';

export interface AccordionProps {
  className?: string;
  children: ReactNode;
}

export const Accordion = ({
  className,
  children,
}: AccordionProps): JSX.Element => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };
  return (
    <div className={clsx(styles.Accordion, className)}>
      <AccordionContext.Provider value={{ toggle, openKey }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};
