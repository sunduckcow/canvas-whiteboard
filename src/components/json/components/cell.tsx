import { FC } from "react";

export const CellValue: FC<{ value: unknown }> = ({ value }) => {
  if (value === null) return <span className="text-gray-500">null</span>;
  if (value === undefined)
    return <span className="text-gray-500">undefined</span>;

  // const type = Array.isArray(value) ? "array" : typeof value;

  switch (typeof value) {
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
    case "object":
      if (Array.isArray(value))
        return (
          <span
            className="text-gray-600 dark:text-gray-400 cursor-pointer hover:underline"
            title={JSON.stringify(value, null, 2)}
          >
            [{value.length}]
          </span>
        );
      return (
        <span
          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:underline"
          title={JSON.stringify(value, null, 2)}
        >
          {"{...}"}
        </span>
      );

    default:
      return <span>{String(value)}</span>;
  }
};
