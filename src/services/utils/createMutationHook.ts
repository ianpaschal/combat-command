import { useState } from 'react';
import { useMutation } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { ConvexError } from 'convex/values';

import { toast } from '~/components/ToastProvider';

export type MutationFn = FunctionReference<'mutation'>;
export type MutationHookConfig<T extends MutationFn> = {
  onSuccess?: (response: T['_returnType']) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};

export const createMutationHook = <T extends MutationFn>(mutationFn: T) => (config?: MutationHookConfig<T>) => {
  const handler = useMutation(mutationFn);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    mutation: async (args: T['_args']) => {
      setIsLoading(true);
      try {
        const response = await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(response);
        }
      } catch (error) {
        if (error instanceof ConvexError) {
          toast.error('Error', { description: error.data.message });
          if (config?.onError) {
            config.onError(error);
          }
        }
      }
      setIsLoading(false);
    },
    loading,
  };
};
