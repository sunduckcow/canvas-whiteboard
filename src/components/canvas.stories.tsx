import type { Meta, StoryObj } from "@storybook/react";

import { Canvas } from "./canvas";

const meta = {
  title: "Canvas",
  component: Canvas,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    width: 300,
    height: 300,
    draw(ctx, canvas) {
      const w = canvas.width;
      const h = canvas.height;
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(w / 4, h / 4);
      ctx.lineTo((w / 4) * 3, (h / 4) * 3);
      ctx.closePath();
      ctx.stroke();
    },
  },
};
