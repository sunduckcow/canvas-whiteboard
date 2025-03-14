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
  },
  tags: ["developer", "designer", "product manager"],
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
  mixedArray: [1, "string", true, null, { key: "value" }],
  nullValue: null,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    data: sampleData,
    initialExpanded: true,
    sections: [
      { title: "Address Details", path: "address" },
      { title: "Projects (Table View)", path: "projects" },
      { title: "Project Alpha Tasks (Table View)", path: "projects.0.tasks" },
      { title: "Primitive Array (Table View)", path: "primitiveArray" },
      { title: "Mixed Array", path: "mixedArray" },
      { title: "Settings", path: "metadata.settings" },
      { title: "Non-existent Path", path: "some.invalid.path" },
      { title: "Personal Information", path: "" },
    ],
  },
};
