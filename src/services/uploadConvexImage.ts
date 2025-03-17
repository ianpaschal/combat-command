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
