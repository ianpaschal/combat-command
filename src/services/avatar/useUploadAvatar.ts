import { useState } from 'react';
import { useMutation } from 'convex/react';
import Pica from 'pica';

import { api, UserId } from '~/api';

const compressImage = async (file: File): Promise<Blob> => {

  const targetSize = 256;
  const pica = new Pica();

  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => (img.onload = resolve));

  const { width, height } = img;
  const scale = targetSize / Math.min(width, height);
    
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  // Create source and destination canvases
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx!.drawImage(img, 0, 0, width, height);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;

  const destCanvas = document.createElement('canvas');
  destCanvas.width = targetSize;
  destCanvas.height = targetSize;

  // Resize the image first
  await pica.resize(srcCanvas, tempCanvas);

  // Crop and center the image
  const cropX = (newWidth - targetSize) / 2;
  const cropY = (newHeight - targetSize) / 2;
  const destCtx = destCanvas.getContext('2d');
  destCtx!.drawImage(tempCanvas, cropX, cropY, targetSize, targetSize, 0, 0, targetSize, targetSize);

  // Convert canvas to blob
  return await pica.toBlob(destCanvas, 'image/jpeg');
}; 

export const useUploadAvatar = () => {
  const [isLoading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  const updateUser = useMutation(api.users.updateUser);

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

        await updateUser({
          id: userId,
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
