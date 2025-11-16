import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, StorageId } from '~/api';
import { toast } from '~/components/ToastProvider';
import {
  createMutationHook,
  createQueryHook,
  MutationHookConfig,
} from '~/services/utils';

export const useGetFileUrl = createQueryHook(api.files.getFileUrl);
export const useGenerateFileUploadUrl = createMutationHook(api.files.generateFileUploadUrl);

export const useUploadFile = (
  config?: MutationHookConfig<{
    _type: 'mutation';
    _visibility: 'public';
    _returnType: StorageId;
    _args: object;
    _componentPath: string;
  }>,
) => {
  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const [loading, setIsLoading] = useState<boolean>(false);
  return {
    mutation: async (file: Blob) => {
      setIsLoading(true);
      try {
        const response = await fetch(await generateUploadUrl(), {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        const { storageId } = await response.json();
        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(storageId, file);
        }
        return storageId;
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
