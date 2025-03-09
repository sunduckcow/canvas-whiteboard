import { RawCanvas } from "./RawCanvas";
import { Script } from "./types";
import { UseCanvasProps, useCanvas } from "./UseCanvas";
import type { BaseFC } from "@/lib/utility-types";

export interface CanvasProps extends UseCanvasProps {
  preScripts?: Script[];
  postScripts?: Script[];
}
export const Canvas: BaseFC<CanvasProps> = ({
  preScripts,
  postScripts,
  ...props
}) => {
  const canvas = useCanvas(props, preScripts, postScripts);
  return <RawCanvas {...canvas} />;
};
