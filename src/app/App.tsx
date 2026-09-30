import { MotionConfig } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "../features/footer";
import { Navbar } from "../features/navbar";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ScrollToTop from "../shared/components/ScrollToTop";
import { PanelProvider } from "../shared/panels";
import PanelHost from "./PanelHost";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <PanelProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <PanelHost />
        </PanelProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}