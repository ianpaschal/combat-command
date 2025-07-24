import clsx from 'clsx';
import { Construction } from 'lucide-react';

import { EmptyState } from '~/components/EmptyState';
import { Header } from '../Header';

import styles from './StatsCard.module.scss';

export interface StatsCardProps {
  className?: string;
}

export const StatsCard = ({
  className,
}: StatsCardProps): JSX.Element => (
  <div className={clsx(styles.StatsCard, className)}>
    <Header title="Stats" />
    <EmptyState icon={<Construction />} message="Under Construction" />
  </div>
);
