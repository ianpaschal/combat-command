import { Doc } from '../../../_generated/dataModel';

export const getDisplayName = (
  doc: Doc<'tournaments'>,
): string => {
  if (doc.editionYear) {
    return `${doc.title} ${doc.editionYear}`;
  }
  return doc.title;
};
