"use client";

import { forwardRef, useId, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Shared label / hint / error wrapper. Wires aria attributes so screen readers announce errors. */
function FieldShell({
  id, label, hint, error, children, className,
}: { id: string; label?: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-body font-semibold text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-caption font-medium text-ember">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-caption text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const control = (error?: string) =>
  cn(
    "block w-full rounded-field border bg-white px-4 text-ui text-ink placeholder:text-ink-mute transition",
    "focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink",
    error ? "border-ember" : "border-line-strong hover:border-ink-mute",
  );

type BaseProps = { label?: string; hint?: string; error?: string; wrapperClassName?: string };

export const TextField = forwardRef<HTMLInputElement, BaseProps & React.InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, hint, error, wrapperClassName, className, id: idProp, type = "text", ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(control(error), "h-14", isPassword && "pr-12", className)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-canvas"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </FieldShell>
  );
});

export const TextAreaField = forwardRef<HTMLTextAreaElement, BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextAreaField({ label, hint, error, wrapperClassName, className, id: idProp, rows = 4, ...rest }, ref) {
    const autoId = useId();
    const id = idProp ?? autoId;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(control(error), "resize-y py-3.5 leading-relaxed", className)}
          {...rest}
        />
      </FieldShell>
    );
  },
);

export const SelectField = forwardRef<HTMLSelectElement, BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectField({ label, hint, error, wrapperClassName, className, id: idProp, children, ...rest }, ref) {
    const autoId = useId();
    const id = idProp ?? autoId;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            className={cn(control(error), "h-14 appearance-none pr-11", className)}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        </div>
      </FieldShell>
    );
  },
);

export function CheckboxField({
  label, error, className, ...rest
}: { label: React.ReactNode; error?: string; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body text-ink">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
          <input id={id} type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-ink-mute bg-white checked:border-ink checked:bg-ink" aria-invalid={Boolean(error) || undefined} {...rest} />
          <Check className="pointer-events-none absolute inset-0 m-auto hidden h-3.5 w-3.5 text-white peer-checked:block" strokeWidth={3} />
        </span>
        <span>{label}</span>
      </label>
      {error && <p role="alert" className="mt-1.5 text-caption font-medium text-ember">{error}</p>}
    </div>
  );
}

/** Pill toggle between a few options (e.g. Learn / Teach). */
export function Segmented<T extends string>({
  value, onChange, options, label,
}: { value: T; onChange: (v: T) => void; options: Array<{ value: T; label: string }>; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-canvas p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-11 rounded-full text-body font-semibold transition",
            value === o.value ? "bg-white text-ink shadow-pill" : "text-ink-soft hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
