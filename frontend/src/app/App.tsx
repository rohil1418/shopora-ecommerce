import { MotionConfig } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminGuard, AdminLayout } from "../features/admin";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import BagPage from "../pages/BagPage";
import CollectionPage from "../pages/CollectionPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductPage from "../pages/ProductPage";
import ScrollToTop from "../shared/components/ScrollToTop";
import { PanelProvider } from "../shared/panels";
import { AuthProvider, CartProvider, WishlistProvider } from "../shared/store";
import PanelHost from "./PanelHost";
import SiteLayout from "./SiteLayout";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminProductFormPage from "../pages/AdminProductFormPage";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PanelProvider>
                <Routes>
                  <Route element={<SiteLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/collections/:slug" element={<CollectionPage />} />
                    <Route path="/product/:uid" element={<ProductPage />} />
                    <Route path="/bag" element={<BagPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route path="/admin" element={<AdminGuard />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="products/new" element={<AdminProductFormPage />} />
                      <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                    </Route>
                  </Route>
                </Routes>
                <PanelHost />
              </PanelProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}