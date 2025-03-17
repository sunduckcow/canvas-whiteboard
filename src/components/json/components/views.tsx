import { FC, ReactNode } from "react";

interface View<N> {
  when: (node: unknown) => node is N;
  stringify: (node: N) => string;
  render: (node: N, expanded?: boolean) => ReactNode;
  fold?: (
    node: N
  ) => [string | number | symbol, ReactNode | unknown][] | ReactNode;
}

function span<N>(className?: string) {
  return function (this: View<N>, value: N) {
    return <span className={className}>{this.stringify(value)}</span>;
  };
}

export const createView = <N,>(config: View<N>) => config;

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
});

const dateView = createView({
  when: (node): node is Date => node instanceof Date,
  stringify: (value) => value.toISOString(),
  render: span("text-teal-600 dark:text-teal-400"),
});

const mapView = createView({
  when: (node): node is Map<unknown, unknown> => node instanceof Map,
  stringify: (value) => `Map(${value.size})`,
  render: span("text-indigo-600 dark:text-indigo-400"),
});

const setView = createView({
  when: (node): node is Set<unknown> => node instanceof Set,
  stringify: (value) => `Set(${value.size})`,
  render: span("text-indigo-600 dark:text-indigo-400"),
});

const arrayView = createView({
  when: (node): node is Array<unknown> => Array.isArray(node),
  stringify: (value) => `[ ${value.length} ]`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  // fold: Object.entries,
  fold: (value) => value.map((el, i) => [i, el] as [number, unknown]),
});

const objectView = createView({
  when: (node): node is object => typeof node === "object",
  stringify: (value) => `{ ${Object.keys(value).length} }`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  fold: Object.entries,
});

const fallbackView = createView<unknown>({
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

export const extendedViews = [
  pointView,
  rectangleView,
  // hundredView,
  ...defaultViews,
];

export const CellValue: FC<{ value: unknown }> = ({ value }) => {
  for (const view of extendedViews)
    if (view.when(value)) return view.render(value as never);

  return <span>{String(value)}</span>;
};

export const safeStringify = (obj: unknown, space?: string | number) =>
  JSON.stringify(obj, jsonReplacer, space);

export function jsonReplacer(_key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  if (typeof value === "function") {
    return `ƒ ${getFunctionSignature(value)}`;
  }
  if (typeof value === "symbol") {
    return value.toString();
  }
  if (value instanceof Date) {
    return `Date(${value.toISOString()})`;
  }
  if (value instanceof Map) {
    return `Map(${value.size})`;
  }
  if (value instanceof Set) {
    return `Set(${value.size})`;
  }
  return value;
}

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
