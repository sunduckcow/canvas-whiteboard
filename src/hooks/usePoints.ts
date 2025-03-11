import { RefObject, useCallback, useMemo, useState } from "react";

import { useEventListeners } from "./useEventListeners";

// const inBBox = (px: number, py: number, x: number, y: number) =>
//   x - 10 < px && x + 10 > px && y - 10 < py && y + 10 > py;

// Helper function to check if a point is within a given distance of coordinates
const isPointNear = (
  point: Point,
  x: number,
  y: number,
  distance = 10
): boolean => {
  return Math.abs(point.x - x) <= distance && Math.abs(point.y - y) <= distance;
};

// Helper function to check if a point is within a selection rectangle
const isPointInRect = (
  point: RawPoint,
  r1: RawPoint,
  r2: RawPoint
): boolean => {
  const { x: x1, y: y1 } = r1;
  const { x: x2, y: y2 } = r2;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
};

const lengthSquare = (p1: RawPoint, p2: RawPoint) =>
  (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);

export type PointState = "idle" | "hovered" | "selected";
export interface RawPoint {
  x: number;
  y: number;
}
export interface Point extends RawPoint {
  state: PointState;
}

export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const examplePoints: Point[] = [{ x: 100, y: 100, state: "idle" }];

export interface UsePointsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  initialPoints?: Point[];
}

export const usePoints = ({
  canvasRef,
  initialPoints = examplePoints,
}: UsePointsProps): {
  points: Point[];
  selection?: Rectangle | null;
} => {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  // const [selection, setSelection] = useState<Rectangle | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<RawPoint | null>(null);
  const [dragEnd, setDragEnd] = useState<RawPoint | null>(null);

  const continueDragging = useCallback(
    (point: RawPoint) => setDragEnd(point),
    []
  );

  const hoverPoints = useCallback(({ x, y }: RawPoint) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) => ({
        ...point,
        state:
          point.state === "selected"
            ? "selected"
            : isPointNear(point, x, y)
            ? "hovered"
            : "idle",
      }))
    );
  }, []);

  const togglePoint = useCallback((idx: number) => {
    setPoints((prevPoints) =>
      prevPoints.map((point, i) =>
        i === idx
          ? {
              ...point,
              state: point.state === "selected" ? "hovered" : "selected",
            }
          : point
      )
    );
  }, []);

  const startDragging = useCallback(({ x, y }: RawPoint) => {
    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, []);

  const push = useCallback((point: RawPoint) => {
    setPoints((prev) => [...prev, { ...point, state: "idle" }]);
  }, []);

  const selectPointsInRect = useCallback((r1: RawPoint, r2: RawPoint) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) => ({
        ...point,
        state: isPointInRect(point, r1, r2) ? "selected" : "idle",
      }))
    );
  }, []);

  useEventListeners(canvasRef, {
    mousemove(_e, { x, y }) {
      if (isDragging && dragStart) {
        continueDragging({ x, y });
      } else {
        hoverPoints({ x, y });
      }
    },

    mousedown(_e, { x, y }) {
      // Check if we clicked on an existing point
      const clickedPointIndex = points.findIndex((p) => isPointNear(p, x, y));

      if (clickedPointIndex >= 0) {
        togglePoint(clickedPointIndex);
      } else {
        startDragging({ x, y });
      }
    },

    mouseup() {
      if (isDragging && dragStart && dragEnd) {
        // If selection area is very small, treat as a click and add a new point
        const isSmallSelection = lengthSquare(dragStart, dragEnd) < 25;

        if (isSmallSelection) {
          push(dragStart);
        } else {
          selectPointsInRect(dragStart, dragEnd);
        }
      }

      stopDragging();
    },
    mouseleave() {
      if (isDragging && dragStart && dragEnd) {
        selectPointsInRect(dragStart, dragEnd);
      }
      stopDragging();
    },
  });

  const selection = useMemo<Rectangle | null>(
    () =>
      dragStart && dragEnd
        ? {
            x1: dragStart?.x,
            y1: dragStart?.y,
            x2: dragEnd?.x,
            y2: dragEnd?.y,
          }
        : null,
    [dragEnd, dragStart]
  );

  return { points, selection };
};
