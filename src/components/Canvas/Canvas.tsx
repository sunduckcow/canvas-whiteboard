import { useEffect, useImperativeHandle, useMemo, useRef } from "react";

import { resetScript } from "./constants";
import { CanvasProps, RawCanvasProps, UseCanvasProps } from "./types";
import { resolveScripts } from "./utils";
import { cn } from "@/lib/utils";
import { getTools } from "@/utils/tools";
import type { BaseFC } from "@/utils/utility-types";

export function useCanvas({
  ref,
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
    const canvas = ref.current;
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
  }, [script, box, plugins, ref]);

  return { box, ref };
}

export const RawCanvas: BaseFC<RawCanvasProps> = ({
  ref,
  children,
  className,
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
      <canvas ref={ref} {...htmlCanvasProps} {...box} />
      {/** TODO: layers = more canvas elements */}

      {children}
    </div>
  );
};

export const Canvas: BaseFC<CanvasProps> = ({
  rawCanvasProps,
  ref: outerRef,
  ...props
}) => {
  const innerRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(outerRef, () => innerRef.current!, []);

  const canvas = useCanvas({ ref: innerRef, ...props });

  return <RawCanvas {...rawCanvasProps} {...canvas} />;
};
