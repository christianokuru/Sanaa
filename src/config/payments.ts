/** Mobile money networks shown at checkout, by country. */
export const MOBILE_MONEY_NETWORKS: Record<string, string[]> = {
  KE: ["M-Pesa", "Airtel Money"],
  GH: ["MTN MoMo", "Telecel Cash", "AirtelTigo Money"],
  UG: ["MTN MoMo", "Airtel Money"],
  TZ: ["M-Pesa", "Tigo Pesa", "Airtel Money"],
  RW: ["MTN MoMo", "Airtel Money"],
  ZM: ["MTN MoMo", "Airtel Money"],
  MW: ["Airtel Money", "TNM Mpamba"],
  CM: ["MTN MoMo", "Orange Money"],
  CI: ["Orange Money", "MTN MoMo", "Moov Money"],
  SN: ["Orange Money", "Wave", "Free Money"],
  BF: ["Orange Money", "Moov Money"],
  ML: ["Orange Money", "Moov Money"],
  BJ: ["MTN MoMo", "Moov Money"],
  TG: ["Moov Money", "T-Money"],
  ET: ["telebirr"],
};

/** Payout providers teachers can choose. */
export const PAYOUT_BANKS: Record<string, string[]> = {
  NG: ["Access Bank", "GTBank", "First Bank", "Zenith Bank", "UBA", "Kuda", "Opay", "Moniepoint"],
  GH: ["GCB Bank", "Ecobank", "Stanbic", "Fidelity Bank"],
  KE: ["Equity Bank", "KCB", "Co-operative Bank", "NCBA"],
  ZA: ["FNB", "Standard Bank", "Absa", "Capitec", "Nedbank"],
  UG: ["Stanbic", "Centenary Bank", "dfcu"],
  TZ: ["CRDB", "NMB"],
  RW: ["Bank of Kigali", "Equity Rwanda"],
};

export function payoutCountries(): string[] {
  return Array.from(new Set([...Object.keys(MOBILE_MONEY_NETWORKS), ...Object.keys(PAYOUT_BANKS)]));
}
