export type WLDTotal = {
  wins: number;
  losses: number;
  draws: number;
};

export type WLD = {
  win: number;
  loss: number;
  draw: number;
};

export type Statistic<T extends string[], U extends number|WLD> = {
  key: T;
  value: U;
};
