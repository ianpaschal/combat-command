import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '~/api';
import { toast } from '~/components/ToastProvider';
import { MutationHookConfig } from '~/services/MutationHookConfig';

export const useRemoveUserFromMatchResult = (config?: MutationHookConfig) => {
  const mutation = api.matchResults.mutations.removeUserFromMatchResult;
  const handler = useMutation(mutation);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    removeUserFromMatchResult: async (args: typeof mutation._args) => {
      setIsLoading(true);
      try {
        await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess();
        }
      } catch (error) {
        console.error(error);
        toast.error(error as string);
        if (config?.onError) {
          config.onError(error);
        }
      }
      setIsLoading(false);
    },
    loading,
  };
};
