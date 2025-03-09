import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCcw } from "lucide-react";

import { Canvas } from "./Canvas";
import { upscalePlugin } from "./plugins/upscalePlugin";
import { Button } from "../ui/button";
import { transformPlugin } from "./plugins/transformPlugin";
import { useGestures } from "@/hooks/useGestures";
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
    script(ctx, { box: { width, height }, tools: { cross } }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      cross(width / 2, height / 2, Math.min(width / 4, height / 4));
    },
  },
};

export const UpscalePlugin: Story = {
  args: { plugins: [upscalePlugin()], script: Simple.args?.script },
};

export const Primary: Story = {
  render: function Render(args) {
    const { x, y, z, ref, reset } = useGestures();

    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={reset}>
          <RefreshCcw />
          Reset
        </Button>
        <Canvas
          {...args}
          rawCanvasProps={{ wrapperRef: ref }}
          script={[
            upscalePlugin(),
            (ctx, { box, tools: { xoy } }) => {
              ctx.strokeStyle = "gray";
              xoy({ x, y, z, ...box });
            },
            transformPlugin({ x, y, z }),
            (ctx, { box: { width, height }, tools: { cross } }) => {
              const n = 10;
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
          ]}
        />
      </div>
    );
  },
};
