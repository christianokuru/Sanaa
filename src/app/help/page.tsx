import { ChevronDown } from "lucide-react";
import { ProsePage } from "@/components/content/Prose";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Help Centre", description: "Answers about payments, mobile money, currencies, certificates, teaching and payouts on Sanaa.", alternates: { canonical: "/help" } };

const FAQ: Array<{ id: string; group: string; q: string; a: string }> = [
  { id: "payments", group: "Learning", q: "How can I pay?", a: "Mobile money (M-Pesa, MTN MoMo, Airtel Money, Orange Money and more), debit or credit card, and bank transfer where available. Payments are processed securely by our payment partner. Sanaa never sees or stores your card number." },
  { id: "currency", group: "Learning", q: "Why is the price in my currency?", a: "We detect your country and convert each teacher's price at today's exchange rate, rounded to a friendly number. You can change your country at any time from the flag at the top of the page." },
  { id: "access", group: "Learning", q: "How long do I keep a course?", a: "For life. Once you buy a course you can watch it again whenever you need." },
  { id: "data", group: "Learning", q: "How do I save data?", a: "Turn on Data saver in the video player or in your account settings. Videos then play in lower quality, which uses much less data." },
  { id: "certificate", group: "Learning", q: "How do I get a certificate?", a: "Finish every lesson in a course. Your certificate appears in My learning and has a link anyone can open to check it is real." },
  { id: "refunds", group: "Learning", q: "Can I get a refund?", a: "If a course is not what was described, contact us within 14 days of buying and before you finish half the lessons, and we'll refund you." },
  { id: "teach", group: "Teaching", q: "Who can teach on Sanaa?", a: "Anyone with a real, practical skill and the patience to teach it. Every course is reviewed by our team before it goes live." },
  { id: "payouts", group: "Teaching", q: "How do payouts work?", a: "You keep 80% of every sale. Your balance is sent to your mobile money or bank account in your own currency. Add your payout details in your teacher dashboard." },
  { id: "price", group: "Teaching", q: "How should I price my course?", a: "Price in your own currency. Look at similar courses in your category, and remember that learners in other countries see a converted price. Free courses are a great way to win your first reviews." },
  { id: "safety", group: "Safety", q: "Is it safe to pay a teacher directly?", a: "No. Always pay through Sanaa. Payments made outside Sanaa aren't protected and can't be refunded. Report anyone who asks you to pay them directly." },
  { id: "account", group: "Safety", q: "How do you protect my account?", a: "Passwords are never stored in plain text, repeated wrong passwords lock the account for a few minutes, and the whole site runs over an encrypted connection." },
];

export default function HelpPage() {
  const groups = Array.from(new Set(FAQ.map((f) => f.group)));
  return (
    <ProsePage eyebrow="Help Centre" title="How can we help?" intro={`Quick answers to common questions. Still stuck? Email us at ${siteConfig.supportEmail}.`}>
      {groups.map((group) => (
        <section key={group} aria-labelledby={`g-${group}`}>
          <h2 id={`g-${group}`}>{group}</h2>
          <div className="divide-y divide-line rounded-2xl border border-line">
            {FAQ.filter((f) => f.group === group).map((f) => (
              <details key={f.id} id={f.id} className="group scroll-mt-28">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </ProsePage>
  );
}
