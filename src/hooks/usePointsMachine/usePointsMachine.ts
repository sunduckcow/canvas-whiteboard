import { useMachine } from "@xstate/react";
import throttle from "lodash/throttle";
import { RefObject, useMemo } from "react";

import { EventListeners, useEventListeners } from "../useEventListeners";
import { machine, type Point } from "./machine";

function pointGrid(width: number, height: number, distance: number): Point[] {
  const res: Point[] = [];
  for (let x = distance; x <= width - distance; x += distance)
    for (let y = distance; y <= height - distance; y += distance)
      res.push({ x, y });
  return res;
}

const examplePoints: Point[] = pointGrid(300, 300, 50);

export interface UsePointsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  initialEntities?: Point[];
}
export const usePointsMachine = ({
  canvasRef,
  initialEntities = examplePoints,
}: UsePointsProps) => {
  const [snapshot, send] = useMachine(machine, {
    input: { initialEntities },
  });

  const listeners = useMemo<EventListeners>(
    () => ({
      mousedown: ({ shiftKey }, point) =>
        send({ type: "mouse.down", point, shiftKey }),
      // TODO: somehow connect throttle with fps
      mousemove: throttle(({ shiftKey }, point) =>
        send({ type: "mouse.move", point, shiftKey })
      ),
      mouseup: ({ shiftKey }, point) =>
        send({ type: "mouse.up", point, shiftKey }),
      mouseleave: ({ shiftKey }, point) =>
        send({ type: "mouse.leave", point, shiftKey }),
    }),
    [send]
  );
  useEventListeners(canvasRef, listeners);

  return snapshot;
};
