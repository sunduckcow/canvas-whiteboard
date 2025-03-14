import { List, TableIcon } from "lucide-react";
import { FC, useState } from "react";

import { Button } from "@/components/ui/button";

export const ArrayViewToggle: FC<{ sectionData: object[] }> = ({
  sectionData,
}) => {
  const [viewMode, setViewMode] = useState<"tree" | "table">("table");

  // Only show toggle if the array contains objects that can be displayed in a table
  const canShowTable =
    sectionData.length > 0 &&
    sectionData.every((item) => typeof item === "object" && item !== null);

  if (!canShowTable) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "tree" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("tree")}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="h-8 w-8 p-0"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
