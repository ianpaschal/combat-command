type CnUtil = (className?: string) => string;
export const createCn = (baseClass: string): CnUtil => (
  (className) => className ? `${baseClass}${className}` : baseClass
);
