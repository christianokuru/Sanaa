"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButton";
import { listBanks, savePayoutAccount } from "@/lib/actions/teach";
import { AFRICAN_COUNTRIES } from "@/lib/countries";
import { BANK_COUNTRIES, MOBILE_MONEY } from "@/lib/payout-options";

type Account = {
  method: "mobile_money" | "bank"; country: string; provider_code: string;
  provider_name: string | null; account_number: string; account_name: string;
} | null;

const PAYOUT_COUNTRIES = AFRICAN_COUNTRIES.filter((c) => MOBILE_MONEY[c.code] || BANK_COUNTRIES.includes(c.code));

export function PayoutForm({ account, defaultCountry }: { account: Account; defaultCountry?: string }) {
  const [state, action] = useFormState(savePayoutAccount, null);
  const [country, setCountry] = useState(account?.country ?? (PAYOUT_COUNTRIES.some((c) => c.code === defaultCountry) ? defaultCountry! : "NG"));
  const hasMomo = Boolean(MOBILE_MONEY[country]);
  const hasBank = BANK_COUNTRIES.includes(country);
  const [method, setMethod] = useState<"mobile_money" | "bank">(account?.method ?? (hasMomo ? "mobile_money" : "bank"));
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [code, setCode] = useState(account?.provider_code ?? "");

  const effective = method === "mobile_money" && !hasMomo ? "bank" : method === "bank" && !hasBank ? "mobile_money" : method;

  useEffect(() => {
    if (effective !== "bank") return;
    let live = true;
    listBanks(country).then((b) => live && setBanks(b));
    return () => { live = false; };
  }, [country, effective]);

  const options = effective === "mobile_money" ? MOBILE_MONEY[country] ?? [] : banks;
  const providerName = options.find((o) => o.code === code)?.name ?? account?.provider_name ?? "";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="method" value={effective} />
      <input type="hidden" name="provider_name" value={providerName} />
      <div>
        <label className="label" htmlFor="country">Country</label>
        <select id="country" name="country" value={country} onChange={(e) => { setCountry(e.target.value); setCode(""); }} className="input">
          {PAYOUT_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-full bg-sand p-1">
        {([["mobile_money", "Mobile money", hasMomo], ["bank", "Bank account", hasBank]] as const).map(([m, label, ok]) => (
          <button key={m} type="button" disabled={!ok} onClick={() => { setMethod(m); setCode(""); }}
            className={`min-h-[44px] rounded-full text-sm font-semibold disabled:opacity-40 ${effective === m ? "bg-white shadow-card" : "text-earth/60"}`}>
            {label}
          </button>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="provider_code">{effective === "bank" ? "Bank" : "Network"}</label>
        {options.length > 0 ? (
          <select id="provider_code" name="provider_code" value={code} onChange={(e) => setCode(e.target.value)} className="input" required>
            <option value="">Choose</option>
            {options.map((o) => <option key={`${o.code}-${o.name}`} value={o.code}>{o.name}</option>)}
          </select>
        ) : (
          <>
            <input id="provider_code" name="provider_code" value={code} onChange={(e) => setCode(e.target.value)} className="input" placeholder="Bank code" required />
            <p className="mt-1 text-xs text-earth-soft">Bank list is loading or unavailable. You can type your bank code.</p>
          </>
        )}
      </div>
      <div>
        <label className="label" htmlFor="account_number">{effective === "bank" ? "Account number" : "Phone number (with country code)"}</label>
        <input id="account_number" name="account_number" inputMode="numeric" defaultValue={account?.account_number} placeholder={effective === "bank" ? "0123456789" : "233241234567"} className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="account_name">Name on the account</label>
        <input id="account_name" name="account_name" defaultValue={account?.account_name} className="input" required />
      </div>
      {state && <p className={`rounded-xl p-3 text-sm ${state.error ? "bg-terracotta-light text-terracotta-dark" : "bg-forest-light text-forest"}`}>{state.error ?? state.message}</p>}
      <SubmitButton>Save payout details</SubmitButton>
    </form>
  );
}
