export type Country = { code: string; name: string; currency: string };

// All 54 African countries, plus countries with large African communities abroad.
export const AFRICAN_COUNTRIES: Country[] = [
  { code: "DZ", name: "Algeria", currency: "DZD" },
  { code: "AO", name: "Angola", currency: "AOA" },
  { code: "BJ", name: "Benin", currency: "XOF" },
  { code: "BW", name: "Botswana", currency: "BWP" },
  { code: "BF", name: "Burkina Faso", currency: "XOF" },
  { code: "BI", name: "Burundi", currency: "BIF" },
  { code: "CV", name: "Cape Verde", currency: "CVE" },
  { code: "CM", name: "Cameroon", currency: "XAF" },
  { code: "CF", name: "Central African Republic", currency: "XAF" },
  { code: "TD", name: "Chad", currency: "XAF" },
  { code: "KM", name: "Comoros", currency: "KMF" },
  { code: "CG", name: "Congo", currency: "XAF" },
  { code: "CD", name: "DR Congo", currency: "CDF" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF" },
  { code: "DJ", name: "Djibouti", currency: "DJF" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "GQ", name: "Equatorial Guinea", currency: "XAF" },
  { code: "ER", name: "Eritrea", currency: "ERN" },
  { code: "SZ", name: "Eswatini", currency: "SZL" },
  { code: "ET", name: "Ethiopia", currency: "ETB" },
  { code: "GA", name: "Gabon", currency: "XAF" },
  { code: "GM", name: "Gambia", currency: "GMD" },
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "GN", name: "Guinea", currency: "GNF" },
  { code: "GW", name: "Guinea-Bissau", currency: "XOF" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "LS", name: "Lesotho", currency: "LSL" },
  { code: "LR", name: "Liberia", currency: "LRD" },
  { code: "LY", name: "Libya", currency: "LYD" },
  { code: "MG", name: "Madagascar", currency: "MGA" },
  { code: "MW", name: "Malawi", currency: "MWK" },
  { code: "ML", name: "Mali", currency: "XOF" },
  { code: "MR", name: "Mauritania", currency: "MRU" },
  { code: "MU", name: "Mauritius", currency: "MUR" },
  { code: "MA", name: "Morocco", currency: "MAD" },
  { code: "MZ", name: "Mozambique", currency: "MZN" },
  { code: "NA", name: "Namibia", currency: "NAD" },
  { code: "NE", name: "Niger", currency: "XOF" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "RW", name: "Rwanda", currency: "RWF" },
  { code: "ST", name: "São Tomé and Príncipe", currency: "STN" },
  { code: "SN", name: "Senegal", currency: "XOF" },
  { code: "SC", name: "Seychelles", currency: "SCR" },
  { code: "SL", name: "Sierra Leone", currency: "SLE" },
  { code: "SO", name: "Somalia", currency: "SOS" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "SS", name: "South Sudan", currency: "SSP" },
  { code: "SD", name: "Sudan", currency: "SDG" },
  { code: "TZ", name: "Tanzania", currency: "TZS" },
  { code: "TG", name: "Togo", currency: "XOF" },
  { code: "TN", name: "Tunisia", currency: "TND" },
  { code: "UG", name: "Uganda", currency: "UGX" },
  { code: "ZM", name: "Zambia", currency: "ZMW" },
  { code: "ZW", name: "Zimbabwe", currency: "USD" },
];

export const DIASPORA_COUNTRIES: Country[] = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "IT", name: "Italy", currency: "EUR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "BE", name: "Belgium", currency: "EUR" },
  { code: "IE", name: "Ireland", currency: "EUR" },
  { code: "AE", name: "United Arab Emirates", currency: "AED" },
  { code: "AU", name: "Australia", currency: "AUD" },
];

export const ALL_COUNTRIES = [...AFRICAN_COUNTRIES, ...DIASPORA_COUNTRIES];

export function findCountry(code?: string | null): Country | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  return ALL_COUNTRIES.find((c) => c.code === upper);
}

export function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

export const COUNTRY_COOKIE = "sanaa_country";
