import { RefObject, useMemo, useState } from "react";

import { EventListeners, useEventListeners } from "./useEventListeners";

const isPointNear = (
  point: Point,
  x: number,
  y: number,
  distance = 10
): boolean => {
  return Math.abs(point.x - x) <= distance && Math.abs(point.y - y) <= distance;
};

const isPointInRect = (point: Point, r1: Point, r2: Point): boolean => {
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

const lengthSquare = (p1: Point, p2: Point) =>
  (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);

export interface Point {
  x: number;
  y: number;
}
export interface PointView extends Point {
  selected?: boolean;
  hovered?: boolean;
}

export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const examplePoints: PointView[] = [{ x: 100, y: 100 }];

export interface UsePointsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  initialPoints?: PointView[];
}

export const usePoints = ({
  canvasRef,
  initialPoints = examplePoints,
}: UsePointsProps): {
  points: PointView[];
  selection?: Rectangle | null;
} => {
  const [points, setPoints] = useState<PointView[]>(initialPoints);
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState<number[]>([]);

  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragStartPoint, setDragStartPoint] = useState(-1);
  const [dragEnd, setDragEnd] = useState<Point | null>(null);

  const [relation, setRelation] = useState<Point[] | null>(null);

  const listeners = useMemo<EventListeners>(
    () => ({
      mousedown({ shiftKey }, { x, y }) {
        setDragStart({ x, y });
        const pointIndex = points.findIndex((p) => isPointNear(p, x, y));
        setDragStartPoint(pointIndex);
        if (pointIndex >= 0) {
          if (selected.includes(pointIndex)) {
            if (shiftKey) {
              setSelected((prev) => prev.filter((idx) => idx !== pointIndex));
            }
          } else {
            if (shiftKey) {
              setSelected((prev) => [...prev, pointIndex]);
            } else {
              setSelected([pointIndex]);
            }
          }
        }
        // full copy workaround since here we cant get updated selected state
        setRelation(points.map((point) => ({ ...point })));
      },
      mousemove(_e, { x, y }) {
        const pointIndex = points.findIndex((p) => isPointNear(p, x, y));
        if (pointIndex >= 0) setHovered(pointIndex);
        else setHovered(-1);

        if (dragStart) {
          setDragEnd({ x, y });
          if (dragStartPoint >= 0 && relation) {
            setPoints((prevPoints) => {
              const newPoints = [...prevPoints];

              selected.forEach((idx) => {
                if (relation[idx]) {
                  const dx = x - dragStart.x;
                  const dy = y - dragStart.y;
                  newPoints[idx] = {
                    x: relation[idx].x + dx,
                    y: relation[idx].y + dy,
                  };
                }
              });
              return newPoints;
            });
          }
        }
      },
      mouseup({ shiftKey }, { x, y }) {
        if (
          (dragStart && dragEnd && lengthSquare(dragStart, dragEnd) < 25) ||
          !dragEnd
        ) {
          if (dragStartPoint === -1) {
            setPoints((prev) => [...prev, { x, y }]);
            setHovered(points.length);
            if (shiftKey) {
              setSelected((prev) => [...prev, points.length]);
            } else {
              setSelected([points.length]); //?? []
              // setSelected([]);
            }
          } else {
            if (selected.includes(dragStartPoint)) {
              setSelected([dragStartPoint]);
            }
          }
        } else {
          if (dragStartPoint === -1) {
            if (dragStart && dragEnd) {
              const selectedIdxs = points
                .map((point, idx) =>
                  isPointInRect(point, dragStart, dragEnd) ? idx : null
                )
                .filter((point) => point !== null);
              if (shiftKey) {
                setSelected((prev) => [...new Set([...prev, ...selectedIdxs])]);
              } else {
                setSelected(selectedIdxs);
              }
            }
          }
        }

        setDragStartPoint(-1);
        setDragStart(null);
        setDragEnd(null);
        setRelation(null);
      },
    }),
    [dragEnd, dragStart, dragStartPoint, points, relation, selected]
  );

  useEventListeners(canvasRef, listeners);

  return useMemo(
    () => ({
      points: points.map((point, idx) => ({
        ...point,
        hovered: idx === hovered,
        selected: selected.includes(idx),
      })),
      selection:
        dragStart && dragEnd && dragStartPoint === -1
          ? {
              x1: dragStart?.x,
              y1: dragStart?.y,
              x2: dragEnd?.x,
              y2: dragEnd?.y,
            }
          : null,
    }),
    [points, dragStart, dragEnd, dragStartPoint, hovered, selected]
  );
};
