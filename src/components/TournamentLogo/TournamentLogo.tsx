import { CSSProperties } from 'react';
import clsx from 'clsx';

import styles from './TournamentLogo.module.scss';

type TournamentLogoShape = 'round' | 'square' | 'hexagon' | 'shield';

export type TournamentLogoWrapper = {
  shape: TournamentLogoShape;
  borderColor?: CSSProperties['borderColor'];
  backgroundColor: CSSProperties['backgroundColor'];
};

export interface TournamentLogoProps {
  className?: string;
  url: string;
  shadow?: boolean;
  wrapper?: TournamentLogoWrapper
}

const shapes: Record<TournamentLogoShape, { outer: string, inner: string }> = {
  round: {
    outer: 'M64 32A32 32 0 1 1 0 32A32 32 0 1 1 64 32Z',
    inner: 'M62 32A30 30 0 1 1 2 32A30 30 0 1 1 62 32Z',
  },
  shield: {
    outer: 'M57.882,6.471A4,4,0,0,1,60,10V34.6A24,24,0,0,1,48,55.381L34,63.464a4,4,0,0,1-4,0L16,55.381A24,24,0,0,1,4,34.6V10A4,4,0,0,1,6.118,6.471a55,55,0,0,1,51.764,0Z',
    inner: 'M32,62a2,2,0,0,1-1-.268L17,53.648A22.058,22.058,0,0,1,6,34.6V10A2,2,0,0,1,7.058,8.236a53,53,0,0,1,49.883,0A2,2,0,0,1,58,10V34.6A22.058,22.058,0,0,1,47,53.648L33,61.731A2,2,0,0,1,32,62Z',
  },
  hexagon: {
    outer: 'M32,64a4,4,0,0,1-2-.536l-24.249-14a4,4,0,0,1-2-3.464V18a4,4,0,0,1,2-3.464L30,.536a4,4,0,0,1,4,0l24.249,14a4,4,0,0,1,2,3.464V46a4,4,0,0,1-2,3.464L34,63.464A4,4,0,0,1,32,64Z',
    inner: 'M32,62a2,2,0,0,1-1-.268l-24.25-14a2,2,0,0,1-1-1.731V18a2,2,0,0,1,1-1.731L31,2.268a2,2,0,0,1,2,0l24.249,14a2.006,2.006,0,0,1,1,1.732V46a2,2,0,0,1-1,1.731L33,61.731A2,2,0,0,1,32,62Z',
  },
  square: {
    outer: 'M60,8V56a4,4,0,0,1-4,4H8a4,4,0,0,1-4-4V8A4,4,0,0,1,8,4H56A4,4,0,0,1,60,8Z',
    inner: 'M8,58a2,2,0,0,1-2-2V8A2,2,0,0,1,8,6H56a2,2,0,0,1,2,2V56a2,2,0,0,1-2,2Z',
  },
};

export const TournamentLogo = ({
  className,
  url,
  shadow = true,
  wrapper,
}: TournamentLogoProps): JSX.Element => (
  <div className={clsx(styles.TournamentLogo, className)}>
    <svg viewBox="0 0 64 64" data-shadow={shadow}>
      <defs>
        <clipPath id="clip">
          {wrapper ? (
            <path id="clip-shape" d={shapes[wrapper?.shape][wrapper.borderColor ? 'inner' : 'outer']} />
          ) : (
            <rect x="0" y="0" width="64" height="64" />
          )}
        </clipPath>
      </defs>
      {!!wrapper?.borderColor && (
        <path id="clip-shape" d={shapes[wrapper.shape].outer} fill={wrapper.borderColor} />
      )}
      <rect
        width="64"
        height="64"
        fill={wrapper?.backgroundColor ?? 'transparent'}
        clipPath="url(#clip)"
      />
      <image
        href={url}
        width={wrapper ? 60 : 64}
        height={wrapper ? 60 : 64}
        x={wrapper ? 2 : 0}
        y={wrapper ? 2 : 0}
        preserveAspectRatio="xMidYMid meet"
        clipPath="url(#clip)"
      />
    </svg>
  </div>
);
