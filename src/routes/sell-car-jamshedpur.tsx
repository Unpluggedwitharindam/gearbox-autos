import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, Camera, FileCheck, PhoneCall, ShieldCheck, Users } from "lucide-react";
import { NEARBY_AREAS } from "@/lib/seo-areas";

export const Route = createFileRoute("/sell-car-jamshedpur")({
  head: () => ({
    meta: [
      { title: "Sell Your Car in Jamshedpur — Free Listing, 0% Commission | Gearbox Autos" },
      { name: "description", content: "Sell your used car in Jamshedpur fast and at the best price. Free listing, genuine verified buyers, 0% commission and free JH-05 RC transfer help from Gearbox Autos, Sonari." },
      { property: "og:title", content: "Sell Your Car in Jamshedpur — Gearbox Autos" },
      { property: "og:description", content: "List your car free, meet verified buyers directly and pay 0% commission." },
      { property: "og:url", content: "https://gearboxautos.in/sell-car-jamshedpur" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/sell-car-jamshedpur" }],
  }),

  component: SellCarJamshedpur,
});

const steps = [
  { icon: PhoneCall, title: "Share your car details", text: "Fill the listing form or WhatsApp us your car's model, year, KMs and photos." },
  { icon: Camera, title: "We verify & list it free", text: "We inspect the car, verify documents and publish it to buyers across Jamshedpur." },
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
        Gearbox Autos helps car owners in Jamshedpur sell directly to verified local buyers — with a{" "}
        <strong className="text-foreground">free listing</strong>,{" "}
        <strong className="text-foreground">0% commission</strong> and full paperwork support. You keep 100% of the
        sale price.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/sell" className="btn-primary px-10 py-4 inline-flex items-center gap-2">
          List your car free <ArrowRight className="h-4 w-4" />
        </Link>
        <a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" className="border border-border hover:border-primary px-10 py-4 font-head text-lg tracking-wide transition-all">
          WhatsApp your car details
        </a>
      </div>

      <div className="mt-16">
        <h2 className="display-h2">How it <span className="text-primary">works</span></h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-card p-6 border-l-4 border-primary">
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
          <h3 className="font-head text-xl">0% commission, forever</h3>
          <p className="text-sm text-muted-foreground mt-2">Dealers typically take 5–10% off your price. With us, the buyer's offer is your price.</p>
        </div>
        <div className="bg-card p-6">
          <ShieldCheck className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-head text-xl">Verified buyers only</h3>
          <p className="text-sm text-muted-foreground mt-2">We screen enquiries so you spend time only with serious, genuine buyers.</p>
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
