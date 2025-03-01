import { FC, PropsWithChildren } from "react";

export type BaseFC<P = object> = FC<
  PropsWithChildren<P & { className?: string }>
>;
