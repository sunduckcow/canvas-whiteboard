import { FC, ReactNode } from "react";

import { ArrayView } from "./array";
// import { Matrix } from "./matrix";
// import { JsonNode } from "./node"
import { ObjectView } from "./object";
import type { ObjectKey } from "@/utils/utility-types";
import { Paralyze } from "@/utils/utility-types";

interface View<Node> {
  when: (node: unknown) => node is Node;

  stringify: (node: Node) => string;
  render: (node: Node, expanded?: boolean) => ReactNode;

  fold?: (node: Node) => [ObjectKey, unknown][] | ReactNode;
  compactWhen?: (node: Node) => boolean;
  compact?: (node: Node) => [ObjectKey, unknown] | ReactNode;

  transformKey: (key: ObjectKey, keys?: number) => string;
  /** use stringify in safeStringify */
  serialize?: boolean;
}

function span<Node>(className?: string) {
  return function (this: View<Node>, value: Node) {
    return <span className={className}>{this.stringify(value)}</span>;
  };
}

export const createView = <Node,>(
  config: Paralyze<View<Node>, "transformKey">
): View<Node> => ({
  ...config,
  transformKey: config.transformKey || defaultTransformKey,
});

const undefinedView = createView({
  when: (node): node is undefined => typeof node === "undefined",
  stringify: () => "undefined",
  render: span("text-gray-500 dark:text-gray-400"),
});

const nullView = createView({
  when: (node): node is null => node === null,
  stringify: () => "null",
  render: span("text-red-600 dark:text-red-400"),
});

const stringView = createView({
  when: (node): node is string => typeof node === "string",
  stringify: (value) => `"${value}"`,
  render: span("text-green-600 dark:text-green-400"),
});

const numberView = createView({
  when: (node): node is number => typeof node === "number",
  stringify: (value) => String(value),
  render: span("text-blue-600 dark:text-blue-400"),
});

const booleanView = createView({
  when: (node): node is boolean => typeof node === "boolean",
  stringify: (value) => value.toString(),
  render: span("text-purple-600 dark:text-purple-400"),
});

const functionView = createView({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  when: (node): node is Function => typeof node === "function",
  stringify: (value) => `ƒ ${getFunctionSignature(value)}`,
  render: span("text-yellow-600 dark:text-yellow-400"),
  serialize: true,
});

const symbolView = createView({
  when: (node): node is symbol => typeof node === "symbol",
  stringify: (value) => value.toString(),
  render: span("text-orange-600 dark:text-orange-400"),
});

const bigintView = createView({
  when: (node): node is bigint => typeof node === "bigint",
  stringify: (value) => `${value.toString()}n`,
  render: span("text-blue-600 dark:text-blue-400"),
  serialize: true,
});

const dateView = createView({
  when: (node): node is Date => node instanceof Date,
  stringify: (value) => value.toISOString(),
  render: span("text-teal-600 dark:text-teal-400"),
  serialize: true,
});

const mapView = createView({
  when: (node): node is Map<unknown, unknown> => node instanceof Map,
  stringify: (value) => `Map(${value.size})`,
  render: span("text-indigo-600 dark:text-indigo-400"),
  serialize: true,
});

const setView = createView({
  when: (node): node is Set<unknown> => node instanceof Set,
  stringify: (value) => `Set(${value.size})`,
  render: span("text-indigo-600 dark:text-indigo-400"),
  serialize: true,
});

const arrayView = createView({
  when: (node): node is Array<unknown> => Array.isArray(node),
  stringify: (value) => `[] ${value.length} items`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  // fold: Object.entries,
  fold: (value) => value.map((el, i) => [i, el] as [number, unknown]),
  compactWhen: (value) => value.length <= 5,
  compact: (value) => <ArrayView data={value} />,
});

const objectView = createView({
  when: (node): node is Record<ObjectKey, unknown> =>
    typeof node === "object" && node !== null,
  stringify: (value) => `{} ${Object.keys(value).length} keys`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  fold: Object.entries,
  compactWhen: (value) => Object.keys(value).length <= 3,
  compact: (value) => <ObjectView data={value} />,
});

export const fallbackView = createView({
  when: (_node): _node is unknown => true,
  stringify: (value) => String(value),
  render: span(),
});

const defaultViews = [
  undefinedView,
  nullView,
  stringView,
  numberView,
  booleanView,
  functionView,
  symbolView,
  bigintView,
  dateView,
  mapView,
  setView,
  arrayView,
  objectView,
  fallbackView,
];

interface Point {
  x: number;
  y: number;
}

export const pointView = createView({
  when: (node): node is Point =>
    typeof node === "object" &&
    node !== null &&
    "x" in node &&
    "y" in node &&
    Object.keys(node).length === 2,
  stringify: ({ x, y }) => `p(${Math.round(x)}, ${Math.round(y)})`,
  render: span("text-emerald-600 dark:text-emerald-400"),
});

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const rectangleView = createView({
  when: (node): node is Rect =>
    typeof node === "object" &&
    node !== null &&
    "x1" in node &&
    "y1" in node &&
    "x2" in node &&
    "y2" in node &&
    Object.keys(node).length === 4,
  stringify: ({ x1, y1, x2, y2 }) =>
    `r[${Math.round(x1)}, ${Math.round(y1)}, ${Math.round(x2)}, ${Math.round(
      y2
    )}]`,
  render: span("text-emerald-600 dark:text-emerald-400"),
  // fold: ({ x1, y1, x2, y2 }) => [
  //   ["point 1", { x: x1, y: y1 }],
  //   ["point 2", { x: x2, y: y2 }],
  // ],
});

export const hundredView = createView({
  when: (node): node is number => typeof node === "number" && node === 100,
  stringify: () => `C (100)`,
  render: span("text-blue-600 dark:text-blue-400"),
});

// const matrixView = createView({
//   when: (node): node is unknown[][] =>
//     Array.isArray(node) &&
//     node.length > 0 &&
//     node.every((row) => Array.isArray(row) && row.length > 0),
//   stringify: () => "",
//   render: () => "Matrix",
//   fold: (value) => <Matrix matrix={value} />,
// });

// const singleKeyObject = createView({
//   ...objectView,
//   when: (node): node is object =>
//     objectView.when(node) && Object.keys(node).length === 1,
//   compact: (value) => Object.entries(value).pop(),
// });

export const extendedViews = [
  pointView,
  rectangleView,
  // hundredView,
  // singleKeyObject,
  // matrixView,
  ...defaultViews,
];

export const CellValue: FC<{ value: unknown }> = ({ value }) => {
  for (const view of extendedViews)
    if (view.when(value)) return view.render(value as never);

  return <span>{String(value)}</span>;
};

export const findView = (value: unknown, views = extendedViews) => {
  return views.find((view) => view.when(value)) || fallbackView;
};

export const safeStringify = (obj: unknown, space?: string | number) =>
  JSON.stringify(obj, jsonReplacer, space);

export const jsonReplacer = (_key: string, value: unknown) =>
  extendedViews
    .find((view) => view.serialize && view.when(value))
    ?.stringify(value as never) || value;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getFunctionSignature(func: Function): string {
  const funcStr = func.toString();
  const arrowMatch = funcStr.match(/^\s*(?:async\s*)?($$[^)]*$$)/);
  const normalMatch = funcStr.match(
    /^\s*(?:async\s*)?function\s*[^(]*($$[^)]*$$)/
  );

  if (arrowMatch) {
    return arrowMatch[1];
  }

  if (normalMatch) {
    return normalMatch[1];
  }

  return "()";
}

function defaultTransformKey(key: ObjectKey, count: number = 0): string {
  switch (typeof key) {
    case "string":
      return key;
    case "symbol":
      return `[${key.toString()}]`;
    case "number":
      return String(key).padStart(Math.ceil(Math.log10(count)), "_"); // &nbsp; ??
  }
}
