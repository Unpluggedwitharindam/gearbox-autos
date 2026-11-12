import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  CarFront,
  Tag,
  Search,
  MapPin,
  ShieldCheck,
  Percent,
  Handshake,
  Wrench,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstallAppBanner } from "@/components/InstallAppBanner";
import { listPublicCars } from "@/lib/cars.functions";
import {
  filterHomepageCars,
  homepageBudgets,
  bodyTypes,
  type HomepageFilters,
} from "@/lib/homepage-inventory";
import { marketplaceAreas } from "@/lib/marketplace-areas";
import {
  MarketplaceHeader,
  MarketplaceCars,
  MarketplaceFaq,
  MarketplaceFooter,
} from "@/showcase/marketplace";
import { images } from "@/showcase/marketplace-assets";
import homeCss from "../homepage.css?url";
const carsQuery = queryOptions({ queryKey: ["cars", "public"], queryFn: () => listPublicCars() });
const faq = [
  [
    "Are the cars inspected before listing?",
    "Ask our team which inspections and document checks have been completed for your chosen car. Only a completed inspection supports a verified claim; you should also inspect the car and its records before buying.",
  ],
  [
    "Can I sell my car even if it has a loan?",
    "Share the loan details with our team. Any outstanding finance and lender requirements must be resolved as part of the sale; the team can help you understand the next steps.",
  ],
  [
    "Do you charge any commission from buyers?",
    "No. Buyers pay Gearbox Autos 0% commission. Applicable RC transfer fees are paid to the RTO. Sellers pay a nominal service charge only after a successful deal.",
  ],
  [
    "How do I book a car inspection or test drive?",
    "For a test drive, open the car listing and complete its booking form. To sell, submit your car details through Sell Your Car and our local team will coordinate the next steps.",
  ],
];
export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): HomepageFilters => ({
    q: typeof s.q === "string" ? s.q : undefined,
    budget: typeof s.budget === "string" ? s.budget : undefined,
    body: typeof s.body === "string" ? s.body : undefined,
    make: typeof s.make === "string" ? s.make : undefined,
    fuel: typeof s.fuel === "string" ? s.fuel : undefined,
    transmission: typeof s.transmission === "string" ? s.transmission : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(carsQuery),
  head: () => {
    const title = "Second Hand Cars in Jamshedpur — Buy & Sell | Gearbox Autos";
    const description =
      "Explore current second-hand cars in Jamshedpur, compare budgets, arrange a test drive or sell your car with local support and 0% buyer commission.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://gearboxautos.in/" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: "https://gearboxautos.in/" },
        { rel: "stylesheet", href: homeCss },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        },
      ],
    };
  },
  component: Index,
});
function Index() {
  const { data: cars } = useSuspenseQuery(carsQuery);
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(filters.q ?? "");
  const [budget, setBudget] = useState(filters.budget ?? "");
  const [body, setBody] = useState(filters.body ?? "");
  const results = filterHomepageCars(cars, filters);
  const filtering = Object.values(filters).some(Boolean);
  const displayed = filtering ? results : results.slice(0, 4);
  const apply = async (next: HomepageFilters) => {
    await navigate({ search: next, resetScroll: false });
    document.getElementById("latest-cars")?.scrollIntoView({ behavior: "instant", block: "start" });
  };
  return (
    <div className="homepage">
      <MarketplaceHeader />
      <section className="market-hero relative">
        <img
          src={images.hero}
          alt="Dark Hyundai SUV on a naturally lit road"
          width="858"
          height="249"
          fetchPriority="high"
          className="market-hero-photo absolute right-0 top-0 h-full object-cover"
        />
        <div className="container-page relative py-5 md:py-6">
          <div className="market-hero-copy">
            <span className="market-slash" />
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.1]">
              Second Hand Cars in
              <br className="hidden sm:block" /> Jamshedpur
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-lg">
              Buy or sell quality cars with trust, transparency and local support.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-w-[520px]">
              {(
                [
                  {
                    to: "/buy",
                    title: "Buy a Car",
                    text: "Explore second hand cars.",
                    Icon: CarFront,
                    image: images.buy,
                    buy: true,
                  },
                  {
                    to: "/sell",
                    title: "Sell Your Car",
                    text: "Get the best value for your car.",
                    Icon: Tag,
                    image: images.sell,
                    buy: false,
                  },
                ] as const
              ).map(({ to, title, text, Icon, image, buy }) => (
                <Link
                  to={to}
                  key={to}
                  className={`market-action relative overflow-hidden rounded-lg border border-border p-4 ${buy ? "bg-primary" : "bg-secondary"}`}
                >
                  <img
                    src={image}
                    alt=""
                    width="307"
                    height="246"
                    className="absolute right-0 bottom-0 h-full w-[46%] object-cover object-right"
                  />
                  <div className="relative w-[73%]">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold whitespace-nowrap">
                      <Icon className="size-5 shrink-0" />
                      {title}
                    </h2>
                    <p className="mt-2 text-xs max-w-32 leading-snug">{text}</p>
                    <span
                      className={`mt-3 inline-grid size-7 place-items-center rounded-full ${buy ? "bg-background" : "bg-primary"}`}
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="container-page">
        <form
          aria-label="Search cars"
          className="market-search relative bg-background border border-border rounded-lg p-3 grid gap-3 md:grid-cols-[1.7fr_1fr_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            void apply({ q: q || undefined, budget: budget || undefined, body: body || undefined });
          }}
        >
          <label className="relative">
            <Search className="absolute left-3 top-3 size-5" />
            <Input
              aria-label="Search by car, brand or model"
              placeholder="Search by Car, Brand or Model"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 pl-11 border-0 shadow-none"
            />
          </label>
          <label className="sr-only" htmlFor="home-budget">
            Budget
          </label>
          <select
            id="home-budget"
            className="market-select"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Any Budget</option>
            {homepageBudgets.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="home-body">
            Body type
          </label>
          <select
            id="home-body"
            className="market-select"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          >
            <option value="">All Body Types</option>
            {bodyTypes.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <Button type="submit" className="h-11 rounded-full px-7">
            Search Cars
            <ArrowRight />
          </Button>
        </form>
        <div className="py-5 grid lg:grid-cols-[auto_1fr] gap-4 items-center">
          <h2 className="font-bold text-sm">Find Second Hand Cars in Your Area</h2>
          <nav
            aria-label="Locality shortcuts"
            className="flex gap-2 overflow-x-auto pb-1 lg:justify-end"
          >
            {marketplaceAreas.slice(1, 7).map((a) => (
              <Link
                to={`/second-hand-cars-in-${a.slug}`}
                key={a.slug}
                className="flex items-center gap-2 shrink-0 border border-border rounded-full px-4 py-2 text-xs bg-background"
              >
                <MapPin className="size-3.5" />
                {a.name}
              </Link>
            ))}
          </nav>
        </div>
        <section id="latest-cars" className="scroll-mt-5 pb-9">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center mb-5">
            <h2 className="text-xl md:text-2xl font-extrabold">
              {filtering ? "Cars Matching Your Search" : "Latest Cars in Jamshedpur"}
            </h2>
            <Button asChild variant="link" size="sm">
              <Link to="/buy">
                View All Cars
                <ArrowRight />
              </Link>
            </Button>
          </div>
          {filtering && (
            <div role="status" className="flex gap-4 items-center mb-4 text-sm">
              {results.length} matching cars
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setQ("");
                  setBudget("");
                  setBody("");
                  void apply({});
                }}
              >
                Clear filters
                <XIcon />
              </Button>
            </div>
          )}
          {displayed.length ? (
            <MarketplaceCars cars={displayed} />
          ) : (
            <div className="py-8 text-center border-y border-border">
              <p>No matching cars currently listed.</p>
              <Button variant="link" onClick={() => void apply({})}>
                Browse all cars
              </Button>
            </div>
          )}
        </section>
        <section className="market-trust grid sm:grid-cols-2 lg:grid-cols-5 gap-5 bg-secondary py-6 px-5">
          <h2 className="text-xl font-extrabold leading-tight">
            <span className="market-slash" />
            Why Choose
            <br />
            Gearbox Autos?
          </h2>
          {[
            {
              Icon: ShieldCheck,
              title: "Inspection clarity",
              text: "Ask for completed checks on your chosen car.",
            },
            {
              Icon: Percent,
              title: "0% Buyer Commission",
              text: "No buyer commission. RTO fees apply.",
            },
            {
              Icon: Handshake,
              title: "Transparent Deals",
              text: "Direct owner conversations, clear terms.",
            },
            {
              Icon: MapPin,
              title: "Local Experts in Jamshedpur",
              text: "On-ground support from our Sonari team.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="lg:border-l border-border lg:pl-5">
              <Icon className="size-7 mb-2" strokeWidth={1.5} />
              <h3 className="font-bold text-sm leading-tight">{title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </section>
        <section className="py-7">
          <h2 className="market-heading">
            Browse by <mark>Budget</mark>
          </h2>
          <p className="text-xs text-muted-foreground mt-2 mb-4">
            Find second hand cars that fit your budget.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {homepageBudgets.map((b, i) => (
              <Button
                variant="secondary"
                key={b.value}
                className="market-category h-auto p-3 flex-col whitespace-normal"
                onClick={() => {
                  setBudget(b.value);
                  void apply({ budget: b.value });
                }}
              >
                <span className="text-sm font-bold">{b.label}</span>
                <img
                  src={images.budgets[i]}
                  alt=""
                  width="294"
                  height="118"
                  loading="lazy"
                  className="w-full h-20 object-contain mt-2"
                />
              </Button>
            ))}
          </div>
        </section>
        <section className="pb-7">
          <h2 className="market-heading">
            Browse by <mark>Body Type</mark>
          </h2>
          <p className="text-xs text-muted-foreground mt-2 mb-4">
            Explore cars by your preferred body style.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {bodyTypes.map((b, i) => (
              <Button
                variant="secondary"
                key={b}
                className="market-category h-auto p-3 flex-col"
                onClick={() => {
                  setBody(b);
                  void apply({ body: b });
                }}
              >
                <img
                  src={images.bodies[i]}
                  alt=""
                  width="294"
                  height="93"
                  loading="lazy"
                  className="w-full h-16 object-contain"
                />
                <span className="text-sm font-bold mt-2">{b}</span>
              </Button>
            ))}
          </div>
        </section>
        <section className="market-club relative overflow-hidden bg-foreground text-background p-6">
          <img
            src={images.club}
            alt=""
            width="745"
            height="124"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)_auto] gap-5 items-center">
            <div>
              <h2 className="text-2xl font-extrabold">
                <span className="market-slash" />
                GBX
                <br />
                Motor Club
              </h2>
              <p className="text-xs mt-2">
                A community for car owners
                <br />
                in Jamshedpur.
              </p>
            </div>
            {[
              { Icon: Wrench, text: "Free car health check-up", note: "Every six months" },
              { Icon: Settings, text: "Servicing & detailing benefits", note: "" },
              { Icon: ShieldCheck, text: "Insurance, PUC & RC assistance", note: "" },
              { Icon: Users, text: "Member-only deals & events", note: "" },
            ].map(({ Icon, text, note }) => (
              <div key={text} className="text-xs lg:border-l border-background/25 lg:pl-4">
                <Icon className="size-6 mb-2" />
                <p>{text}</p>
                {note && <p className="mt-1 opacity-75">{note}</p>}
              </div>
            ))}
            <Button asChild size="sm" className="rounded-full">
              <Link to="/gbx-motor-club">
                Become a Member
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
        <section className="py-7">
          <h2 className="market-heading mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Buying a Second Hand Car",
                Icon: CarFront,
                steps: [
                  "Search & choose your car",
                  "Inspect & get details",
                  "Complete the deal with support",
                ],
                buy: true,
              },
              {
                title: "Selling Your Car",
                Icon: Tag,
                steps: [
                  "Share your car details",
                  "Get a fair valuation",
                  "Sell with local support",
                ],
                buy: false,
              },
            ].map((g) => (
              <div key={g.title} className={`p-5 ${g.buy ? "bg-primary/15" : "bg-secondary"}`}>
                <h3 className="font-bold flex items-center gap-2 text-base">
                  <g.Icon className="size-7 bg-primary p-1 rounded-md" />
                  {g.title}
                </h3>
                <ol className="grid grid-cols-3 gap-4 mt-5">
                  {g.steps.map((s, i) => (
                    <li key={s} className="text-center text-xs leading-relaxed">
                      <span className="inline-grid place-items-center bg-primary size-6 rounded-full font-bold mb-2">
                        {i + 1}
                      </span>
                      <p>{s}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Sellers pay a nominal service charge after a successful deal.{" "}
            <Link to="/how-it-works" className="underline">
              See the full process
            </Link>
            .
          </p>
        </section>
        <section className="pb-7">
          <h2 className="market-heading">What Our Customers Say</h2>
          <div className="mt-4 py-5 border-y border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Verified customer reviews will appear here when available.
            </p>
            <Button asChild variant="link">
              <Link to="/contact">
                Share your experience
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
        <section className="pb-7">
          <h2 className="market-heading mb-5">Frequently Asked Questions</h2>
          <MarketplaceFaq items={faq} />
        </section>
        <section className="market-final relative overflow-hidden bg-foreground text-background p-6 md:p-8">
          <img
            src={images.cta}
            alt=""
            width="735"
            height="124"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="market-slash" />
              <h2 className="text-xl md:text-2xl font-bold max-w-md">
                Ready to Buy or Sell a Second Hand Car in Jamshedpur?
              </h2>
              <p className="mt-2 text-sm">Get started with Gearbox Autos today.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to="/buy">
                  <CarFront />
                  Buy a Car
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent text-background border-background rounded-full hover:bg-background hover:text-foreground"
              >
                <Link to="/sell">
                  <Tag />
                  Sell Your Car
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <div className="mt-6">
          <InstallAppBanner />
        </div>
      </div>
      <MarketplaceFooter />
    </div>
  );
}
function XIcon() {
  return <span aria-hidden="true">×</span>;
}
