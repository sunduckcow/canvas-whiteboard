import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, isValidElement, ReactNode, useState } from "react";

import { findView } from "./views";
import { cn } from "@/lib/utils";
import type { ObjectKey } from "@/utils/utility-types";

type JsonNodeProps = {
  data: unknown;
  name?: ObjectKey;
  initialExpanded?: boolean;
  compact?: boolean;
  level?: number;
  siblings?: number;
};

const debug = true;

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  initialExpanded = true,
  compact = false,
  level = 0,
  siblings,
}) => {
  const hasKey = name !== undefined;

  const isReactNode = isValidElement(data);

  const view = findView(data);

  const expandable = Boolean(view.fold) && !isReactNode;

  // const viewCompact = view.compact;
  const hasCompact =
    view.compact && view.compactWhen && view.compactWhen(data as never);

  // let _initialExpanded = false;
  // if (hasCompact && compact && expandable) {
  //   _initialExpanded = initialExpanded || !name || !hasKey;
  // }

  const [expanded, setExpanded] = useState(
    initialExpanded && hasKey ? !(compact && hasCompact) : true
  );

  const fold = isReactNode ? [] : view.fold?.(data as never);

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
            {hasKey && (
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
            )}
            <span
              className={cn(
                debug && "border-amber-200 dark:border-amber-800 border-b-2"
              )}
            >
              {!expanded && hasCompact && compact ? (
                (view.compact?.(data as never) as ReactNode)
              ) : (
                <>{isReactNode ? data : view.render(data as never)}</>
              )}
            </span>
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
