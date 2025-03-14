import { assign, enqueueActions, setup } from "xstate";

import { Point } from "../useEventListeners";

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface MachineContext extends Position {
  speed: number;
}

type MachineInput = Partial<MachineContext>;

interface MachineEvent<T extends string> {
  type: T;
}

interface WheelEvent extends MachineEvent<"wheel">, Point {
  ctrl: boolean;
  dx: number;
  dy: number;
}

type Events = WheelEvent | MachineEvent<"restart">;

export const defaultMachineContext: MachineContext = {
  x: 0,
  y: 0,
  z: 1,
  speed: 2,
};
export const machine = setup({
  types: {
    context: {} as MachineContext & { __initial: MachineContext },
    events: {} as Events,
    input: {} as MachineInput | void,
  },
  actions: {
    zoom: assign(({ context }, params: { zoom: number } & Point) => ({
      x: context.x * params.zoom + params.x * (1 - params.zoom),
      y: context.y * params.zoom + params.y * (1 - params.zoom),
      z: context.z * params.zoom,
    })),
    move: assign(({ context }, params: { dx: number; dy: number }) => ({
      x: context.x - params.dx * context.speed,
      y: context.y - params.dy * context.speed,
    })),
    restart: assign(({ context: { __initial } }) => __initial),
  },
  guards: {
    ctrl: ({ event }) => "ctrl" in event && event.ctrl,
  },
}).createMachine({
  context: ({ input }) => {
    const __initial = { ...defaultMachineContext, ...input };
    return { ...__initial, __initial };
  },

  id: "gestures",

  on: {
    wheel: {
      actions: enqueueActions(
        ({ context: { speed }, event: { x, y, dx, dy }, enqueue, check }) => {
          if (check("ctrl")) {
            const zoom = Math.exp(-dy / (100 / speed));
            enqueue({ type: "zoom", params: { zoom, x, y } });
          } else {
            enqueue({ type: "move", params: { dx, dy } });
          }
        }
      ),
    },
    restart: { actions: "restart" },
  },
});
