import {
  v,
  VLiteral,
  VUnion,
} from 'convex/values';

export const getStaticEnumConvexValidator = <T extends Record<string, string>, V extends T[keyof T] = T[keyof T]>(
  enumObj: T,
): VUnion<V, VLiteral<V, 'required'>[], 'required', never> => v.union(
  ...(Object.values(enumObj) as V[]).map(
    (item) => v.literal(item) as VLiteral<V, 'required'>,
  ),
);
