import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';

import 'pdfjs-dist/build/pdf.worker.mjs';

export const ListDropZone = (): JSX.Element => {
  const onDrop = (acceptedFiles: File[]): void => {

    acceptedFiles.forEach(async (file) => {

      // pdfToText(file)
      //   .then(text => console.log(text))
      //   .catch(error => console.error(error))

      // Create a blob URL for the PDF file
      const blobUrl = URL.createObjectURL(file);

      // Load the PDF file
      const loadingTask = pdfjsLib.getDocument(blobUrl);
      const pdf = await loadingTask.promise;

      console.log(pdf);

      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      console.log(textContent);

      console.log('labels', await pdf.getPageLabels());

    });

  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>

    </div>
  );
};