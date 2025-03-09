export function toArray<T>(arg?: T | T[]) {
  if (!arg) return [];
  if (typeof arg === "object" && Array.isArray(arg)) return arg;
  return [arg];
}
