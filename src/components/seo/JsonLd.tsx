import { headers } from "next/headers";

/** Structured data for search engines. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const nonce = headers().get("x-nonce") ?? undefined;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: json }} />;
}
