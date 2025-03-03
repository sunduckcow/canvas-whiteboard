import type { Meta, StoryObj } from "@storybook/react";

import { CanvasView, Canvas } from "./Canvas";
import { useCanvas } from "./useCanvas";
import { doGrid } from "@/utils/primitives";
import { useGestures } from "@/hooks/useGestures";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { DrawFn } from "./types";
import { useCallback } from "react";
import { upscalePlugin } from "./plugins/upscalePlugin";

const meta = {
  title: "Canvas",
  component: Canvas,
  parameters: { layout: "centered" },
  args: {
    canvasHeight: 300,
    canvasWidth: 300,
  },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    draw(ctx, { width, height, primitives: { cross } }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const UpscalePlugin: Story = {
  args: {
    draw(ctx, { width, height, primitives: { cross } }) {
      upscalePlugin(ctx, { width, height }, 2);

      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const CrossGrid: Story = {
  render({ draw: _draw, ...rest }) {
    const { x, y, z, ref, reset } = useGestures();
    const draw = useCallback<DrawFn>(
      (ctx, box) => {
        ctx.reset();
        ctx.translate(x, y);
        ctx.scale(z, z);
        _draw?.(ctx, box);
      },
      [_draw, x, y, z]
    );
    const canvas = useCanvas({ ...rest, draw });
    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={reset}>
          <RefreshCcw />
          Reset
        </Button>
        <CanvasView {...canvas} wrapperRef={ref} />
      </div>
    );
  },
  args: {
    draw(ctx, { width, height, primitives: { cross } }) {
      const n = 5;
      const step = 10;
      const cx = width / 2;
      const cy = height / 2;

      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;

      doGrid(
        [cx - n * step, step, cx + n * step],
        [cy - n * step, step, cy + n * step],
        (x, y) => cross(x, y, step / 3)
      );
    },
  },
};
