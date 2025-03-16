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
    regular: function multiply(a: number, b: number) {
      return a * b;
    },
    async: async function fetchData() {
      return "data";
    },
  },
  arrays: {
    empty: [],
    numbers: [1, 2, 3, 4, 5],
    mixed: [1, "two", { three: 3 }, [4, 5]],
    objects: [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
      { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" },
    ],
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },
  nested: {
    a: {
      b: {
        c: {
          d: {
            e: "Deeply nested value",
          },
        },
      },
    },
  },
  compact: { x: 100, y: 150, visible: true },
  compactArray: [10, 20, 30, 40, 50],
};

export const Primary: Story = {
  render: () => (
    <Json
      data={sampleData}
      initialExpand
      sections={[
        { title: "Name", path: "name" },
        { title: "Address Details", path: "address" },
        { title: "Projects (Table View)", path: "projects" },
        { title: "Root", path: "" },
        { title: "Project Alpha Tasks (Table View)", path: "projects.0.tasks" },
        { title: "Primitive Array (Table View)", path: "primitiveArray" },
        { title: "Mixed Array", path: "mixedArray" },
        { title: "Settings", path: "metadata.settings" },
        { title: "Non-existent Path", path: "some.invalid.path" },
      ]}
    />
  ),
  // storybook cant handle bigint
  // https://github.com/storybookjs/storybook/issues/22452
  args: {} as { data: object },
};
