import { UserId } from '~/api';
import { usePlayerDisplayName } from './components/CommonFields.hooks';
import { FowV4MatchResultFormData } from './FowV4MatchResultForm.schema';

export const usePlayerDisplayNames = (
  data: FowV4MatchResultFormData,
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
