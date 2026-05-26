import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListLeads } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/leads")({ component: Leads });

function Leads() {
  const { data = [] } = useQuery({ queryKey: ["admin", "leads"], queryFn: () => adminListLeads() });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sell Leads ({data.length})</h2>
      <div className="surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr><th className="text-left p-3">When</th><th className="text-left p-3">Name</th><th className="text-left p-3">Phone</th><th className="text-left p-3">City</th><th className="text-left p-3">Car</th><th className="text-left p-3">Year</th><th className="text-left p-3">KM</th><th className="text-left p-3">Email</th></tr>
          </thead>
          <tbody>
            {(data as any[]).map((r) => (
              <tr key={r.id} className="border-b border-border/40">
                <td className="p-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium">{r.full_name}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">{r.city}</td>
                <td className="p-3">{r.car_model}</td>
                <td className="p-3">{r.year ?? "—"}</td>
                <td className="p-3">{r.km ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{r.email ?? "—"}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No leads yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
