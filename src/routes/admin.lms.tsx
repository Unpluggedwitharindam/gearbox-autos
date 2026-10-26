import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Phone, MessageCircle, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  adminListLeadsLms,
  adminCreateLead,
  adminUpdateLead,
  adminDeleteLead,
  LEAD_STATUSES,
  LEAD_SOURCES,
} from "@/lib/lead.functions";
import { adminListCars } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/lms")({
  head: () => ({
    meta: [
      { title: "Lead Management — Admin — Gearbox Autos" },
      { name: "description", content: "Gearbox Autos lead management system. Track enquiries, change stages, and contact buyers on WhatsApp." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: Lms,
});

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  test_drive: "Test Drive",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400",
  contacted: "bg-amber-500/15 text-amber-400",
  follow_up: "bg-purple-500/15 text-purple-400",
  test_drive: "bg-cyan-500/15 text-cyan-400",
  negotiation: "bg-orange-500/15 text-orange-400",
  won: "bg-green-500/15 text-green-400",
  lost: "bg-red-500/15 text-red-400",
};

function waLink(phone: string, name: string, car?: string | null) {
  const digits = phone.replace(/\D/g, "");
  const num = digits.length === 10 ? `91${digits}` : digits;
  const text = encodeURIComponent(
    `Hi ${name}, this is Gearbox Autos, Jamshedpur.${car ? ` Following up on your enquiry about the ${car}.` : " Following up on your enquiry."} How can we help you today?`,
  );
  return `https://wa.me/${num}?text=${text}`;
}

function telLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `91${digits}` : digits}`;
}

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
  car_id: string | null;
  car_name: string | null;
  notes: string | null;
  created_at: string;
};

function Lms() {
  const qc = useQueryClient();
  const { data: leads = [] } = useQuery({ queryKey: ["admin", "lms-leads"], queryFn: () => adminListLeadsLms() });
  const { data: cars = [] } = useQuery({ queryKey: ["admin", "cars"], queryFn: () => adminListCars() });

  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    source: "website" as string,
    car_id: "",
    notes: "",
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "lms-leads"] });

  const createMut = useMutation({
    mutationFn: (data: Parameters<typeof adminCreateLead>[0]["data"]) => adminCreateLead({ data }),
    onSuccess: () => {
      toast.success("Lead added");
      setShowForm(false);
      setForm({ full_name: "", phone: "", email: "", source: "website", car_id: "", notes: "" });
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add lead"),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminUpdateLead({ data: { id, status: status as (typeof LEAD_STATUSES)[number] } }),
    onSuccess: () => {
      toast.success("Stage updated");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update stage"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteLead({ data: { id } }),
    onSuccess: () => {
      toast.success("Lead deleted");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete lead"),
  });

  const filtered = useMemo(
    () => (filter === "all" ? leads : (leads as Lead[]).filter((l) => l.status === filter)),
    [leads, filter],
  ) as Lead[];

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const s of LEAD_STATUSES) c[s] = (leads as Lead[]).filter((l) => l.status === s).length;
    return c;
  }, [leads]);

  const selectedCar = (cars as { id: string; name: string }[]).find((c) => c.id === form.car_id);

  const submit = () => {
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    createMut.mutate({
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      source: form.source as (typeof LEAD_SOURCES)[number],
      status: "new",
      car_id: form.car_id || null,
      car_name: selectedCar?.name || null,
      notes: form.notes || null,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Lead Management ({leads.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary rounded-md py-2 px-4 text-sm font-semibold flex items-center gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Lead"}
        </button>
      </div>

      {showForm && (
        <div className="surface p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Full name *</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="98765 43210"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Interested car</label>
            <select
              value={form.car_id}
              onChange={(e) => setForm({ ...form, car_id: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">— None / general enquiry —</option>
              {(cars as { id: string; name: string }[]).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Notes</label>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Budget, timing, trade-in…"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={submit}
              disabled={createMut.isPending}
              className="btn-primary rounded-md py-2 px-5 text-sm font-semibold disabled:opacity-50"
            >
              {createMut.isPending ? "Saving…" : "Save Lead"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-4">
        {["all", ...LEAD_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
              filter === s
                ? "bg-primary/15 text-primary border-primary/40"
                : "border-border text-muted-foreground hover:bg-card"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((lead) => (
          <div key={lead.id} className="surface p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{lead.full_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[lead.status] ?? ""}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground capitalize">{lead.source.replace("_", " ")}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {lead.phone}
                  {lead.email ? ` · ${lead.email}` : ""}
                  {lead.car_name ? ` · Interested: ${lead.car_name}` : ""}
                </div>
                {lead.notes && <p className="text-sm mt-2 whitespace-pre-wrap">{lead.notes}</p>}
                <div className="text-[11px] text-muted-foreground mt-2">
                  Added {new Date(lead.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={waLink(lead.phone, lead.full_name, lead.car_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md bg-green-600/15 text-green-400 px-3 py-2 text-xs font-medium hover:bg-green-600/25"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a
                  href={telLink(lead.phone)}
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-card"
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <select
                  value={lead.status}
                  onChange={(e) => statusMut.mutate({ id: lead.id, status: e.target.value })}
                  className="rounded-md border border-border bg-background px-2 py-2 text-xs"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete lead for ${lead.full_name}?`)) deleteMut.mutate(lead.id);
                  }}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-red-400 hover:bg-card"
                  aria-label={`Delete lead ${lead.full_name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {filter === "all" ? "No leads yet. Click “Add Lead” to create your first one." : `No leads in the “${STATUS_LABELS[filter]}” stage.`}
          </p>
        )}
      </div>
    </div>
  );
}
