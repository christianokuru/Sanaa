import { Container } from "@/components/ui/Container";
import { WishlistView } from "@/components/library/WishlistView";

export const metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <Container className="pt-8 md:pt-12">
      <WishlistView />
    </Container>
  );
}
