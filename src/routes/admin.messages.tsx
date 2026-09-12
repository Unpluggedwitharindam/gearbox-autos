import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListMessages } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact Messages — Admin — Gearbox Autos" },
      { name: "description", content: "Read and manage customer contact messages and enquiries sent to Gearbox Autos." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: Messages,
});

function Messages() {
  const { data = [] } = useQuery({ queryKey: ["admin", "messages"], queryFn: () => adminListMessages() });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Messages ({data.length})</h2>
      <div className="grid gap-3">
        {(data as any[]).map((m) => (
          <div key={m.id} className="surface p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(m.created_at).toLocaleString()}</span>
              <span>{m.email}{m.phone ? ` · ${m.phone}` : ""}</span>
            </div>
            <div className="font-semibold mt-2">{m.full_name} {m.subject ? <span className="text-muted-foreground font-normal">— {m.subject}</span> : null}</div>
            <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
        {data.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}
