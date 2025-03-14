import { PluginName, PluginFabric } from "./types";
import { Position } from "@/hooks/useGestures";

const createPlugin = <P, N extends PluginName, A>(
  config: PluginFabric<P, N, A>
) => config;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resetPlugin = createPlugin((_1: void) => ({
  name: "reset",
  script: (ctx, { box: { width, height } }) => {
    ctx.reset();
    ctx.clearRect(0, 0, width, height);
  },
}));

export const upscalePlugin = createPlugin(
  (props: void | number | { x?: number; y?: number }) => ({
    name: "upscale",
    script: (ctx, { box: { width, height } }) => {
      const scaleX =
        (props && typeof props === "object" ? props.x : props) || 2;
      const scaleY =
        (props && typeof props === "object" ? props.y : props) || 2;

      const newWidth = width * scaleX;
      const newHeight = height * scaleY;

      if (ctx.canvas.width !== newWidth || ctx.canvas.height !== newHeight) {
        ctx.canvas.width = newWidth;
        ctx.canvas.height = newHeight;
        ctx.canvas.style.setProperty("width", `${width}px`);
        ctx.canvas.style.setProperty("height", `${height}px`);
      }

      ctx.scale(scaleX, scaleY);

      return ctx.getTransform();
    },
  })
);

export const transformPlugin = createPlugin(({ x, y, z }: Position) => ({
  name: "transform",
  script: (ctx) => {
    ctx.translate(x, y);
    ctx.scale(z, z);
    return ctx.getTransform();
  },
}));
