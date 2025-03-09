import type { Primitives } from "@/utils/primitives";

export type Box = { width: number; height: number };

export type Script = (
  ctx: CanvasRenderingContext2D,
  meta: Box & { primitives: Primitives }
) => void;

export type CanvasPlugin<Props extends unknown[] = []> = (
  ...props: Props
) => Script;

// /* Work in progress */

// export type CanvasPlugin_ = {
//   before?: DrawFn;
//   beforePriority?: number;
//   after?: DrawFn;
//   afterPriority?: number;
//   context?: Record<string | number | symbol, unknown>;
// };

// export type Primitives_ = { line: () => void };

// export type DrawFn_ = (
//   ctx: CanvasRenderingContext2D,
//   meta: Box & { primitives: Primitives_ }
// ) => void;
