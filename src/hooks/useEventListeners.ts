import { RefObject, useEffect } from "react";

export interface Point {
  x: number;
  y: number;
}

const getPoint = (element: HTMLElement, px: number, py: number) => {
  const rect = element.getBoundingClientRect();
  return { x: px - rect.left, y: py - rect.top };
};

function isMouseEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

export type EventHandler<T extends Event = Event> = T extends MouseEvent
  ? (event: T, point: Point) => void
  : (event: T) => void;

export type EventListeners = {
  [K in keyof HTMLElementEventMap]?: EventHandler<HTMLElementEventMap[K]>;
};

const handlerWrapper =
  (handler: EventHandler, element: HTMLElement) => (e: Event) => {
    if (isMouseEvent(e)) {
      // For mouse events, calculate the relative point
      const point = getPoint(element, e.clientX, e.clientY);
      // Call with point for mouse events
      (handler as (e: MouseEvent, point: Point) => void)(e, point);
    } else {
      // For non-mouse events, call without point
      (handler as (e: Event) => void)(e);
    }
  };

export const useEventListeners = <Element extends HTMLElement = HTMLElement>(
  ref: RefObject<Element | null>,
  listeners: EventListeners
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const controller = new AbortController();
    const signal = controller.signal;

    (
      Object.entries(listeners) as Array<
        [keyof HTMLElementEventMap, EventHandler<Event>]
      >
    ).forEach(([eventName, handler]) => {
      element.addEventListener(eventName, handlerWrapper(handler, element), {
        signal,
      });
    });

    return () => controller.abort();
  }, [listeners, ref]);
};
