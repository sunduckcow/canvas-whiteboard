import { useState, useCallback, useRef, useEffect } from "react";

type EventListenersMap = {
  [key in keyof HTMLElementEventMap]: (ev: HTMLElementEventMap[key]) => void;
};

const getRealCoordinates = (e: MouseEvent, parent: HTMLElement) => {
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
  const [{ x, y, z }, setPosition] = useState({ x: _x, y: _y, z: _z });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;
    const wheelListener: EventListenersMap["wheel"] = (e) => {
      e.preventDefault();
      if (e.ctrlKey) {
        const [deltaX, deltaY] = getRealCoordinates(e, parent);

        const zoom = Math.exp(-e.deltaY / (100 / speed));
        setPosition(({ x, y, z }) => ({
          x: x * zoom + deltaX * (1 - zoom),
          y: y * zoom + deltaY * (1 - zoom),
          z: z * zoom,
        }));
      } else {
        setPosition(({ x, y, z }) => ({
          x: x - e.deltaX * speed,
          y: y - e.deltaY * speed,
          z,
        }));
      }
    };
    parent.addEventListener("wheel", wheelListener);
    return () => {
      parent.removeEventListener("wheel", wheelListener);
    };
  }, [speed, setPosition]);

  const reset = useCallback(() => {
    setPosition({ x: _x, y: _y, z: _z });
  }, [_x, _y, _z, setPosition]);

  return { x, y, z, ref, reset, setPosition };
}

/**
 * defaults,
 * settings (when apply action, which button pressed etc),
 * materials (ref),
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
