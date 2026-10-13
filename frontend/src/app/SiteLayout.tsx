import { Outlet } from "react-router-dom";
import { Footer } from "../features/footer";
import { Navbar } from "../features/navbar";

export default function SiteLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}