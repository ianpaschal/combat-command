import { useState } from 'react';
import { useAction, useMutation } from 'convex/react';

import { api, StorageId } from '~/api';
import { toast } from '~/components/ToastProvider';
import {
  createMutationHook,
  createQueryHook,
  MutationHookConfig,
} from '~/services/utils';
import { handleError } from '~/services/utils/handleError';

export const useGenerateFileUploadUrl = createMutationHook(api.files.generateFileUploadUrl);
export const useGetFileMetadata = createQueryHook(api.files.getFileMetadata);
export const useGetFileUrl = createQueryHook(api.files.getFileUrl);

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

const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'] as const;
const DOCUMENT_MIME_TYPES = [...IMAGE_MIME_TYPES, 'application/pdf'] as const;

type DocumentHookConfig = {
  onSuccess?: (storageId: StorageId, file: Blob) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};

export const useUploadDocument = (config?: DocumentHookConfig) => {
  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const convertImageToPdf = useAction(api.files.convertImageToPdf);
  const [loading, setIsLoading] = useState<boolean>(false);

  return {
    mutation: async (file: Blob) => {
      setIsLoading(true);
      try {
        if (!(DOCUMENT_MIME_TYPES as ReadonlyArray<string>).includes(file.type)) {
          throw new Error(
            `Unsupported file type: ${file.type}. Please upload a PDF or image (PNG, JPG).`,
          );
        }

        const response = await fetch(await generateUploadUrl(), {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        const { storageId }: { storageId: StorageId } = await response.json();

        const isImage = (IMAGE_MIME_TYPES as ReadonlyArray<string>).includes(file.type);
        const pdfStorageId = isImage
          ? await convertImageToPdf({ storageId, mimeType: file.type }) : storageId;

        if (config?.successMessage) {
          toast.success(config.successMessage);
        }
        if (config?.onSuccess) {
          config.onSuccess(pdfStorageId, file);
        }
        return pdfStorageId;
      } catch (error) {
        handleError(error);
        if (config?.onError) {
          config.onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    loading,
  };
};
