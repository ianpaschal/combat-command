import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, MatchResultId } from '~/api';
import { MutationHookConfig } from '~/services/MutationHookConfig';
import { uploadConvexImage } from '~/services/uploadConvexImage';

export const useAddPhotoToMatchResult = (config?: MutationHookConfig) => {
  const [loading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const addPhoto = useMutation(api.photos.mutations.addPhoto);
  const addPhotoToMatchResult = useMutation(api.matchResults.mutations.addPhotoToMatchResult);

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
          singleConfig.onSuccess();
        }
        if (config?.onSuccess) {
          config.onSuccess();
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
