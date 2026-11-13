import { ProsePage } from "@/components/content/Prose";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <ProsePage eyebrow="Legal" title="Privacy Policy" intro="Last updated 1 November 2026. We collect as little as we can, and we never sell your data. This is a template and should be reviewed by a lawyer before launch.">
      <section><h2>What we collect</h2><ul><li>Account details: your name, email and country.</li><li>Learning activity: courses you buy and lessons you finish.</li><li>Teacher payout details, visible only to you and our payments team.</li></ul></section>
      <section><h2>What we don't collect</h2><p>We never see or store full card numbers. Payments are handled by our payment partner.</p></section>
      <section><h2>How we use it</h2><p>To run your account, show prices in your currency, process payments and payouts, and improve courses. We don't use advertising trackers.</p></section>
      <section><h2>Cookies</h2><p>We use one cookie to remember your country, and your browser's storage to keep you logged in and remember your preferences.</p></section>
      <section><h2>Your rights</h2><p>You can ask us to export or delete your data at any time by emailing hello@sanaa.africa. This policy is written to align with the Nigeria Data Protection Act, Kenya's Data Protection Act, South Africa's POPIA and the GDPR.</p></section>
    </ProsePage>
  );
}
