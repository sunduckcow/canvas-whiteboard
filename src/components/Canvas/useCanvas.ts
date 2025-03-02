import { useEffect, useMemo, useRef } from "react";
import { UseCanvasProps } from "./types";
import { upscalePlugin } from "./plugins/upscalePlugin";

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
