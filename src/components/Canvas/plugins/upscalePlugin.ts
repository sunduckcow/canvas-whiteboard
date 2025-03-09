import { CanvasPlugin } from "../types";

export const upscalePlugin: CanvasPlugin<[scaleX?: number, scaleY?: number]> =
  (scaleX = 2, scaleY = scaleX) =>
  (ctx, { width, height }) => {
    if (scaleX === 0) scaleX = 1;
    if (scaleY === 0) scaleY = 1;

    ctx.canvas.width = width * scaleX;
    ctx.canvas.height = height * scaleY;
    ctx.canvas.style.setProperty("width", `${width}px`);
    ctx.canvas.style.setProperty("height", `${height}px`);
    ctx.scale(scaleX, scaleY);
  };
