import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  RefObject,
} from "react";

import type { Tools } from "@/utils/tools";
import { OneOrArray, Paralyze, Prettify } from "@/utils/utility-types";

export type CanvasRef = RefObject<HTMLCanvasElement | null>;

export interface UseCanvasProps<Plugins extends DefaultPlugins> {
  ref: CanvasRef;
  script?: OneOrArray<Script<Artifacts<Plugins>, void>>;
  canvasWidth?: ComponentProps<"canvas">["width"];
  canvasHeight?: ComponentProps<"canvas">["height"];
  plugins?: Plugins;
  noResetPlugin?: boolean;
}

export interface RawCanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  ref?: React.Ref<HTMLCanvasElement>;
  wrapperRef?: React.Ref<HTMLDivElement>;
  box?: { width: number; height: number };
}

export interface CanvasProps<TPlugins extends DefaultPlugins>
  extends Paralyze<UseCanvasProps<TPlugins>, "ref"> {
  rawCanvasProps?: RawCanvasProps;
}

export type Box = { width: number; height: number };

export type Script<Artifacts, Artifact> = (
  ctx: CanvasRenderingContext2D,
  context: {
    box: Box;
    tools: Tools;
  },
  artifacts: Artifacts
) => Artifact;

export type PluginName = string | number | symbol;

export type Plugin<Name extends PluginName, Artifact> = {
  name: Name;
  script: Script<void, Artifact>;
};

export type PluginFabric<Props, Name extends PluginName, Artifact> = (
  props: Props
) => Plugin<Name, Artifact>;

// export type PluginFabric<
//   Props,
//   Name extends PluginName,
//   Artifact
// > = Props extends unknown
//   ? () => Plugin<Name, Artifact>
//   : (props: Props) => Plugin<Name, Artifact>;

export type DefaultPlugins = readonly Plugin<string, unknown>[];

export type Artifacts<Plugins extends DefaultPlugins> = Prettify<{
  [P in Plugins[number]["name"]]: Extract<
    Plugins[number],
    Plugin<P, unknown>
  >["script"] extends Script<void, infer R>
    ? R
    : never;
}>;
