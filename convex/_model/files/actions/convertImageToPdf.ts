import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';
import { PDFDocument } from 'pdf-lib';

import { Id } from '../../../_generated/dataModel';
import { ActionCtx } from '../../../_generated/server';

const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'] as const;
type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

const isImageMimeType = (mimeType: string): mimeType is ImageMimeType => (IMAGE_MIME_TYPES as ReadonlyArray<string>).includes(mimeType);

export const convertImageToPdfArgs = v.object({
  storageId: v.id('_storage'),
  mimeType: v.string(),
});

export const convertImageToPdf = async (
  ctx: ActionCtx,
  args: Infer<typeof convertImageToPdfArgs>,
): Promise<Id<'_storage'>> => {
  if (!isImageMimeType(args.mimeType)) {
    throw new ConvexError(`Unsupported MIME type: ${args.mimeType}. Expected one of: ${IMAGE_MIME_TYPES.join(', ')}`);
  }

  const blob = await ctx.storage.get(args.storageId);
  if (!blob) {
    throw new ConvexError('File not found in storage');
  }

  const imageBytes = new Uint8Array(await blob.arrayBuffer());
  const pdfDoc = await PDFDocument.create();

  const image = args.mimeType === 'image/png' ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = pdfBytes.buffer as ArrayBuffer;
  const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const pdfStorageId = await ctx.storage.store(pdfBlob);

  await ctx.storage.delete(args.storageId);

  return pdfStorageId;
};
