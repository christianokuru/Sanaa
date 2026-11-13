// Mobile money networks Flutterwave can send payouts to.
// Confirm codes in the Flutterwave transfer docs before going live.
export const MOBILE_MONEY: Record<string, { code: string; name: string }[]> = {
  GH: [
    { code: "MTN", name: "MTN Mobile Money" },
    { code: "VODAFONE", name: "Telecel (Vodafone) Cash" },
    { code: "TIGO", name: "AirtelTigo Money" },
  ],
  KE: [{ code: "MPS", name: "M-Pesa" }],
  UG: [{ code: "MPS", name: "MTN / Airtel Mobile Money" }],
  TZ: [{ code: "MPS", name: "M-Pesa / Tigo Pesa / Airtel" }],
  RW: [{ code: "MPS", name: "MTN / Airtel Mobile Money" }],
  ZM: [{ code: "MPS", name: "MTN / Airtel Mobile Money" }],
  CM: [{ code: "FMM", name: "MTN / Orange Money" }],
  CI: [{ code: "FMM", name: "Orange / MTN / Moov Money" }],
  SN: [{ code: "FMM", name: "Orange Money / Free Money" }],
};

// Countries where Flutterwave can pay out to a bank account.
export const BANK_COUNTRIES = ["NG", "GH", "KE", "UG", "TZ", "ZA", "RW", "ZM", "MW", "SL"];
