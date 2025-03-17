import { FC } from "react";

import { CellValue } from "./views";
import { ObjectKey } from "@/utils/utility-types";

export const ObjectView: FC<{
  data: Record<ObjectKey, unknown>;
}> = ({ data }) => {
  return (
    <div>
      <span>{"{ "}</span>
      {Object.entries(data).map(([name, item], index, entries) => (
        <>
          <span>{name}</span>
          <span className="px-1">:</span>
          <CellValue value={item} />
          {index !== entries.length - 1 && <span>, </span>}
        </>
      ))}
      <span>{" }"}</span>
    </div>
  );
};
