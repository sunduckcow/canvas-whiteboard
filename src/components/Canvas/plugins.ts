import { CanvasPlugin } from "./types";
import { Position } from "@/hooks/useGestures";

export const resetPlugin: CanvasPlugin<void> =
  () =>
  (ctx, { box: { width, height } }) => {
    ctx.reset();
    ctx.clearRect(0, 0, width, height);
  };

export const upscalePlugin: CanvasPlugin<
  void | number | { x?: number; y?: number }
> =
  (props) =>
  (ctx, { box: { width, height } }) => {
    const scaleX = (props && typeof props === "object" ? props.x : props) || 2;
    const scaleY = (props && typeof props === "object" ? props.y : props) || 2;

    const newWidth = width * scaleX;
    const newHeight = height * scaleY;

    if (ctx.canvas.width !== newWidth || ctx.canvas.height !== newHeight) {
      ctx.canvas.width = newWidth;
      ctx.canvas.height = newHeight;
      ctx.canvas.style.setProperty("width", `${width}px`);
      ctx.canvas.style.setProperty("height", `${height}px`);
    }

    ctx.scale(scaleX, scaleY);
  };

export const transformPlugin: CanvasPlugin<Position> =
  ({ x, y, z }) =>
  (ctx) => {
    ctx.translate(x, y);
    ctx.scale(z, z);
  };
