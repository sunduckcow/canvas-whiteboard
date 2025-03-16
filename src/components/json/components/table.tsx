import { FC } from "react";

import { CellValue } from "./cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export const ArrayTableView: FC<{
  data: unknown[];
}> = ({ data }) => {
  // If array is empty, show a message
  if (data.length === 0) {
    return (
      <div className="text-neutral-500 italic dark:text-neutral-400">
        Empty array
      </div>
    );
  }

  // Get all unique keys from all objects in the array
  const allKeys = new Set<string>();
  data.forEach((item) => {
    if (item && typeof item === "object") {
      Object.keys(item).forEach((key) => allKeys.add(key));
    }
  });
  const columns = Array.from(allKeys);

  // If no columns were found, it might be an array of primitives
  if (columns.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Index</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index}</TableCell>
              <TableCell>
                <CellValue value={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // For objects, create a table with all keys as columns
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index}</TableCell>
              {columns.map((column) => (
                <TableCell key={column}>
                  {item && typeof item === "object" && column in item ? (
                    <CellValue
                      value={(item as Record<string, unknown>)[column]}
                    />
                  ) : (
                    <span className="text-neutral-500 dark:text-neutral-400">
                      —
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
