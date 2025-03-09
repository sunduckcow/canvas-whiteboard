import { ComponentProps, useMemo, useRef, useEffect } from "react";

import { resetScript } from "./constants";
import { CanvasPlugin, Script } from "./types";
import { resolveScripts } from "./utils";
import { getTools } from "@/utils/tools";

export interface UseCanvasProps {
  script?: Script | Script[];
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
  plugins?: ReturnType<CanvasPlugin>[];
}
export function useCanvas({
  script,
  canvasWidth,
  canvasHeight,
  plugins,
}: UseCanvasProps) {
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

    const tools = getTools(ctx);

    const drawContext = { box, tools };

    const drawScripts = resolveScripts(resetScript, plugins, script);

    drawScripts.forEach((drawScript) => {
      drawScript(ctx, drawContext);
    });
  }, [script, box, plugins]);

  return { canvasRef, box };
}
