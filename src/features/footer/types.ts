import type { IconType } from "react-icons";
import type { PanelName } from "@/shared/panels";

export type FooterLink = {
  label: string;
  href: string;
  icon?: IconType;
  iconHover?: string;
  external?: boolean;
  panel?: PanelName;
};

export type FooterGroup = { title: string; links: FooterLink[] };