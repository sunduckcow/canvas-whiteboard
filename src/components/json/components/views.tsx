import { FC } from "react";
import { ReactNode } from "react";

import { EntriesView } from "./entries";
import { defaultTransformKey } from "../utils";
import { getFunctionSignature } from "../utils";
import type { ObjectKey, Paralyze } from "@/utils/utility-types";

/*
JSON.stringify({ set: new Set([1,2,3,4])}, (_k, v) => {
    if(v instanceof Set) {
        return {title: 'Set()', value:{test: 'key'}}
    }
    return v
})
> '{"set":{"title":"Set()","value":{"test":"key"}}}'
*/
/*

class Draw {
  constructor(key, val) {
    this.key = key
    this.val = val
  }
}

new Draw(1,2).constructor.name
> 'Draw'

({}).constructor.name
> 'Object'
*/

// interface ObjectKeyMeta {
//   key?: ObjectKey;
//   separator?: string;
//   richKey?: boolean | unknown; // overrides key
//   displayKey?: boolean;
//   childViews?: unknown; // ??
//   childNodeMeta?: unknown; // ??
// }

export interface View<Node> {
  when: (node: unknown) => node is Node;

  stringify: (node: Node) => string; // => string | {title: string; value: unknown} // stringify plane for viewing sets and maps
  render: (node: Node, expanded?: boolean) => ReactNode;

  // fold?: (node: Node) => [ObjectKey | undefined, unknown][] | ReactNode;
  fold?: (
    node: Node
  ) => [ObjectKey /*| ObjectKeyMeta*/ | undefined, unknown][] | ReactNode;
  compactWhen?: (node: Node) => boolean; // QUESTION: maybe remove this prop and make compact return value nullable as predicate
  compact?: (node: Node) => ReactNode;

  transformKey: (key: ObjectKey, keys?: number) => string;
  /** use stringify in safeStringify */
  serialize?: boolean;
}

export function span<Node>(className?: string) {
  return function (this: View<Node>, value: Node) {
    return <span className={className}>{this.stringify(value)}</span>;
  };
}

export function createView<Node>(
  config: Paralyze<View<Node>, "transformKey">
): View<Node> {
  return {
    ...config,
    transformKey: config.transformKey || defaultTransformKey,
  };
}

export const fallbackView = createView({
  when: (_node): _node is unknown => true,
  stringify: (value) => String(value),
  render: span(),
});

/* Primitive Views */

export const undefinedView = createView({
  when: (node): node is undefined => typeof node === "undefined",
  stringify: () => "undefined",
  render: span("text-gray-500 dark:text-gray-400"),
});
export const nullView = createView({
  when: (node): node is null => node === null,
  stringify: () => "null",
  render: span("text-red-600 dark:text-red-400"),
});
export const stringView = createView({
  when: (node): node is string => typeof node === "string",
  stringify: (value) => `"${value}"`,
  render: span("text-green-600 dark:text-green-400"),
});
export const numberView = createView({
  when: (node): node is number => typeof node === "number",
  stringify: (value) => String(value),
  render: span("text-blue-600 dark:text-blue-400"),
});
export const booleanView = createView({
  when: (node): node is boolean => typeof node === "boolean",
  stringify: (value) => value.toString(),
  render: span("text-purple-600 dark:text-purple-400"),
});
export const symbolView = createView({
  when: (node): node is symbol => typeof node === "symbol",
  stringify: (value) => value.toString(),
  render: span("text-orange-600 dark:text-orange-400"),
});
export const bigintView = createView({
  when: (node): node is bigint => typeof node === "bigint",
  stringify: (value) => `${value.toString()}n`,
  render: span("text-blue-600 dark:text-blue-400"),
  serialize: true,
});

export const primitiveViews = [
  undefinedView,
  nullView,
  stringView,
  numberView,
  booleanView,
  symbolView,
  bigintView,
];

export const mapView = createView({
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
  fold: (value) =>
    value
      .entries()
      .toArray()
      .map(([key, value]) => [String(key), value] as [string, unknown]),
  // fold: (value) => [
  //   ["size", value.size],
  //   [
  //     "[[Entries]]",
  //     value
  //       .entries()
  //       .map(([key, value]) => ({ [key]: value }))
  //       .toArray(),
  //   ],
  // ],

  serialize: true,
});

// const meta = Symbol("Json.meta");

export const setView = createView({
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
    Array.from(value.keys()).map(
      (value) => [undefined, value] as [undefined, unknown]
    ),
  serialize: true,
});

export const advancedViews = [mapView, setView];

export const functionView = createView({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  when: (node): node is Function => typeof node === "function",
  stringify: (value) => `ƒ ${value.name} ${getFunctionSignature(value)}`,
  render: span("text-yellow-600 dark:text-yellow-400"),
  serialize: true,
});

export const dateView = createView({
  when: (node): node is Date => node instanceof Date,
  stringify: (value) => value.toISOString(),
  render: span("text-teal-600 dark:text-teal-400"),
  serialize: true,
});

export const arrayView = createView({
  when: (node): node is Array<unknown> => Array.isArray(node),
  stringify: (value) => `[] ${value.length} items`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  fold: (value) => value.map((el, i) => [i, el] as [number, unknown]),
  compactWhen: (value) => value.length <= 5 && value.every(isPrimitive),
  compact: (value) => (
    <EntriesView
      entries={value.map((item) => [undefined, item])}
      brackets="[]"
    />
  ),
});

export const objectView = createView({
  when: (node): node is Record<ObjectKey, unknown> =>
    typeof node === "object" && node !== null,
  stringify: (value) => `{} ${Object.keys(value).length} keys`,
  render: span("text-gray-600 dark:text-gray-400"), // cursor-pointer hover:underline"
  fold: (value) =>
    Object.entries(value).map(
      ([key, value]) => [key, value] as [string, unknown]
    ),
  compactWhen: (value) =>
    Object.keys(value).length <= 3 && Object.values(value).every(isPrimitive),
  compact: (value) => <EntriesView entries={Object.entries(value)} />,
});

export const objectViews = [functionView, dateView, arrayView, objectView];

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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

export const geometryViews = [pointView, rectangleView];

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

export const defaultViews = [
  ...primitiveViews,
  ...geometryViews,
  ...advancedViews,
  ...objectViews,
  fallbackView,
];

export function isPrimitive(value: unknown) {
  for (const view of defaultViews) {
    if (view.when(value) && "fold" in view) return false;
  }
  return true;
}

export const CellValue: FC<{ value: unknown }> = ({ value }) => {
  for (const view of defaultViews)
    if (view.when(value)) return view.render(value as never);

  return <span>{String(value)}</span>;
};

export const findView = (value: unknown, views = defaultViews) => {
  return views.find((view) => view.when(value)) || fallbackView;
};

export const safeStringify = (obj: unknown, space?: string | number) =>
  JSON.stringify(obj, jsonReplacer, space);

export const jsonReplacer = (_key: string, value: unknown) =>
  defaultViews
    .find((view) => view.serialize && view.when(value))
    ?.stringify(value as never) || value;
