import { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";
import { CanvasViewProps, UseCanvasProps } from "./types";
import { useCanvas } from "./useCanvas";

export const CanvasView: BaseFC<CanvasViewProps> = ({
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

export const Canvas: BaseFC<UseCanvasProps> = (props) => {
  const canvas = useCanvas(props);
  return <CanvasView {...canvas} />;
};
