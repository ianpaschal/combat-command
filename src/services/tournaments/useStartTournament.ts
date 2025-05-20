import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '~/api';
import { toast } from '~/components/ToastProvider';
import { MutationHookConfig } from '~/services/MutationHookConfig';

export const useStartTournament = (config?: MutationHookConfig) => {
  const mutation = api.tournaments.startTournament;
  const handler = useMutation(mutation);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    mutation: async (args: typeof mutation._args) => {
      setIsLoading(true);
      try {
        await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(args.id);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error('Error', { description: error.message });
        }
        if (config?.onError) {
          config.onError(error);
        }
      }
      setIsLoading(false);
    },
    loading,
  };
};
