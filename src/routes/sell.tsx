import { createFileRoute } from "@tanstack/react-router";
import { User, Phone, MapPin, Car as CarIcon, Calendar, Gauge, ArrowRight, ChevronDown } from "lucide-react";
import sellBg from "@/assets/sell-bg.png";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Sell Your Car — Gearbox Autos" }, { name: "description", content: "Get the best value for your car. Fill in the details and our experts will get in touch." }]}),
  component: Sell,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function Input({ icon: Icon, ...p }: any) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input {...p} className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
    </div>
  );
}

function Sell() {
  return (
    <section className="relative min-h-screen">
      <img src={sellBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      <div className="relative container-page pt-32 pb-20 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="eyebrow">Sell your car</div>
          <h1 className="display-h1 mt-4">Get the best value <br/>for your car<span className="text-primary">.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-md">Fill in the details below and our experts will get in touch with you for the best offer.</p>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
            {[
              ["0% Commission","You keep 100% of your money."],
              ["No Hidden Charges","What you see is what you get."],
              ["Quick & Hassle Free","Smooth process from start to finish."],
              ["Best Market Value","Get the most competitive offer."],
            ].map(([t,d]) => (
              <div key={t}>
                <div className="h-8 w-8 rounded-full border border-primary/40 grid place-items-center text-primary text-xs mb-2">★</div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground mt-1">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="surface p-8 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Tell us about your car</h2>
            <p className="text-muted-foreground"><span className="text-foreground">We'll handle the rest.</span></p>
            <div className="mt-2 h-0.5 w-12 bg-primary" />
          </div>
          <Field label="Full Name"><Input icon={User} placeholder="Enter your full name" /></Field>
          <Field label="Phone Number"><Input icon={Phone} placeholder="Enter your 10 digit mobile number" /></Field>
          <Field label="Email Address"><Input icon={User} placeholder="Enter your email address" /></Field>
          <Field label="City"><Input icon={MapPin} placeholder="Enter your city" /></Field>
          <Field label="Which car are you looking to sell?"><Input icon={CarIcon} placeholder="Enter car make & model" /></Field>
          <Field label="Year of Registration">
            <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select className="bg-transparent outline-none text-sm flex-1 text-muted-foreground">
                <option>Select year of registration</option>
                {Array.from({ length: 20 }, (_, i) => 2025 - i).map((y) => <option key={y} className="bg-background">{y}</option>)}
              </select>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Field>
          <Field label="Approx. KM Driven"><Input icon={Gauge} placeholder="Enter approximate kilometers" /></Field>
          <button className="btn-primary w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2">
            Submit Details <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground text-center">🔒 Your information is safe with us and will never be shared.</p>
        </form>
      </div>
    </section>
  );
}
