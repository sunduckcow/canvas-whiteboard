import { ComponentPropsWithoutRef } from "react";

import type { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";

export interface RawCanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  canvasRef?: React.Ref<HTMLCanvasElement>;
  wrapperRef?: React.Ref<HTMLDivElement>;
  box?: { width: number; height: number };
}
export const RawCanvas: BaseFC<RawCanvasProps> = ({
  children,
  className,
  canvasRef,
  wrapperRef,
  box,
  ...htmlCanvasProps
}) => {
  return (
    <div
      ref={wrapperRef}
      style={box}
      className={cn("border-primary border relative box-content", className)}
    >
      <canvas ref={canvasRef} {...htmlCanvasProps} {...box} />
      {children}
    </div>
  );
};
