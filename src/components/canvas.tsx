import { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useMemo, useRef } from "react";

interface CanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  draw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}
interface UseCanvasProps extends Pick<CanvasProps, "draw"> {}

export function useCanvas({ draw }: UseCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw?.(ctx, canvas);
  }, [draw]);

  return ref;
}

export const Canvas: BaseFC<CanvasProps> = ({
  children,
  draw,
  className,
  ...htmlCanvasProps
}) => {
  const box = useMemo(
    () => ({
      width: Number(htmlCanvasProps.width || 300),
      height: Number(htmlCanvasProps.height || 150),
    }),
    [htmlCanvasProps.height, htmlCanvasProps.width]
  );

  const canvasRef = useCanvas({ draw });

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
