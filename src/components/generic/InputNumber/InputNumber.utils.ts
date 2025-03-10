export const safelyConvertStringToNumber = (value: string): number => {
  const sanitized = value.replace(/[^-?\d.]/g, ''); // Allow digits, a leading '-', and one '.'
  return sanitized.length ? Number(sanitized) : NaN;
};

export const safetyConvertNumberToString = (value?: number): string => {
  if ((value === undefined) || (value !== undefined && isNaN(value))) {
    return '';
  }
  return value.toString();
};
