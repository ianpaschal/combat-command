import { Doc } from '../../../_generated/dataModel';

export const getDisplayName = (
  doc?: Doc<'tournaments'> | null,
): string => {
  if (!doc) {
    return 'Unknown Tournament'; // TODO: Language support
  }
  if (doc.editionYear) {
    return `${doc.title} ${doc.editionYear}`;
  }
  return doc.title;
};
