"use client";

import { Select } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudioSelect({ id, label, value, options, onChange, hint }: {
  id: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div className="studio-field">
      <label htmlFor={id}>{label}</label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger asChild><Button id={id} variant="outline" className="studio-select-trigger" aria-describedby={hint ? `${id}-hint` : undefined}><Select.Value /><Select.Icon><ChevronDown size={15} /></Select.Icon></Button></Select.Trigger>
        <Select.Portal><Select.Content className="studio-select-content" position="popper" sideOffset={4}>
          <Select.Viewport>{options.map((option) => (
            <Select.Item className="studio-select-item" key={option.value} value={option.value}>
              <Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator><Check size={14} /></Select.ItemIndicator>
            </Select.Item>
          ))}</Select.Viewport>
        </Select.Content></Select.Portal>
      </Select.Root>
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}
