import { FC } from "react";

import { CellValue } from "./cell";

export const ArrayView: FC<{
  data: unknown[];
}> = ({ data }) => {
  return (
    <div>
      <span>[ </span>
      {data.map((item, index) => (
        <>
          <CellValue value={item} />
          {index !== data.length - 1 && <span>, </span>}
        </>
      ))}
      <span> ]</span>
    </div>
  );
};
