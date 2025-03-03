import { useEffect, useMemo, useRef } from "react";
import type { UseCanvasProps } from "./types";
import { getPrimitives } from "@/utils/primitives";

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
    const primitives = getPrimitives(ctx);

    draw?.(ctx, { ...box, primitives });
  }, [draw, box]);

  return { canvasRef, box };
}
