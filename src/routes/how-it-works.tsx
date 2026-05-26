import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Users, MessagesSquare, Car as CarIcon, FileCheck, ShieldCheck, Handshake, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [{ title: "How It Works — Gearbox Autos" }, { name: "description", content: "Simple, transparent, fair. The Gearbox Autos process for buying and selling used cars." }]}),
  component: HowItWorks,
});

const steps = [
  { Icon: CalendarCheck, title: "Book a Test Drive", desc: "Browse cars and book a test drive at your convenience." },
  { Icon: Users, title: "Meet the Owner Directly", desc: "Meet the owner in person and inspect the car yourself." },
  { Icon: MessagesSquare, title: "Negotiate", desc: "Have an open conversation and negotiate the best deal directly with the owner." },
  { Icon: CarIcon, title: "Drive Home Your Car", desc: "Finalize the deal and drive home your dream car." },
  { Icon: FileCheck, title: "RC Transfer Made Easy", desc: "We help you with the RC transfer process seamlessly." },
];

function HowItWorks() {
  return (
    <section className="container-page pt-32 pb-12">
      <div className="eyebrow">How it works</div>
      <h1 className="display-h1 mt-4">The Gearbox Autos Process<span className="text-primary">.</span></h1>
      <p className="mt-5 text-muted-foreground max-w-2xl">We make buying and selling cars simple, transparent and fair for everyone.<br/>No hidden charges. No middlemen. Just great cars and honest deals.</p>

      <div className="mt-12 grid gap-5 md:grid-cols-5 relative">
        {steps.map((s, i) => (
          <div key={s.title} className="surface p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-background border border-primary text-primary text-sm grid place-items-center font-semibold">{i+1}</div>
            <s.Icon className="h-10 w-10 mx-auto text-foreground/80 mt-3" />
            <div className="font-semibold mt-4">{s.title}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="surface mt-8 p-8 grid md:grid-cols-2 gap-8">
        <div className="flex items-center gap-5">
          <ShieldCheck className="h-16 w-16 text-primary/80" />
          <div>
            <span className="inline-block text-xs text-primary border border-primary/40 rounded px-2 py-0.5 mb-2">For Car Buyers</span>
            <div className="text-xl font-semibold">100% Transparent.</div>
            <div className="text-xl text-primary font-semibold">0% Commission.</div>
            <p className="text-sm text-muted-foreground mt-2">You don't pay us anything. You only pay the RC transfer fees to the RTO.</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Handshake className="h-16 w-16 text-primary/80" />
          <div>
            <span className="inline-block text-xs text-primary border border-primary/40 rounded px-2 py-0.5 mb-2">For Car Sellers</span>
            <div className="text-xl font-semibold">We Keep It Fair.</div>
            <div className="text-xl text-primary font-semibold">Nominal Service Charge.</div>
            <p className="text-sm text-muted-foreground mt-2">We charge the seller a nominal service charge only after the deal is successfully closed.</p>
          </div>
        </div>
      </div>

      <div className="surface mt-6 p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <div className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Transparency is our promise.</div>
          <div className="text-sm text-muted-foreground">No hidden charges, no surprises. Just a better way to buy and sell used cars.</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm"><div className="font-semibold">Have questions?</div><div className="text-muted-foreground">We're here to help.</div></div>
          <Link to="/contact" className="btn-primary rounded-md px-4 py-2.5 text-sm font-semibold flex items-center gap-2">Contact Us <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
