import { useEffect, useState } from 'react';

export function useFileFromUrl(url?: string): File | undefined {
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (!url) return;

    const fetchFile = async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const blob = await response.blob();

      // Extract filename from the URL
      const urlParts = url.split('/');
      let filename = urlParts[urlParts.length - 1] || 'download';

      // Ensure filename has an extension (fallback to blob's type if missing)
      if (!filename.includes('.')) {
        const ext = blob.type.split('/')[1]; // Get file extension from MIME type
        filename += ext ? `.${ext}` : '';
      }

      setFile(new File([blob], filename, { type: blob.type }));
    };

    fetchFile();
  }, [url]);

  return file;
}
