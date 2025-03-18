import { Braces, Brackets, List, ListTree, TableIcon } from "lucide-react";
import { FC, useMemo, useState } from "react";

import { JsonNode } from "./node";
import { RawJson } from "./raw";
import { Section } from "../json";
import { isArray } from "../utils";
import { ArrayTableView } from "./table";
import { Button } from "@/components/ui/button";

type ViewState = "tree" | "list" | "table" | "raw" | "array";

const viewIcon: Record<ViewState, typeof List> = {
  tree: ListTree,
  list: List,
  raw: Braces,
  table: TableIcon,
  array: Brackets,
};

interface SectionProps extends Section {
  data: unknown;
}
export const SectionView: FC<SectionProps> = ({ data, title, path }) => {
  const canShowTable = useMemo(
    () =>
      isArray(data) &&
      data.length > 0 &&
      data.every((item) => typeof item === "object" && item !== null),
    [data]
  );

  const [view, setView] = useState<ViewState>(canShowTable ? "table" : "tree");

  const options = useMemo<ViewState[]>(
    // () => ["tree", "list", "table", "array", "raw"],
    () =>
      ["tree", canShowTable && "table", "raw"].filter(Boolean) as ViewState[],
    [canShowTable]
  );

  return (
    <div className="overflow-auto p-4 font-mono text-sm">
      {title && (
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">{title}</h4>

            <div className="flex items-center gap-2">
              {options.map((option) => {
                const IconComponent = viewIcon[option];
                return (
                  <Button
                    variant={view === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView(option)}
                    className="h-8 w-8 p-0"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>
          {path && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Path: {path}
            </p>
          )}
        </div>
      )}
      {view === "tree" && <JsonNode data={data} />}
      {view === "list" && <JsonNode data={data} />}
      {view === "table" && isArray(data) && <ArrayTableView data={data} />}
      {view === "raw" && <RawJson data={data} />}
      {data === undefined && (
        <div className="text-neutral-500 italic dark:text-neutral-400">
          Path not found in data
        </div>
      )}
    </div>
  );
};
