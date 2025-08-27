import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, MatchResultId } from '~/api';
import { uploadConvexImage } from '~/services/uploadConvexImage';
import { MutationHookConfig } from '~/services/utils/MutationHookConfig';

export const useAddPhotoToMatchResult = (config?: MutationHookConfig) => {
  const [loading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const addPhoto = useMutation(api.photos.createPhoto);
  const addPhotoToMatchResult = useMutation(api.matchResults.addPhotoToMatchResult);

  return {
    addPhotoToMatchResult: async (matchResultId: MatchResultId, file: File, singleConfig?: MutationHookConfig) => {
      setLoading(true);
      try {
        // TODO: Compress image before uploading
        const uploadUrl = await generateUploadUrl();
        const storageId = await uploadConvexImage(uploadUrl, file);
        if (storageId) {
          const photoId = await addPhoto({
            storageId,
          });
          await addPhotoToMatchResult({
            matchResultId,
            photoId,
          });
        }
        if (singleConfig?.onSuccess) {
          singleConfig.onSuccess(file.name);
        }
        if (config?.onSuccess) {
          config.onSuccess(file.name);
        }
      } catch (error) {
        if (singleConfig?.onError) {
          singleConfig.onError(error);
        }
        if (config?.onError) {
          config.onError(error);
        }
      }
      setLoading(false);
    },
    loading,
  };
};
