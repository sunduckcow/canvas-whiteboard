import { FC, isValidElement, ReactNode, useState } from "react";

import { defaultTransformKey, findView } from "./views";
import { traverseSingleKeys } from "../utils";
import { Chevron } from "./chevron";
import { NodeTitle } from "./title";
import { cn } from "@/lib/utils";
import type { ObjectKey } from "@/utils/utility-types";

type JsonNodeProps = {
  data: unknown;
  name?: ObjectKey;
  initialExpanded?: boolean;
  compact?: boolean;
  level?: number;
  siblings?: number;
  recursionLimit?: number;
};

const debug = false;

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  initialExpanded = true,
  compact = true,
  level = 0,
  siblings,
  recursionLimit = 7,
}) => {
  const hasKey = name !== undefined;

  const [foldDepth, setFoldDepth] = useState(Infinity);

  const [keys, value] = traverseSingleKeys(name, data, foldDepth);

  const isReactNode = isValidElement(value);

  const view = findView(value);

  const expandable = Boolean(view.fold) && !isReactNode;

  const hasCompact =
    view.compact && view.compactWhen && view.compactWhen(value as never);

  const [expanded, setExpanded] = useState(
    initialExpanded && hasKey ? !(compact && hasCompact) : true
  );

  const fold = isReactNode ? [] : view.fold?.(value as never);

  if (level >= recursionLimit)
    return <span className="bg-red-400">Recursion limit exceeded</span>;

  return (
    <div
      className={cn(
        hasKey && "my-1",
        debug && "border-blue-200 dark:border-blue-800 border"
      )}
    >
      <div
        className={cn("flex items-center", !(hasKey && expandable) && "pl-6")}
      >
        {hasKey && expandable && (
          <Chevron
            open={expanded}
            onClick={() => {
              setExpanded((prev) => !prev);
              // TODO: need fold context
              setFoldDepth(Infinity);
            }}
          />
        )}
        <NodeTitle
          keys={keys.map((key, idx, keys) => {
            const last = idx === keys.length - 1;
            const first = idx === 0;
            return last
              ? view.transformKey(key, 0)
              : defaultTransformKey(key, first ? siblings : 0);
          })}
          value={
            !expanded && hasCompact && compact
              ? (view.compact?.(value as never) as ReactNode)
              : isReactNode
              ? value
              : view.render(value as never)
          }
          onKeyClick={(idx) => {
            setFoldDepth((prev) => (prev === idx ? Infinity : idx));
            setExpanded(true); // TODO: single state (true / false / number) -> true = Infinity, false = 0
          }}
        />
      </div>
      {expandable && expanded && (
        <div className={cn(hasKey && "pl-12")}>
          {Array.isArray(fold)
            ? fold.map(([key, value]) => (
                <JsonNode
                  key={String(key)}
                  data={value}
                  name={key}
                  level={level + 1}
                  siblings={fold.length}
                  recursionLimit={recursionLimit}
                />
              ))
            : fold}
        </div>
      )}
    </div>
  );
};
