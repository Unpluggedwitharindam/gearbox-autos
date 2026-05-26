import { createFileRoute } from "@tanstack/react-router";
import { Eye, Handshake, ShieldCheck, MapPin, Car as CarIcon, CarFront, Users } from "lucide-react";
import aboutImg from "@/assets/about-jsr.png";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — Gearbox Autos" }, { name: "description", content: "Driven by trust. Built on transparency. Gearbox Autos is a used car marketplace based out of Jamshedpur." }]}),
  component: About,
});

function About() {
  return (
    <section className="relative">
      <div className="container-page pt-32 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="eyebrow">About us</div>
          <h1 className="display-h1 mt-4">Driven by Trust.<br/>Built on Transparency<span className="text-primary">.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-md">Gearbox Autos is a used car marketplace based out of Jamshedpur, India. We connect buyers and sellers directly, making car transactions simple, transparent and hassle-free.</p>
          <div className="mt-8 inline-flex items-center gap-2 surface px-4 py-3 text-sm"><MapPin className="h-4 w-4 text-primary" /> Proudly Based in Jamshedpur, India</div>
        </div>
        <div className="relative h-[380px] rounded-2xl overflow-hidden border border-border">
          <img src={aboutImg} alt="Jamshedpur skyline" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>

      <div className="container-page mt-16 grid lg:grid-cols-4 gap-10">
        <div>
          <div className="eyebrow">Our Mission</div>
          <p className="mt-4 text-sm text-muted-foreground">To create a trustworthy and transparent platform for buying and selling used cars, where people deal directly and drive away happy.</p>
        </div>
        {[
          { Icon: Eye, title: "Transparency First", desc: "We believe in complete transparency at every step. No hidden fees, no surprises." },
          { Icon: Handshake, title: "Direct & Fair Deals", desc: "Buyers meet sellers directly, ensuring fair negotiations and the best prices." },
          { Icon: ShieldCheck, title: "Simple & Hassle-Free", desc: "From test drive to RC transfer, we make the process smooth, safe and stress-free." },
        ].map((b) => (
          <div key={b.title}>
            <b.Icon className="h-9 w-9 text-primary" />
            <div className="mt-3 font-semibold">{b.title}</div>
            <p className="text-sm text-muted-foreground mt-2">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="container-page mt-12">
        <div className="surface p-6">
          <div className="eyebrow mb-6">Gearbox Autos in Numbers</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: CarFront, n: "1000+", l: "Happy Customers" },
              { Icon: CarIcon, n: "500+", l: "Cars Sold" },
              { Icon: Handshake, n: "98%", l: "Positive Feedback" },
              { Icon: MapPin, n: "1", l: "City We Call Home — Jamshedpur" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-4">
                <s.Icon className="h-10 w-10 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page mt-10 text-center">
        <p className="text-foreground">At Gearbox Autos, we don't just sell cars, we build relationships.</p>
        <p className="text-primary font-semibold mt-1">Thank you, Jamshedpur, for trusting us.</p>
      </div>
    </section>
  );
}
