import { Doc } from '../../../_generated/dataModel';

const keys: (keyof Doc<'users'>)[] = [
  'givenName',
  'familyName',
  'username',
] as const;

export const extractSearchTokens = (doc: Doc<'users'>): string => [...new Set([
  ...keys.map((key) => `${doc[key]}`),
  ...split(doc.username ?? ''),
].map((token) => token.toLowerCase()))].join(' ');

const split = (str: string): string[] => str
  // Replace underscores and hyphens with spaces
  .replace(/[._-]/g, ' ')
  // Add space before uppercase letters (for camelCase/PascalCase)
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  // Add space before uppercase letters that are followed by lowercase (for handling acronyms)
  .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
  // Add space between letters and numbers
  .replace(/([a-zA-Z])(\d)/g, '$1 $2')
  .replace(/(\d)([a-zA-Z])/g, '$1 $2')
  // Split on whitespace and filter out empty strings
  .split(/\s+/)
  .filter((word) => word.length > 0)
  // Convert to lowercase
  .map((word) => word.toLowerCase());
