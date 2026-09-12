export const SITE_URL = "https://gearboxautos.in";

export const DEALER_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${SITE_URL}/#dealership`,
  name: "Gearbox Autos",
  url: SITE_URL,
  telephone: "+91-90655-91253",
  email: "gearboxautotechgbat@gmail.com",
  priceRange: "₹₹",
  image: `${SITE_URL}/favicon.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Golden Town, opposite BSS School, Adarsh Nagar, Sonari",
    addressLocality: "Jamshedpur",
    addressRegion: "Jharkhand",
    postalCode: "831011",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Jamshedpur" },
    { "@type": "City", name: "Adityapur" },
    { "@type": "City", name: "Ghatshila" },
    { "@type": "City", name: "Chaibasa" },
    { "@type": "AdministrativeArea", name: "Saraikela-Kharsawan" },
  ],
  sameAs: ["https://www.instagram.com/gearbox_autos_usedcars/"],
};

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}