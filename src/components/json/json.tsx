import get from "lodash/get";
import React from "react";

import { SectionView } from "./components/section";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface InlineOptions {
  array?: boolean | number;
  object?: boolean | number;
  keys?: boolean | number;
}

interface Globals {
  initialExpand?: boolean | number;
  showPath?: boolean;
  inline?: boolean | InlineOptions;
  // editable?: string[];
}

export interface Section extends Globals {
  path?: string;
  title?: string;
  table?: { columns: string[] | { title: string; key: string }[] };
  list?: { rows: string[] | { title: string; key: string }[] };
}

interface JsonProps extends Globals {
  data: unknown;
  className?: string;
  sections?: Section[];
}

export function Json({
  data,
  className,
  sections = [{}],
  ...globals
}: JsonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
        className
      )}
    >
      {/* <div className="flex items-center justify-between border-b p-3">
        <h3 className="text-lg font-medium">JSON Viewer</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRawView(!rawView)}
          >
            {rawView ? "Tree View" : "Raw View"}
          </Button>
        </div>
      </div> */}

      {sections.map((section, index) => {
        const sectionData = section.path ? get(data, section.path) : data;
        const isLastSection = index === sections.length - 1;

        return (
          <React.Fragment key={index}>
            <SectionView {...globals} {...section} data={sectionData} />
            {!isLastSection && <Separator />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
