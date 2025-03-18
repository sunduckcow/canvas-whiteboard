import { ChevronDown, ChevronRight } from "lucide-react";
import { ComponentProps, FC } from "react";

import { cn } from "@/lib/utils";

interface ChevronProps extends ComponentProps<"button"> {
  open?: boolean;
}
export const Chevron: FC<ChevronProps> = ({ open, className, ...props }) => (
  <button
    {...props}
    className={cn(
      "mr-1 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded",
      className
    )}
  >
    {open ? (
      <ChevronDown className="h-4 w-4 text-gray-500" />
    ) : (
      <ChevronRight className="h-4 w-4 text-gray-500" />
    )}
  </button>
);
