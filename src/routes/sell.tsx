import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Phone, MapPin, Car as CarIcon, Calendar, Gauge, ArrowRight, ChevronDown, Mail } from "lucide-react";
import sellBg from "@/assets/sell-bg.png";
import { submitSellLead } from "@/lib/leads.functions";

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
  const empty = { full_name: "", phone: "", email: "", city: "", car_model: "", year: "", km: "" };
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof empty) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const mut = useMutation({
    mutationFn: () =>
      submitSellLead({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          car_model: form.car_model,
          year: form.year ? Number(form.year) : undefined,
          km: form.km ? Number(form.km) : undefined,
        },
      }),
    onSuccess: () => { toast.success("Thanks! Our team will reach out soon."); setForm(empty); },
    onError: (e: Error) => toast.error(e.message || "Submission failed"),
  });

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

        <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="surface p-8 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Tell us about your car</h2>
            <p className="text-muted-foreground"><span className="text-foreground">We'll handle the rest.</span></p>
            <div className="mt-2 h-0.5 w-12 bg-primary" />
          </div>
          <Field label="Full Name"><Input required icon={User} placeholder="Enter your full name" value={form.full_name} onChange={set("full_name")} /></Field>
          <Field label="Phone Number"><Input required icon={Phone} placeholder="Enter your 10 digit mobile number" value={form.phone} onChange={set("phone")} /></Field>
          <Field label="Email Address"><Input icon={Mail} type="email" placeholder="Enter your email address" value={form.email} onChange={set("email")} /></Field>
          <Field label="City"><Input required icon={MapPin} placeholder="Enter your city" value={form.city} onChange={set("city")} /></Field>
          <Field label="Which car are you looking to sell?"><Input required icon={CarIcon} placeholder="Enter car make & model" value={form.car_model} onChange={set("car_model")} /></Field>
          <Field label="Year of Registration">
            <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select value={form.year} onChange={set("year")} className="bg-transparent outline-none text-sm flex-1 text-muted-foreground">
                <option value="">Select year of registration</option>
                {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => <option key={y} value={y} className="bg-background">{y}</option>)}
              </select>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Field>
          <Field label="Approx. KM Driven"><Input icon={Gauge} type="number" placeholder="Enter approximate kilometers" value={form.km} onChange={set("km")} /></Field>
          <button disabled={mut.isPending} className="btn-primary w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {mut.isPending ? "Submitting…" : <>Submit Details <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-xs text-muted-foreground text-center">🔒 Your information is safe with us and will never be shared.</p>
        </form>
      </div>
    </section>
  );
}
