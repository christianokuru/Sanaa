"use client";

import { useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, Globe } from "lucide-react";
import { AFRICAN_COUNTRIES, DIASPORA_COUNTRIES, flagEmoji, type Country } from "@/lib/countries";
import { setCountry } from "@/lib/actions/country";

export function CountryPicker({ current }: { current?: Country }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filter = (list: Country[]) =>
    list.filter((c) => `${c.name} ${c.currency}`.toLowerCase().includes(q.toLowerCase()));
  const africa = useMemo(() => filter(AFRICAN_COUNTRIES), [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const abroad = useMemo(() => filter(DIASPORA_COUNTRIES), [q]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(code: string) {
    startTransition(async () => {
      await setCountry(code);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-h-[40px] items-center gap-1.5 rounded-full border border-earth/15 bg-white px-3 text-sm font-semibold"
        aria-label={current ? `Country: ${current.name}. Change country` : "Choose your country"}
      >
        {current ? (
          <>
            <span className="text-lg leading-none">{flagEmoji(current.code)}</span>
            <span>{current.currency}</span>
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            <span>USD</span>
          </>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-earth/50 md:items-center" onClick={() => setOpen(false)}>
          <div
            className="flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-cream md:max-w-md md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Choose your country"
          >
            <div className="flex items-center justify-between p-5 pb-3">
              <div>
                <h2 className="font-display text-xl font-bold">Where are you?</h2>
                <p className="text-sm text-earth-soft">Prices will show in your currency.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-sand" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative px-5 pb-3">
              <Search className="pointer-events-none absolute left-9 top-3.5 h-5 w-5 text-earth/40" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search country"
                className="input pl-11"
              />
            </div>
            <div className="overflow-y-auto px-3 pb-6">
              <CountryList title="Africa" list={africa} current={current} onPick={choose} disabled={pending} />
              <CountryList title="Living abroad" list={abroad} current={current} onPick={choose} disabled={pending} />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function CountryList({
  title, list, current, onPick, disabled,
}: { title: string; list: Country[]; current?: Country; onPick: (c: string) => void; disabled: boolean }) {
  if (list.length === 0) return null;
  return (
    <div className="mt-2">
      <p className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-earth/50">{title}</p>
      <ul>
        {list.map((c) => (
          <li key={c.code}>
            <button
              disabled={disabled}
              onClick={() => onPick(c.code)}
              className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-sand ${
                current?.code === c.code ? "bg-sand font-semibold" : ""
              }`}
            >
              <span className="text-xl">{flagEmoji(c.code)}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-sm text-earth/50">{c.currency}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
