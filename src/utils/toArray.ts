import { OneOrArray } from "./utility-types";

export function toArray<T>(arg?: OneOrArray<T>) {
  if (!arg) return [];
  if (typeof arg === "object" && Array.isArray(arg)) return arg;
  return [arg];
}
