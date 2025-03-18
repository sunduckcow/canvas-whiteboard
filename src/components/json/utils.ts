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
