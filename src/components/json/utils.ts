import { ObjectKey } from "@/utils/utility-types";

export const isArray = (arg: unknown): arg is unknown[] => Array.isArray(arg);

export function traverseSingleKeys(
  initialKey: ObjectKey | undefined,
  data: unknown,
  depth = Infinity
): [ObjectKey[], unknown] {
  let current = data;
  const keys: ObjectKey[] = initialKey === undefined ? [] : [initialKey];

  while (typeof current === "object" && current !== null && depth > 0) {
    const currentKeys = Reflect.ownKeys(current) as ObjectKey[];
    if (
      Array.isArray(current)
        ? currentKeys.length !== 2
        : currentKeys.length !== 1
    )
      return [keys, current];
    const key = currentKeys[0];
    keys.push(key);
    current = current[key as never];
    depth--;
  }

  return [keys, current];
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function getFunctionSignature(func: Function): string {
  const funcStr = func.toString();
  const arrowMatch = funcStr.match(/^\s*(?:async\s*)?($$[^)]*$$)/);
  const normalMatch = funcStr.match(
    /^\s*(?:async\s*)?function\s*[^(]*($$[^)]*$$)/
  );

  if (arrowMatch) {
    return arrowMatch[1];
  }

  if (normalMatch) {
    return normalMatch[1];
  }

  return "()";
}

export function defaultTransformKey(
  key: ObjectKey,
  siblings: number = 0
): string {
  switch (typeof key) {
    case "string":
      return key;
    case "symbol":
      return `[${key.toString()}]`;
    case "number":
      return String(key).padStart(Math.ceil(Math.log10(siblings)), "_"); // &nbsp; ??
  }
}
