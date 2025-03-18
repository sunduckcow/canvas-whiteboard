import type { Meta, StoryObj } from "@storybook/react";

import { Json } from "./json";

const meta = {
  title: "Json",
  component: Json,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Json>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  name: "John Doe",
  age: 30,
  isActive: true,
  geometry: {
    point: { x: 50, y: 50 },
    rectangle: { x1: 100, y1: 100, x2: 300, y2: 200 },
    circle: { x: 300, y: 300, r: 50 },
  },
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    coordinates: {
      lat: 40.7128,
      lng: -74.006,
    },
    inbox: [],
  },
  tags: [
    "developer",
    "designer",
    "product manager",
    // "engineer",
    // "mathematician",
  ],
  projects: [
    {
      id: 1,
      name: "Project Alpha",
      status: "completed",
      tasks: [
        { id: 101, title: "Task 1", completed: true },
        { id: 102, title: "Task 2", completed: false },
      ],
    },
    {
      id: 2,
      name: "Project Beta",
      status: "in-progress",
      tasks: [
        { id: 201, title: "Task 1", completed: true },
        { id: 202, title: "Task 2", completed: false },
        { id: 203, title: "Task 3", completed: false },
      ],
    },
  ],
  metadata: {
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-03-20T15:30:00Z",
    version: 2.1,
    settings: {
      notifications: true,
      theme: "dark",
      language: "en",
    },
  },
  primitiveArray: [1, 2, 3, 4, 5],
  mixedArray: [1, "string", true, null, Symbol("title")],
  nullValue: null,
  primitives: {
    string: "Hello, world!",
    number: 42,
    boolean: true,
    null: null,
    undefined: undefined,
    bigint: BigInt(9007199254740991),
    symbol: Symbol("description"),
  },
  objects: {
    date: new Date(),
    regex: /^hello$/i,
    map: new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]),
    set: new Set([1, 2, 3, 4, 5]),
  },
  functions: {
    arrow: (a: number, b: number) => a + b,
    unnamed: function (arg: unknown) {
      return arg;
    },
    regular: function multiply(a: number, b: number) {
      return a * b;
    },
    async: async function fetchData() {
      return "data";
    },
  },
  longArray: Array(20)
    .fill(0)
    .map((_, i) => i + 1),
  arrays: {
    empty: [],
    numbers: [1, 2, 3, 4, 5],
    mixed: [1, "two", { three: 3 }, [4, 5]],
    objects: [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
      { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" },
    ],
  },
  matrices: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    hardMatrix: [
      [1, 2, 3, 4],
      [5, null, 6, undefined, 7, 8],
      [null, null, 9, 10, null, 11, 12],
      [13, 14, null, 15, null, 16],
    ],
  },
  nested: {
    root: true,
    prim: { a: { b: { c: { d: { e: "Deeply nested value" } } } } },
    obj: { a: { b: { c: { d: { e: { one: 1, two: 2 } } } } } },
    tree: { a: { b: { c: { one: { d: { e: 1 } }, two: { d: { e: 1 } } } } } },
    symbolKeys: { [Symbol("a")]: { [Symbol("b")]: Symbol("c") } },
    arrays: [[[["test"]]]],
    // eslint-disable-next-line no-sparse-arrays
    voids: [[, [, , [, , , "123"]]]],
  },
  compacts: {
    object: { x: 100, y: 150, visible: true },
    array: [10, 20, 30, 40, 50],
  },
  oneof: ["idle", "hold", "moving", "drawing"],
  sets: {
    empty: new Set(),
    small: new Set([1, 2, 3]),
    large: new Set(
      Array(10)
        .fill(0)
        .map((_, i) => i + 100)
    ),
  },
  maps: {
    empty: new Map(),
    small: new Map(Object.entries([1, 2, 3])),
    large: new Map(
      Array(10)
        .fill(0)
        .map((_, i) => [`key ${i}`, i + 100])
    ),
  },
};

export const Primary: Story = {
  render: () => (
    <Json
      data={sampleData}
      initialExpand
      sections={[
        { title: "Name", path: "name" },
        { title: "Nested", path: "nested" },
        { title: "Compacts", path: "compacts" },
        { title: "Mixed Array", path: "mixedArray" },
        { title: "Matrix", path: "matrices" },
        { title: "Geometry", path: "geometry" },
        { title: "Sets", path: "sets" },
        { title: "Maps", path: "maps" },
        { title: "Address Details", path: "address" },
        { title: "Projects (Table View)", path: "projects" },
        { title: "Root", path: "" },
        { title: "Project Alpha Tasks (Table View)", path: "projects.0.tasks" },
        { title: "Primitive Array (Table View)", path: "primitiveArray" },
        { title: "Settings", path: "metadata.settings" },
        { title: "One of", path: "oneof" },
        { title: "Non-existent Path", path: "some.invalid.path" },
      ]}
    />
  ),
  // storybook cant handle bigint
  // https://github.com/storybookjs/storybook/issues/22452
  args: {} as { data: unknown },
};
