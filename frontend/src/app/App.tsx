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
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import OrdersPage from "../pages/OrdersPage";
import InfoPage from "@/features/info/InfoPage";
import { INFO_PAGES } from "@/features/info/infoPages";
import ContactPage from "@/features/info/ContactPage";

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
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    {INFO_PAGES.map((p) => (
                      <Route key={p.path} path={p.path} element={<InfoPage page={p} />} />
                    ))}
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route path="/admin" element={<AdminGuard />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="products/new" element={<AdminProductFormPage />} />
                      <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
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