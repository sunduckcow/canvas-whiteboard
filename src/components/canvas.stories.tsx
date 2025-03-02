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
    draw(ctx, { width, height }) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(width / 4, height / 4);
      ctx.lineTo((width / 4) * 3, (height / 4) * 3);
      ctx.closePath();
      ctx.stroke();
    },
  },
};
