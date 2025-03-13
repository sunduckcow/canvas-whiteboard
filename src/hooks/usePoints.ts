import { RefObject, useCallback, useMemo, useState } from "react";

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

const len2 = (p1: Point, p2: Point) =>
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

function pointGrid(width: number, height: number, distance: number): Point[] {
  const res: Point[] = [];
  for (let x = distance; x <= width - distance; x += distance)
    for (let y = distance; y <= height - distance; y += distance)
      res.push({ x, y });
  return res;
}
// const examplePoints: PointView[] = [{ x: 100, y: 100 }];
const examplePoints: PointView[] = pointGrid(300, 300, 50);

export interface UsePointsProps {
  ref: RefObject<HTMLCanvasElement | null>;
  initialPoints?: PointView[];
}

export const usePoints = ({
  ref,
  initialPoints = examplePoints,
}: UsePointsProps) => {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState<number[]>([]);

  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragStartPoint, setDragStartPoint] = useState(-1);
  const [dragStartPointSelected, setDragStartPointSelected] = useState(false); // TODO: how to remove it
  const [dragEnd, setDragEnd] = useState<Point | null>(null);

  const [relation, setRelation] = useState<Point[] | null>(null);

  const deleteSelected = useCallback(() => {
    setPoints((prev) => prev.filter((_p, idx) => !selected.includes(idx)));
    setSelected([]);
  }, [selected]);

  const pushPoint = useCallback(
    (p: Point) => setPoints((prev) => [...prev, p]),
    []
  );
  const addSelected = useCallback(
    (idxs: number[]) => setSelected((prev) => [...new Set([...prev, ...idxs])]),
    []
  );
  const removeSelected = useCallback(
    (removeIdx: number) =>
      setSelected((prev) => prev.filter((idx) => idx !== removeIdx)),
    []
  );

  const listeners = useMemo<EventListeners>(
    () => ({
      mousedown({ shiftKey }, { x, y }) {
        setDragStart({ x, y });
        const pointIndex = points.findIndex((p) => isPointNear(p, x, y));
        setDragStartPoint(pointIndex);
        // FIXME: full copy workaround since here we cant get updated selected state
        setRelation(points.map((point) => ({ ...point })));

        const clickedPoint = pointIndex >= 0;
        const clickedSelected = selected.includes(pointIndex);
        setDragStartPointSelected(clickedSelected);

        if (clickedPoint && !clickedSelected && shiftKey) {
          addSelected([pointIndex]);
        }
        if (clickedPoint && !clickedSelected && !shiftKey) {
          setSelected([pointIndex]);
        }
      },
      mousemove(_e, { x, y }) {
        const pointIndex = points.findIndex((p) => isPointNear(p, x, y));
        const currentlyOnPoint = pointIndex >= 0;
        if (currentlyOnPoint) {
          setHovered(pointIndex);
        }
        if (!currentlyOnPoint) {
          setHovered(-1);
        }

        const clickedPoint = dragStartPoint >= 0;

        if (dragStart) {
          setDragEnd({ x, y });
        }
        if (dragStart && clickedPoint && relation) {
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
      },
      mouseup({ shiftKey }, { x, y }) {
        setDragStartPoint(-1);
        setDragStart(null);
        setDragEnd(null);
        setRelation(null);

        const didMove = dragStart && dragEnd && len2(dragStart, dragEnd) > 25;
        const clickedPoint = dragStartPoint >= 0;
        const clickedSelected = selected.includes(dragStartPoint);

        if (!didMove && !clickedPoint) {
          pushPoint({ x, y });
          setHovered(points.length); // hover last added
        }
        if (!didMove && !clickedPoint && shiftKey) {
          addSelected([points.length]);
        }
        if (!didMove && !clickedPoint && !shiftKey) {
          setSelected([points.length]); //?? []
          // setSelected([]);
        }

        if (
          !didMove &&
          clickedPoint &&
          clickedSelected &&
          shiftKey &&
          dragStartPointSelected
        ) {
          removeSelected(dragStartPoint);
        }
        if (!didMove && clickedPoint && clickedSelected && !shiftKey) {
          setSelected([dragStartPoint]);
        }
        if (didMove && !clickedPoint && dragStart && dragEnd) {
          const selectedIdxs = points.reduce<number[]>((acc, point, idx) => {
            if (isPointInRect(point, dragStart, dragEnd)) acc.push(idx);
            return acc;
          }, []);
          if (shiftKey) {
            addSelected(selectedIdxs);
          } else {
            setSelected(selectedIdxs);
          }
        }
      },
    }),
    [
      addSelected,
      dragEnd,
      dragStart,
      dragStartPoint,
      dragStartPointSelected,
      points,
      pushPoint,
      relation,
      removeSelected,
      selected,
    ]
  );

  useEventListeners(ref, listeners);

  return useMemo(
    () => ({
      deleteSelected,
      points: points.map((point, idx) => ({
        ...point,
        hovered:
          idx === hovered ||
          Boolean(
            !(dragStartPoint >= 0) &&
              dragStart &&
              dragEnd &&
              isPointInRect(point, dragStart, dragEnd)
          ),
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
    [
      deleteSelected,
      points,
      dragStart,
      dragEnd,
      dragStartPoint,
      hovered,
      selected,
    ]
  );
};
