import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, Car, ExternalLink, Gauge, Loader2, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyzeGarageQuestion } from "@/lib/garage.functions";
import { UNKNOWN, type GarageAnalysis, type RankedComparable } from "@/lib/garage/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "Garage AI Used Car Valuation | Gearbox Autos" },
      { name: "description", content: "Ask Garage for Indian used-car analysis, Jamshedpur inventory comparisons, transparent valuation evidence and dealer-aware buying or selling guidance." },
      { property: "og:title", content: "Garage AI Used Car Intelligence" },
      { property: "og:description", content: "Indian used-car analysis grounded in verified market evidence and Gearbox Autos Jamshedpur inventory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/garage" }],
  }),
  component: GaragePage,
});

type ChatMessage = { role: "user" | "assistant"; content: string };
type SortKey = "relevance" | "price" | "km" | "year" | "distance";
const STARTERS = [
  "What should I pay for a 2021 Hyundai Creta SX diesel automatic with 42,000 km, 1st owner, Jamshedpur?",
  "Should I buy this 2019 Mahindra XUV500 diesel manual with 80,000 km?",
  "Which is better for Jamshedpur, Tata Nexon or Hyundai Venue?",
  "What should I sell my car for?",
];

const money = (value: number) => `₹${(value / 100_000).toFixed(value % 100_000 === 0 ? 1 : 2)}L`;
const known = (value: string | number) => value === UNKNOWN ? "Unknown" : String(value);

function GaragePage() {
  const analyze = useServerFn(analyzeGarageQuestion);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<GarageAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const abortRef = useRef<AbortController | null>(null);

  const submit = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next); setInput(""); setLoading(true); setError(""); setAnalysis(null);
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/garage-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }), signal: controller.signal });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ message: "Garage could not answer right now." }));
        throw new Error(body.message ?? "Garage could not answer right now.");
      }
      if (!response.body) throw new Error("Garage returned an empty response.");
      setAnalysis(await analyze({ data: { messages: next } }));
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        answer += decoder.decode(chunk.value, { stream: true });
        setMessages([...next, { role: "assistant", content: answer }]);
      }
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError(caught instanceof Error ? caught.message : "Garage could not answer right now.");
    } finally { setLoading(false); abortRef.current = null; }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section className="border-b border-zinc-200 px-4 pb-10 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Ask Garage</p><h1 className="mt-2 text-4xl font-extrabold md:text-6xl">Know the car. Know the deal.</h1></div>
            <div className="hidden items-center gap-2 border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 md:flex"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Evidence-first analysis</div>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">Indian used-car intelligence for valuations, comparisons, buying, selling and Gearbox Autos inventory in Jamshedpur.</p>
          <form onSubmit={(event: FormEvent) => { event.preventDefault(); submit(); }} className="mt-8 flex items-end gap-3 border border-zinc-300 bg-white p-3 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <Search className="mb-3 ml-2 h-5 w-5 shrink-0 text-zinc-400" />
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} rows={2} placeholder="Ask anything about a used car…" className="min-h-14 flex-1 resize-none bg-transparent py-2 text-base outline-none placeholder:text-zinc-400" />
            {loading ? <Button type="button" variant="outline" size="icon" aria-label="Stop" onClick={() => abortRef.current?.abort()}><X /></Button> : <Button type="submit" size="icon" aria-label="Ask Garage" disabled={!input.trim()}><ArrowUp /></Button>}
          </form>
          {messages.length === 0 && <div className="mt-4 flex flex-wrap gap-2">{STARTERS.map((item) => <button key={item} type="button" onClick={() => submit(item)} className="border border-zinc-200 px-3 py-2 text-left text-xs text-zinc-600 transition hover:border-red-500 hover:text-red-600">{item}</button>)}</div>}
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {messages.length === 0 ? <EmptyState /> : <Conversation messages={messages} loading={loading} error={error} onRetry={() => { const question = [...messages].reverse().find((message) => message.role === "user")?.content; if (question) submit(question); }} />}
          {analysis && <Evidence analysis={analysis} sort={sort} onSort={setSort} />}
        </div>
        <aside className="space-y-4">
          <div className="border border-zinc-200 bg-zinc-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Garage principles</p><ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-700"><li>Verified listings only</li><li>Jamshedpur and Jharkhand first</li><li>Fuel types never mixed in primary comparisons</li><li>Every relaxed match is disclosed</li><li>Estimates are ranges, never exact promises</li></ul></div>
          <div className="border border-zinc-200 p-5"><Gauge className="h-5 w-5 text-red-600" /><h2 className="mt-3 font-bold">Dealer intelligence</h2><p className="mt-2 text-sm leading-6 text-zinc-600">Gearbox Autos staff can review stock age, margin inputs and pricing opportunities in the protected dashboard.</p><Button asChild variant="outline" className="mt-4"><Link to="/admin">Open dashboard</Link></Button></div>
        </aside>
      </main>
    </div>
  );
}

function EmptyState() { return <div className="grid min-h-80 place-items-center border border-dashed border-zinc-300 p-8 text-center"><div><Bot className="mx-auto h-10 w-10 text-red-600" /><h2 className="mt-4 text-2xl font-bold">Ask a real used-car question</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-600">Include year, make, model, variant, fuel, transmission, kilometres, ownership and location for the strongest analysis.</p></div></div>; }

function Conversation({ messages, loading, error, onRetry }: { messages: ChatMessage[]; loading: boolean; error: string; onRetry: () => void }) {
  return <section aria-live="polite" className="space-y-4">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-2xl bg-zinc-950 p-4 text-sm leading-6 text-white" : "max-w-3xl border-l-4 border-red-600 bg-zinc-50 p-5 text-sm leading-7 text-zinc-800"}>{message.role === "assistant" ? <div className="prose prose-sm max-w-none"><ReactMarkdown>{message.content || "Analysing…"}</ReactMarkdown></div> : message.content}</div>)}{loading && <p className="flex items-center gap-2 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Garage is checking the vehicle and inventory…</p>}{error && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p>{error}</p><Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>Try again</Button></div>}</section>;
}

function Evidence({ analysis, sort, onSort }: { analysis: GarageAnalysis; sort: SortKey; onSort: (sort: SortKey) => void }) {
  const vehicle = analysis.vehicle;
  const sorted = useMemo(() => [...analysis.externalComparables].sort(sorter(sort)), [analysis.externalComparables, sort]);
  return <section className="space-y-6 border-t border-zinc-200 pt-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Structured analysis</p><h2 className="mt-2 text-2xl font-extrabold">{known(vehicle.manufacturingYear)} {known(vehicle.make)} {known(vehicle.model)} {known(vehicle.variant)}</h2><p className="mt-1 text-sm text-zinc-500">{known(vehicle.km)} km · {known(vehicle.ownerCount)} owner · {known(vehicle.fuel)} · {known(vehicle.transmission)} · {known(vehicle.location)}</p></div></div>
    {analysis.missingFields.length > 0 && <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Needed for a reliable valuation:</strong> {analysis.missingFields.join(", ")}.</div>}
    <ValuationPanel analysis={analysis} />
    <InventoryMatches matches={analysis.inventoryComparables} />
    <ComparableTable items={sorted} sort={sort} onSort={onSort} providerStatus={analysis.providerStatus} relaxations={analysis.relaxations} />
  </section>;
}

function ValuationPanel({ analysis }: { analysis: GarageAnalysis }) {
  const valuation = analysis.valuation;
  if (valuation.status === "unavailable") return <div className="border border-zinc-300 p-5"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-red-600" /><div><h3 className="font-bold">Market valuation not yet available</h3><p className="mt-1 text-sm leading-6 text-zinc-600">No verified external listing feed currently contains enough relevant evidence. Garage will not invent a median, score or price range. The AI answer above can still use actual Gearbox inventory and provide practical inspection or negotiation guidance.</p></div></div></div>;
  const chart = [{ name: "Low", value: valuation.statistics.minimum }, { name: "Q1", value: valuation.statistics.lowerQuartile }, { name: "Median", value: valuation.statistics.median }, { name: "Q3", value: valuation.statistics.upperQuartile }, { name: "High", value: valuation.statistics.maximum }];
  return <div className="border border-zinc-200 p-5"><div className="grid gap-5 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Garage Score</p><p className="mt-2 text-5xl font-black">{valuation.garageScore}<span className="text-xl text-zinc-400">/100</span></p><p className="mt-1 font-bold text-red-600">{valuation.label}</p><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><Metric label="Average listed price" value={money(valuation.statistics.mean)} /><Metric label="Median listed price" value={money(valuation.statistics.median)} /><Metric label="Fair market value" value={`${money(valuation.fairMarketValue.low)}–${money(valuation.fairMarketValue.high)}`} /><Metric label="Dealer buy price" value={`${money(valuation.dealerBuyingPrice.low)}–${money(valuation.dealerBuyingPrice.high)}`} /><Metric label="Listing price" value={money(valuation.recommendedSellingPrice)} /><Metric label="Expected close" value={money(valuation.expectedClosingPrice)} /></dl></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis tickFormatter={(value) => `${(Number(value) / 100_000).toFixed(0)}L`} /><Tooltip formatter={(value) => money(Number(value))} /><Bar dataKey="value" fill="#dc2626" /></BarChart></ResponsiveContainer></div></div><div className="mt-5 border-t border-zinc-200 pt-4"><p className="text-xs font-bold uppercase text-zinc-500">Marketplace evidence</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{analysis.sourceStatuses.map((source) => { const stats = valuation.statistics.sourceBreakdown.find((item) => item.source === source.source); return <div key={source.source} className="border border-zinc-200 p-3"><div className="flex items-center justify-between"><strong>{source.source}</strong><span className="text-xs text-zinc-500">{source.status}</span></div><p className="mt-1 text-xs text-zinc-500">{stats ? `${stats.count} matched · avg ${money(stats.mean)}` : `${source.listingCount} retrieved`}</p></div>; })}</div><p className="mt-3 text-xs text-zinc-500">Based on {valuation.statistics.count} comparable asking prices after removing {valuation.statistics.outlierCount} outlier{valuation.statistics.outlierCount === 1 ? "" : "s"}. Asking prices are not completed sale prices.</p></div></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-zinc-500">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>; }

function InventoryMatches({ matches }: { matches: GarageAnalysis["inventoryComparables"] }) { return <div><div className="flex items-center gap-2"><Car className="h-5 w-5 text-red-600" /><h3 className="text-lg font-bold">Gearbox Autos inventory</h3><span className="text-sm text-zinc-500">{matches.length} match{matches.length === 1 ? "" : "es"}</span></div>{matches.length === 0 ? <p className="mt-3 border border-zinc-200 p-4 text-sm text-zinc-600">No similar current Gearbox inventory was found.</p> : <div className="mt-3 grid gap-3 md:grid-cols-2">{matches.map((car) => <Link key={car.id} to="/car/$id" params={{ id: car.slug }} className="border border-zinc-200 p-4 transition hover:border-red-500"><p className="font-bold">{car.name}</p><p className="mt-1 text-sm text-zinc-500">{known(car.manufacturingYear)} · {known(car.km)} km · {known(car.fuel)} · {known(car.ownerCount)} owner</p><p className="mt-3 font-bold">{money(car.askingPriceInr)}</p></Link>)}</div>}</div>; }

function ComparableTable({ items, sort, onSort, providerStatus, relaxations }: { items: RankedComparable[]; sort: SortKey; onSort: (value: SortKey) => void; providerStatus: GarageAnalysis["providerStatus"]; relaxations: string[] }) { return <div><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold">External comparable cars</h3><p className="text-sm text-zinc-500">{items.length} verified relevant listing{items.length === 1 ? "" : "s"} analysed</p></div><label className="flex items-center gap-2 text-xs font-semibold">Sort<select value={sort} onChange={(event) => onSort(event.target.value as SortKey)} className="border border-zinc-300 bg-white px-3 py-2"><option value="relevance">Relevance</option><option value="price">Price</option><option value="km">KM</option><option value="year">Year</option><option value="distance">Distance</option></select></label></div>{relaxations.length > 0 && items.length > 0 && <div className="mt-3 border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{relaxations.map((item) => <p key={item}>{item}</p>)}</div>}{providerStatus !== "connected" ? <div className="mt-3 border border-zinc-200 p-5 text-sm leading-6 text-zinc-600">A verified external Indian listing provider is not connected yet. Garage will show listings here only after their source, URL and vehicle facts can be verified.</div> : items.length === 0 ? <div className="mt-3 border border-zinc-200 p-5 text-sm text-zinc-600">No genuinely relevant comparable listings were found.</div> : <div className="mt-3 overflow-x-auto border border-zinc-200"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr>{["Vehicle", "Year", "KM", "Owner", "Fuel", "Variant", "Location", "Price", "Relevance", "Source"].map((head) => <th key={head} className="p-3">{head}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-zinc-200"><td className="p-3 font-semibold">{known(item.make)} {known(item.model)}</td><td className="p-3">{known(item.manufacturingYear)}</td><td className="p-3">{known(item.km)}</td><td className="p-3">{known(item.ownerCount)}</td><td className="p-3">{known(item.fuel)}</td><td className="p-3">{known(item.variant)}</td><td className="p-3">{known(item.location)}</td><td className="p-3 font-bold">{money(item.askingPriceInr)}</td><td className="p-3">{item.relevance}%</td><td className="p-3">{item.listingUrl === UNKNOWN ? item.source : <a href={item.listingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-red-600">View <ExternalLink className="h-3 w-3" /></a>}</td></tr>)}</tbody></table></div>}</div>; }

function sorter(key: SortKey) { return (a: RankedComparable, b: RankedComparable) => { if (key === "price") return a.askingPriceInr - b.askingPriceInr; if (key === "km") return (a.km === UNKNOWN ? Infinity : a.km) - (b.km === UNKNOWN ? Infinity : b.km); if (key === "year") return (b.manufacturingYear === UNKNOWN ? 0 : b.manufacturingYear) - (a.manufacturingYear === UNKNOWN ? 0 : a.manufacturingYear); if (key === "distance") return a.distanceTier - b.distanceTier; return b.relevance - a.relevance; }; }