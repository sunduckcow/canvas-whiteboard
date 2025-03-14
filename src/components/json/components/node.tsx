import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import React from "react";
import { FC, useState } from "react";

import { cn } from "@/lib/utils";

type JsonNodeProps = {
  data: object;
  name: string;
  isRoot?: boolean;
  initialExpanded?: boolean;
  searchTerm?: string;
  level?: number;
};

export const JsonNode: FC<JsonNodeProps> = ({
  data,
  name,
  isRoot = false,
  initialExpanded = false,
  searchTerm = "",
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [copied, setCopied] = useState(false);

  const type =
    data === null ? "null" : Array.isArray(data) ? "array" : typeof data;
  const isExpandable = (type === "array" || type === "object") && data !== null;
  const hasMatchingSearch =
    searchTerm &&
    JSON.stringify(data).toLowerCase().includes(searchTerm.toLowerCase());

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = () => {
    if (data === null) return <span className="text-gray-500">null</span>;
    if (data === undefined)
      return <span className="text-gray-500">undefined</span>;

    switch (type) {
      case "string":
        return (
          <span className="text-green-600 dark:text-green-400">"{data}"</span>
        );
      case "number":
        return <span className="text-blue-600 dark:text-blue-400">{data}</span>;
      case "boolean":
        return (
          <span className="text-purple-600 dark:text-purple-400">
            {data.toString()}
          </span>
        );
      case "object":
        return <span className="text-gray-600 dark:text-gray-400">{"{}"}</span>;
      case "array":
        return <span className="text-gray-600 dark:text-gray-400">{"[]"}</span>;
      default:
        return <span>{String(data)}</span>;
    }
  };

  const canRenderInline = () => {
    if (!isExpandable || data === null || data === undefined) return false;

    // For arrays and objects, check if they're small enough to render inline
    const entries =
      type === "array"
        ? data.map((item: any, index: number) => [index, item])
        : Object.entries(data);

    // Only render inline if there are few entries and they're all simple values
    if (entries.length > 3) return false;

    // Check if all values are simple (not objects or arrays)
    return entries.every(([_, value]: [string, any]) => {
      const valueType =
        value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
      return valueType !== "object" && valueType !== "array";
    });
  };

  const renderInline = () => {
    if (type === "array") {
      const items = data.map((item: any, index: number) => {
        if (item === null)
          return (
            <span key={index} className="text-gray-500">
              null
            </span>
          );
        if (item === undefined)
          return (
            <span key={index} className="text-gray-500">
              undefined
            </span>
          );
        if (typeof item === "string")
          return (
            <span key={index} className="text-green-600 dark:text-green-400">
              "{item}"
            </span>
          );
        if (typeof item === "number")
          return (
            <span key={index} className="text-blue-600 dark:text-blue-400">
              {item}
            </span>
          );
        if (typeof item === "boolean")
          return (
            <span key={index} className="text-purple-600 dark:text-purple-400">
              {item.toString()}
            </span>
          );
        return <span key={index}>{String(item)}</span>;
      });

      return (
        <span>
          <span className="text-gray-600 dark:text-gray-400">[</span>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <span className="mx-0.5">{item}</span>
              {index < items.length - 1 && (
                <span className="text-gray-500">,</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-gray-600 dark:text-gray-400">]</span>
        </span>
      );
    } else {
      // object
      const pairs = Object.entries(data).map(([key, value]: [string, any]) => {
        let valueEl;
        if (value === null)
          valueEl = <span className="text-gray-500">null</span>;
        else if (value === undefined)
          valueEl = <span className="text-gray-500">undefined</span>;
        else if (typeof value === "string")
          valueEl = (
            <span className="text-green-600 dark:text-green-400">
              "{value}"
            </span>
          );
        else if (typeof value === "number")
          valueEl = (
            <span className="text-blue-600 dark:text-blue-400">{value}</span>
          );
        else if (typeof value === "boolean")
          valueEl = (
            <span className="text-purple-600 dark:text-purple-400">
              {value.toString()}
            </span>
          );
        else valueEl = <span>{String(value)}</span>;

        return (
          <span key={key}>
            <span className="text-gray-800 dark:text-gray-200">{key}</span>
            <span className="text-gray-500">:</span>
            <span className="mx-1">{valueEl}</span>
          </span>
        );
      });

      return (
        <span>
          <span className="text-gray-600 dark:text-gray-400">{"{"}</span>
          <span className="mx-0.5">
            {pairs.map((pair, index) => (
              <React.Fragment key={index}>
                {pair}
                {index < pairs.length - 1 && (
                  <span className="text-gray-500">,</span>
                )}
              </React.Fragment>
            ))}
          </span>
          <span className="text-gray-600 dark:text-gray-400">{"}"}</span>
        </span>
      );
    }
  };

  const renderChildren = () => {
    if (!isExpandable || !isExpanded || data === null || data === undefined)
      return null;

    // If we can render inline and the node is collapsed, don't render children
    if (canRenderInline() && !isExpanded) return null;

    const entries =
      type === "array"
        ? data.map((item: any, index: number) => [index, item])
        : Object.entries(data);

    if (entries.length === 0) {
      return (
        <div className="pl-6 text-gray-500">
          {type === "array" ? "[]" : "{}"}
        </div>
      );
    }

    return (
      <div className="pl-6">
        {entries.map(([key, value]: [string, any]) => (
          <JsonNode
            key={key}
            data={value}
            name={key}
            initialExpanded={initialExpanded}
            searchTerm={searchTerm}
            level={level + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "my-1",
        hasMatchingSearch && "bg-yellow-100 dark:bg-yellow-900/30 rounded",
        isRoot && "mt-0"
      )}
    >
      <div className="flex items-start">
        {isExpandable ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-1 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div className="flex-1">
          <div className="flex items-center">
            {!isRoot && (
              <>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {type === "array" ? `[${name}]` : name}
                </span>
                <span className="mx-1 text-gray-500">:</span>
              </>
            )}

            {isExpandable && canRenderInline() && !isExpanded ? (
              <span className="mr-2">{renderInline()}</span>
            ) : (
              <>
                <span
                  className={cn("mr-2", isExpandable && isExpanded && "hidden")}
                >
                  {renderValue()}
                </span>

                {isExpandable && (
                  <span className="text-gray-500">
                    {type === "array"
                      ? `${data.length} items`
                      : `${Object.keys(data).length} keys`}
                  </span>
                )}
              </>
            )}

            <button
              onClick={handleCopy}
              className="ml-2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          </div>

          {renderChildren()}
        </div>
      </div>
    </div>
  );
};
