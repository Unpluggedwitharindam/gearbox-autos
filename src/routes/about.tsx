import { createFileRoute } from "@tanstack/react-router";
import { Eye, Handshake, ShieldCheck, MapPin, Car as CarIcon, CarFront, Users } from "lucide-react";
import aboutImg from "@/assets/hero-bmw-x5.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Gearbox Autos — Trusted Used Car Marketplace in Jamshedpur" },
      { name: "description", content: "Gearbox Autos is a Jamshedpur-based used car marketplace connecting buyers and sellers directly with transparent, zero-commission deals." },
      { property: "og:title", content: "About Gearbox Autos — Jamshedpur" },
      { property: "og:description", content: "Driven by trust, built on transparency — used cars in Jamshedpur." },
      { property: "og:url", content: "https://gearboxautos.in/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/about" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Gearbox Autos",
        url: "https://gearboxautos.in/about",
        about: { "@id": "https://gearboxautos.in/#dealership" },
      }),
    }],
  }),

  component: About,
});

const teamMembers = [
  {
    name: "Arindam Banerjee",
    role: "Head of Marketing",
    initials: "AB",
  },
  {
    name: "Vivek Kumar",
    role: "Head of Sales",
    initials: "VK",
  },
  {
    name: "Ayush Sablok",
    role: "Head of Finance",
    initials: "AS",
  },
  {
    name: "Anish Sablok",
    role: "Head of Operations",
    initials: "AS",
  },
];

function About() {
  return (
    <section className="relative">
      <div className="container-page pt-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="eyebrow">About us</div>
          <h1 className="display-h1 mt-4">Driven by Trust.<br /> Built on Transparency<span className="text-primary">.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-md">Gearbox Autos is a used car marketplace based out of Jamshedpur, India. We connect buyers and sellers directly, making car transactions simple, transparent and hassle-free.</p>
          <div className="mt-8 inline-flex items-center gap-2 surface px-4 py-3 text-sm"><MapPin className="h-4 w-4 text-primary" /> Proudly Based in Jamshedpur, India</div>
        </div>
        <div className="relative h-[380px] rounded-none overflow-hidden border border-border">
          <img src={aboutImg} alt="Gearbox Autos showroom car in Jamshedpur" className="absolute inset-0 h-full w-full object-cover" />
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

      {/* Leadership Team */}
      <div className="container-page mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="eyebrow">Our Team</div>
            <h2 className="display-h2 mt-2">The Leadership <span className="text-primary">Team</span></h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            The dedicated team driving transparency, fair deals, and seamless car ownership at Gearbox Autos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="surface p-6 flex flex-col justify-between group hover:border-primary/60 transition-all duration-300 border-l-4 border-l-primary/40 hover:border-l-primary"
            >
              <div>
                <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 text-primary font-head text-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {member.initials}
                </div>
                <h3 className="font-head text-xl tracking-wide text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mt-1.5">
                  {member.role}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <span>Gearbox Autos</span>
                <span className="text-primary">●</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-16">
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
