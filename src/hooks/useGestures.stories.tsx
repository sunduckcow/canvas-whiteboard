import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCcw } from "lucide-react";
import { useRef } from "react";

import { useGestures } from "./useGestures";
import { Button } from "@/components/ui/button";

const meta = {
  title: "useGestures",
  parameters: { layout: "centered" },
} satisfies Meta<typeof useGestures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: function Render() {
    const ref = useRef<HTMLDivElement>(null);
    const { x, y, z, reset } = useGestures({ ref });
    return (
      <div className="[&>:not(:first-child)]:mt-8">
        <Button onClick={reset}>
          <RefreshCcw />
          Reset
        </Button>
        <div
          className="border border-border w-[300px] h-[300px] relative overflow-hidden"
          ref={ref}
        >
          {Array(5)
            .fill(0)
            .map((_1, i) =>
              Array(5)
                .fill(0)
                .map((_2, j) =>
                  (i + j + 1) % 2 ? (
                    <div
                      key={`${i},${j}`}
                      className="w-8 h-8 bg-green-300 dark:bg-green-700 flex items-center justify-center absolute"
                      style={{
                        transform: `translate(${x + i * 32 * z}px, ${
                          y + j * 32 * z
                        }px) scale(${z}, ${z})`,
                        transformOrigin: "top left",
                      }}
                    >
                      {i},{j}
                    </div>
                  ) : null
                )
            )}
        </div>
      </div>
    );
  },
  args: {},
};
