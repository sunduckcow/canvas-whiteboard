import { FC } from "react";

import { CellValue } from "./views";

export const ArrayView: FC<{
  data: unknown[];
}> = ({ data }) => {
  return (
    <div>
      <span className="text-gray-600 dark:text-gray-400">{"[ "}</span>
      {data.map((item, index) => (
        <>
          <CellValue value={item} />
          {index !== data.length - 1 && (
            <span className="text-gray-600 dark:text-gray-400">, </span>
          )}
        </>
      ))}
      <span className="text-gray-600 dark:text-gray-400">{" ]"}</span>
    </div>
  );
};
