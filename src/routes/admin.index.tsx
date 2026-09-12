import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Car, Inbox, Calendar, MessageSquare } from "lucide-react";
import { adminGetCounts } from "@/lib/admin.functions";

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

function Dashboard() {
  const { data } = useQuery({ queryKey: ["admin", "counts"], queryFn: () => adminGetCounts() });
  const items = [
    { label: "Cars", value: data?.cars ?? 0, Icon: Car },
    { label: "Sell Leads", value: data?.leads ?? 0, Icon: Inbox },
    { label: "Test Drives", value: data?.bookings ?? 0, Icon: Calendar },
    { label: "Messages", value: data?.messages ?? 0, Icon: MessageSquare },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((i) => (
        <div key={i.label} className="surface p-5">
          <i.Icon className="h-5 w-5 text-primary" />
          <div className="text-3xl font-bold mt-3">{i.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{i.label}</div>
        </div>
      ))}
    </div>
  );
}
