import { Check, Copy } from "lucide-react";
import { FC, useState } from "react";

import { safeStringify } from "./cell";
import { Button } from "@/components/ui/button";

export const RawJson: FC<{ data: unknown }> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = safeStringify(data, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto">
        {jsonString}
      </pre>
    </div>
  );
};
