"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  label = "Copy code",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (reset.current) clearTimeout(reset.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Couldn’t copy. Select and copy the text instead.");
    }
    if (reset.current) clearTimeout(reset.current);
    reset.current = setTimeout(() => setStatus(""), 4000);
  }
  return (
    <span className="copy-control">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copy}
        aria-label={label}
      >
        {status === "Copied" ? (
          <Check aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {status === "Copied" ? "Copied" : label}
      </Button>
      <span
        className={status.startsWith("Couldn") ? "copy-error" : "sr-only"}
        role="status"
      >
        {status}
      </span>
    </span>
  );
}
