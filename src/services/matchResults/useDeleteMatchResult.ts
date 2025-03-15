import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '~/api';
import { toast } from '~/components/ToastProvider';
import { MutationHookConfig } from '~/services/MutationHookConfig';

export const useDeleteMatchResult = (config?: MutationHookConfig) => {
  const mutation = api.matchResults.mutations.deleteMatchResult;
  const handler = useMutation(mutation);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    deleteMatchResult: async (args: typeof mutation._args) => {
      setIsLoading(true);
      try {
        await handler(args);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
      }
      setIsLoading(false);
      if (config?.successMessage) {
        toast.success(config.successMessage);
      }
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    loading,
  };
};
