import clsx from 'clsx';

import { Card } from '~/components/generic/Card';

import './TournamentCard.scss';

export interface TournamentCardProps {
  orientation?: 'vertical' | 'horizontal';
}
export const TournamentCard = ({
  orientation = 'horizontal',
}: TournamentCardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = {
    title: 'Foo',
    thumbnail_url: 'https://github.com/shadcn.png',
    banner_url: 'https://github.com/shadcn.png',
  };
  return (
    <Card className={clsx('TournamentCard', `TournamentCard-${orientation}`)}>
      <div className="ThumbnailWrapper">
        <img
          className="Image"
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape photograph by Tobias Tullius"
        />
      </div>
      <div className="TournamentCardContent">
        <h3>Belgian Nationals 2025</h3>
        <span>Line points</span>
        <span>Line with date and time</span>
        <span>Line with place</span>
      </div>
    </Card>
  );
};