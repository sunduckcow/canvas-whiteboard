import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, isValidElement, ReactNode, useState } from "react";

import { defaultTransformKey, findView } from "./views";
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

  // const viewCompact = view.compact;
  const hasCompact =
    view.compact && view.compactWhen && view.compactWhen(value as never);

  // let _initialExpanded = false;
  // if (hasCompact && compact && expandable) {
  //   _initialExpanded = initialExpanded || !name || !hasKey;
  // }

  const [expanded, setExpanded] = useState(
    initialExpanded && hasKey ? !(compact && hasCompact) : true
  );

  const fold = isReactNode ? [] : view.fold?.(value as never);

  // console.log(data, traverseSingleKeys(data));

  // const compact = Array.isArray(fold) && fold.length === 1;

  // if (compact) {
  //   const [key, name] = fold[0];
  //   return (
  //     <>
  //       <span className="text-gray-800 dark:text-gray-200 font-medium">
  //         //{key}//
  //       </span>
  //       <span className="mx-1 text-gray-500">:</span>
  //       <JsonNode
  //         key={String(key)}
  //         data={name}
  //         name={view.transformKey(key, fold.length)}
  //         level={level + 1}
  //       />
  //     </>
  //   );
  // }

  // const compact = siblings === 1;

  if (level >= recursionLimit)
    return <span className="bg-red-400">Recursion limit exceeded</span>;

  return (
    <div
      className={cn(
        hasKey && "my-1",
        debug && "border-blue-200 dark:border-blue-800 border"
      )}
    >
      <div className="flex items-start">
        {hasKey &&
          (expandable ? (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mr-1 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className={cn("w-6")} />
          ))}

        <div className="flex-1">
          <div className="flex items-center">
            {/* {hasKey && (
              <>
                <span
                  className={cn(
                    "text-gray-800 dark:text-gray-200 font-medium",
                    debug && "border-lime-400 dark:border-lime-600 border-b-2"
                  )}
                >
                  {view.transformKey(name, siblings)}
                </span>

                <span
                  className={cn(
                    "mx-1 text-gray-500 hover:text-gray-500",
                    debug && "border-gray-500 border-b-2"
                  )}
                >
                  :
                </span>
              </>
            )} */}
            {keys.flatMap((key, idx, keys) => {
              const last = idx === keys.length - 1;
              const first = idx === 0;
              return [
                <span
                  className={cn(
                    "text-gray-800 dark:text-gray-200 font-medium",
                    debug && "border-lime-400 dark:border-lime-600 border-b-2"
                  )}
                >
                  {last
                    ? view.transformKey(key, 0)
                    : defaultTransformKey(key, first ? siblings : 0)}
                </span>,

                <span
                  className={cn(
                    "mx-1 text-gray-500 hover:text-gray-500",
                    debug && "border-gray-500 border-b-2"
                  )}
                  // TODO: add unfold back
                  onClick={() => {
                    setFoldDepth(idx);
                    setExpanded(true);
                  }}
                >
                  {last ? ":" : "/"}
                </span>,
              ];
            })}
            <span
              className={cn(
                debug && "border-amber-200 dark:border-amber-800 border-b-2"
              )}
            >
              {!expanded && hasCompact && compact ? (
                (view.compact?.(value as never) as ReactNode)
              ) : (
                <>{isReactNode ? value : view.render(value as never)}</>
              )}
            </span>
            {/* <span>
              {keys.map((key) => (
                <span>{String(key)},</span>
              ))}
              <CellValue value={value} />
            </span> */}
          </div>
          {expandable && expanded && (
            <div className={cn(hasKey && "pl-6")}>
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
      </div>
    </div>
  );
};

function traverseSingleKeys(
  initialKey: ObjectKey | undefined,
  data: unknown,
  depth = Infinity
): [ObjectKey[], unknown] {
  let current = data;
  const keys: ObjectKey[] = initialKey === undefined ? [] : [initialKey];

  while (typeof current === "object" && current !== null && depth > 0) {
    const currentKeys = Reflect.ownKeys(current) as ObjectKey[];
    if (currentKeys.length !== 1) return [keys, current];
    const key = currentKeys.pop()!;
    keys.push(key);
    current = current[key as never];
    depth--;
  }

  return [keys, current];
}
