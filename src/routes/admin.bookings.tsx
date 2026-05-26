import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListBookings } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/bookings")({ component: Bookings });

function Bookings() {
  const { data = [] } = useQuery({ queryKey: ["admin", "bookings"], queryFn: () => adminListBookings() });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Test Drive Bookings ({data.length})</h2>
      <div className="surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr><th className="text-left p-3">When</th><th className="text-left p-3">Name</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Car</th><th className="text-left p-3">Date</th><th className="text-left p-3">Email</th></tr>
          </thead>
          <tbody>
            {(data as any[]).map((r) => (
              <tr key={r.id} className="border-b border-border/40">
                <td className="p-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium">{r.full_name}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">{r.car_name ?? "—"}</td>
                <td className="p-3">{r.preferred_date ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{r.email ?? "—"}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
