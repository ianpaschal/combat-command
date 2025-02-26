import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useMutation } from 'convex/react';

import { api, UserId } from '~/api';

const compressImage = async (file: File): Promise<File> => await imageCompression(file, {
  maxSizeMB: 0.15,
  maxIteration: 1,
  fileType: 'image/jpeg',
  maxWidthOrHeight: 256,
  useWebWorker: true,
}); 

export const useUploadAvatar = () => {
  const [isLoading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar.updateAvatar);

  return {
    uploadAvatar: async (userId: UserId, file: File) => {
      if (!file) {
        return;
      }

      setLoading(true);

      try {
        const compressedFile = await compressImage(file);
   
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': compressedFile.type },
          body: compressedFile,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const { storageId } = await uploadResponse.json(); // Get Convex file ID

        await updateAvatar({
          userId,
          avatarStorageId: storageId,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    },
    isLoading,
  };
};
