import { Script } from "./types";

export const resetScript: Script = (ctx, { box: { width, height } }) => {
  ctx.reset();
  ctx.clearRect(0, 0, width, height);
};
