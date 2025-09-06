import { useForm } from 'react-hook-form';

import { usePlayerDisplayName } from './components/CommonFields.hooks';
import { fowV4MatchResultFormSchema } from './FowV4MatchResultForm.schema';

export const usePlayerDisplayNames = (): [string, string] => {
  const form = useForm();
  const data = fowV4MatchResultFormSchema.parse(form.getValues());
  const player0DisplayName = usePlayerDisplayName({
    userId: data.player0UserId,
  });
  const player1DisplayName = usePlayerDisplayName({
    userId: data.player1UserId,
  });
  return [
    player0DisplayName,
    player1DisplayName,
  ];
};
