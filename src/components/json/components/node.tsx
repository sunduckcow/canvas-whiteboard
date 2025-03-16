import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";

import { ArrayView } from "./array";
import { CellValue } from "./cell";
import { cn } from "@/lib/utils";

type JsonNodeProps = {
  data: unknown;
  name?: string;
  initialExpanded?: boolean;
  level?: number;
};

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  initialExpanded = true,
  level = 0,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded || !name);

  const expandable = typeof data === "object" && data !== null;

  // if (root) {
  //   if (expandable) return <RenderChildren data={data} level={level + 1} />;
  //   return <CellValue value={data} />;
  // }

  return (
    <div className={cn(Boolean(name) && "my-1")}>
      <div className="flex items-start">
        {Boolean(name) &&
          (expandable ? (
            <button
              onClick={() => setExpanded(!expanded)}
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
                  {name}
                </span>
                <span className="mx-1 text-gray-500">:</span>
              </>
            )}

            <span className={cn("mr-2", expandable && "hidden")}>
              <CellValue value={data} />
            </span>

            {expandable && (
              <span className="text-gray-500">
                {Array.isArray(data)
                  ? `${expanded ? "" : "[]"} ${data.length} items`
                  : `${expanded ? "" : "{}"} ${Object.keys(data).length} keys`}
              </span>
            )}
          </div>

          {expandable && expanded && (
            <div className={cn(Boolean(name) && "pl-6")}>
              <RenderChildren data={data} level={level + 1} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RenderChildren = ({ data, level }: { data: object; level: number }) => {
  if (
    Array.isArray(data) &&
    data.every((item) => typeof item !== "object" || item === null)
  )
    return <ArrayView data={data} />;
  const entries = Object.entries(data);
  if (entries.length === 0)
    return (
      <span className="text-gray-500">{Array.isArray(data) ? "[]" : "{}"}</span>
    );

  return Object.entries(data).map(([key, value]) => (
    <JsonNode key={key} data={value} name={key} level={level + 1} />
  ));
};
