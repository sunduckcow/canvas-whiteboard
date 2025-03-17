import { FC, useState } from "react";

import { CellValue } from "./views";
import { cn } from "@/lib/utils";

interface Cell {
  x: number;
  y: number;
}

interface MatrixProps {
  matrix: unknown[][];
}

export const Matrix: FC<MatrixProps> = ({ matrix }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // States for region selection
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [endCell, setEndCell] = useState<Cell | null>(null);

  const handleCellHover = (cell: Cell) => {
    setHoveredRow(cell.x);
    setHoveredCol(cell.y);

    if (selecting) setEndCell(cell);
  };

  // Handler for mouse leave from a cell
  const handleCellLeave = () => {
    if (selecting) return;
    setHoveredRow(null);
    setHoveredCol(null);
  };

  // Handler for mouse down on a cell (start selection)
  const handleMouseDown = (cell: Cell) => {
    setSelecting(true);
    setStartCell(cell);
    setEndCell(cell);
  };

  // Handler for mouse up (end selection)
  const handleMouseUp = () => {
    setSelecting(false);
  };

  // Calculate if a cell is within the selected region
  const isCellSelected = ({ x: row, y: col }: Cell) => {
    if (!startCell || !endCell) return false;

    const minRow = Math.min(startCell.x, endCell.x);
    const maxRow = Math.max(startCell.x, endCell.x);
    const minCol = Math.min(startCell.y, endCell.y);
    const maxCol = Math.max(startCell.y, endCell.y);

    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };

  // Extract the selected submatrix
  //   const getSelectedSubmatrix = () => {
  //     if (!startCell || !endCell) return [];

  //     const minRow = Math.min(startCell.row, endCell.row);
  //     const maxRow = Math.max(startCell.row, endCell.row);
  //     const minCol = Math.min(startCell.col, endCell.col);
  //     const maxCol = Math.max(startCell.col, endCell.col);

  //     const submatrix = [];
  //     for (let i = minRow; i <= maxRow; i++) {
  //       const row = [];
  //       for (let j = minCol; j <= maxCol; j++) {
  //         row.push(matrix[i][j]);
  //       }
  //       submatrix.push(row);
  //     }

  //     return submatrix;
  //   };

  //   const submatrix = getSelectedSubmatrix();
  //   const hasSelection = submatrix.length > 0;

  return (
    <div className="p-4" onMouseUp={handleMouseUp}>
      <div className="inline-block border border-gray-300 rounded mb-6">
        {matrix.map((row, x) => (
          <div key={x} className="flex">
            {row.map((cell, y) => (
              <div
                key={y}
                className={cn(
                  `w-12 h-12 flex items-center justify-center border border-gray-200 transition-colors select-none`,
                  hoveredRow === x && !selecting && "bg-blue-100",
                  hoveredCol === y && !selecting && "bg-blue-100",
                  hoveredRow === x &&
                    hoveredCol === y &&
                    !selecting &&
                    "bg-blue-300",
                  isCellSelected({ x, y }) && "bg-green-200",
                  selecting ? "cursor-grabbing" : "cursor-pointer"
                )}
                onMouseEnter={() => handleCellHover({ x, y })}
                onMouseLeave={handleCellLeave}
                onMouseDown={() => handleMouseDown({ x, y })}
              >
                {cell !== null && cell !== undefined && (
                  <CellValue value={cell} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* {hasSelection && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Submatrix:</h3>
          <div className="inline-block border border-gray-300 rounded bg-green-100">
            {submatrix.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-12 h-12 flex items-center justify-center border border-gray-200"
                  >
                    <CellValue value={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Selection: [{startCell?.row}, {startCell?.col}] to [{endCell?.row},{" "}
            {endCell?.col}]
          </p>
        </div>
      )}

      {!hasSelection && (
        <div className="mt-4 text-sm text-gray-600">
          {hoveredRow !== null && hoveredCol !== null
            ? `Hovered: matrix[${hoveredRow}][${hoveredCol}] = ${matrix[hoveredRow][hoveredCol]}`
            : "Hover over cells to see coordinates"}
        </div>
      )} */}
    </div>
  );
};
