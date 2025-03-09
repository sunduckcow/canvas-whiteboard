import type { Tools } from "@/utils/tools";

export type Box = { width: number; height: number };

export type Script = (
  ctx: CanvasRenderingContext2D,
  context: {
    box: Box;
    tools: Tools;
  }
) => void;

export type CanvasPlugin<Props = unknown> = (props: Props) => Script;
