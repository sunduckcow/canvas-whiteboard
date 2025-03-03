import type { Primitives } from "@/utils/primitives";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";

export type Box = { width: number; height: number };

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  meta: Box & { primitives: Primitives }
) => void;

export interface CanvasViewProps extends ComponentPropsWithoutRef<"canvas"> {
  canvasRef?: React.Ref<HTMLCanvasElement>;
  wrapperRef?: React.Ref<HTMLDivElement>;
  box?: { width: number; height: number };
}

export interface UseCanvasProps {
  draw?: DrawFn;
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
}

/* Work in progress */

export type CanvasPlugin_ = {
  before?: DrawFn;
  beforePriority?: number;
  after?: DrawFn;
  afterPriority?: number;
  context?: Record<string | number | symbol, unknown>;
};

export type Primitives_ = { line: () => void };

export type DrawFn_ = (
  ctx: CanvasRenderingContext2D,
  meta: Box & { primitives: Primitives_; context: {} }
) => void;
