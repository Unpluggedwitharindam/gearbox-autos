import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, Camera, FileCheck, PhoneCall, ShieldCheck, Users } from "lucide-react";
import { NEARBY_AREAS } from "@/lib/seo-areas";
import { sellerPricingHeading, sellerPricingBands, sellerPricingExample, sellerPricingSummary } from "@/showcase/seller-pricing";

export const Route = createFileRoute("/sell-car-jamshedpur")({
  head: () => ({
    meta: [
      { title: "Seller Assistance Fees & Selling Guide — Jamshedpur | Gearbox Autos" },
      { name: "description", content: `Understand selling a used car in Jamshedpur. ${sellerPricingSummary}` },
      { property: "og:title", content: "Sell Your Car in Jamshedpur — Gearbox Autos" },
      { property: "og:description", content: sellerPricingSummary },
      { property: "og:url", content: "https://gearboxautos.in/sell-car-jamshedpur" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/sell-car-jamshedpur" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to sell your car in Jamshedpur",
        description: "Discuss listing, meet buyers, and complete the sale with RC transfer assistance.",
        step: steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.text,
          url: `https://gearboxautos.in/sell-car-jamshedpur#step-${index + 1}`,
        })),
      }),
    }],
  }),

  component: SellCarJamshedpur,
});

const steps = [
  { icon: PhoneCall, title: "Share your car details", text: "Fill the listing form or WhatsApp us your car's model, year, KMs and photos." },
  { icon: Camera, title: "Discuss listing and assistance", text: "Ask our team about listing your car and review the seller assistance fee schedule." },
  { icon: Users, title: "Meet genuine buyers", text: "Buyers contact you directly — no brokers, no lowball dealer offers." },
  { icon: FileCheck, title: "We help close & transfer", text: "We assist with the sale paperwork and RC transfer at the Jamshedpur (JH-05) RTO." },
];

function SellCarJamshedpur() {
  return (
    <section className="container-page pt-12 pb-16">
      <div className="eyebrow">Sell in Jamshedpur</div>
      <h1 className="display-h1 mt-4">
        Sell your car in <span className="text-primary">Jamshedpur</span>
      </h1>
      <p className="mt-5 text-muted-foreground max-w-2xl leading-relaxed">
        Gearbox Autos helps car owners in Jamshedpur with seller assistance.
        Fees are based on the final vehicle selling price. Review the fee schedule before submitting an enquiry.
      </p>
      <div className="mt-6 max-w-2xl border-y border-border py-5">
        <h2 className="text-lg font-semibold">{sellerPricingHeading}</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm">
          {sellerPricingBands.map((band) => <li key={band}>{band}</li>)}
        </ul>
        <p className="mt-3 text-sm">{sellerPricingExample}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/sell" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
          Submit your car details <ArrowRight className="h-4 w-4" />
        </Link>
        <a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" className="border border-border hover:border-primary px-10 py-4 font-head text-lg tracking-wide transition-all">
          WhatsApp your car details
        </a>
      </div>

      <div className="mt-16">
        <h2 className="display-h2">How it <span className="text-primary">works</span></h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div id={`step-${i + 1}`} key={s.title} className="bg-card p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between mb-4">
                <s.icon className="h-6 w-6 text-primary" />
                <span className="font-head text-3xl text-muted-foreground/40">{i + 1}</span>
              </div>
              <h3 className="font-head text-xl">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        <div className="bg-card p-6">
          <BadgePercent className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-head text-xl">Seller assistance pricing</h3>
          <p className="text-sm text-muted-foreground mt-2">Fees are based on the final vehicle selling price. See the fee schedule above.</p>
        </div>
        <div className="bg-card p-6">
          <ShieldCheck className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-head text-xl">Buyer enquiries</h3>
          <p className="text-sm text-muted-foreground mt-2">Discuss buyer enquiries and meeting arrangements with our team.</p>
        </div>
        <div className="bg-card p-6">
          <FileCheck className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-head text-xl">RC transfer done right</h3>
          <p className="text-sm text-muted-foreground mt-2">We guide the ownership transfer at the JH-05 RTO so there's no liability left on you.</p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="display-h2">Selling from outside <span className="text-primary">Jamshedpur?</span></h2>
        <p className="mt-4 text-muted-foreground max-w-2xl">We regularly work with sellers across the region:</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEARBY_AREAS.map((a) => (
            <div key={a.name} className="bg-card p-6">
              <div className="font-head text-xl">{a.name}</div>
              <p className="text-sm text-muted-foreground mt-2">{a.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
