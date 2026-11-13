import { z } from "zod";
import { CATEGORY_SLUGS } from "@/config/categories";
import { ALL_COUNTRIES } from "@/lib/locale/countries";

const COUNTRY_CODES = ALL_COUNTRIES.map((c) => c.code) as [string, ...string[]];
const CURRENCIES = Array.from(new Set(ALL_COUNTRIES.map((c) => c.currency))) as [string, ...string[]];

/** Strip control characters and trim. Applied to every free-text field. */
const cleanText = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Keep it under ${max} characters`));

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-zA-Z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number");

export const nameSchema = cleanText(80).pipe(z.string().min(2, "Enter your full name"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(128),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  country: z.enum(COUNTRY_CODES, { errorMap: () => ({ message: "Choose your country" }) }),
  role: z.enum(["student", "teacher"]),
  terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms to continue" }) }),
});

export const forgotSchema = z.object({ email: emailSchema });

export const profileSchema = z.object({
  name: nameSchema,
  country: z.enum(COUNTRY_CODES, { errorMap: () => ({ message: "Choose your country" }) }),
  bio: cleanText(600).optional(),
});

export const passwordChangeSchema = z
  .object({ current: z.string().min(1, "Enter your current password"), next: passwordSchema, confirm: z.string() })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a star rating").max(5),
  body: cleanText(1000).pipe(z.string().min(10, "Tell others a little more (10+ characters)")),
});

export const courseDetailsSchema = z.object({
  title: cleanText(120).pipe(z.string().min(6, "Give your course a clear title")),
  subtitle: cleanText(160).pipe(z.string().min(6, "Add a short description")),
  description: cleanText(5000).pipe(z.string().min(40, "Describe your course in at least 40 characters")),
  category: z.enum(CATEGORY_SLUGS),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  currency: z.enum(CURRENCIES),
  price: z.coerce.number({ invalid_type_error: "Enter a price" }).min(0, "Price can't be negative").max(10_000_000),
  outcomes: z.array(cleanText(120)).max(12).transform((a) => a.filter(Boolean)),
});

export const lessonSchema = z.object({
  title: cleanText(120).pipe(z.string().min(3, "Give the lesson a title")),
  minutes: z.coerce.number().int().min(1, "At least 1 minute").max(240),
  preview: z.boolean(),
});

export const payoutSchema = z
  .object({
    method: z.enum(["mobile_money", "bank"]),
    country: z.enum(COUNTRY_CODES),
    provider: cleanText(80).pipe(z.string().min(2, "Choose your provider")),
    accountNumber: z.string().trim().regex(/^[0-9+ ]{6,20}$/, "Enter numbers only (6 to 20 digits)"),
    accountName: nameSchema,
  })
  .transform((v) => ({ ...v, accountNumber: v.accountNumber.replace(/[^0-9+]/g, "") }));

export const mobileMoneyPaymentSchema = z.object({
  phone: z.string().trim().regex(/^\+?[0-9 ]{9,16}$/, "Enter a valid phone number"),
});

export const cardPaymentSchema = z.object({
  number: z
    .string()
    .transform((s) => s.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^[0-9]{12,19}$/, "Enter a valid card number"))
    .refine(luhn, "Card number is not valid"),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY")
    .refine(notExpired, "This card has expired"),
  cvv: z.string().trim().regex(/^[0-9]{3,4}$/, "3 or 4 digits"),
  name: nameSchema,
});

export const searchQuerySchema = cleanText(80);

/** Map a ZodError to { field: message } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function luhn(num: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function notExpired(mmYY: string): boolean {
  const [mm, yy] = mmYY.split("/").map(Number);
  const end = new Date(2000 + yy!, mm!, 1);
  return end.getTime() > Date.now();
}
