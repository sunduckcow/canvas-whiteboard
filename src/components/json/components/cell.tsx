import { FC } from "react";

export const CellValue: FC<{ value: unknown }> = ({ value }) => {
  switch (typeof value) {
    case "undefined":
      return (
        <span className="text-gray-500 dark:text-gray-400">undefined</span>
      );
    case "string":
      return (
        <span className="text-green-600 dark:text-green-400">"{value}"</span>
      );
    case "number":
      return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
    case "boolean":
      return (
        <span className="text-purple-600 dark:text-purple-400">
          {value.toString()}
        </span>
      );
    case "function":
      return (
        <span className="text-yellow-600 dark:text-yellow-400">
          ƒ {getFunctionSignature(value)}
        </span>
      );
    case "symbol":
      return (
        <span className="text-orange-600 dark:text-orange-400">
          {value.toString()}
        </span>
      );
    case "bigint":
      return (
        <span className="text-blue-600 dark:text-blue-400">
          {value.toString()}n
        </span>
      );
    case "object":
      if (value === null) {
        return <span className="text-red-600 dark:text-red-400">null</span>;
      }
      if (value instanceof Date) {
        return (
          <span className="text-teal-600 dark:text-teal-400">
            Date({value.toISOString()})
          </span>
        );
      }
      if (value instanceof Map) {
        return (
          <span className="text-indigo-600 dark:text-indigo-400">
            Map({value.size})
          </span>
        );
      }
      if (value instanceof Set) {
        return (
          <span className="text-indigo-600 dark:text-indigo-400">
            Set({value.size})
          </span>
        );
      }
      if (Array.isArray(value))
        return (
          <span
            className="text-gray-600 dark:text-gray-400 cursor-pointer hover:underline"
            title={safeStringify(value, 2)}
          >
            {`[ ${value.length} items ]`}
          </span>
        );
      return (
        <span
          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:underline"
          title={safeStringify(value, 2)}
        >
          {`{ ${Object.keys(value).length} keys }`}
        </span>
      );
    default:
      return <span>{String(value)}</span>;
  }
};

export const safeStringify = (obj: unknown, space?: string | number) =>
  JSON.stringify(obj, jsonReplacer, space);

export function jsonReplacer(_key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  if (typeof value === "function") {
    return `ƒ ${getFunctionSignature(value)}`;
  }
  if (typeof value === "symbol") {
    return value.toString();
  }
  if (value instanceof Date) {
    return `Date(${value.toISOString()})`;
  }
  if (value instanceof Map) {
    return `Map(${value.size})`;
  }
  if (value instanceof Set) {
    return `Set(${value.size})`;
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getFunctionSignature(func: Function): string {
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
