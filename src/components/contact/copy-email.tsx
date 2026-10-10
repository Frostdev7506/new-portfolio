"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export function CopyEmail() {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setStatus("Email copied.");
    } catch {
      setStatus("Couldn’t copy. Select the email address to copy it.");
    }
  }
  return (
    <div className="copy-email">
      <div>
        <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Copy email address"
          onClick={copy}
        >
          {status === "Email copied." ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
        </Button>
      </div>
      <span role="status">{status}</span>
    </div>
  );
}
