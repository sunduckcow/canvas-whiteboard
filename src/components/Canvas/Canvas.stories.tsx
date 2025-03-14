import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCcw, Trash2Icon } from "lucide-react";
import { useCallback, useRef } from "react";

import { Canvas } from "./Canvas";
import { upscalePlugin } from "./plugins";
import { transformPlugin } from "./plugins";
import { Button } from "../ui/button";
import { useGestures } from "@/hooks/useGestures";
import { useGesturesMachine } from "@/hooks/useGesturesMachine/useGesturesMachine";
import { usePoints } from "@/hooks/usePoints";
import { usePointsMachine } from "@/hooks/usePointsMachine/usePointsMachine";
import { pointToString } from "@/hooks/usePointsMachine/utils";
import { doGrid } from "@/utils/tools";

const meta = {
  title: "Canvas",
  component: Canvas,
  parameters: { layout: "centered" },
  args: { canvasHeight: 300, canvasWidth: 300 },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    script(ctx, { box: { width, height }, tools }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      tools.cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const UpscalePlugin: Story = {
  args: { plugins: [upscalePlugin()], script: Simple.args?.script },
};

// StoryObj<Meta<typeof Canvas<[ReturnType<typeof upscalePlugin>, ReturnType<typeof transformPlugin>]>>>
export const Grid: Story = {
  render: function Render(args) {
    const { x, y, z, wrapperRef, reset } = useGestures();

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={reset}>
          <RefreshCcw />
          Reset
        </Button>
        <Canvas
          {...args}
          rawCanvasProps={{ wrapperRef }}
          plugins={[upscalePlugin(), transformPlugin({ x, y, z })]}
          script={[
            (ctx, { box, tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "gray";
                tools.xoy({ x, y, z, ...box });
              }),
            (ctx, { box: { width, height }, tools }) => {
              const n = 10;
              const step = 10;
              const cx = width / 2;
              const cy = height / 2;

              ctx.strokeStyle = "green";
              ctx.lineWidth = 2;

              doGrid(
                [cx - n * step, step, cx + n * step],
                [cy - n * step, step, cy + n * step],
                (x, y) => tools.cross(x, y, step / 3)
              );
            },
          ]}
        />
      </div>
    );
  },
  // args: { script: [] },
};

export const GesturesMachine: Story = {
  render: function Render(args) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const {
      snapshot: {
        context: { x, y, z },
      },
      restart,
    } = useGesturesMachine({ ref: wrapperRef });

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={restart}>
          <RefreshCcw />
          Restart
        </Button>
        <Canvas
          {...args}
          rawCanvasProps={{ wrapperRef }}
          plugins={[upscalePlugin(), transformPlugin({ x, y, z })]}
          script={[
            (ctx, { box, tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "gray";
                tools.xoy({ x, y, z, ...box });
              }),
            (ctx, { box: { width, height }, tools }) => {
              const n = 10;
              const step = 10;
              const cx = width / 2;
              const cy = height / 2;

              ctx.strokeStyle = "green";
              ctx.lineWidth = 2;

              doGrid(
                [cx - n * step, step, cx + n * step],
                [cy - n * step, step, cy + n * step],
                (x, y) => tools.cross(x, y, step / 3)
              );
            },
          ]}
        />
      </div>
    );
  },
  // args: { script: [] },
};

export const SimplePoints: Story = {
  render: function Render(args) {
    const ref = useRef<HTMLCanvasElement>(null);
    const { points, selection, deleteSelected } = usePoints({ ref });

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={deleteSelected}>
          <Trash2Icon />
          Delete
        </Button>

        <Canvas
          ref={ref}
          {...args}
          plugins={[upscalePlugin(3)]}
          script={[
            (ctx, { tools }) => {
              ctx.lineWidth = 1;
              if (selection) {
                ctx.strokeStyle = "gray";
                tools.rect(
                  selection.x1,
                  selection.y1,
                  selection.x2,
                  selection.y2
                );
              }
              points.forEach(({ x, y, hovered, selected }) => {
                ctx.lineWidth = 1;
                if (hovered) {
                  if (selected) {
                    ctx.strokeStyle = "lightblue";
                  } else {
                    ctx.strokeStyle = "lightgreen";
                  }
                } else {
                  if (selected) {
                    ctx.strokeStyle = "blue";
                  } else {
                    ctx.strokeStyle = "green";
                  }
                }

                tools.cross(x, y, 10);
                tools.circle(x, y, 10);
              });
            },
          ]}
        />
      </div>
    );
  },
};

export const StateMachinePoints: Story = {
  render: function Render(args) {
    const ref = useRef<HTMLCanvasElement>(null);
    const {
      snapshot: { context, value },
    } = usePointsMachine({ ref });
    const { start, end, entities, held } = context;

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <div>
          <div>value: {value}</div>
          <div>startNearest: {held?.index || "none"}</div>
          <div>selected: [{Array.from(context.selected).toString()}]</div>
          <div>
            region: [{start && pointToString(start)},{" "}
            {end && pointToString(end)}]
          </div>
        </div>

        <Canvas
          ref={ref}
          {...args}
          plugins={[upscalePlugin(3)]}
          script={[
            (ctx, { tools }) => {
              ctx.lineWidth = 1;
              if (value === "selecting" && start && end) {
                ctx.strokeStyle = "gray";
                tools.rect(start.x, start.y, end.x, end.y);
              }
              entities.forEach(({ x, y }, idx) => {
                const hovered = context.hovered === idx;
                const selected = context.selected.has(idx);

                ctx.lineWidth = 1;
                if (hovered) {
                  if (selected) {
                    ctx.strokeStyle = "lightblue";
                  } else {
                    ctx.strokeStyle = "lightgreen";
                  }
                } else {
                  if (selected) {
                    ctx.strokeStyle = "blue";
                  } else {
                    ctx.strokeStyle = "green";
                  }
                }

                tools.cross(x, y, 10);
                tools.circle(x, y, 10);
              });
            },
          ]}
        />
      </div>
    );
  },
};

export const StateMachinePanPoints: Story = {
  render: function Render(args) {
    const { x, y, z, wrapperRef, reset } = useGestures();

    const {
      snapshot: { context, value },
      deleteSelected,
      restart: pointsRestart,
    } = usePointsMachine({ ref: wrapperRef }); // <- z, y, z (or transform)
    const { start, end, entities, held } = context;

    const restart = useCallback(() => {
      reset();
      pointsRestart();
    }, [pointsRestart, reset]);

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <div>
          <div>value: {value}</div>
          <div>startNearest: {held ? held.index : "none"}</div>
          <div>selected: [{Array.from(context.selected).toString()}]</div>
          <div>
            region: [{start && pointToString(start)},{" "}
            {end && pointToString(end)}]
          </div>
        </div>

        <div className="[&>:not(:first-child)]:ml-8">
          <Button onClick={deleteSelected}>
            <Trash2Icon />
            Delete
          </Button>
          <Button onClick={restart}>
            <RefreshCcw />
            Restart
          </Button>
        </div>

        <Canvas
          {...args}
          rawCanvasProps={{ wrapperRef }}
          plugins={[upscalePlugin(3), transformPlugin({ x, y, z })]}
          script={[
            (ctx, { box, tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "gray";
                tools.xoy({ x, y, z, ...box });
              }),
            // (_ctx, { tools, box }, { transform }) => {
            //   const p = {
            //     x: box.width / 2,
            //     y: box.height / 2,
            //   };
            //   const pt = tools.transformPoint(transform.inverse(), p);
            //   console.log({
            //     "original point": tools.pointToString(p),
            //     "transformed point": tools.pointToString(pt),
            //   });
            // },
            (ctx, { tools }) => {
              ctx.lineWidth = 1;
              if (value === "selecting" && start && end) {
                ctx.strokeStyle = "gray";
                tools.rect(start.x, start.y, end.x, end.y);
              }
              entities.forEach(({ x, y }, idx) => {
                const hovered = context.hovered === idx;
                const selected = context.selected.has(idx);

                ctx.lineWidth = 1;
                if (hovered) {
                  if (selected) {
                    ctx.strokeStyle = "lightblue";
                  } else {
                    ctx.strokeStyle = "lightgreen";
                  }
                } else {
                  if (selected) {
                    ctx.strokeStyle = "blue";
                  } else {
                    ctx.strokeStyle = "green";
                  }
                }

                tools.cross(x, y, 10);
                tools.circle(x, y, 10);
              });
            },
            (ctx, { tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "tomato";
                tools.cross(150, 150);
              }),
          ]}
        />
      </div>
    );
  },
};

export const StateMachine2PanPoints: Story = {
  render: function Render(args) {
    const ref = useRef<HTMLDivElement>(null);
    const {
      snapshot: {
        context: { x, y, z },
      },
      restart: gesturesRestart,
    } = useGesturesMachine({ ref });

    const {
      snapshot: { context, value },
      deleteSelected,
      restart: pointsRestart,
    } = usePointsMachine({ ref }); // <- z, y, z (or transform) machine friendship
    const { start, end, entities, held } = context;

    const restart = useCallback(() => {
      gesturesRestart();
      pointsRestart();
    }, [gesturesRestart, pointsRestart]);

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <div>
          <div>value: {value}</div>
          <div>startNearest: {held ? held.index : "none"}</div>
          <div>selected: [{Array.from(context.selected).toString()}]</div>
          <div>
            region: [{start && pointToString(start)},{" "}
            {end && pointToString(end)}]
          </div>
        </div>

        <div className="[&>:not(:first-child)]:ml-8">
          <Button onClick={deleteSelected}>
            <Trash2Icon />
            Delete
          </Button>
          <Button onClick={restart}>
            <RefreshCcw />
            Restart
          </Button>
        </div>

        <Canvas
          {...args}
          rawCanvasProps={{ wrapperRef: ref }}
          plugins={[upscalePlugin(3), transformPlugin({ x, y, z })]}
          script={[
            (ctx, { box, tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "gray";
                tools.xoy({ x, y, z, ...box });
                ctx.lineWidth = 1;
                if (value === "selecting" && start && end) {
                  ctx.strokeStyle = "gray";
                  tools.rect(start.x, start.y, end.x, end.y);
                }
              }),
            // (_ctx, { tools, box }, { transform }) => {
            //   const p = {
            //     x: box.width / 2,
            //     y: box.height / 2,
            //   };
            //   const pt = tools.transformPoint(transform.inverse(), p);
            //   console.log({
            //     "original point": tools.pointToString(p),
            //     "transformed point": tools.pointToString(pt),
            //   });
            // },
            (ctx, { tools }) => {
              // ctx.lineWidth = 1;
              // if (value === "selecting" && start && end) {
              //   ctx.strokeStyle = "gray";
              //   tools.rect(start.x, start.y, end.x, end.y);
              // }
              entities.forEach(({ x, y }, idx) => {
                const hovered = context.hovered === idx;
                const selected = context.selected.has(idx);

                ctx.lineWidth = 1;
                if (hovered) {
                  if (selected) {
                    ctx.strokeStyle = "lightblue";
                  } else {
                    ctx.strokeStyle = "lightgreen";
                  }
                } else {
                  if (selected) {
                    ctx.strokeStyle = "blue";
                  } else {
                    ctx.strokeStyle = "green";
                  }
                }

                tools.cross(x, y, 10);
                tools.circle(x, y, 10);
              });
            },
            (ctx, { tools }, { upscale }) =>
              tools.onTransform(upscale, () => {
                ctx.strokeStyle = "tomato";
                tools.cross(150, 150);
              }),
          ]}
        />
      </div>
    );
  },
};
