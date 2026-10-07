import { MotionConfig } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "../features/footer";
import { Navbar } from "../features/navbar";
import BagPage from "../pages/BagPage";
import CollectionPage from "../pages/CollectionPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductPage from "../pages/ProductPage";
import ScrollToTop from "../shared/components/ScrollToTop";
import { PanelProvider } from "../shared/panels";
import { CartProvider, WishlistProvider } from "../shared/store";
import PanelHost from "./PanelHost";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <CartProvider>
          <WishlistProvider>
            <PanelProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/product/:uid" element={<ProductPage />} />
                <Route path="/bag" element={<BagPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Footer />
              <PanelHost />
            </PanelProvider>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}