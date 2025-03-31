import { StorageId } from '~/api';

export const uploadConvexImage = async (uploadUrl: string, file: Blob): Promise<StorageId | undefined> => {
  try {
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }
    const { storageId } = await uploadResponse.json();
    return storageId;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '~/api';

export const useUploadConvexImage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.generateFileUploadUrl.generateFileUploadUrl);
  return {
    mutation: async (file: Blob): Promise<StorageId | undefined> => {
      setLoading(true);
      try {
        const uploadResponse = await fetch(await generateUploadUrl(), {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }
        const { storageId } = await uploadResponse.json();
        return storageId;
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    },
    loading,
  };
};
