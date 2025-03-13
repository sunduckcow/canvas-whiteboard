import { assign, enqueueActions, not, setup } from "xstate";

import { findNearIndex, inReact, near } from "./utils";

export interface Point {
  x: number;
  y: number;
}

interface KeyModifiers {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
}
interface MachineContext {
  keyModifiers?: KeyModifiers;
  entities: Point[];
  selected: Set<number>;
  start?: Point;
  held?: { point: Point; index: number; wasSelected: boolean };
  end?: Point;
  hovered?: number;
  relations?: Record<number, Point>;
}
interface MachineInput {
  initialEntities?: Point[];
}

interface MachineEvent<T extends string> {
  type: T;
}

interface MachineMouseEvent<T extends string>
  extends MachineEvent<`mouse.${T}`> {
  point: Point;
  shiftKey: boolean;
}
// interface MachineKeyEvent<T extends string> extends MachineEvent<T> { key: string; }

type Events =
  | MachineMouseEvent<"down">
  | MachineMouseEvent<"move">
  | MachineMouseEvent<"up">
  | MachineMouseEvent<"leave">;
export const machine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as Events,
    input: {} as MachineInput | void,
  },
  actions: {
    moveEnd: assign({ end: ({ event }) => event.point }),
    reset: assign({ start: undefined, end: undefined, relations: undefined }),
    setStart: assign(({ context: { entities, selected }, event }) => {
      const index = findNearIndex(entities, event.point);
      return {
        start: event.point,
        held:
          index >= 0
            ? {
                index,
                point: entities[index],
                wasSelected: selected.has(index),
              }
            : undefined,
      };
    }),
    addPoint: assign({
      entities: ({ context, event }) => [...context.entities, event.point],
    }),
    setSelected: assign((_, ids: number[]) => ({ selected: new Set(ids) })),
    select: assign(({ context }, id: number) => ({
      selected: context.selected.add(id),
    })),
    deselect: assign(({ context }, params: { index: number }) => {
      context.selected.delete(params.index);
      return {
        selected: context.selected,
      };
    }),
    selectInRegion: assign(({ context, event }) => {
      const { start, end, entities, selected } = context;
      if (!start || !end) return {};
      const regionIds = entities.reduce<number[]>((acc, p, i) => {
        if (inReact(p, start, end)) acc.push(i);
        return acc;
      }, []);
      if (!event.shiftKey) return { selected: new Set(regionIds) };
      regionIds.forEach((i) => selected.add(i));
      return { selected };
    }),
    setRelations: assign({
      relations: ({ context: { selected, entities } }) =>
        Array.from(selected).reduce<Record<number, Point>>((acc, id) => {
          acc[id] = { ...entities[id] };
          return acc;
        }, {}),
    }),
    moveSelected: assign({
      entities: ({
        context: { entities, relations, selected, start },
        event: {
          point: { x, y },
        },
      }) => {
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
  },
  guards: {
    moved: ({ context, event }) =>
      Boolean(context.start && !near(event.point, context.start, 5)),
    held: ({ context }) => Boolean(context.held),
    heldSelected: ({ context }) => Boolean(context.held?.wasSelected),
    shift: ({ event }) => event.shiftKey,
    emptySelection: ({ context }) => context.selected.size === 0,
  },
}).createMachine({
  context: ({ input }) => ({
    entities: input?.initialEntities || [],
    selected: new Set<number>(),
  }),

  id: "vectorEditor",
  initial: "idle",

  on: {
    "mouse.leave": {
      description: "reset on moving mouse out of the box",
      target: ".idle",
      actions: "reset",
    },
  },

  states: {
    idle: {
      on: {
        "mouse.down": {
          target: "hold",
          actions: [
            "setStart",
            enqueueActions(({ enqueue, context, check }) => {
              const held = context.held;
              if (!(held && !held.wasSelected)) return;
              if (check("shift")) {
                enqueue({ type: "select", params: held.index });
              } else {
                enqueue({ type: "setSelected", params: [held.index] });
              }
            }),
            "setRelations",
          ],
        },
      },
    },

    hold: {
      on: {
        "mouse.up": {
          description: "if not moved add put point under cursor",
          target: "idle",
          actions: [
            enqueueActions(({ context, check, enqueue }) => {
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
                enqueue("addPoint");
                const newId = context.entities.length;
                if (check("shift")) {
                  // -> select
                  enqueue({ type: "select", params: newId }); // -> addSelected
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
            guard: not("moved"),
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
          actions: ["selectInRegion", "reset"],
        },
        "mouse.move": {
          actions: "moveEnd",
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
          actions: ["moveEnd", "moveSelected"],
        },
      },
    },
    // drawing: {},
  },
});
