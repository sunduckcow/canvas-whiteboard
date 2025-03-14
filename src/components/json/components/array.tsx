import { FC, useState } from "react";

import { JsonNode } from "./node";
import { ArrayTableView } from "./table";

export const ArrayView: FC<{
  data: object[];
  name: string;
  searchTerm?: string;
}> = ({ data, name, searchTerm }) => {
  const [viewMode, setViewMode] = useState<"tree" | "table">("table");

  // Check if array contains objects that can be displayed in a table
  const canShowTable =
    data.length > 0 &&
    data.every((item) => typeof item === "object" && item !== null);

  // If we can't show a table or user prefers tree view, show the tree view
  if (!canShowTable || viewMode === "tree") {
    return (
      <JsonNode
        data={data}
        name={name}
        isRoot
        initialExpanded={true}
        searchTerm={searchTerm}
      />
    );
  }

  // Otherwise, show the table view
  return <ArrayTableView data={data} searchTerm={searchTerm} />;
};
