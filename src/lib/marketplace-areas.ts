export const marketplaceAreas = [
  {
    slug: "jamshedpur",
    name: "Jamshedpur",
    intro:
      "Compare second-hand cars across the city with a local team based in Sonari. Start with your budget, then check ownership, maintenance records and the actual condition before arranging a test drive.",
    advice:
      "For a mix of city journeys and longer trips, compare fuel costs, ground clearance and rear-seat comfort. The right car is the one that fits your regular journeys, not just its asking price.",
  },
  {
    slug: "bistupur",
    name: "Bistupur",
    intro:
      "Looking for a used car for daily trips around Bistupur? Compare compact cars and automatic options alongside larger family vehicles in our current Jamshedpur inventory.",
    advice:
      "Check visibility, low-speed steering and parking ease on your test drive. Ask about clutch condition for a manual car and service history for an automatic before discussing the deal.",
  },
  {
    slug: "sonari",
    name: "Sonari",
    intro:
      "Gearbox Autos is based near Golden Town, opposite BSS School, Adarsh Nagar in Sonari. Contact the team to confirm where your shortlisted car can be inspected before travelling.",
    advice:
      "A nearby team makes it easier to ask questions in person. Bring your shortlist and check the RC, insurance validity, ownership history and maintenance records together.",
  },
  {
    slug: "kadma",
    name: "Kadma",
    intro:
      "Compare used cars for everyday journeys from Kadma, from affordable hatchbacks to roomier SUVs. Our listings show asking prices, kilometres, fuel and transmission so you can shortlist before a visit.",
    advice:
      "Consider passenger comfort and boot space as well as your parking space. Check the tyres, suspension and air conditioning during an inspection rather than relying on photographs alone.",
  },
  {
    slug: "sakchi",
    name: "Sakchi",
    intro:
      "Find a second-hand car for trips around Sakchi and across Jamshedpur. Browse the live collection and speak with the local team about viewing a car and meeting its owner.",
    advice:
      "For stop-start journeys, test the brakes, clutch and gearbox carefully. An automatic may suit frequent traffic, but compare its maintenance history and running costs against a manual.",
  },
  {
    slug: "mango",
    name: "Mango",
    intro:
      "Shortlist cars for commuting from Mango and family travel beyond the city. Compare live listings by budget and model, then arrange a viewing with Gearbox Autos.",
    advice:
      "Think about your usual passenger count and commute distance. Check cooling performance, seat comfort and fuel type, and ask to see service records before negotiating.",
  },
  {
    slug: "adityapur",
    name: "Adityapur",
    intro:
      "Explore second-hand cars available to buyers in Adityapur through our Jamshedpur team. Listing locations are shown as recorded; a car on this page is not necessarily parked in Adityapur.",
    advice:
      "For a regular work commute, compare reliability and maintenance costs rather than only features. Confirm the registered owner and ask the team which documents are needed for the applicable RC transfer.",
  },
  {
    slug: "telco",
    name: "Telco",
    intro:
      "Browse second-hand cars for journeys from Telco and family trips around Jamshedpur. Use the current inventory to compare asking prices and arrange an inspection before making a commitment.",
    advice:
      "If your journeys include longer drives, test highway comfort where safe and agreed with the owner. Look at tyre age, braking, service intervals and rear-seat space as part of your shortlist.",
  },
] as const;
export function localityFaq(name: string) {
  return [
    [
      `Are all these cars located in ${name}?`,
      "No. These are current Gearbox Autos listings from Jamshedpur and nearby areas. Each car shows its recorded location. Contact us to confirm the viewing address and availability.",
    ],
    [
      `How can I book a test drive from ${name}?`,
      "Open a car listing and use its existing test-drive form. Share your preferred date and contact details so the team can coordinate a visit.",
    ],
    [
      "What should I check before buying?",
      "Check the RC, owner details, insurance, service history, kilometres and vehicle condition. Ask which inspections have been completed for the specific car; verification is not a blanket guarantee.",
    ],
    [
      "Do buyers pay commission?",
      "Gearbox Autos charges buyers 0% commission. Applicable RC transfer charges are paid to the RTO. Sellers pay a nominal service charge after a successful deal.",
    ],
  ];
}
