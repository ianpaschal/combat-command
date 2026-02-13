export const filterWithSearchTerm = <T extends object>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[],
): T[] => {
  if (!searchTerm) {
    return items;
  }
  const tokens = searchTerm.trim().toLowerCase().split(' ');
  return items.filter((item) => fields.some((field) => {
    const value = item[field];
    return tokens.some((token) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(token);
      }
      if (typeof value === 'number') {
        return value.toString().includes(token);
      }
      return false;
    });
  }),
  );
};
