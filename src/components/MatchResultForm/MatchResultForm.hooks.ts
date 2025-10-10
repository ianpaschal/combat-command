import { UserId } from '~/api';
import { usePlayerDisplayName } from '~/components/MatchResultDetailFields';
import { MatchResultFormData } from './MatchResultForm.schema';

export const usePlayerDisplayNames = (
  data: MatchResultFormData,
): [string, string] => {
  const player0DisplayName = usePlayerDisplayName({
    userId: data.player0UserId?.length ? data.player0UserId as UserId : undefined,
  });
  const player1DisplayName = usePlayerDisplayName({
    userId: data.player1UserId?.length ? data.player1UserId as UserId : undefined,
  });
  return [
    player0DisplayName,
    player1DisplayName,
  ];
};
