import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Car, Inbox, Calendar, MessageSquare, Users } from "lucide-react";
import { adminGetCounts } from "@/lib/admin.functions";
import { adminGetLeadFunnel, LEAD_STATUSES } from "@/lib/lead.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard Overview — Admin — Gearbox Autos" },
      { name: "description", content: "Private Gearbox Autos administration overview." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: Dashboard,
});

const FUNNEL_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  test_drive: "Test Drive",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

function Dashboard() {
  const { data } = useQuery({ queryKey: ["admin", "counts"], queryFn: () => adminGetCounts() });
  const { data: funnel } = useQuery({ queryKey: ["admin", "lead-funnel"], queryFn: () => adminGetLeadFunnel() });
  const items = [
    { label: "Cars", value: data?.cars ?? 0, Icon: Car },
    { label: "Active Leads", value: funnel?.active ?? 0, Icon: Users },
    { label: "Sell Leads", value: data?.leads ?? 0, Icon: Inbox },
    { label: "Test Drives", value: data?.bookings ?? 0, Icon: Calendar },
    { label: "Messages", value: data?.messages ?? 0, Icon: MessageSquare },
  ];
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((i) => (
          <div key={i.label} className="surface p-5">
            <i.Icon className="h-5 w-5 text-primary" />
            <div className="text-3xl font-bold mt-3">{i.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{i.label}</div>
          </div>
        ))}
      </div>
      <Link to="/admin/lms" className="surface p-5 mt-4 block hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sales Funnel</h3>
          <span className="text-xs text-primary">Open LMS →</span>
        </div>
        <div className="flex gap-3 flex-wrap mt-3">
          {LEAD_STATUSES.map((s) => (
            <div key={s} className="rounded-md border border-border/60 px-3 py-2 text-center min-w-[90px]">
              <div className="text-xl font-bold">{funnel?.byStatus?.[s] ?? 0}</div>
              <div className="text-[11px] text-muted-foreground">{FUNNEL_LABELS[s]}</div>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
