import { Box } from "../types";

export const upscalePlugin = (
  ctx: CanvasRenderingContext2D,
  { width, height }: Box,
  scaleX: number = 2,
  scaleY: number = scaleX
) => {
  ctx.canvas.width = width * scaleX;
  ctx.canvas.height = height * scaleY;
  ctx.canvas.style.setProperty("width", `${width}px`);
  ctx.canvas.style.setProperty("height", `${height}px`);
  ctx.scale(scaleX, scaleY);
};
