import { FC, ReactNode } from "react";

// import { Matrix } from "./matrix";
// import { JsonNode } from "./node"
import { EntriesView } from "./entries";
import { Badge } from "@/components/ui/badge";
import type { ObjectKey } from "@/utils/utility-types";
import { Paralyze } from "@/utils/utility-types";

/*
JSON.stringify({ set: new Set([1,2,3,4])}, (_k, v) => {
    if(v instanceof Set) {
        return {title: 'Set()', value:{test: 'key'}}
    }
    return v
})
> '{"set":{"title":"Set()","value":{"test":"key"}}}'
*/

interface View<Node> {
  when: (node: unknown) => node is Node;

  stringify: (node: Node) => string; // => string | {title: string; value: unknown} // stringify plane for viewing sets and maps
  render: (node: Node, expanded?: boolean) => ReactNode;

  fold?: (node: Node) => [ObjectKey, unknown][] | ReactNode;
  compactWhen?: (node: Node) => boolean; // QUESTION: maybe remove this prop and make compact return value nullable as predicate
  compact?: (node: Node) => ReactNode;

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
  compactWhen: (value) => value.size <= 3,
  compact(value) {
    return (
      <>
        <span className="mr-2">{this.render(value)}</span>
        <EntriesView
          className={"text-indigo-600 dark:text-indigo-400"}
          separator=" => "
          entries={Array.from(value.entries())}
          richKey
        />
      </>
    );
  },
  fold: (value) => Array.from(value.entries()),
  serialize: true,
});

const setView = createView({
  when: (node): node is Set<unknown> => node instanceof Set,
  stringify: (value) => `Set(${value.size})`,
  render: span("text-indigo-600 dark:text-indigo-400"),
  compactWhen: (value) => value.size <= 5,
  compact(value) {
    return (
      <>
        <span className="mr-2">{this.render(value)}</span>
        <EntriesView
          className={"text-indigo-600 dark:text-indigo-400"}
          entries={Array.from(value.keys()).map((item) => [undefined, item])}
        />
      </>
    );
  },
  fold: (value) =>
    Array.from(value.keys()).map((item) => [undefined, item] as const),
  serialize: true,
});

const arrayView = createView({
  when: (node): node is Array<unknown> => Array.isArray(node),
  stringify: (value) => `[] ${value.length} items`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  // fold: Object.entries,
  fold: (value) => value.map((el, i) => [i, el] as [number, unknown]),
  compactWhen: (value) => value.length <= 5 && value.every(isPrimitive),
  compact: (value) => (
    <EntriesView
      entries={value.map((item) => [undefined, item])}
      brackets="[]"
    />
  ),
});

const objectView = createView({
  when: (node): node is Record<ObjectKey, unknown> =>
    typeof node === "object" && node !== null,
  stringify: (value) => `{} ${Object.keys(value).length} keys`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  fold: Object.entries,
  compactWhen: (value) =>
    Object.keys(value).length <= 3 && Object.values(value).every(isPrimitive),
  compact: (value) => <EntriesView entries={Object.entries(value)} />,
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
  render: span("text-sky-600 dark:text-sky-400"),
  // fold: ({ x1, y1, x2, y2 }) => [ // virtual fold? also usable for urls as strings
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

export function oneOfView<Types extends string[]>(
  types: Types,
  renders?:
    | Record<Types[number], View<Types[number]>["render"]>
    | (Partial<Record<Types[number], View<Types[number]>["render"]>> & {
        default: View<Types[number]>["render"];
      })
) {
  return createView({
    when: (node): node is Types[number] =>
      typeof node === "string" && types.includes(node),
    stringify: (value) => value,
    render(value, expanded) {
      if (!renders)
        return <span className="text-red-600 dark:text-red-400">{value}</span>;
      if (value in renders) {
        return renders[value]?.(value, expanded);
      }
      if ("default" in renders) return renders.default(value, expanded);
    },
  });
}

export const extendedViews = [
  pointView,
  rectangleView,
  // hundredView,
  // singleKeyObject,
  // matrixView,
  oneOfView(["idle", "hold", "moving", "drawing"] as const, {
    default: (value) => <Badge variant="secondary">{value}</Badge>,
  }),
  ...defaultViews,
];

function isPrimitive(value: unknown) {
  for (const view of extendedViews) {
    if (view.when(value) && "fold" in view) return false;
  }
  return true;
}

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

export function defaultTransformKey(
  key: ObjectKey,
  siblings: number = 0
): string {
  switch (typeof key) {
    case "string":
      return key;
    case "symbol":
      return `[${key.toString()}]`;
    case "number":
      return String(key).padStart(Math.ceil(Math.log10(siblings)), "_"); // &nbsp; ??
  }
}
