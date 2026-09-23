"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
};

export function PasswordField({ label, hint, className, id, ...props }: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 pr-12 text-fg",
            className,
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-fg-muted transition-colors hover:text-accent focus-visible:text-accent"
        >
          {visible ? <EyeOff size={19} aria-hidden /> : <Eye size={19} aria-hidden />}
        </button>
      </div>
      {hint && <span className="mt-2 block text-xs text-fg-subtle">{hint}</span>}
    </div>
  );
}
