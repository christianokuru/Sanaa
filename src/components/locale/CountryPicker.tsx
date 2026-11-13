"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Globe, Search } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { useLocale } from "@/components/locale/LocaleProvider";
import { AFRICAN_COUNTRIES, DIASPORA_COUNTRIES, flagEmoji, type Country } from "@/lib/locale/countries";
import { setCountryAction } from "@/lib/locale/actions";
import { cn } from "@/lib/utils/cn";

/** Header chip showing the visitor's country and currency, opening a picker. */
export function CountryButton({ className, variant = "chip" }: { className?: string; variant?: "chip" | "round" | "text" }) {
  const { country, currency } = useLocale();
  const [open, setOpen] = useState(false);
  const label = country ? `${country.name}, prices in ${currency}. Change country` : "Choose your country";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-semibold transition",
          variant === "chip" && "h-10 rounded-full px-3 text-body hover:bg-canvas",
          variant === "round" && "h-10 w-10 rounded-full border border-line-strong bg-white text-lg shadow-pill",
          variant === "text" && "text-body underline-offset-4 hover:underline",
          className,
        )}
      >
        {country ? <span className="text-lg leading-none">{flagEmoji(country.code)}</span> : <Globe className="h-4 w-4" />}
        {variant !== "round" && <span>{currency}</span>}
      </button>
      <CountrySheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CountrySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { country: current } = useLocale();
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  const filter = (list: Country[]) => {
    const term = q.trim().toLowerCase();
    return term ? list.filter((c) => `${c.name} ${c.currency}`.toLowerCase().includes(term)) : list;
  };
  const africa = useMemo(() => filter(AFRICAN_COUNTRIES), [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const abroad = useMemo(() => filter(DIASPORA_COUNTRIES), [q]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(code: string) {
    start(async () => {
      await setCountryAction(code);
      router.refresh();
      onClose();
    });
  }

  return (
    <Sheet open={open} onClose={onClose} title="Country and currency" description="Prices show in your local currency" variant="full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          data-autofocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search country or currency"
          aria-label="Search country or currency"
          className="h-12 w-full rounded-full border border-line-strong bg-white pl-11 pr-4 text-ui placeholder:text-ink-mute focus:border-ink focus:outline-none"
        />
      </div>
      <CountryList title="Africa" list={africa} current={current} onPick={choose} disabled={pending} />
      <CountryList title="Living abroad" list={abroad} current={current} onPick={choose} disabled={pending} />
      {africa.length + abroad.length === 0 && <p className="mt-8 text-center text-ink-soft">No country matches “{q}”.</p>}
    </Sheet>
  );
}

function CountryList({ title, list, current, onPick, disabled }: { title: string; list: Country[]; current: Country | null; onPick: (c: string) => void; disabled: boolean }) {
  if (list.length === 0) return null;
  return (
    <section className="mt-6">
      <h3 className="mb-2 text-body font-semibold">{title}</h3>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {list.map((c) => {
          const active = current?.code === c.code;
          return (
            <li key={c.code}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(c.code)}
                aria-current={active || undefined}
                className={cn("flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 text-left transition hover:bg-canvas", active && "bg-canvas ring-1 ring-ink")}
              >
                <span className="text-xl leading-none">{flagEmoji(c.code)}</span>
                <span className="flex-1">
                  <span className="block text-body font-medium">{c.name}</span>
                  <span className="block text-caption text-ink-soft">{c.currency}</span>
                </span>
                {active && <Check className="h-4 w-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
