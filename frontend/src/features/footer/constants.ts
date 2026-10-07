import { FaFacebookF, FaInstagram, FaThreads, FaTwitter, FaYoutube } from "react-icons/fa6";
import type { FooterGroup, FooterLink } from "./types";
import type { PanelName } from "@/shared/panels";

export const FOOTER_HEADING = "Stay in Style.";

export const FOOTER_TAGLINE =
  "Be the first to know about new arrivals, exclusive offers and style edits.";

export const FOOTER_NOTE =
  "Product colours may vary slightly due to screen settings. All prices are inclusive of taxes.";

const link = (label: string, href = "#"): FooterLink => ({ label, href });

const pageLink = (label: string): FooterLink => ({
  label,
  href: `/${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
});

const panelLink = (label: string, panel: PanelName): FooterLink => ({
  label,
  href: "#",
  panel,
});

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: "Shop",
    links: [link("Men"), link("Women"), link("Kids"), link("Beauty"), link("Perfume")],
  },
  {
    title: "Help",
    links: [
      pageLink("FAQs"),
      pageLink("Shipping"),
      pageLink("Returns"),
      pageLink("Track Order"),
      pageLink("Size Guide"),
    ],
  },
  {
    title: "Follow Us",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/",
        icon: FaInstagram,
        iconHover: "group-hover:text-pink-400",
        external: true,
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/",
        icon: FaFacebookF,
        iconHover: "group-hover:text-blue-400",
        external: true,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/",
        icon: FaYoutube,
        iconHover: "group-hover:text-red-500",
        external: true,
      },
      {
        label: "Twitter",
        href: "https://www.twitter.com/",
        icon: FaTwitter,
        iconHover: "group-hover:text-red-400",
        external: true,
      },
      {
        label: "Threads",
        href: "https://www.threads.com/",
        icon: FaThreads,
        iconHover: "group-hover:text-red-400",
        external: true,
      },
    ],
  },
  {
    title: "Account",
    links: [
      panelLink("Login / Sign Up", "auth"),
      panelLink("My Wishlist", "wishlist"),
      link("Shopping Bag", "/bag"),
      link("Contact Us"),
    ],
  },
  {
    title: "Company",
    links: [
      pageLink("About Us"),
      pageLink("Careers"),
      pageLink("Press"),
      pageLink("Store Locator"),
    ],
  },
  {
    title: "Legal",
    links: [
      pageLink("Terms & Conditions"),
      pageLink("Privacy Policy"),
      pageLink("Accessibility"),
      pageLink("Cookie Policy"),
    ],
  },
];