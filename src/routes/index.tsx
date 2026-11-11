import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Search, MapPin, Phone, MessageCircle, Menu, X, Users, FileCheck, Handshake, Check, CarFront, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Logo } from '@/components/Logo';
import { InstallAppBanner } from '@/components/InstallAppBanner';
import { listPublicCars } from '@/lib/cars.functions';
import { filterHomepageCars, homepageBudgets, inventoryMake, type HomepageFilters } from '@/lib/homepage-inventory';
import showroom from '@/assets/showroom-hero.jpg.asset.json';
import homeCss from '../homepage.css?url';

const carsQuery = queryOptions({ queryKey: ['cars', 'public'], queryFn: () => listPublicCars() });
const navigation = [
  { to: '/buy', label: 'Buy a Car' }, { to: '/sell', label: 'Sell Your Car' },
  { to: '/how-it-works', label: 'How It Works' }, { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' },
] as const;
const faq = [
  ['Do buyers pay a commission?', 'No. Gearbox Autos charges buyers 0% commission. You negotiate directly with the owner. Applicable RC transfer fees are paid to the RTO.'],
  ['Can I inspect the car and meet its owner?', 'Yes. Our process includes meeting the owner in person and inspecting the car yourself. Contact our Jamshedpur team to arrange a visit before you decide.'],
  ['How do I book a test drive in Jamshedpur?', 'Open a car listing and use its test-drive booking form. Share your contact details and preferred date, and our team will help coordinate the visit.'],
  ['Do you help with RC transfer?', 'Yes. Our team assists with sale paperwork and the RC transfer process. The applicable transfer fees are payable to the RTO; ask the team about the documents required for your car.'],
  ['What is the process and charge for selling my car?', 'Share your car and contact details through the Sell Your Car form. Our team gets in touch, verifies the car and documents, and helps connect you with buyers. As explained on our How It Works page, sellers pay a nominal service charge only after a successful deal. Confirm the charge with our team before proceeding.'],
  ['Where is Gearbox Autos located?', 'Visit us near Golden Town, opposite BSS School, Adarsh Nagar, Sonari, Jamshedpur, Jharkhand 831011. Call +91 90655 91253 to plan your visit.'],
];

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomepageFilters => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    budget: typeof search.budget === 'string' ? search.budget : undefined,
    make: typeof search.make === 'string' ? search.make : undefined,
    fuel: typeof search.fuel === 'string' ? search.fuel : undefined,
    transmission: typeof search.transmission === 'string' ? search.transmission : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(carsQuery),
  head: ({ loaderData }) => {
    const photo = loaderData?.find(car => car.image)?.image;
    const title = 'Used Cars in Jamshedpur — Buy & Sell | Gearbox Autos';
    const description = 'Find your next used car in Jamshedpur with 0% buyer commission. Browse current cars, meet owners directly, book a test drive or sell with our Sonari team.';
    return {
      meta: [
        { title }, { name: 'description', content: description },
        { property: 'og:title', content: title }, { property: 'og:description', content: description },
        { property: 'og:url', content: 'https://gearboxautos.in/' }, { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        ...(photo?.startsWith('https://') ? [{ property: 'og:image', content: photo }, { name: 'twitter:image', content: photo }] : []),
      ],
      links: [{ rel: 'canonical', href: 'https://gearboxautos.in/' }, { rel: 'stylesheet', href: homeCss }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Gearbox Autos', url: 'https://gearboxautos.in' }) }],
    };
  },
  errorComponent: () => <div className="container-page py-20"><h1 className="text-3xl">Cars could not be loaded</h1><p className="my-4">Please check your connection and try again.</p><Button asChild><Link to="/">Try again</Link></Button></div>,
  notFoundComponent: () => <div className="container-page py-20">Page not found. <Link to="/">Return home</Link></div>,
  component: Index,
});

function Index() {
  const { data: cars } = useSuspenseQuery(carsQuery);
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState(filters.q ?? '');
  const [budget, setBudget] = useState(filters.budget ?? '');
  const heroCar = cars.find(car => car.image);
  const results = filterHomepageCars(cars, filters);
  const filtering = Object.values(filters).some(Boolean);
  const displayed = filtering ? results : results.slice(0, 6);
  const makes = [...new Set(cars.map(inventoryMake).filter(Boolean))].sort();
  const transmissions = [...new Set(cars.map(car => car.transmission.toLowerCase()).filter(Boolean))].map(value => value[0].toUpperCase() + value.slice(1));
  const scrollResults = () => requestAnimationFrame(() => document.getElementById('latest-cars')?.scrollIntoView({ block: 'start' }));
  const apply = async (next: HomepageFilters) => { await navigate({ search: next, resetScroll: false }); scrollResults(); };
  const clear = () => { setQuery(''); setBudget(''); void apply({}); };

  return (
    <div className="homepage">
      <div className="bg-primary text-primary-foreground text-center px-4 py-2.5 text-xs flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        <span className="inline-flex items-center gap-1.5"><MapPin className="size-3" /> Rooted in Jamshedpur</span>
        <span className="hidden sm:inline opacity-40">|</span><span>Direct owner deals. <strong>0% buyer commission.</strong></span>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <Link to="/" aria-label="Gearbox Autos home" className="home-logo shrink-0 px-3 py-2 rounded-sm"><Logo className="h-10" /></Link>
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            {navigation.filter(item => item.to !== '/sell').map(item => <Link key={item.to} to={item.to} className="hover:text-muted-foreground">{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild><a href="tel:+919065591253" aria-label="Call Gearbox Autos" title="Call Gearbox Autos"><Phone /></a></Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex"><a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Gearbox Autos" title="WhatsApp Gearbox Autos"><MessageCircle /></a></Button>
            <Button asChild className="hidden sm:inline-flex"><Link to="/sell">Sell Your Car <ArrowUpRight /></Link></Button>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="home-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && <nav id="home-mobile-nav" aria-label="Mobile navigation" className="container-page grid gap-4 border-t border-border py-5 lg:hidden">{navigation.map(item => <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="text-sm font-semibold">{item.label}</Link>)}<a href="https://wa.me/919065591253">Chat on WhatsApp</a></nav>}
      </header>

      <section className="home-hero relative overflow-hidden">
        {heroCar && <img src={heroCar.image} alt={heroCar.name + ' — available at Gearbox Autos'} width="1600" height="1000" fetchPriority="high" className="home-hero-photo absolute right-0 top-0 w-full md:w-3/4 h-48 md:h-full object-cover" />}
        <div className="home-hero-shade absolute inset-0" />
        <div className="container-page relative pt-44 pb-7 md:pt-16 md:pb-16">
          <p className="home-overline text-xs font-semibold uppercase mb-5">A better way to buy & sell used cars</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.12] max-w-xl">The right car.<br />The right deal.<br /><span className="text-accent">Right here in<br className="hidden md:block" /> Jamshedpur.</span></h1>
          <p className="mt-6 max-w-md text-sm md:text-base leading-relaxed opacity-85">Real cars. Direct owner conversations. A transparent process, with your local Gearbox Autos team by your side.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 h-11"><Link to="/buy">Explore Cars <ArrowRight /></Link></Button>
            <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-11"><Link to="/sell">Sell Your Car <ArrowUpRight /></Link></Button>
          </div>
          {heroCar && <Link to="/car/$id" params={{ id: heroCar.slug }} className="mt-5 md:absolute md:right-8 md:bottom-12 inline-flex max-w-full md:max-w-xs items-center gap-4 border-b border-primary-foreground/40 py-2 text-xs"><span className="leading-relaxed"><span className="block opacity-70 mb-1">IN THE COLLECTION</span>{heroCar.name} · {heroCar.price}</span><ArrowUpRight className="size-5 shrink-0" /></Link>}
        </div>
      </section>

      <section aria-label="Find a car" className="border-b border-border bg-card">
        <div className="container-page py-7 md:py-8">
          <div className="flex items-center justify-between gap-4 mb-5"><h2 className="text-xl font-semibold">Find your next car</h2><span className="text-xs text-muted-foreground">{cars.length} cars in the collection</span></div>
          <form className="grid md:grid-cols-[1.7fr_1fr_auto] gap-3" onSubmit={event => { event.preventDefault(); void apply({ q: query || undefined, budget: budget || undefined }); }}>
            <label className="block"><span className="text-xs font-medium block mb-2">Make, model or keyword</span><div className="relative"><Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><Input className="h-11 pl-10 bg-background shadow-none" placeholder="Try Kia, Brezza or automatic" value={query} onChange={event => setQuery(event.target.value)} /></div></label>
            <label className="block"><span className="text-xs font-medium block mb-2">Your budget</span><select className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm" value={budget} onChange={event => setBudget(event.target.value)}><option value="">Any budget</option>{homepageBudgets.filter(item => item.value).map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <Button type="submit" className="h-11 md:self-end px-8">Search Cars <ArrowRight /></Button>
          </form>
          <div className="flex flex-wrap items-center gap-2 mt-4"><span className="text-xs text-muted-foreground mr-1">Popular choices</span>{transmissions.map(transmission => <Button key={transmission} size="sm" variant="ghost" className="h-8 border border-border" aria-pressed={filters.transmission === transmission} onClick={() => void apply({ transmission })}>{transmission}</Button>)}<Button variant="link" size="sm" onClick={() => void apply({ budget: '500000' })}>Under ₹5 lakh <ArrowUpRight /></Button></div>
        </div>
      </section>

      <section aria-label="Why Gearbox Autos" className="border-b border-border">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[{ Icon: Handshake, title: '0% buyer commission', detail: 'More value in your hands' }, { Icon: Users, title: 'Meet the owner', detail: 'Inspect. Discuss. Decide.' }, { Icon: FileCheck, title: 'RC transfer support', detail: 'Guidance through the paperwork' }, { Icon: MapPin, title: 'Your local team', detail: 'Based in Sonari, Jamshedpur' }].map(({ Icon, title, detail }) => <div key={title} className="flex items-start gap-3"><Icon strokeWidth={1.4} className="size-6 shrink-0 mt-0.5 text-primary" /><div><h3 className="font-semibold text-xs md:text-sm">{title}</h3><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{detail}</p></div></div>)}
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <p className="home-overline text-xs text-muted-foreground uppercase font-semibold">A car for every chapter</p>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3">Start with your budget.</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 mt-8 border-y border-border">
          {homepageBudgets.map((item, i) => <Button key={item.label} variant="ghost" className={`h-auto rounded-none justify-between text-left whitespace-normal py-7 px-4 md:px-6 ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-border' : ''} ${i === 1 ? 'lg:border-r' : ''}`} onClick={() => { setBudget(item.value); setQuery(''); void apply({ budget: item.value || undefined }); }}><span><span className="block text-lg md:text-xl font-semibold">{item.label}</span><span className="block text-xs text-muted-foreground mt-2 font-normal">{item.caption}</span></span><ArrowUpRight /></Button>)}
        </div>
        {makes.length > 0 && <div className="flex flex-wrap items-center gap-2 mt-6"><span className="text-xs text-muted-foreground mr-3">Shop by make</span>{makes.map(make => <Button key={make} variant={filters.make === make ? 'default' : 'ghost'} size="sm" onClick={() => void apply({ make })}>{make}</Button>)}</div>}
      </section>

      <section id="latest-cars" className="container-page pb-14 md:pb-20 scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8"><div><p className="text-xs font-semibold text-muted-foreground uppercase">Curated cars. Clear asking prices.</p><h2 className="mt-3 text-3xl md:text-4xl font-semibold">{filtering ? 'Your shortlist.' : 'Fresh on the lot.'}</h2></div><Button asChild variant="link" className="px-0"><Link to="/buy">View all cars <ArrowUpRight /></Link></Button></div>
        {filtering && <div className="flex flex-wrap items-center gap-4 mb-6" role="status"><p className="text-sm">{results.length} matching {results.length === 1 ? 'car' : 'cars'}{filters.q ? ` for “${filters.q}”` : ''}{filters.make ? ` · ${filters.make}` : ''}{filters.budget ? ` · ${homepageBudgets.find(item => item.value === filters.budget)?.label ?? 'Budget filter'}` : ''}{filters.transmission ? ` · ${filters.transmission}` : ''}</p><Button variant="link" size="sm" onClick={clear}>Clear filters <X /></Button></div>}
        {displayed.length === 0 ? <div className="border-y border-border py-12 text-center"><CarFront className="size-8 mx-auto text-muted-foreground" /><h3 className="text-xl mt-4 font-semibold">{filtering ? 'No cars match just yet.' : 'The next arrival is on its way.'}</h3><p className="text-sm text-muted-foreground my-3">{filtering ? 'Try another model or a wider budget.' : 'Ask our local team about current availability.'}</p><Button onClick={clear} variant="outline">Browse all current cars</Button></div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">{displayed.map(car => <article key={car.id} className="bg-card border border-border rounded-md overflow-hidden group flex flex-col">
          <Link to="/car/$id" params={{ id: car.slug }} aria-label={`View ${car.name}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">{car.image ? <img src={car.image} alt={car.name} width="720" height="540" loading="lazy" decoding="async" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 95vw" className="w-full h-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" /> : <div className="h-full grid place-items-center text-muted-foreground"><CarFront className="size-12" /></div>}{car.year > 0 && <span className="absolute left-4 top-4 bg-card text-foreground text-xs px-2.5 py-1.5 rounded-sm font-semibold">{car.year}</span>}</Link>
          <div className="p-5 flex flex-col flex-1"><p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">{car.location && <><MapPin className="size-3" />{car.location}</>}</p><h3 className="text-base font-semibold leading-snug min-h-12"><Link to="/car/$id" params={{ id: car.slug }}>{car.name}</Link></h3><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-3">{car.km && <span>{car.km} km</span>}{car.fuel && <span>{car.fuel}</span>}{car.transmission && <span>{car.transmission}</span>}</div><div className="mt-5 pt-4 border-t border-border flex justify-between items-center gap-2"><div><p className="text-xl font-semibold">{car.price}</p><p className="text-xs text-muted-foreground mt-1">Owner's asking price</p></div><Button variant="outline" size="icon" asChild><Link to="/car/$id" params={{ id: car.slug }} aria-label={`View details and book a test drive for ${car.name}`} title="View car & book a test drive"><ArrowUpRight /></Link></Button></div></div>
        </article>)}</div>}
      </section>

      <section className="home-seller">
        <div className="container-page py-14 md:py-20 grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-20 items-center">
          <div><p className="home-overline text-xs uppercase font-semibold">Your car. Your next chapter.</p><h2 className="text-3xl md:text-4xl font-semibold leading-tight mt-4">Selling your car?<br />Start with a better,<br />more transparent deal.</h2><p className="text-sm leading-relaxed opacity-80 max-w-md mt-5">Skip the guesswork. Share your car details, speak with our local team, and connect directly with interested buyers.</p><Button asChild className="mt-7 bg-accent text-accent-foreground hover:bg-accent/90 h-11"><Link to="/sell">Start selling your car <ArrowRight /></Link></Button></div>
          <div className="space-y-6">{[['01', 'Tell us about your car', 'Share the model, year, kilometres and your contact details.'], ['02', 'Let’s talk, locally', 'Our Jamshedpur team follows up and helps verify and list your car.'], ['03', 'A deal on clear terms', 'Meet buyers directly. We support the paperwork and RC transfer.']].map(([n, title, detail]) => <div key={n} className="flex gap-5 border-b border-primary-foreground/20 pb-6"><span className="text-accent text-xs pt-1">{n}</span><div><h3 className="text-base font-semibold">{title}</h3><p className="text-sm leading-relaxed opacity-75 mt-2">{detail}</p></div></div>)}<p className="text-xs leading-relaxed opacity-75">A nominal seller service charge applies only after a successful deal. Discuss the amount with our team upfront.</p></div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="flex flex-wrap justify-between items-end gap-4"><div><p className="text-xs text-muted-foreground uppercase font-semibold">No middlemen. No mystery.</p><h2 className="text-3xl md:text-4xl mt-3 font-semibold">How Gearbox works.</h2></div><Button asChild variant="link"><Link to="/how-it-works">The full process <ArrowUpRight /></Link></Button></div>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10">
          {[{ label: 'For buyers', steps: ['Browse the collection & book a test drive', 'Meet the owner, inspect & negotiate directly', 'Close your deal with RC transfer support'] }, { label: 'For sellers', steps: ['Share your car details & hear from our team', 'Verify, list & connect with interested buyers', 'Agree the deal & complete the paperwork'] }].map(group => <div key={group.label}><h3 className="text-sm font-semibold mb-5 border-b border-border pb-4">{group.label}</h3><ol className="space-y-5">{group.steps.map((step, i) => <li key={step} className="flex items-start gap-4 text-sm leading-relaxed"><span className="text-xs text-muted-foreground pt-0.5">0{i + 1}</span>{step}</li>)}</ol></div>)}
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container-page grid md:grid-cols-2 gap-8 md:gap-14 py-12 md:py-16 items-center">
          <img src={showroom.url} alt="Gearbox Autos showroom in Sonari, Jamshedpur" width="800" height="600" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-sm" />
          <div><p className="text-xs font-semibold uppercase text-muted-foreground">Not just online. Right around the corner.</p><h2 className="text-3xl md:text-4xl font-semibold leading-tight mt-4">Your next car starts<br />with a local conversation.</h2><p className="text-sm leading-relaxed text-muted-foreground mt-5">Come to Sonari. Meet the team. Take a closer look at your options and ask the questions that matter.</p><address className="not-italic flex items-start gap-3 mt-6 text-sm leading-relaxed"><MapPin className="size-5 shrink-0 mt-1" /><span>Near Golden Town, opposite BSS School,<br />Adarsh Nagar, Sonari, Jamshedpur,<br />Jharkhand 831011</span></address><div className="flex flex-wrap gap-3 mt-7"><Button asChild><a href="tel:+919065591253"><Phone /> Call our Sonari team</a></Button><Button asChild variant="outline"><Link to="/contact">Plan a visit <ArrowUpRight /></Link></Button></div></div>
        </div>
      </section>

      <section className="container-page grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-20 py-14 md:py-20">
        <div><p className="text-xs font-semibold uppercase text-muted-foreground">Good questions. Straight answers.</p><h2 className="text-3xl md:text-4xl font-semibold mt-4">A little clarity<br />before you drive.</h2><Button asChild variant="link" className="mt-5 px-0"><Link to="/contact">Ask us anything <ArrowUpRight /></Link></Button></div>
        <Accordion type="single" collapsible className="border-t border-border">{faq.map(([question, answer], i) => <AccordionItem key={question} value={`faq-${i}`}><AccordionTrigger className="text-sm md:text-base font-semibold py-5 pr-2 focus-visible:outline-2">{question}</AccordionTrigger><AccordionContent className="text-sm leading-relaxed text-muted-foreground pr-6">{answer}</AccordionContent></AccordionItem>)}</Accordion>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"><div><h2 className="text-3xl md:text-4xl font-semibold">Let’s find your next drive.</h2><p className="text-sm text-muted-foreground mt-3">Good cars. Honest conversations. Here in Jamshedpur.</p></div><div className="flex flex-wrap gap-3"><Button asChild className="h-11"><Link to="/buy">Explore Cars <ArrowRight /></Link></Button><Button asChild variant="outline" className="h-11"><Link to="/sell">Sell Your Car</Link></Button></div></div>
      </section>
      <div className="container-page pt-7"><InstallAppBanner /></div>
      <footer className="container-page pt-12 pb-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10"><div><Link to="/" className="home-logo inline-block rounded-sm px-3 py-2" aria-label="Gearbox Autos home"><Logo className="h-10" /></Link><p className="text-sm text-muted-foreground leading-relaxed mt-5 max-w-sm">A local marketplace for pre-owned cars, bringing Jamshedpur’s buyers and owners together.</p><div className="flex gap-2 mt-4"><Button size="icon" variant="ghost" asChild><a href="https://www.instagram.com/gearbox_autos_usedcars/" target="_blank" rel="noopener noreferrer" aria-label="Gearbox Autos Instagram"><Instagram /></a></Button><Button size="icon" variant="ghost" asChild><a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" aria-label="Gearbox Autos WhatsApp"><MessageCircle /></a></Button></div></div><div><h3 className="text-sm font-semibold mb-5">Explore Gearbox</h3><nav aria-label="Footer navigation" className="grid gap-3 text-sm text-muted-foreground">{navigation.map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}<Link to="/inventory">Full Inventory</Link><Link to="/used-cars-in-jamshedpur">Used Cars in Jamshedpur</Link></nav></div><div><h3 className="text-sm font-semibold mb-5">Talk to your local team</h3><a className="block text-sm mb-3" href="tel:+919065591253">+91 90655 91253</a><a href="mailto:gearboxautotechgbat@gmail.com" className="block text-xs text-muted-foreground break-all">gearboxautotechgbat@gmail.com</a><p className="text-xs text-muted-foreground leading-relaxed mt-4">Near Golden Town, opp. BSS School,<br />Adarsh Nagar, Sonari, Jamshedpur 831011</p><p className="inline-flex gap-2 items-center text-xs mt-5"><Check className="size-4" /> 0% commission for buyers</p></div></div>
        <div className="border-t border-border pt-6 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground"><p>© {new Date().getFullYear()} Gearbox Autos. All rights reserved.</p><Link to="/privacy-policy">Privacy Policy</Link></div>
      </footer>
    </div>
  );
}
