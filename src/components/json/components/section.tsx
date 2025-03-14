import { FC } from "react";

import { ArrayView } from "./array";
import { ArrayViewToggle } from "./array-toggle";
import { JsonNode } from "./node";
import { RawJson } from "./raw";

interface SectionProps {
  data: object;
  title?: string;
  path?: string;
  raw?: boolean;
  array?: boolean;
}
export const Section: FC<SectionProps> = ({
  data,
  title,
  path,
  raw,
  array,
}) => {
  return (
    <div className="overflow-auto p-4 font-mono text-sm">
      {title && (
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">{title}</h4>
            {array && !raw && <ArrayViewToggle sectionData={data} />}
          </div>
          {path && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Path: {path}
            </p>
          )}
        </div>
      )}

      {data !== undefined ? (
        raw ? (
          <RawJson data={data} />
        ) : array ? (
          <ArrayView data={data} name={path?.split(".").pop() || "root"} />
        ) : (
          <JsonNode
            data={data}
            name={path?.split(".").pop() || "root"}
            isRoot
          />
        )
      ) : (
        <div className="text-neutral-500 italic dark:text-neutral-400">
          Path not found in data
        </div>
      )}
    </div>
  );
};
