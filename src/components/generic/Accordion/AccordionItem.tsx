import { ReactNode, useContext } from 'react';
import useMeasure from 'react-use-measure';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { AccordionContext } from '~/components/generic/Accordion/Accordion.context';

import styles from './AccordionItem.module.scss';

const duration = 0.15;

export interface AccordionItemProps {
  className?: string;
  id: string;
  disabled?: boolean;
  children: [ReactNode, ReactNode];
  classNames?: {
    root?: string;
    header?: string;
    content?: string;
  }
}

export const AccordionItem = ({
  classNames = {},
  id,
  disabled = false,
  children,
}: AccordionItemProps): JSX.Element => {
  const { toggle, openKey } = useContext(AccordionContext);
  const [ref, { height }] = useMeasure();
  const isOpen = openKey === id;
  const [header, content] = children;
  const handleToggle = (): void => {
    if (!disabled) {
      toggle(id);
    }
  };
  return (
    <div key={id} className={clsx(styles.AccordionItem, classNames?.root)}>
      <div
        className={clsx(styles.AccordionItem_Header, classNames?.header)}
        data-enabled={!disabled}
        onClick={handleToggle}
      >
        {!disabled && (
          <motion.div
            className={styles.AccordionItem_Header_Chevron}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ ease: 'easeInOut', duration }}
          >
            <ChevronRight />
          </motion.div>
        )}
        {header}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height }}
            exit={{ height: 0 }}
            transition={{ ease: 'easeInOut', duration }}
            style={{ overflow: 'hidden' }}
          >
            <div ref={ref} className={clsx(styles.AccordionItem_Content, classNames?.content)}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
