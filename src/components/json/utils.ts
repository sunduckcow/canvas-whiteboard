export const isPrimitive = (arg: unknown) =>
  arg === null || typeof arg !== "object";

export const isArray = (arg: unknown): arg is unknown[] => Array.isArray(arg);
export const isRecord = (arg: unknown): arg is Record<ObjectKey, unknown> =>
  typeof arg === "object" &&
  arg !== null &&
  !(arg instanceof Date) &&
  !(arg instanceof RegExp) &&
  !(arg instanceof Set) &&
  !(arg instanceof Map);

type ObjectKey = string | number | symbol;
