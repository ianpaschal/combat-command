import { Alignment } from '../../common/alignment';
import { Faction } from '../../common/faction';
import { DeepTournamentRegistration } from '../../tournamentRegistrations/_helpers/deepenTournamentRegistration';

export const getDetails = (
  registrations: DeepTournamentRegistration[],
): {
  alignments: Alignment[];
  factions: Faction[];
} => {
  
  const alignments = new Set<Alignment>();
  const factions = new Set<Faction>();

  for (const reg of registrations) {
    for (const a of reg.alignments) {
      alignments.add(a);
    }
    for (const f of reg.factions) {
      factions.add(f);
    }
  }

  return {
    alignments: Array.from(alignments),
    factions: Array.from(factions),
  };
};
