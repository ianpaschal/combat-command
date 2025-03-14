import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, UpdateMatchResultInput } from '~/api';
import { toast } from '~/components/ToastProvider';

export type UseUpdateMatchResultConfig = {
  onSuccess?: () => void;
};

export const useUpdateMatchResult = (config?: UseUpdateMatchResultConfig) => {
  const handler = useMutation(api.matchResults.updateMatchResult.updateMatchResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return {
    updateMatchResult: async (input: UpdateMatchResultInput) => {
      setIsLoading(true);
      try {
        await handler(input);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
        setIsLoading(true);
      }
      toast.success('Match result saved!');
      setIsLoading(true);
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    isLoading,
  };
};
