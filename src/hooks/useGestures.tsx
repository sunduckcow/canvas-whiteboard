import { useState, useCallback, useRef, useMemo } from "react";

import { EventListeners, useEventListeners } from "./useEventListeners";

export const getRealCoordinates = (e: MouseEvent, parent: HTMLElement) => {
  const { clientX, clientY } = e;
  const bounds = parent.getBoundingClientRect();
  const x = Math.round(clientX - bounds.left);
  const y = Math.round(clientY - bounds.top);
  return [x, y] as const;
};

export interface Position {
  x: number;
  y: number;
  z: number;
}

interface UseGesturesParams extends Partial<Position> {
  speed?: number;
}

export function useGestures({
  x: _x = 0,
  y: _y = 0,
  z: _z = 1,
  speed = 2,
}: UseGesturesParams = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [{ x, y, z }, setPosition] = useState({ x: _x, y: _y, z: _z });
  const reset = useCallback(() => {
    setPosition({ x: _x, y: _y, z: _z });
  }, [_x, _y, _z, setPosition]);

  const listeners = useMemo<EventListeners>(
    () => ({
      wheel: (e, { x: px, y: py }) => {
        e.preventDefault();
        if (e.ctrlKey) {
          const zoom = Math.exp(-e.deltaY / (100 / speed));
          setPosition(({ x, y, z }) => ({
            x: x * zoom + px * (1 - zoom),
            y: y * zoom + py * (1 - zoom),
            z: z * zoom,
          }));
        } else {
          setPosition(({ x, y, z }) => ({
            x: x - e.deltaX * speed,
            y: y - e.deltaY * speed,
            z,
          }));
        }
      },
    }),
    [speed]
  );

  useEventListeners(wrapperRef, listeners);

  return { x, y, z, wrapperRef, reset, setPosition };
}

/**
 * defaults,
 * settings (when apply action, which button pressed etc),
 * transformers (process resulting value)
 * -> useGestures ->
 * raw gestures: delta-move, delta-rotate, delta-scale
 *
 * x, y, z should be controlled from outside
 *
 * + refactor
 *
 * NOTE: rotate in safari example: https://kenneth.io/post/detecting-multi-touch-trackpad-gestures-in-javascript
 */
