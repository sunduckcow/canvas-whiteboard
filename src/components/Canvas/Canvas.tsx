import { useRef } from "react";

import { RawCanvas, RawCanvasProps } from "./RawCanvas";
import { UseCanvasProps, useCanvas } from "./useCanvas";
import type { BaseFC } from "@/lib/utility-types";

export interface CanvasProps extends Omit<UseCanvasProps, "canvasRef"> {
  rawCanvasProps?: RawCanvasProps;
}
export const Canvas: BaseFC<CanvasProps> = ({ rawCanvasProps, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useCanvas({ canvasRef, ...props });
  return <RawCanvas {...rawCanvasProps} {...canvas} canvasRef={canvasRef} />;
};
