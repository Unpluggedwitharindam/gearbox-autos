import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Headphones, Facebook, Instagram, MessageCircle, ShieldCheck, User, ArrowRight } from "lucide-react";
import contactImg from "@/assets/car-amaze-black.jpg";
import { submitContact } from "@/lib/leads.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Gearbox Autos" }, { name: "description", content: "Get in touch with Gearbox Autos. We're here to help with your buying or selling journey." }]}),
  component: Contact,
});

function Contact() {
  const empty = { full_name: "", phone: "", email: "", subject: "", message: "" };
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof empty) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const mut = useMutation({
    mutationFn: () => submitContact({ data: form }),
    onSuccess: () => { toast.success("Message sent! We'll get back to you soon."); setForm(empty); },
    onError: (e: Error) => toast.error(e.message || "Failed to send"),
  });

  return (
    <section className="container-page pt-32 pb-12">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="eyebrow">Contact us</div>
          <h1 className="display-h1 mt-4">We're Here to Help.<br/>Let's Talk<span className="text-primary">.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-md">Have questions or need assistance? We're just a call or message away.</p>

          <div className="mt-8 space-y-4 max-w-md">
            {[
              { Icon: Phone, label: "Phone", value: "+91 90655 91253" },
              { Icon: Mail, label: "Email", value: "gearboxautotechgbat@gmail.com" },
              { Icon: MapPin, label: "Address", value: "4/9 Awas Tower, Sonari, Jamshedpur" },
            ].map((r) => (
              <div key={r.label} className="surface p-4 flex items-center gap-4">
                <r.Icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">{r.label}</div>
                  <div className="font-medium">{r.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-md">
            <div className="font-semibold">We're Available</div>
            <div className="mt-2 flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" /> Mon – Sat: 10:00 AM – 7:00 PM</div>
            <div className="text-sm text-muted-foreground ml-6">Sunday: Closed</div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="surface p-6 space-y-4">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <Row icon={User} placeholder="Full name" value={form.full_name} onChange={set("full_name")} required />
          <Row icon={Mail} type="email" placeholder="Email" value={form.email} onChange={set("email")} required />
          <Row icon={Phone} placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} />
          <Row icon={MessageCircle} placeholder="Subject" value={form.subject} onChange={set("subject")} />
          <label className="block">
            <textarea required rows={5} placeholder="Your message" value={form.message} onChange={set("message")} className="w-full rounded-md bg-input/60 border border-border/60 px-3 py-2.5 text-sm outline-none" />
          </label>
          <button disabled={mut.isPending} className="btn-primary w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {mut.isPending ? "Sending…" : <>Send Message <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>

      <div className="surface mt-10 p-6 grid md:grid-cols-2 gap-6 items-center">
        <div className="flex items-center gap-4">
          <Headphones className="h-10 w-10 text-primary" />
          <div>
            <div className="font-semibold">Your Trust Drives Us.</div>
            <div className="text-sm text-muted-foreground">At Gearbox Autos, transparency and honesty drive everything we do.</div>
          </div>
        </div>
        <div className="flex md:justify-end items-center gap-6">
          <div className="text-sm text-muted-foreground">Follow us for the latest deals</div>
          <div className="flex items-center gap-2">
            {[Facebook, Instagram, MessageCircle].map((I, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-border grid place-items-center hover:border-primary hover:text-primary">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="surface mt-6 p-5 flex items-center gap-4">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <div>
          <div className="font-semibold">100% Transparent. 0% Commission.</div>
          <div className="text-sm text-muted-foreground">No hidden charges. No surprises. Just great cars and honest deals.</div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon: Icon, ...p }: any) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input {...p} className="bg-transparent outline-none text-sm flex-1" />
    </div>
  );
}
