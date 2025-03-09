import { Script } from "@/components/Canvas/types";
import { toArray } from "@/utils/toArray";

export function resolveScripts(
  ...scripts: (Script | Script[] | undefined | boolean)[]
) {
  return toArray(scripts)
    .flat()
    .filter((script) => typeof script === "function") as Script[];
}
