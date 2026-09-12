import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, Car, Clock, IndianRupee, Loader2, TrendingUp } from "lucide-react";
import { getGarageDashboard } from "@/lib/garage-admin.functions";

export const Route = createFileRoute("/admin/garage")({
  head: () => ({ meta: [
    { title: "Garage Intelligence — Admin — Gearbox Autos" },
    { name: "description", content: "Private Gearbox Autos inventory valuation and dealer intelligence dashboard." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
    { property: "og:title", content: "Garage Intelligence — Admin" },
    { property: "og:description", content: "Private Gearbox Autos dealer intelligence." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: GarageAdmin,
});

const money = (value: number | null) => value == null ? "Not enough data" : `₹${value.toLocaleString("en-IN")}`;
const number = (value: number | null, suffix = "") => value == null ? "Not enough data" : `${value.toLocaleString("en-IN")}${suffix}`;

function GarageAdmin() {
  const { data, isPending, error } = useQuery({ queryKey: ["admin", "garage-intelligence"], queryFn: () => getGarageDashboard() });
  if (isPending) return <div className="surface flex min-h-52 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;
  if (error || !data) return <div className="surface p-6 text-sm text-destructive">Garage intelligence could not be loaded.</div>;
  const metrics = [
    { label: "Total inventory", value: number(data.metrics.totalInventory), Icon: Car },
    { label: "Cars in stock", value: number(data.metrics.inStock), Icon: Car },
    { label: "Average stock age", value: number(data.metrics.averageInventoryAge, " days"), Icon: Clock },
    { label: "Average days to sell", value: number(data.metrics.averageDaysToSell, " days"), Icon: Clock },
    { label: "Average buying price", value: money(data.metrics.averageBuyingPrice), Icon: IndianRupee },
    { label: "Average selling price", value: money(data.metrics.averageSellingPrice), Icon: IndianRupee },
    { label: "Average gross margin", value: money(data.metrics.averageGrossMargin), Icon: TrendingUp },
    { label: "Price reviews needed", value: number(data.metrics.carsNeedingPriceChanges), Icon: AlertTriangle },
  ];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Garage Intelligence</div><h2 className="mt-1 text-2xl font-bold">Inventory position</h2></div><div className={`rounded-md border px-3 py-2 text-xs font-semibold ${data.providerConnected ? "border-green-500/30 text-green-400" : "border-primary/30 text-primary"}`}>{data.providerConnected ? "Verified market feed active" : "External market feed not connected"}</div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, Icon }) => <div key={label} className="surface p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 text-xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{data.sourceStatuses.map((source) => <div key={source.source} className="surface p-4"><div className="flex items-center justify-between gap-3"><strong>{source.source}</strong><span className="text-xs text-muted-foreground">{source.status}</span></div><p className="mt-2 text-sm text-muted-foreground">{source.listingCount} cached listing{source.listingCount === 1 ? "" : "s"}</p></div>)}</div>
    <div className="surface overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="border-b border-border text-xs uppercase text-muted-foreground"><tr>{["Vehicle", "Market median", "Gearbox price", "Difference", "Garage score", "Stock age", "Recommended action"].map((head) => <th key={head} className="p-3 text-left">{head}</th>)}</tr></thead><tbody>{data.vehicles.map((vehicle) => <tr key={vehicle.id} className="border-b border-border/50"><td className="p-3 font-semibold">{vehicle.name}</td><td className="p-3">{money(vehicle.marketMedian)}</td><td className="p-3">{money(vehicle.askingPrice)}</td><td className="p-3">{vehicle.difference == null ? "Not enough data" : `${vehicle.difference >= 0 ? "+" : "−"}${money(Math.abs(vehicle.difference))}`}</td><td className="p-3">{vehicle.garageScore == null ? "Not enough data" : `${vehicle.garageScore}/100`}</td><td className="p-3">{vehicle.daysInInventory} days</td><td className="max-w-xs p-3 text-muted-foreground">{vehicle.recommendation}</td></tr>)}</tbody></table></div>
    {!data.providerConnected && <div className="surface flex gap-3 p-5 text-sm text-muted-foreground"><BarChart3 className="h-5 w-5 shrink-0 text-primary" /><p>Market medians, price-position alerts and Garage Scores stay unavailable until verified comparable listings are connected. Inventory age and recorded buying/selling metrics remain live.</p></div>}
  </div>;
}