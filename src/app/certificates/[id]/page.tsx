import { Container } from "@/components/ui/Container";
import { CertificateView } from "@/components/certificate/CertificateView";

export const metadata = { title: "Certificate", robots: { index: false } };

export default function CertificatePage({ params }: { params: { id: string } }) {
  const id = /^[a-z0-9-]{1,64}$/i.test(params.id) ? params.id : "";
  return (
    <Container>
      <CertificateView id={id} />
    </Container>
  );
}
