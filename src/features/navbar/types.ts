export type NavLink = { label: string; href: string };

export type NavColumn = {
  title: string;
  href: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
};