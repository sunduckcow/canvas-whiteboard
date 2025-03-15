import { assign, enqueueActions, setup } from "xstate";

import { findNearIndex, inReact, near } from "./utils";

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Point {
  x: number;
  y: number;
}

interface MachineContext extends Position {
  entities: Point[];
  selected: Set<number>;
  start?: Point;
  held?: { point: Point; index: number; wasSelected: boolean };
  end?: Point;
  hovered?: number;
  relations?: Record<number, Point>;
  speed: number;
}
interface MachineInput {
  initialEntities?: Point[];
  initialPosition?: Position;
  speed?: number;
}

interface MachineEvent<T extends string = ""> {
  type: T;
}

interface MachineMouseEvent<T extends string = "">
  extends MachineEvent<`mouse.${T}`> {
  point: Point;
  shift: boolean;
  ctrl: boolean;
}

interface MachineWheelEvent extends Omit<MachineMouseEvent, "type"> {
  type: "wheel";
  delta: Point;
}

type MouseEvents =
  | MachineMouseEvent<"down">
  | MachineMouseEvent<"move">
  | MachineMouseEvent<"up">
  | MachineMouseEvent<"leave">;

type OtherEvents =
  | MachineEvent<"delete">
  | MachineEvent<"restart">
  | MachineWheelEvent;

type Events = MouseEvents | OtherEvents;

export const machine = setup({
  types: {
    context: {} as MachineContext & { __input: MachineInput | void },
    events: {} as Events,
    input: {} as MachineInput | void,
  },
  actions: {
    updateHover: assign({
      hovered: ({ context }, point: Point) =>
        findNearIndex(context.entities, point),
    }),
    resetHover: assign({ hovered: undefined }),
    moveEnd: assign({ end: (_, point: Point) => point }),
    reset: assign({
      start: undefined,
      end: undefined,
      relations: undefined,
      held: undefined,
    }),
    setStart: assign(
      ({ context: { entities, selected, hovered } }, point: Point) => {
        const index = hovered;
        return {
          start: point,
          held:
            index !== undefined && index >= 0
              ? {
                  index,
                  point: entities[index],
                  wasSelected: selected.has(index),
                }
              : undefined,
        };
      }
    ),
    addPoint: assign({
      entities: ({ context }, point: Point) => [...context.entities, point],
    }),
    setSelected: assign((_, ids: number[]) => ({ selected: new Set(ids) })),
    addSelected: assign(({ context }, ids: number[]) => ({
      selected: context.selected.union(new Set(ids)),
    })),
    // // https://github.com/statelyai/xstate/issues/4820
    // select: enqueueActions(({ enqueue, check }, params: number[]) => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   if (check("shift")) { enqueue({ type: "addSelected", params }); } else { enqueue({ type: "setSelected", params }); }
    // }),
    deselect: assign(({ context }, params: { index: number }) => {
      context.selected.delete(params.index);
      return { selected: context.selected };
    }),
    selectInRegion: assign(({ context }, shift: boolean) => {
      const { start, end, entities, selected } = context;
      if (!start || !end) return {};
      const regionIds = entities.reduce<number[]>((acc, p, i) => {
        if (inReact(p, start, end)) acc.push(i);
        return acc;
      }, []);
      if (!shift) return { selected: new Set(regionIds) };
      regionIds.forEach((i) => selected.add(i));
      return { selected };
    }),
    // selectInRegion: enqueueActions(({ context: { start, end, entities }, enqueue }) => {
    //   if (!start || !end) return {};
    //   const regionIds = entities.reduce<number[]>((acc, p, i) => { if (inReact(p, start, end)) acc.push(i); return acc; }, []);
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   enqueue({ type: "select", params: regionIds });
    // }),
    setRelations: assign({
      relations: ({ context: { selected, entities } }) =>
        selected.values().reduce<Record<number, Point>>((acc, id) => {
          acc[id] = { ...entities[id] };
          return acc;
        }, {}),
    }),
    moveSelected: assign({
      entities: (
        { context: { entities, relations, selected, start } },
        { x, y }: Point
      ) => {
        if (!relations || !start) return entities;
        const newEntities = [...entities];
        Array.from(selected).forEach((idx) => {
          if (relations[idx]) {
            const dx = x - start.x;
            const dy = y - start.y;
            newEntities[idx] = {
              x: relations[idx].x + dx,
              y: relations[idx].y + dy,
            };
          }
        });
        return newEntities;
      },
    }),
    deleteSelected: assign({
      entities: ({ context: { entities, selected } }) =>
        entities.filter((_, index) => !selected.has(index)),
      selected: () => new Set<number>(),
    }),
    restart: assign(({ context: { __input } }) => ({
      entities: __input?.initialEntities || [],
      selected: new Set<number>(),
      end: undefined,
      held: undefined,
      hovered: undefined,
      relations: undefined,
      start: undefined,
      x: __input?.initialPosition?.x || 0,
      y: __input?.initialPosition?.y || 0,
      z: __input?.initialPosition?.z || 1,
    })),
    zoom: assign(({ context }, params: { zoom: number } & Point) => ({
      x: context.x * params.zoom + params.x * (1 - params.zoom),
      y: context.y * params.zoom + params.y * (1 - params.zoom),
      z: context.z * params.zoom,
    })),
    move: assign(({ context }, delta: Point) => ({
      x: context.x - delta.x * context.speed,
      y: context.y - delta.y * context.speed,
    })),
  },
  guards: {
    moved: ({ context: { start } }, point: Point) =>
      Boolean(start && !near(point, start, 5)),
    held: ({ context }) => Boolean(context.held),
    heldSelected: ({ context }) => Boolean(context.held?.wasSelected),
    shift: ({ event }) => "shift" in event && event.shift,
    ctrl: ({ event }) => "ctrl" in event && event.ctrl,
    emptySelection: ({ context }) => context.selected.size === 0,
  },
}).createMachine({
  context: ({ input }) => ({
    entities: input?.initialEntities || [],
    selected: new Set<number>(),
    speed: input?.speed || 2,
    ...(input?.initialPosition || { x: 0, y: 0, z: 1 }),
    __input: input,
  }),

  id: "editor",
  initial: "idle",

  on: {
    "mouse.leave": {
      description: "reset on moving mouse out of the box",
      target: ".idle",
      actions: "reset",
    },
    wheel: {
      actions: enqueueActions(
        ({ context: { speed }, event: { point, delta }, enqueue, check }) => {
          if (check("ctrl")) {
            const zoom = Math.exp(-delta.y / (100 / speed));
            enqueue({ type: "zoom", params: { zoom, ...point } });
          } else {
            enqueue({ type: "move", params: delta });
          }
        }
      ),
    },
    delete: { actions: "deleteSelected" },
    restart: { actions: "restart" },
  },

  states: {
    idle: {
      on: {
        "mouse.down": {
          target: "hold",
          actions: [
            { type: "setStart", params: ({ event }) => event.point },
            enqueueActions(({ enqueue, context, check }) => {
              const held = context.held;
              if (!(held && !held.wasSelected)) return;
              // enqueue({ type: "select", params: [held.index] });
              if (check("shift")) {
                enqueue({ type: "addSelected", params: [held.index] });
              } else {
                enqueue({ type: "setSelected", params: [held.index] });
              }
            }),
            "setRelations",
          ],
        },
        "mouse.move": {
          actions: { type: "updateHover", params: ({ event }) => event.point },
        },
      },
    },

    hold: {
      on: {
        "mouse.up": {
          description: "if not moved add put point under cursor",
          target: "idle",
          actions: [
            enqueueActions(({ context, check, enqueue, event }) => {
              if (check("held")) {
                const held = context.held;
                if (held && held.wasSelected /*check("heldSelected")*/) {
                  if (check("shift")) {
                    enqueue({
                      type: "deselect",
                      params: { index: held.index },
                    });
                  } else {
                    enqueue({ type: "setSelected", params: [held.index] });
                  }
                }
              } else {
                enqueue({ type: "addPoint", params: event.point });
                const newId = context.entities.length;
                enqueue.assign({ hovered: newId });
                // enqueue({ type: "select", params: [newId] });
                if (check("shift")) {
                  enqueue({ type: "addSelected", params: [newId] });
                } else {
                  enqueue({ type: "setSelected", params: [newId] });
                }
              }
            }),
            "reset",
          ],
        },
        "mouse.move": [
          {
            description: "ignore move when small distance",
            guard: { type: "moved", params: ({ event }) => event.point },
          },
          {
            description: "move selected",
            guard: "held",
            target: "moving",
          },
          {
            description: "select region",
            target: "selecting",
          },
        ],
      },
    },
    selecting: {
      on: {
        "mouse.up": {
          target: "idle",
          actions: [
            { type: "selectInRegion", params: ({ event }) => event.shift },
            { type: "reset", params: ({ event }) => event.point },
          ],
        },
        "mouse.move": {
          actions: { type: "moveEnd", params: ({ event }) => event.point },
        },
      },
    },
    moving: {
      on: {
        "mouse.up": {
          target: "idle",
          actions: "reset",
        },
        "mouse.move": {
          actions: [
            { type: "moveEnd", params: ({ event }) => event.point },
            { type: "moveSelected", params: ({ event }) => event.point },
          ],
        },
      },
    },
  },
});
