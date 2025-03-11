import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCcw } from "lucide-react";
import { useRef } from "react";

import { Canvas } from "./Canvas";
import { upscalePlugin } from "./plugins/upscalePlugin";
import { RawCanvas } from "./RawCanvas";
import { Button } from "../ui/button";
import { transformPlugin } from "./plugins/transformPlugin";
import { useCanvas } from "./useCanvas";
import { useGestures } from "@/hooks/useGestures";
import { usePoints } from "@/hooks/usePoints";
import { doGrid } from "@/utils/tools";

const meta = {
  title: "Canvas",
  component: Canvas,
  parameters: { layout: "centered" },
  args: {
    canvasHeight: 340,
    canvasWidth: 340,
  },
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
          script={[
            upscalePlugin(),
            (ctx, { box, tools }) => {
              ctx.strokeStyle = "gray";
              tools.xoy({ x, y, z, ...box });
            },
            transformPlugin({ x, y, z }),
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
};

export const SimplePoints: Story = {
  render: function Render(args) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { points, selection } = usePoints({ canvasRef });

    const canvas = useCanvas({
      canvasRef,
      ...args,
      script: (ctx, { tools }) => {
        ctx.lineWidth = 2;
        if (selection) {
          ctx.strokeStyle = "gray";
          tools.rect(selection.x1, selection.y1, selection.x2, selection.y2);
        }
        points.forEach(({ x, y, hovered, selected }) => {
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

          tools.cross(x, y);
        });
      },
    });
    return <RawCanvas canvasRef={canvasRef} {...canvas} />;
  },
};
