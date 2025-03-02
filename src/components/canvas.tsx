import { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useRef,
} from "react";

type Box = { width: number; height: number };

interface CanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  draw?: (ctx: CanvasRenderingContext2D, box: Box) => void;
}
interface UseCanvasProps extends Pick<CanvasProps, "draw"> {
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
}

const upscalePlugin = (
  ctx: CanvasRenderingContext2D,
  { width, height }: Box,
  scaleX: number = 2,
  scaleY: number = scaleX
) => {
  ctx.canvas.width = width * scaleX;
  ctx.canvas.height = height * scaleY;
  ctx.canvas.style.setProperty("width", `${width}px`);
  ctx.canvas.style.setProperty("height", `${height}px`);
  ctx.scale(scaleX, scaleY);
};

export function useCanvas({ draw, canvasWidth, canvasHeight }: UseCanvasProps) {
  const box = useMemo(
    () => ({
      width: Number(canvasWidth || 300),
      height: Number(canvasHeight || 150),
    }),
    [canvasWidth, canvasHeight]
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    upscalePlugin(ctx, box, 2);

    draw?.(ctx, box);
  }, [draw, box]);

  return { canvasRef, box };
}

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
