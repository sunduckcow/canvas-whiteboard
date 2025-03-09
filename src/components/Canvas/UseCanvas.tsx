import { ComponentProps, useMemo, useRef, useEffect } from "react";

import { resetScript } from "./constants";
import { Script } from "./types";
import { resolveScripts } from "@/lib/utils";
import { getPrimitives } from "@/utils/primitives";

export interface UseCanvasProps {
  script?: Script | Script[];
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
}
export function useCanvas(
  { script, canvasWidth, canvasHeight }: UseCanvasProps,
  preScripts?: Script[],
  postScripts?: Script[]
) {
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

    if (!script) return;

    const primitives = getPrimitives(ctx);

    const drawScripts = resolveScripts(
      resetScript,
      preScripts,
      script,
      postScripts
    );

    drawScripts?.forEach((drawScript) => {
      drawScript(ctx, { ...box, primitives });
    });
  }, [script, box, preScripts, postScripts]);

  return { canvasRef, box };
}
