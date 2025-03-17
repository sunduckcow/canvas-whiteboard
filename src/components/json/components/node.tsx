import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";

import { extendedViews } from "./views";
import { cn } from "@/lib/utils";

type JsonNodeProps = {
  data: unknown;
  name?: string | symbol | number;
  initialExpanded?: boolean;
  level?: number;
};

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  initialExpanded = true,
  level = 0,
}) => {
  const view = extendedViews.find((view) => view.when(data));

  const expandable = Boolean(view?.fold);

  const [expanded, setExpanded] = useState(
    expandable ? initialExpanded || !name : false
  );

  const fold = view?.fold?.(data as never);

  return (
    <div className={cn(Boolean(name) && "my-1")}>
      <div className="flex items-start">
        {Boolean(name) &&
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
            <span className="w-6" />
          ))}

        <div className="flex-1">
          <div className="flex items-center">
            {Boolean(name) && (
              <>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {/* {Array.isArray(data) ? `[${name}]` : name} */}
                  {/* view?.replaceKey(data) ???? */}
                  {typeof name === "symbol" ? `[${name.toString()}]` : name}
                </span>
                <span className="mx-1 text-gray-500">:</span>
              </>
            )}
            <span className="mr-2">{view?.render(data as never)}</span>
          </div>
          {expandable && expanded && (
            <div className={cn(Boolean(name) && "pl-6")}>
              {Array.isArray(fold)
                ? fold.map(([key, value]) => (
                    <JsonNode
                      key={String(key)}
                      data={value}
                      name={
                        typeof key === "number"
                          ? String(key).padStart(
                              Math.ceil(Math.log10(fold.length)),
                              "_" // &nbsp; ??
                            )
                          : key
                      }
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
