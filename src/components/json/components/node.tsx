import { FC, isValidElement, ReactNode, useMemo } from "react";

import { Chevron } from "./chevron";
import { NodeTitle } from "./title";
import { useJsonContext } from "../json-context";
import { traverseSingleKeys } from "../utils";
import { defaultTransformKey } from "../utils";
import { findView } from "./views";
import { cn } from "@/lib/utils";
import type { ObjectKey } from "@/utils/utility-types";

type JsonNodeProps = {
  data: unknown;
  name?: ObjectKey;
  compact?: boolean;
  level?: number;
  siblings?: number;
  recursionLimit?: number;
  comma?: boolean;
  path?: string[];
};

export const debug = false;

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  compact = true,
  level = 0,
  siblings,
  recursionLimit = 7,
  comma,
  path = [],
}) => {
  const hasKey = name !== undefined;
  const nodePath = useMemo(
    () => (hasKey ? [...path, String(name)] : path),
    [hasKey, name, path]
  );

  const { getNodeState, updateNodeState } = useJsonContext();
  const { expanded, foldDepth } = getNodeState(nodePath);

  // Use Infinity for foldDepth when collapsed, but keep the stored value in state
  const effectiveFoldDepth = expanded ? foldDepth : Infinity;
  const [keys, value] = traverseSingleKeys(name, data, effectiveFoldDepth);

  const isReactNode = isValidElement(value);
  const view = findView(value);
  const expandable = Boolean(view.fold) && !isReactNode;
  const hasCompact =
    view.compact && view.compactWhen && view.compactWhen(value as never);

  if (level >= recursionLimit)
    return <span className="bg-red-400">Recursion limit exceeded</span>;

  const fold = isReactNode ? [] : view.fold?.(value as never);

  const handleExpand = () => {
    updateNodeState(nodePath, { expanded: !expanded });
  };

  const handleFoldDepthChange = (depth: number) => {
    updateNodeState(nodePath, {
      foldDepth: depth === foldDepth ? Infinity : depth,
      expanded: true,
    });
  };

  return (
    <div
      className={cn(
        "my-1",
        debug && "border-blue-200 dark:border-blue-800 border"
      )}
    >
      <div
        className={cn("flex items-center", !(hasKey && expandable) && "pl-6")}
      >
        {hasKey && expandable && (
          <Chevron open={expanded} onClick={handleExpand} />
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
          onKeyClick={(idx) => handleFoldDepthChange(idx)}
          comma={comma}
        />
      </div>
      {expandable && expanded && (
        <div className={cn(hasKey && "pl-12")}>
          {Array.isArray(fold)
            ? fold.map(([key, value], idx, arr) => (
                <JsonNode
                  key={String(key)}
                  data={value}
                  name={key}
                  level={level + 1}
                  siblings={fold.length}
                  recursionLimit={recursionLimit}
                  comma={idx !== arr.length - 1}
                  path={nodePath}
                />
              ))
            : fold}
        </div>
      )}
    </div>
  );
};
