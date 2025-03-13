import { ComponentProps, ComponentPropsWithoutRef } from "react";

import type { Tools } from "@/utils/tools";

export interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  script?: Script | Script[];
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
  plugins?: ReturnType<CanvasPlugin>[];
}

export interface RawCanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  canvasRef?: React.Ref<HTMLCanvasElement>;
  wrapperRef?: React.Ref<HTMLDivElement>;
  box?: { width: number; height: number };
}

export interface CanvasProps extends Omit<UseCanvasProps, "canvasRef"> {
  rawCanvasProps?: RawCanvasProps;
}

export type CanvasPlugin<Props = unknown> = (props: Props) => Script;

export type Box = { width: number; height: number };

export type Script = (
  ctx: CanvasRenderingContext2D,
  context: {
    box: Box;
    tools: Tools;
  }
) => void;
