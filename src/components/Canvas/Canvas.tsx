import { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";
import { useCanvas } from "./useCanvas";
import { CanvasProps } from "./types";

export const Canvas: BaseFC<CanvasProps> = ({
  children,
  draw,
  className,
  ...htmlCanvasProps
}) => {
  const { canvasRef, box } = useCanvas({
    draw,
    canvasWidth: htmlCanvasProps.width,
    canvasHeight: htmlCanvasProps.height,
  });
  return (
    <div
      style={box}
      className={cn("border-primary border relative box-content", className)}
    >
      <canvas ref={canvasRef} {...htmlCanvasProps} />
      {children}
    </div>
  );
};
