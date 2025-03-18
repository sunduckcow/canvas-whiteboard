import { FC, ReactNode } from "react";

import { debug } from "./node";
import { cn } from "@/lib/utils";

interface NodeTitleProps {
  keys: ReactNode[] | ReactNode;
  value: ReactNode;
  onKeyClick: (idx: number) => void;
  // TODO: decide more accurate names
  keySeparator?: string;
  valueSeparator?: string;
  comma?: boolean;
}
export const NodeTitle: FC<NodeTitleProps> = ({
  keys: _keys,
  value,
  onKeyClick,
  valueSeparator = ":",
  keySeparator = "/",
  comma,
}) => {
  const keys = Array.isArray(_keys) ? _keys : [_keys];
  return (
    <>
      {keys.flatMap((node, idx, keys) => [
        <span
          className={cn(
            "text-gray-800 dark:text-gray-200 font-medium",
            debug && "border-lime-400 dark:border-lime-600 border-b-2"
          )}
          onClick={() => onKeyClick(idx)}
        >
          {node}
        </span>,
        <span
          className={cn(
            "mx-1 text-gray-500 hover:text-gray-500",
            debug && "border-gray-500 border-b-2"
          )}
        >
          {idx === keys.length - 1 ? valueSeparator : keySeparator}
        </span>,
      ])}
      <span
        className={cn(
          debug && "border-amber-200 dark:border-amber-800 border-b-2"
        )}
      >
        {value}
      </span>
      {comma && <span className="text-gray-500 hover:text-gray-500">,</span>}
    </>
  );
};
