import type { NavColumn, NavItem, NavLink } from "./types";

const link = (label: string, href = "#"): NavLink => ({ label, href });

const column = (title: string, labels: string[]): NavColumn => ({
  title,
  href: "#",
  links: labels.map((label) => link(label)),
});

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Men",
    href: "#men",
    columns: [
      column("Topwear", ["T-Shirts", "Polo Shirts", "Casual Shirts", "Formal Shirts", "Sweatshirts", "Sweaters", "Jackets", "Blazers & Coats"]),
      column("Bottomwear", ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Track Pants & Joggers"]),
      column("Footwear", ["Casual Shoes", "Formal Shoes", "Sneakers", "Sandals & Floaters", "Flip Flops", "Socks"]),
      column("Innerwear", ["Briefs & Trunks", "Boxers", "Vests", "Loungewear", "Thermals"]),
      column("Accessories", ["Wallets", "Belts", "Caps & Hats", "Sunglasses", "Watches", "Bags & Backpacks"]),
    ],
  },
  {
    label: "Women",
    href: "#women",
    columns: [
      column("Western Wear", ["Dresses", "Tops & Tees", "Shirts", "Jeans", "Skirts", "Trousers", "Jackets & Coats"]),
      column("Ethnic Wear", ["Kurtas & Suits", "Sarees", "Lehengas", "Kurtis", "Dupattas"]),
      column("Footwear", ["Heels", "Flats", "Sneakers", "Sandals", "Wedges"]),
      column("Bags", ["Handbags", "Totes", "Backpacks", "Wallets", "Crossbody Bags"]),
      column("Accessories", ["Jewellery", "Sunglasses", "Watches", "Belts", "Scarves"]),
    ],
  },
  {
    label: "Kids",
    href: "#kids",
    columns: [
      column("Boys", ["T-Shirts", "Shirts", "Jeans", "Shorts", "Jackets", "Sweatshirts"]),
      column("Girls", ["Dresses", "Tops", "Jeans", "Skirts", "Jackets", "Sweatshirts"]),
      column("Infants", ["Rompers", "Bodysuits", "Sleepwear", "Baby Sets"]),
      column("Accessories", ["Bags", "Caps & Hats", "Belts", "Footwear"]),
    ],
  },
  {
    label: "Beauty",
    href: "#beauty",
    columns: [
      column("Makeup", ["Lipstick", "Foundation", "Kajal & Eyeliner", "Mascara", "Nail Polish"]),
      column("Skincare", ["Face Wash", "Moisturisers", "Sunscreen", "Serums", "Face Masks"]),
      column("Haircare", ["Shampoo", "Conditioner", "Hair Oil", "Styling"]),
      column("Bath & Body", ["Body Wash", "Body Lotion", "Hand Cream", "Deodorants"]),
    ],
  },
  {
    label: "Perfume",
    href: "#perfume",
    columns: [
      column("For Him", ["Eau de Parfum", "Eau de Toilette", "Body Mists", "Deodorants"]),
      column("For Her", ["Eau de Parfum", "Eau de Toilette", "Body Mists", "Roll-ons"]),
      column("Gift Sets", ["Men's Gift Sets", "Women's Gift Sets", "Travel Minis"]),
    ],
  },
];