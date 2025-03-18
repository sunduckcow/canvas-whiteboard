import { FC, PropsWithChildren, ReactNode } from "react";

import { CellValue, defaultTransformKey } from "./views";
import { cn } from "@/lib/utils";

interface EntriesViewProps {
  entries: [unknown, unknown][];
  brackets?: "{}" | "[]" | "<>" | "()" | "||";
  separator?: ReactNode;
  open?: ReactNode;
  close?: ReactNode;
  className?: string;
  richKey?: boolean;
}
export const EntriesView: FC<EntriesViewProps> = ({
  entries,
  brackets = "{}",
  separator = ":",
  open,
  close,
  className = "text-gray-600 dark:text-gray-400",
  richKey = false,
}) => {
  const start = open ?? `${brackets[0]} `;
  const end = close ?? ` ${brackets[1]}`;

  return (
    <span>
      {wrapString(start, className)}

      {entries.flatMap(([name, item], index, entries) => {
        const last = index === entries.length - 1;
        return (
          <>
            <KeyValue
              name={
                name === undefined
                  ? undefined
                  : (typeof name === "string" ||
                      typeof name === "number" ||
                      typeof name === "symbol") &&
                    (!richKey ? (
                      defaultTransformKey(name)
                    ) : (
                      <CellValue value={name} />
                    ))
              }
              separator={wrapString(separator, cn("px-1", className))}
            >
              <CellValue value={item} />
            </KeyValue>
            {!last && wrapString(", ", className)}
          </>
        );
      })}
      {wrapString(end, className)}
    </span>
  );
};

function wrapString(node: ReactNode, className?: string) {
  if (typeof node === "string")
    return <span className={className}>{node}</span>;
  return node;
}

interface KeyValueProps extends PropsWithChildren {
  name?: ReactNode;
  separator?: ReactNode;
}
export const KeyValue: FC<KeyValueProps> = ({ name, children, separator }) => {
  if (name === undefined || typeof name === "number") return children;
  return (
    <>
      {name}
      {wrapString(separator, "px-1 text-gray-600 dark:text-gray-400")}
      {children}
    </>
  );
};
