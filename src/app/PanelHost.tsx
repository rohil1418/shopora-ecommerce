import { AuthModal } from "@/features/auth";
import { CartDrawer } from "@/features/cart";
import { SearchPanel } from "@/features/search";
import { WishlistDrawer } from "@/features/wishlist";
import { usePanels } from "@/shared/panels";

export default function PanelHost() {
  const { activePanel, closePanel } = usePanels();

  return (
    <>
      <SearchPanel isOpen={activePanel === "search"} onClose={closePanel} />
      <AuthModal isOpen={activePanel === "auth"} onClose={closePanel} />
      <WishlistDrawer isOpen={activePanel === "wishlist"} onClose={closePanel} />
      <CartDrawer isOpen={activePanel === "cart"} onClose={closePanel} />
    </>
  );
}