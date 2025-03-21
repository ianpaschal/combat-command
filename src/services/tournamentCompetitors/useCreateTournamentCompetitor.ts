import { useState } from 'react';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';

import { api } from '~/api';
import { toast } from '~/components/ToastProvider';
import { MutationHookConfig } from '~/services/MutationHookConfig';

export const useCreateTournamentCompetitor = (config?: MutationHookConfig) => {
  const mutation = api.tournamentCompetitors.createTournamentCompetitor;
  const handler = useMutation(mutation);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    mutation: async (args: typeof mutation._args) => {
      setIsLoading(true);
      try {
        const id = await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(id);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof ConvexError) {
          toast.error('Error', { description: error.data.message });
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
