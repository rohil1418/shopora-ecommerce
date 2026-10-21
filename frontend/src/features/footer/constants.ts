import { FaFacebookF, FaInstagram, FaThreads, FaTwitter, FaYoutube } from "react-icons/fa6";
import type { FooterGroup, FooterLink } from "./types";
import type { PanelName } from "@/shared/panels";

export const FOOTER_HEADING = "Stay in Style.";

export const FOOTER_TAGLINE =
  "Be the first to know about new arrivals, exclusive offers and style edits.";

export const FOOTER_NOTE =
  "Product colours may vary slightly due to screen settings. All prices are inclusive of taxes.";

const link = (label: string, href = "#"): FooterLink => ({ label, href });

const pageLink = (label: string, href: string): FooterLink => ({ label, href });

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
      pageLink("FAQs", "/help/faqs"),
      pageLink("Shipping", "/help/shipping"),
      pageLink("Returns", "/help/returns"),
      pageLink("Track Order", "/help/track-order"),
      pageLink("Size Guide", "/help/size-guide"),
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
      link("Contact Us", "/contact"),
    ],
  },
  {
    title: "Company",
    links: [
      pageLink("About Us", "/company/about"),
      pageLink("Careers", "/company/careers"),
      pageLink("Press", "/company/press"),
      pageLink("Store Locator", "/company/store-locator"),
    ],
  },
  {
    title: "Legal",
    links: [
      pageLink("Terms & Conditions", "/legal/terms"),
      pageLink("Privacy Policy", "/legal/privacy"),
      pageLink("Accessibility", "/legal/accessibility"),
      pageLink("Cookie Policy", "/legal/cookies"),
    ],
  },
];