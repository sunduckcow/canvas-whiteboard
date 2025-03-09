import { Script } from "@/components/Canvas/types";
import { toArray } from "@/utils/toArray";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function resolveScripts(...scripts: (Script | Script[] | undefined)[]) {
  return toArray(scripts).flat().filter(Boolean) as Script[];
}
