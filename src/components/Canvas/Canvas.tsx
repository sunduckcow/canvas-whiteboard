import { useEffect, useImperativeHandle, useMemo, useRef } from "react";

import { resetPlugin } from "./plugins";
import {
  Artifacts,
  CanvasProps,
  DefaultPlugins,
  RawCanvasProps,
  UseCanvasProps,
} from "./types";
import { cn } from "@/lib/utils";
import { toArray } from "@/utils/toArray";
import { getTools } from "@/utils/tools";
import type { BaseFC } from "@/utils/utility-types";

export function useCanvas<TPlugins extends DefaultPlugins>({
  ref,
  script,
  canvasWidth,
  canvasHeight,
  plugins,
  noResetPlugin = false,
}: UseCanvasProps<TPlugins>) {
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

    if (!noResetPlugin) resetPlugin().script(ctx, drawContext);

    const artifacts = plugins?.reduce<Partial<Artifacts<TPlugins>>>(
      (acc, plugin) => {
        const artifact = plugin.script(ctx, drawContext);
        return { ...acc, [plugin.name]: artifact };
      },
      {}
    );

    toArray(script).forEach((drawScript) =>
      drawScript(
        ctx,
        drawContext,
        artifacts as {
          [K in keyof Artifacts<TPlugins>]: Artifacts<TPlugins>[K];
        }
      )
    );
  }, [script, box, plugins, ref, noResetPlugin]);

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

export const Canvas = <TPlugins extends DefaultPlugins>({
  rawCanvasProps,
  ref: outerRef,
  ...props
}: CanvasProps<TPlugins>) => {
  const innerRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(outerRef, () => innerRef.current!, []);

  const canvas = useCanvas({ ref: innerRef, ...props });

  // console.log("artifacts", artifacts);

  return <RawCanvas {...rawCanvasProps} {...canvas} />;
};
