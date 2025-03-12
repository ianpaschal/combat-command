import { ReactElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface AnimateProps {
  children: ReactElement;
  show?: boolean;
}

export const Animate = ({
  children,
  show = false,
}: AnimateProps): JSX.Element => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ ease: 'easeInOut', duration: 0.15 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
