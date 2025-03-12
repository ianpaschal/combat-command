import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, ToggleMatchResultLikeInput } from '~/api';
import { toast } from '~/components/ToastProvider';

export type UseToggleMatchResultLikeConfig = {
  onSuccess?: () => void;
};

export const useToggleMatchResultLike = (config?: UseToggleMatchResultLikeConfig) => {
  const handler = useMutation(api.matchResultLikes.mutations.toggleMatchResultLike);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return {
    toggleMatchResultLike: async (input: ToggleMatchResultLikeInput) => {
      setIsLoading(true);
      try {
        await handler(input);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
        setIsLoading(true);
      }
      setIsLoading(true);
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    isLoading,
  };
};
