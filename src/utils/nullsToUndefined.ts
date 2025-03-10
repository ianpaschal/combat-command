/* eslint-disable @typescript-eslint/no-explicit-any */
export type NullConversion<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? NullConversion<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: NullConversion<T[K]> }
      : T;

export function convertNulls<T>(obj: T): NullConversion<T> {
  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  if ((obj as any).constructor.name === 'Object' || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = convertNulls(obj[key]) as any;
    }
  }
  return obj as any;
}
