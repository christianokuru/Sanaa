"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Segmented, SelectField, TextField } from "@/components/ui/Field";
import { StatTile } from "@/components/ui/StatTile";
import { EditorTopBar } from "@/components/teach/EditorTopBar";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { useLocale } from "@/components/locale/LocaleProvider";
import { MOBILE_MONEY_NETWORKS, PAYOUT_BANKS, payoutCountries } from "@/config/payments";
import { findCountry } from "@/lib/locale/countries";
import { formatCash, rateFor } from "@/lib/locale/currency";
import { useTeacherStats } from "@/lib/hooks/use-teacher-stats";
import { useAppStore } from "@/lib/store/app-store";
import { savePayoutAccount } from "@/lib/services/teaching";
import { toast } from "@/lib/services/toast";
import { formatDate } from "@/lib/utils/format";
import { useShallow } from "zustand/react/shallow";

type Method = "mobile_money" | "bank";

export function PayoutsView() {
  const user = useRequiredUser();
  const stats = useTeacherStats(user);
  const { rates } = useLocale();
  const saved = useAppStore((s) => s.payoutAccounts[user.id]);
  const history = useAppStore(useShallow((s) => s.payouts.filter((p) => p.userId === user.id)));
  const countries = payoutCountries().map((c) => findCountry(c)!).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  const startCountry = saved?.country ?? (countries.some((c) => c.code === user.country) ? user.country : "NG");
  const [country, setCountry] = useState(startCountry);
  const hasMomo = Boolean(MOBILE_MONEY_NETWORKS[country]);
  const hasBank = Boolean(PAYOUT_BANKS[country]);
  const [method, setMethod] = useState<Method>(saved?.method ?? (hasMomo ? "mobile_money" : "bank"));
  const effective: Method = method === "mobile_money" && !hasMomo ? "bank" : method === "bank" && !hasBank ? "mobile_money" : method;
  const providers = (effective === "mobile_money" ? MOBILE_MONEY_NETWORKS[country] : PAYOUT_BANKS[country]) ?? [];
  const [provider, setProvider] = useState(saved?.provider ?? "");
  const [accountNumber, setAccountNumber] = useState(saved?.accountNumber ?? "");
  const [accountName, setAccountName] = useState(saved?.accountName ?? user.name);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currency = findCountry(country)?.currency ?? "USD";
  const money = (usd: number, cur = currency) => formatCash(Math.floor(usd * rateFor(cur, rates)), cur);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = savePayoutAccount(user.id, { method: effective, country, provider: providers.includes(provider) ? provider : "", accountNumber, accountName });
    if (!res.ok) return setErrors(res.fields ?? {});
    setErrors({});
    toast("Payout details saved", { tone: "success" });
  }

  return (
    <div className="pb-12">
      <EditorTopBar title="Payouts" />
      <div className="grid grid-cols-2 gap-3 md:max-w-xl">
        <StatTile label="Ready to pay out" value={money(stats.balanceUsd)} tone="ink" />
        <StatTile label="Paid to you so far" value={money(stats.paidOutUsd)} />
      </div>
      <p className="mt-3 text-body text-ink-soft">Payouts are sent every Friday when your balance is above $10.</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="payout-form">
          <h2 id="payout-form" className="text-section font-semibold">Where should we send your money?</h2>
          <form onSubmit={submit} noValidate className="mt-6 space-y-5">
            <SelectField label="Country" value={country} onChange={(e) => { setCountry(e.target.value); setProvider(""); }}>
              {countries.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
            </SelectField>
            <Segmented
              label="Payout method"
              value={effective}
              onChange={(m) => { setMethod(m); setProvider(""); }}
              options={[
                ...(hasMomo ? [{ value: "mobile_money" as const, label: "Mobile money" }] : []),
                ...(hasBank ? [{ value: "bank" as const, label: "Bank account" }] : []),
              ]}
            />
            <SelectField label={effective === "bank" ? "Bank" : "Network"} value={provider} onChange={(e) => setProvider(e.target.value)} error={errors.provider}>
              <option value="">Choose</option>
              {providers.map((p) => <option key={p}>{p}</option>)}
            </SelectField>
            <TextField
              label={effective === "bank" ? "Account number" : "Phone number"}
              inputMode="numeric"
              placeholder={effective === "bank" ? "0123456789" : "e.g. 254712345678"}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={errors.accountNumber}
              maxLength={20}
            />
            <TextField label="Name on the account" value={accountName} onChange={(e) => setAccountName(e.target.value)} error={errors.accountName} maxLength={80} />
            <Button type="submit" variant="dark">Save payout details</Button>
            <p className="flex items-center gap-2 text-caption text-ink-soft"><ShieldCheck className="h-4 w-4 text-malachite" /> Only you and the Sanaa payments team can see these details.</p>
          </form>
        </section>

        <section aria-labelledby="history">
          <h2 id="history" className="text-section font-semibold">Payout history</h2>
          <ul className="mt-6 divide-y divide-line rounded-card border border-line">
            {history.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                <span>
                  <span className="block text-ui font-semibold">{formatCash(p.amount, p.currency)}</span>
                  <span className="text-caption text-ink-soft">{formatDate(p.createdAt)}</span>
                </span>
                <Badge tone={p.status === "paid" ? "malachite" : p.status === "failed" ? "ember" : "saffron"} className="capitalize">{p.status}</Badge>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 p-4">
              <span>
                <span className="block text-ui font-semibold">{money(stats.paidOutUsd - history.reduce((s, p) => s + p.amountUsd, 0))}</span>
                <span className="text-caption text-ink-soft">Earlier payouts</span>
              </span>
              <Badge tone="malachite">Paid</Badge>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
