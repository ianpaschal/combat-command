import { MatchResultDetails } from '~/api';
import { FowV4MatchResultFormData } from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.schema';
import { calculateFowV4MatchResultScore } from '../../../convex/_model/fowV4/calculateFowV4MatchResultScore';

export const getMatchResultDetails = (
  data: FowV4MatchResultFormData,
): MatchResultDetails | undefined => {
  const { details } = data;
  if (details?.winner === undefined || details?.player0UnitsLost === undefined || details?.player1UnitsLost === undefined) {
    return undefined;
  }
  const [player0Score, player1Score] = calculateFowV4MatchResultScore({
    winner: details.winner,
    player0UnitsLost: details.player0UnitsLost ?? 0,
    player1UnitsLost: details.player1UnitsLost ?? 0,
  });
  return {
    ...details,
    player0Score,
    player1Score,
  };
};
