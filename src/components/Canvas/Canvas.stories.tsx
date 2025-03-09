import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCcw } from "lucide-react";
import { useCallback } from "react";

import { Canvas } from "./Canvas";
import { upscalePlugin } from "./plugins/upscalePlugin";
import { RawCanvas } from "./RawCanvas";
import { Script } from "./types";
import { useCanvas } from "./UseCanvas";
import { Button } from "../ui/button";
import { useGestures } from "@/hooks/useGestures";
import { doGrid } from "@/utils/primitives";

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
    script(ctx, { width, height, primitives: { cross } }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const UpscalePlugin: Story = {
  args: {
    preScripts: [upscalePlugin()],
    script(ctx, { width, height, primitives: { cross } }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const CrossGrid: Story = {
  render: function Render(props) {
    const { x, y, z, ref, reset } = useGestures();
    const translate = useCallback<Script>(
      (ctx) => {
        ctx.translate(x, y);
        ctx.scale(z, z);
      },
      [x, y, z]
    );
    const canvas = useCanvas(props, [translate, upscalePlugin()]);
    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={reset}>
          <RefreshCcw />
          Reset
        </Button>
        <RawCanvas {...canvas} wrapperRef={ref} />
      </div>
    );
  },
  args: {
    script(ctx, { width, height, primitives: { cross } }) {
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
