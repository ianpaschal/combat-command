import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, CreateMatchResultInput } from '~/api';
import { toast } from '~/components/ToastProvider';

export type UseCreateMatchResultConfig = {
  onSuccess?: () => void;
};

export const useCreateMatchResult = (config?: UseCreateMatchResultConfig) => {
  const handler = useMutation(api.matchResults.createMatchResult.createMatchResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return {
    createMatchResult: async (input: CreateMatchResultInput) => {
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
