import { FC, PropsWithChildren } from "react";

export type BaseFC<P = object> = FC<
  PropsWithChildren<P & { className?: string }>
>;

export type Paralyze<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OneOrArray<T> = T | T[];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
export type ObjectKey = string | number | symbol;
