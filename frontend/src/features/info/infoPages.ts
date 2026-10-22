export interface InfoSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface InfoPageData {
  path: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  cta?: { label: string; to: string };
  accordion?: boolean;
}

export const INFO_PAGES: InfoPageData[] = [
  {
    path: "/help/faqs",
    title: "Frequently Asked Questions",
    accordion: true,
    intro: "Quick answers to the questions we hear most often.",
    sections: [
      {
        heading: "How do I place an order?",
        paragraphs: [
          "Add your favourite items to the bag, choose a delivery address and select a payment method. You can pay online or choose Cash on Delivery.",
        ],
      },
      {
        heading: "Which payment methods do you accept?",
        bullets: ["UPI, cards and net banking via Razorpay", "Cash on Delivery (COD)"],
      },
      {
        heading: "Can I change or cancel my order?",
        paragraphs: [
          "You can cancel an order from the My Orders page before it is shipped. Once shipped, you can return it after delivery as per our return policy.",
        ],
      },
      {
        heading: "How do I use a coupon?",
        paragraphs: [
          "Enter the coupon code in the Coupons box on the bag page and tap Apply. The discount is shown in your price details.",
        ],
      },
    ],
  },
  {
    path: "/help/shipping",
    title: "Shipping Information",
    intro: "Everything you need to know about how your order reaches you.",
    sections: [
      {
        heading: "Delivery time",
        paragraphs: [
          "Most orders are delivered within 3 to 7 business days, depending on your pincode. The expected delivery date is shown on the bag page.",
        ],
      },
      {
        heading: "Shipping charges",
        paragraphs: [
          "Delivery charges, if any, are shown in the price details before you place the order. A small platform fee applies to every order.",
        ],
      },
      {
        heading: "Delivery coverage",
        paragraphs: [
          "Enter your pincode on the bag page to check whether we deliver to your area.",
        ],
      },
    ],
  },
  {
    path: "/help/returns",
    title: "Returns & Refunds",
    intro: "Not happy with your purchase? We make returns simple.",
    sections: [
      {
        heading: "7-day return policy",
        paragraphs: [
          "You can request a return within 7 days of delivery. Items must be unused, unwashed and have their original tags and packaging.",
        ],
      },
      {
        heading: "How refunds work",
        bullets: [
          "Online payments are refunded to the original payment method.",
          "For Cash on Delivery orders, refunds are processed to your bank account or UPI.",
          "Refunds usually reflect within 5 to 7 business days after the item reaches us.",
        ],
      },
      {
        heading: "Non-returnable items",
        paragraphs: [
          "For hygiene reasons, beauty products and perfumes cannot be returned once opened.",
        ],
      },
    ],
  },
  {
    path: "/help/track-order",
    title: "Track Your Order",
    intro: "Check where your order is, anytime.",
    sections: [
      {
        heading: "How to track",
        bullets: [
          "Login to your Shopora account.",
          "Open My Orders from your profile.",
          "Select the order to see its current status.",
        ],
      },
      {
        heading: "Order statuses",
        bullets: ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      },
    ],
    cta: { label: "Go to My Orders", to: "/orders" },
  },
  {
    path: "/help/size-guide",
    title: "Size Guide",
    intro: "Find the right fit before you order.",
    sections: [
      {
        heading: "How to measure",
        bullets: [
          "Chest: measure around the fullest part of your chest.",
          "Waist: measure around your natural waistline.",
          "Hip: measure around the fullest part of your hips.",
        ],
      },
      {
        heading: "Kids sizing",
        paragraphs: [
          "Kids sizes are based on age (for example 8-9Y). If your child is between sizes, we recommend choosing the larger size.",
        ],
      },
      {
        heading: "Still unsure?",
        paragraphs: [
          "Check the size chart on the product page, or look at the product description for fit details.",
        ],
      },
    ],
  },

  {
    path: "/company/about",
    title: "About Us",
    intro: "Shopora is an online fashion and lifestyle store built to make shopping simple.",
    sections: [
      {
        heading: "Our story",
        paragraphs: [
          "We started Shopora with one idea: great style should be easy to find and easy to afford. From men's and women's fashion to kids, beauty and perfume, everything is in one place.",
        ],
      },
      {
        heading: "What we value",
        bullets: [
          "Quality products from trusted sellers",
          "Fair prices and honest discounts",
          "Fast delivery and easy returns",
        ],
      },
    ],
  },
  {
    path: "/company/careers",
    title: "Careers",
    intro: "Help us build the future of online shopping.",
    sections: [
      {
        heading: "Work with us",
        paragraphs: [
          "We are always looking for curious, hardworking people in engineering, design, marketing and customer support.",
        ],
      },
      {
        heading: "Open positions",
        paragraphs: [
          "There are no open positions right now. Please check back soon.",
        ],
      },
    ],
  },
  {
    path: "/company/press",
    title: "Press",
    intro: "News and media information about Shopora.",
    sections: [
      {
        heading: "Media enquiries",
        paragraphs: [
          "For interviews, brand assets or press-related questions, please reach out to our team and we will get back to you.",
        ],
      },
      {
        heading: "Latest news",
        paragraphs: ["No press releases yet. Stay tuned for updates."],
      },
    ],
  },
  {
    path: "/company/store-locator",
    title: "Store Locator",
    intro: "Find a Shopora store near you.",
    sections: [
      {
        heading: "Online first",
        paragraphs: [
          "Shopora is currently an online-only store, so there are no physical stores yet. You can shop anytime from the website and get products delivered to your door.",
        ],
      },
      {
        heading: "Coming soon",
        paragraphs: ["We plan to open experience stores in the future. Stay tuned."],
      },
    ],
  },

  {
    path: "/legal/terms",
    title: "Terms & Conditions",
    intro: "Please read these terms carefully before using Shopora.",
    sections: [
      {
        heading: "Use of the website",
        paragraphs: [
          "By using Shopora you agree to use the website lawfully and to provide accurate information when creating an account or placing an order.",
        ],
      },
      {
        heading: "Orders and pricing",
        paragraphs: [
          "All prices are in INR and may change without notice. We may cancel an order in case of a pricing error or lack of stock, and any payment made will be refunded.",
        ],
      },
      {
        heading: "Account security",
        paragraphs: [
          "You are responsible for keeping your login details safe and for all activity under your account.",
        ],
      },
    ],
  },
  {
    path: "/legal/privacy",
    title: "Privacy Policy",
    intro: "Your privacy matters to us. This page explains how we handle your data.",
    sections: [
      {
        heading: "Information we collect",
        bullets: [
          "Account details such as name, email and phone number",
          "Delivery addresses",
          "Order history",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We use your information to process orders, deliver products, provide support and improve the shopping experience. We do not sell your personal data.",
        ],
      },
      {
        heading: "Payments",
        paragraphs: [
          "Online payments are handled by Razorpay. We never store your card or UPI details on our servers.",
        ],
      },
    ],
  },
  {
    path: "/legal/accessibility",
    title: "Accessibility",
    intro: "We want Shopora to be usable by everyone.",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "We work to make our website easy to use with a keyboard and screen readers, with readable text and clear colour contrast.",
        ],
      },
      {
        heading: "Feedback",
        paragraphs: [
          "If you face any difficulty using the website, please contact us and we will work on improving it.",
        ],
      },
    ],
  },
  {
    path: "/legal/cookies",
    title: "Cookie Policy",
    intro: "How Shopora uses cookies and similar technologies.",
    sections: [
      {
        heading: "What are cookies?",
        paragraphs: [
          "Cookies are small files stored on your device that help a website remember you.",
        ],
      },
      {
        heading: "How we use them",
        bullets: [
          "Keeping you logged in",
          "Remembering the items in your bag and wishlist",
          "Understanding how the website is used",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can clear or block cookies from your browser settings. Some features may not work properly without them.",
        ],
      },
    ],
  },
];