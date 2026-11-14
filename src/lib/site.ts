export const site = {
  name: "Wolfgang e-Sports",
  shortName: "Wolfgang",
  legalName: "Wolfgang E-Sports (Pvt) Ltd",
  slogan: "Fight like a wolf",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wolfgangesports.com",
  description:
    "Wolfgang e-Sports is a Sri Lankan esports organisation. Its rosters have won 29+ championships across PUBG Mobile, Valorant, Dota 2, fighting games and more.",
  email: "support@wolfgangesports.com",
  location: "Sri Lanka",
  socials: {
    instagram: "https://www.instagram.com/wolfgangesports/",
    facebook: "https://www.facebook.com/wolfgangsl",
  },
  handles: {
    instagram: "@wolfgangesports",
    facebook: "facebook.com/wolfgangsl",
  },
};

export const nav: { href: string; label: string; soon?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/achievements", label: "Achievements" },
  { href: "/merch", label: "Merch", soon: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
