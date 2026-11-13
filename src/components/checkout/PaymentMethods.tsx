"use client";

import { Building2, CreditCard, Smartphone } from "lucide-react";
import { SelectField, TextField } from "@/components/ui/Field";
import type { PaymentMethod } from "@/lib/services/checkout";
import { cn } from "@/lib/utils/cn";

const METHODS: Record<PaymentMethod, { label: string; text: string; icon: typeof CreditCard }> = {
  mobile_money: { label: "Mobile money", text: "Approve on your phone", icon: Smartphone },
  card: { label: "Debit or credit card", text: "Visa, Mastercard, Verve", icon: CreditCard },
  bank: { label: "Bank transfer", text: "Pay from your banking app", icon: Building2 },
};

export function MethodPicker({ methods, value, onChange }: { methods: PaymentMethod[]; value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="space-y-3">
      {methods.map((m) => {
        const { label, text, icon: Icon } = METHODS[m];
        const active = value === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            className={cn("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition", active ? "border-ink ring-1 ring-ink" : "border-line-strong hover:border-ink")}
          >
            <Icon className="h-6 w-6 shrink-0" strokeWidth={1.6} />
            <span className="flex-1">
              <span className="block text-ui font-semibold">{label}</span>
              <span className="block text-body text-ink-soft">{text}</span>
            </span>
            <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2", active ? "border-ink" : "border-ink-mute")}>
              {active && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type Details = Record<string, string>;
type FieldsProps = { details: Details; set: (k: string, v: string) => void; errors: Record<string, string> };

export function MobileMoneyFields({ networks, details, set, errors }: FieldsProps & { networks: string[] }) {
  return (
    <div className="space-y-4">
      <SelectField label="Network" value={details.network ?? networks[0]} onChange={(e) => set("network", e.target.value)}>
        {networks.map((n) => <option key={n}>{n}</option>)}
      </SelectField>
      <TextField label="Phone number" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" value={details.phone ?? ""} onChange={(e) => set("phone", e.target.value)} error={errors.phone} maxLength={16} hint="You'll get a prompt on this phone to approve the payment." />
    </div>
  );
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function CardFields({ details, set, errors }: FieldsProps) {
  return (
    <div className="space-y-4">
      <TextField label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={details.number ?? ""} onChange={(e) => set("number", formatCardNumber(e.target.value))} error={errors.number} />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={details.expiry ?? ""} onChange={(e) => set("expiry", formatExpiry(e.target.value))} error={errors.expiry} />
        <TextField label="CVV" inputMode="numeric" autoComplete="cc-csc" placeholder="123" type="password" value={details.cvv ?? ""} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} error={errors.cvv} />
      </div>
      <TextField label="Name on card" autoComplete="cc-name" value={details.name ?? ""} onChange={(e) => set("name", e.target.value)} error={errors.name} />
    </div>
  );
}

export function BankFields() {
  return (
    <div className="rounded-2xl bg-canvas p-5 text-body">
      <p className="font-semibold">How it works</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
        <li>Tap pay. We'll give you a one-time account number.</li>
        <li>Send the exact amount from your banking app.</li>
        <li>You're enrolled as soon as the money arrives, usually within a minute.</li>
      </ol>
    </div>
  );
}
