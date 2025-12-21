import { PositionFlag } from './Table.types';

export const getPosition = (
  [i, total]: [number, number],
): PositionFlag[] => {
  const positions: PositionFlag[] = [];
  if (i === 0) {
    positions.push('first');
  }
  if (i + 1 === total) {
    positions.push('last');
  }
  return positions;
};
