import { useMachine } from "@xstate/react";
import throttle from "lodash/throttle";
import { useMemo, RefObject, useCallback } from "react";

import { EventListeners, useEventListeners } from "../useEventListeners";
import { machine } from "./machine";

export interface Position {
  x: number;
  y: number;
  z: number;
}

interface UseGesturesParams extends Partial<Position> {
  speed?: number;
  ref: RefObject<HTMLElement | null>;
}

export function useGesturesMachine({
  x = 0,
  y = 0,
  z = 1,
  speed = 2,
  ref,
}: UseGesturesParams) {
  const [snapshot, send] = useMachine(machine, { input: { x, y, z, speed } });

  const restart = useCallback(() => send({ type: "restart" }), [send]);

  const listeners = useMemo<EventListeners>(
    () => ({
      wheel: throttle((event, { x, y }) => {
        event.preventDefault();
        const { ctrlKey: ctrl, deltaX: dx, deltaY: dy } = event;
        send({ type: "wheel", ctrl, dx, dy, x, y });
      }, 10),
    }),
    [send]
  );

  useEventListeners(ref, listeners);

  return { snapshot, restart };
}
