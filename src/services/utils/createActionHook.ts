import { useState } from 'react';
import { useAction } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { ConvexError } from 'convex/values';

import { toast } from '~/components/ToastProvider';

export type ActionFn = FunctionReference<'action'>;
export type ActionHookConfig<T extends ActionFn> = {
  onSuccess?: (response: T['_returnType']) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};

export const createActionHook = <T extends ActionFn>(actionFn: T) => (config?: ActionHookConfig<T>) => {
  const handler = useAction(actionFn);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    action: async (args: T['_args']) => {
      setIsLoading(true);
      try {
        const response = await handler(args);
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(response);
        }
        return response;
      } catch (error) {
        if (error instanceof ConvexError) {
          toast.error('Error', { description: error.data.message });
          if (config?.onError) {
            config.onError(error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    loading,
  };
};
