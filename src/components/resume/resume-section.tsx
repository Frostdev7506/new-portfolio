import type { ReactNode } from "react";

export function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-2">
      <h2
        className="text-[14px] uppercase border-b border-black mb-[3px] pb-[1px]"
        style={{ fontVariant: "small-caps" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
