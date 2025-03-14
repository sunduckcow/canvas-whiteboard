import get from "lodash/get";
import { Search } from "lucide-react";
import { useState } from "react";
import React from "react";

import { Section } from "./components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Section = {
  path?: string;
  title?: string;
};

type JsonViewerProps = {
  data: object;
  initialExpanded?: boolean;
  className?: string;
  sections?: Section[];
};

export function Json({
  data,
  className,
  // initialExpanded = false,
  sections = [{}],
}: JsonViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawView, setRawView] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
        className
      )}
    >
      <div className="flex items-center justify-between border-b p-3">
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
      </div>

      {sections.map((section, index) => {
        const sectionData = section.path ? get(data, section.path) : data;
        const isLastSection = index === sections.length - 1;
        const isArray = Array.isArray(sectionData);

        return (
          <React.Fragment key={index}>
            <Section
              data={sectionData}
              title={section.title}
              path={section.path}
              raw={rawView}
              array={isArray}
            />
            {!isLastSection && <Separator />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
