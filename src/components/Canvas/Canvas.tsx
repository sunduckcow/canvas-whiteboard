import { RawCanvas, RawCanvasProps } from "./RawCanvas";
import { UseCanvasProps, useCanvas } from "./useCanvas";
import type { BaseFC } from "@/lib/utility-types";

export interface CanvasProps extends UseCanvasProps {
  rawCanvasProps?: RawCanvasProps;
}
export const Canvas: BaseFC<CanvasProps> = ({ rawCanvasProps, ...props }) => {
  const canvas = useCanvas(props);
  return <RawCanvas {...rawCanvasProps} {...canvas} />;
};
