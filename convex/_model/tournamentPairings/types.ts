export type TournamentPairingOptions = {
  allowRepeats?: boolean;
  allowSameAlignment?: boolean;
};

export type TournamentPairingStatus = {
  status: 'error' | 'warning' | 'ok';
  message: string;
};
