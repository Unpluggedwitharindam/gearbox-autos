import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Headphones, Facebook, Instagram, MessageCircle, ShieldCheck } from "lucide-react";
import contactImg from "@/assets/contact-creta.png";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Gearbox Autos" }, { name: "description", content: "Get in touch with Gearbox Autos. We're here to help with your buying or selling journey." }]}),
  component: Contact,
});

function Contact() {
  return (
    <section className="container-page pt-32 pb-12">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="eyebrow">Contact us</div>
          <h1 className="display-h1 mt-4">We're Here to Help.<br/>Let's Talk<span className="text-primary">.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-md">Have questions or need assistance? We're just a call or message away. Reach out to us and we'll be happy to help you with your car buying or selling journey.</p>

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

        <div className="relative h-[480px] rounded-2xl overflow-hidden border border-border">
          <img src={contactImg} alt="Hyundai Creta at night" className="absolute inset-0 h-full w-full object-cover" />
        </div>
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
          <div className="text-sm text-muted-foreground">Follow us for the latest deals and updates</div>
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
