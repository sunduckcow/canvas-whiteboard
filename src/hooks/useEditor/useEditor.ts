import { useMachine } from "@xstate/react";
// import throttle from "lodash/throttle";
import { RefObject, useCallback, useMemo } from "react";

import { EventListeners, useEventListeners } from "../useEventListeners";
import { machine, Position, type Point } from "./machine";

function pointGrid(width: number, height: number, distance: number): Point[] {
  const res: Point[] = [];
  for (let x = distance; x <= width - distance; x += distance)
    for (let y = distance; y <= height - distance; y += distance)
      res.push({ x, y });
  return res;
}

export const examplePoints: Point[] = pointGrid(300, 300, 50);

export interface useEditorProps {
  ref: RefObject<HTMLElement | null>;
  initialEntities?: Point[];
  initialPosition?: Position;
  speed?: number;
}
export const useEditor = ({
  ref,
  initialEntities = examplePoints,
  initialPosition,
  speed,
}: useEditorProps) => {
  const [snapshot, send] = useMachine(machine, {
    input: { initialEntities, initialPosition, speed },
  });

  const listeners = useMemo<EventListeners>(
    () => ({
      mousedown: (event, point) => {
        event.preventDefault();
        const { ctrlKey: ctrl, shiftKey: shift } = event;
        send({ type: "mouse.down", ctrl, shift, point });
      },
      // TODO: somehow connect throttle with fps
      //   mousemove: throttle((event, point) => {
      //     event.preventDefault();
      //     const { ctrlKey: ctrl, shiftKey: shift } = event;
      //     send({ type: "mouse.move", ctrl, shift, point });
      //   }, 10),
      mousemove: (event, point) => {
        event.preventDefault();
        const { ctrlKey: ctrl, shiftKey: shift } = event;
        send({ type: "mouse.move", ctrl, shift, point });
      },
      mouseup: (event, point) => {
        event.preventDefault();
        const { ctrlKey: ctrl, shiftKey: shift } = event;
        send({ type: "mouse.up", ctrl, shift, point });
      },
      mouseleave: (event, point) => {
        event.preventDefault();
        const { ctrlKey: ctrl, shiftKey: shift } = event;
        send({ type: "mouse.leave", ctrl, shift, point });
      },
      //   wheel: throttle((event, point) => {
      //     event.preventDefault();
      //     const { ctrlKey: ctrl, shiftKey: shift, deltaX, deltaY } = event;
      //     const delta = { x: deltaX, y: deltaY };
      //     send({ type: "wheel", ctrl, shift, point, delta });
      //   }, 10),
      wheel: (event, point) => {
        event.preventDefault();
        const { ctrlKey: ctrl, shiftKey: shift, deltaX, deltaY } = event;
        const delta = { x: deltaX, y: deltaY };
        send({ type: "wheel", ctrl, shift, point, delta });
      },
    }),
    [send]
  );
  useEventListeners(ref, listeners);

  const deleteSelected = useCallback(() => send({ type: "delete" }), [send]);
  const restart = useCallback(() => send({ type: "restart" }), [send]);
  return { deleteSelected, snapshot, restart };
};
