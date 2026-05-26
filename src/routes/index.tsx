import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, Tag } from "lucide-react";
import hero from "@/assets/hero-bmw-x5.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gearbox Autos — Buy & Sell Used Cars at 0% Commission" },
      { name: "description", content: "Jamshedpur's trusted used car marketplace. Drive home your dream car at 0% commission with no hidden charges." },
      { property: "og:title", content: "Gearbox Autos — Drive home your dream car at 0% Commission" },
      { property: "og:description", content: "Buy and sell quality used cars with full transparency." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <section className="relative min-h-screen">
      <img src={hero} alt="Land Rover Defender at sunset" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative container-page pt-44 pb-32 min-h-screen flex flex-col justify-between">
        <div className="max-w-2xl">
          <h1 className="display-h1 text-foreground">
            Drive home <br /> your dream car at <br />
            <span className="text-muted-foreground">0% Commission</span> <br />
            and no hidden charges<span className="text-primary">.</span>
          </h1>
          <div className="mt-8 h-px w-24 bg-border" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
          <CTA to="/buy" eyebrow="Find your drive" title="Buy a Used Car" Icon={Car} />
          <CTA to="/sell" eyebrow="Get the best value" title="Sell Your Car" Icon={Tag} />
        </div>
      </div>
    </section>
  );
}

function CTA({ to, eyebrow, title, Icon }: { to: string; eyebrow: string; title: string; Icon: any }) {
  return (
    <Link to={to} className="surface flex items-center gap-4 px-5 py-4 hover:border-primary/60 transition group">
      <div className="h-12 w-12 rounded-full border border-border grid place-items-center text-foreground/80">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="eyebrow">{eyebrow}</div>
        <div className="text-lg font-semibold mt-0.5">{title}</div>
      </div>
      <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition" />
    </Link>
  );
}
