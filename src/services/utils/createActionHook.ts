import { useState } from 'react';
import { useAction } from 'convex/react';
import { FunctionReference } from 'convex/server';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/utils/handleError';

export type ActionFn = FunctionReference<'action'>;
export type ActionHookConfig<T extends ActionFn> = {
  onSuccess?: (response: T['_returnType'], args: T['_args']) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};

export const createActionHook = <T extends ActionFn>(actionFn: T) => (config?: ActionHookConfig<T>) => {
  const handler = useAction(actionFn);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    action: async (args: T['_args'], instanceConfig?: ActionHookConfig<T>) => {
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
        return response;
      } catch (error) {
        handleError(error);
        if (config?.onError) {
          config.onError(error);
        }
        if (instanceConfig?.onError) {
          instanceConfig.onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    loading,
  };
};
