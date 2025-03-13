import { useEffect, useMemo, useRef } from "react";

import { resetScript } from "./constants";
import { CanvasProps, RawCanvasProps, UseCanvasProps } from "./types";
import { resolveScripts } from "./utils";
import type { BaseFC } from "@/lib/utility-types";
import { cn } from "@/lib/utils";
import { getTools } from "@/utils/tools";

export function useCanvas({
  canvasRef,
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
  }, [script, box, plugins, canvasRef]);

  return { box };
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
      {/** TODO: layers = more canvas elements */}

      {children}
    </div>
  );
};

export const Canvas: BaseFC<CanvasProps> = ({ rawCanvasProps, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useCanvas({ canvasRef, ...props });
  return <RawCanvas {...rawCanvasProps} {...canvas} canvasRef={canvasRef} />;
};
