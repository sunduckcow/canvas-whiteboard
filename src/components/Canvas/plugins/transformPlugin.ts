import { CanvasPlugin } from "../types";
import { Position } from "@/hooks/useGestures";

export const transformPlugin: CanvasPlugin<Position> =
  ({ x, y, z }) =>
  (ctx) => {
    ctx.translate(x, y);
    ctx.scale(z, z);
  };
