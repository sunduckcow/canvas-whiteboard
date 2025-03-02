import type { ComponentProps, ComponentPropsWithoutRef } from "react";

export type Box = { width: number; height: number };

export interface CanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  draw?: (ctx: CanvasRenderingContext2D, box: Box) => void;
}

export interface UseCanvasProps extends Pick<CanvasProps, "draw"> {
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
}
