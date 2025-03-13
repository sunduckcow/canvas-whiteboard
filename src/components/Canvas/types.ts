import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  RefObject,
} from "react";

import type { Tools } from "@/utils/tools";
import { Paralyze } from "@/utils/utility-types";

export type CanvasRef = RefObject<HTMLCanvasElement | null>;

export interface UseCanvasProps {
  ref: CanvasRef;
  script?: Script | Script[];
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
  plugins?: ReturnType<CanvasPlugin>[];
}

export interface RawCanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  ref?: React.Ref<HTMLCanvasElement>;
  wrapperRef?: React.Ref<HTMLDivElement>;
  box?: { width: number; height: number };
}

export interface CanvasProps extends Paralyze<UseCanvasProps, "ref"> {
  rawCanvasProps?: RawCanvasProps;
}

export type Box = { width: number; height: number };

export type Script = (
  ctx: CanvasRenderingContext2D,
  context: {
    box: Box;
    tools: Tools;
  }
) => void;

export type CanvasPlugin<Props = unknown> = (props: Props) => Script;
