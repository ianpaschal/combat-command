import { useFormContext } from 'react-hook-form';

import { UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useGetUser } from '~/services/users';

export const usePlayerDisplayName = ({ userId, placeholder }: { userId?: UserId, placeholder?: string }): string => {
  const currentUser = useAuth();
  const { data: user } = useGetUser(userId ? { id: userId } : 'skip');
  if (!userId && placeholder) {
    return placeholder;
  }
  if (userId && !placeholder) {
    if (user?._id === currentUser?._id) {
      return 'You';
    }
    return user?.displayName ?? 'Unknown Player';
  }
  return 'Unknown Player';
};

export const usePlayerOptions = (): { value: number, label: string }[] => {
  const { watch } = useFormContext();
  const {
    player0UserId,
    player1UserId,
    player0Placeholder,
    player1Placeholder,
  } = watch();
  const playerNames = [
    usePlayerDisplayName({ userId: player0UserId, placeholder: player0Placeholder }),
    usePlayerDisplayName({ userId: player1UserId, placeholder: player1Placeholder }),
  ];
  return playerNames.map((label, value) => ({ label, value })); // Will be coerced back to number by Zod
};
