import "server-only";

const BASE = "https://api.flutterwave.com/v3";

export const hasFlutterwave = Boolean(process.env.FLW_SECRET_KEY);

async function flw<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { status?: string; message?: string; data?: unknown };
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || `Flutterwave error ${res.status}`);
  }
  return json.data as T;
}

// Which payment methods to offer, by currency.
const PAYMENT_OPTIONS: Record<string, string> = {
  NGN: "card,banktransfer,ussd,account",
  GHS: "card,mobilemoneyghana",
  KES: "card,mpesa",
  UGX: "card,mobilemoneyuganda",
  TZS: "card,mobilemoneytanzania",
  RWF: "card,mobilemoneyrwanda",
  ZMW: "card,mobilemoneyzambia",
  XAF: "card,mobilemoneyfranco",
  XOF: "card,mobilemoneyfranco",
  ZAR: "card,banktransfer",
  EGP: "card",
  MWK: "card,mobilemoneymalawi",
  ETB: "card,mobilemoneyethiopia",
};

export async function createPaymentLink(input: {
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  email: string;
  name: string;
  title: string;
  meta: Record<string, string>;
}): Promise<string> {
  const data = await flw<{ link: string }>("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: input.currency,
      redirect_url: input.redirectUrl,
      payment_options: PAYMENT_OPTIONS[input.currency] ?? "card",
      customer: { email: input.email, name: input.name },
      customizations: { title: "Sanaa", description: input.title },
      meta: input.meta,
    }),
  });
  return data.link;
}

export type VerifiedTransaction = {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  currency: string;
};

export function verifyTransaction(transactionId: string | number) {
  return flw<VerifiedTransaction>(`/transactions/${encodeURIComponent(String(transactionId))}/verify`);
}

export function getBanks(country: string) {
  return flw<{ id: number; code: string; name: string }[]>(`/banks/${encodeURIComponent(country)}`);
}

export function createTransfer(input: {
  accountBank: string;
  accountNumber: string;
  amount: number;
  currency: string;
  reference: string;
  narration: string;
  beneficiaryName: string;
}) {
  return flw<{ id: number; status: string }>("/transfers", {
    method: "POST",
    body: JSON.stringify({
      account_bank: input.accountBank,
      account_number: input.accountNumber,
      amount: input.amount,
      currency: input.currency,
      reference: input.reference,
      narration: input.narration,
      beneficiary_name: input.beneficiaryName,
      debit_currency: input.currency,
    }),
  });
}
