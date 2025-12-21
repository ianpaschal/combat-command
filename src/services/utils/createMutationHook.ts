import { useState } from 'react';
import { useMutation } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { ConvexError } from 'convex/values';

import { toast } from '~/components/ToastProvider';

export type MutationFn = FunctionReference<'mutation'>;
export type MutationHookConfig<T extends MutationFn> = {
  onSuccess?: (response: T['_returnType'], args: T['_args']) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};

export const createMutationHook = <T extends MutationFn>(mutationFn: T) => (config?: MutationHookConfig<T>) => {
  const handler = useMutation(mutationFn);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    mutation: async (args: T['_args'], instanceConfig?: MutationHookConfig<T>) => {
      setIsLoading(true);
      try {
        const response = await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(response, args);
        }
        if (instanceConfig?.onSuccess) {
          instanceConfig.onSuccess(response, args);
        }
      } catch (error) {
        if (error instanceof ConvexError) {
          toast.error('Error', { description: error.data.message });
        } else if (error instanceof Error) {
          toast.error('Error', { description: error.message as string });
        }
        if (config?.onError) {
          config.onError(error);
        }
        if (instanceConfig?.onError) {
          instanceConfig.onError(error);
        }
      }
      setIsLoading(false);
    },
    loading,
  };
};
