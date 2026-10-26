import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  X,
  LayoutGrid,
  List,
  Flame,
  Snowflake,
  Thermometer,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminListLeadsLms,
  adminCreateLead,
  adminUpdateLead,
  adminDeleteLead,
  adminListLeadNotes,
  adminAddLeadNote,
  LEAD_STATUSES,
  LEAD_TYPES,
  LEAD_SOURCES,
  LEAD_PRIORITIES,
  type LeadRecord,
  type CreateLeadInput,
  type UpdateLeadInput,
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
  new: "New Lead",
  contacted: "Contacted",
  test_drive: "Test Drive / Inspection",
  negotiation: "Negotiation / Token",
  won: "Won / Closed",
  lost: "Lost / Dropped",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400",
  contacted: "bg-amber-500/15 text-amber-400",
  test_drive: "bg-cyan-500/15 text-cyan-400",
  negotiation: "bg-orange-500/15 text-orange-400",
  won: "bg-green-500/15 text-green-400",
  lost: "bg-red-500/15 text-red-400",
};

const TYPE_LABELS: Record<string, string> = { buyer: "Buyer", seller: "Seller", general: "General" };

function PriorityIcon({ priority }: { priority: string }) {
  if (priority === "hot") return <Flame className="h-3.5 w-3.5 text-red-400" aria-label="Hot lead" />;
  if (priority === "cold") return <Snowflake className="h-3.5 w-3.5 text-blue-300" aria-label="Cold lead" />;
  return <Thermometer className="h-3.5 w-3.5 text-amber-400" aria-label="Warm lead" />;
}

function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function telLink(phone: string) {
  return `tel:+${waNumber(phone)}`;
}

function fillTemplate(tpl: string, lead: LeadRecord) {
  return tpl
    .replaceAll("{Name}", lead.full_name)
    .replaceAll("{Car}", lead.car_name ?? "your car")
    .replaceAll("{Date}", lead.follow_up_date ?? "your preferred date");
}

const WA_TEMPLATES: { key: string; label: string; forTypes: string[]; body: string }[] = [
  {
    key: "buyer_greeting",
    label: "New buyer greeting",
    forTypes: ["buyer", "general"],
    body: "Namaste {Name}, thank you for contacting Gearbox Autos Jamshedpur regarding the {Car}. When would be a convenient time for a quick call or showroom visit?",
  },
  {
    key: "seller_valuation",
    label: "Seller car valuation",
    forTypes: ["seller"],
    body: "Hello {Name}, we received your request to sell your {Car}. Our team can inspect your car at Sonari or at your doorstep. What time suits you?",
  },
  {
    key: "test_drive_confirm",
    label: "Test drive confirmation",
    forTypes: ["buyer", "general"],
    body: "Hi {Name}, your test drive for {Car} is confirmed for {Date}. Our showroom is located near Golden Town, opp. BSS School, Adarsh Nagar, Sonari, Jamshedpur.",
  },
  {
    key: "follow_up",
    label: "Follow-up nudge",
    forTypes: ["buyer", "seller", "general"],
    body: "Hi {Name}, just following up from Gearbox Autos on your enquiry about {Car}. Happy to help whenever you're ready — reply here or call us.",
  },
];

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  lead_type: "buyer",
  source: "website",
  priority: "warm",
  car_id: "",
  budget_inr: "",
  follow_up_date: "",
  notes: "",
};

function Lms() {
  const qc = useQueryClient();
  const { data: leads = [] } = useQuery({ queryKey: ["admin", "lms-leads"], queryFn: () => adminListLeadsLms() });
  const { data: cars = [] } = useQuery({ queryKey: ["admin", "cars"], queryFn: () => adminListCars() });

  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<LeadRecord | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "lms-leads"] });

  const createMut = useMutation({
    mutationFn: (data: CreateLeadInput) => adminCreateLead({ data }),
    onSuccess: () => {
      toast.success("Lead added");
      setShowForm(false);
      setForm(emptyForm);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add lead"),
  });

  const updateMut = useMutation({
    mutationFn: (data: UpdateLeadInput) => adminUpdateLead({ data }),
    onSuccess: () => {
      toast.success("Lead updated");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update lead"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteLead({ data: { id } }),
    onSuccess: () => {
      toast.success("Lead deleted");
      setSelected(null);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete lead"),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (leads as LeadRecord[]).filter((l) => {
      if (typeFilter !== "all" && l.lead_type !== typeFilter) return false;
      if (q && !l.full_name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.city ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [leads, search, typeFilter]);

  const byStatus = useMemo(() => {
    const map: Record<string, LeadRecord[]> = {};
    for (const s of LEAD_STATUSES) map[s] = [];
    for (const l of filtered) map[l.status]?.push(l);
    return map;
  }, [filtered]);

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
      city: form.city || null,
      lead_type: form.lead_type as (typeof LEAD_TYPES)[number],
      source: form.source as (typeof LEAD_SOURCES)[number],
      status: "new",
      priority: form.priority as (typeof LEAD_PRIORITIES)[number],
      car_id: form.car_id || null,
      car_name: selectedCar?.name || null,
      budget_inr: form.budget_inr ? Number(form.budget_inr) : null,
      follow_up_date: form.follow_up_date || null,
      notes: form.notes || null,
    });
  };

  const setStatus = (lead: LeadRecord, status: string) => {
    updateMut.mutate({ id: lead.id, status: status as (typeof LEAD_STATUSES)[number] });
    if (selected?.id === lead.id) setSelected({ ...lead, status });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Lead Management ({leads.length})</h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-2 text-xs flex items-center gap-1.5 ${view === "kanban" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-card"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Board
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 text-xs flex items-center gap-1.5 ${view === "list" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-card"}`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="btn-primary rounded-md py-2 px-4 text-sm font-semibold flex items-center gap-2"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Quick Add Lead"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="surface p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Full name *</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Customer name" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Phone *</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="98765 43210" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Optional" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Jamshedpur" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Lead type</label>
            <select value={form.lead_type} onChange={(e) => setForm({ ...form, lead_type: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Source</label>
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              {LEAD_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Interested car</label>
            <select value={form.car_id} onChange={(e) => setForm({ ...form, car_id: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">— None / general enquiry —</option>
              {(cars as { id: string; name: string }[]).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Budget / expected price (₹)</label>
            <input type="number" value={form.budget_inr} onChange={(e) => setForm({ ...form, budget_inr: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="e.g. 650000" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Follow-up date</label>
            <input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground">Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Budget, timing, trade-in…" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button onClick={submit} disabled={createMut.isPending} className="btn-primary rounded-md py-2 px-5 text-sm font-semibold disabled:opacity-50">
              {createMut.isPending ? "Saving…" : "Save Lead"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone or city…"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm w-56"
        />
        {["all", ...LEAD_TYPES].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${typeFilter === t ? "bg-primary/15 text-primary border-primary/40" : "border-border text-muted-foreground hover:bg-card"}`}
          >
            {t === "all" ? "All types" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {LEAD_STATUSES.map((status) => (
            <div key={status} className="min-w-[260px] w-[260px] shrink-0">
              <div className={`rounded-t-md px-3 py-2 text-xs font-semibold flex items-center justify-between ${STATUS_COLORS[status]}`}>
                <span>{STATUS_LABELS[status]}</span>
                <span>{byStatus[status]?.length ?? 0}</span>
              </div>
              <div className="surface rounded-t-none p-2 grid gap-2 min-h-[120px]">
                {(byStatus[status] ?? []).map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="text-left rounded-md border border-border/60 bg-background p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{lead.full_name}</span>
                      <PriorityIcon priority={lead.priority} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {lead.car_name ?? TYPE_LABELS[lead.lead_type] ?? lead.lead_type}
                    </div>
                    {lead.follow_up_date && (
                      <div className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" /> Follow up {lead.follow_up_date}
                      </div>
                    )}
                  </button>
                ))}
                {(byStatus[status] ?? []).length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-4">No leads</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Car</th>
                <th className="text-left p-3">Stage</th>
                <th className="text-left p-3">Follow-up</th>
                <th className="text-left p-3">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border/40 hover:bg-card/50 cursor-pointer" onClick={() => setSelected(lead)}>
                  <td className="p-3 font-medium">
                    <span className="flex items-center gap-1.5">
                      <PriorityIcon priority={lead.priority} /> {lead.full_name}
                    </span>
                  </td>
                  <td className="p-3">{TYPE_LABELS[lead.lead_type] ?? lead.lead_type}</td>
                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">{lead.city ?? "—"}</td>
                  <td className="p-3">{lead.car_name ?? "—"}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) => setStatus(lead, e.target.value)}
                      className={`rounded-md px-2 py-1 text-xs border-0 ${STATUS_COLORS[lead.status]}`}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-xs">{lead.follow_up_date ?? "—"}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <a href={`https://wa.me/${waNumber(lead.phone)}`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-green-600/15 text-green-400 p-1.5 hover:bg-green-600/25" aria-label={`WhatsApp ${lead.full_name}`}>
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                      <a href={telLink(lead.phone)} className="rounded-md border border-border p-1.5 hover:bg-card" aria-label={`Call ${lead.full_name}`}>
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">No leads match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(s) => setStatus(selected, s)}
          onUpdate={(fields) => {
            updateMut.mutate({ id: selected.id, ...fields });
            setSelected({ ...selected, ...fields } as LeadRecord);
          }}
          onDelete={() => {
            if (window.confirm(`Delete lead for ${selected.full_name}?`)) deleteMut.mutate(selected.id);
          }}
        />
      )}
    </div>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
  onUpdate,
  onDelete,
}: {
  lead: LeadRecord;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onUpdate: (fields: Partial<Pick<LeadRecord, "priority" | "follow_up_date" | "lost_reason" | "notes">>) => void;
  onDelete: () => void;
}) {
  const qc = useQueryClient();
  const { data: notes = [] } = useQuery({
    queryKey: ["admin", "lead-notes", lead.id],
    queryFn: () => adminListLeadNotes({ data: { lead_id: lead.id } }),
  });
  const [newNote, setNewNote] = useState("");
  const [waOpen, setWaOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const noteMut = useMutation({
    mutationFn: (note: string) => adminAddLeadNote({ data: { lead_id: lead.id, note } }),
    onSuccess: () => {
      setNewNote("");
      qc.invalidateQueries({ queryKey: ["admin", "lead-notes", lead.id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add note"),
  });

  const openWa = (message: string) => {
    window.open(`https://wa.me/${waNumber(lead.phone)}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const templates = WA_TEMPLATES.filter((t) => t.forTypes.includes(lead.lead_type));

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label={`Lead details for ${lead.full_name}`}>
      <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close lead details" />
      <div className="relative w-full max-w-md h-full bg-card border-l border-border overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{lead.full_name}</h3>
              <PriorityIcon priority={lead.priority} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {TYPE_LABELS[lead.lead_type]} · {lead.source.replaceAll("_", " ")} · {lead.city ?? "Jamshedpur"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md border border-border p-2 hover:bg-background" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setWaOpen((s) => !s)} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-600/15 text-green-400 px-3 py-2.5 text-sm font-medium hover:bg-green-600/25">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <a href={telLink(lead.phone)} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm font-medium hover:bg-background">
            <Phone className="h-4 w-4" /> Call {lead.phone}
          </a>
        </div>

        {waOpen && (
          <div className="surface p-3 mt-3 grid gap-2">
            <p className="text-xs font-semibold text-muted-foreground">Message templates</p>
            {templates.map((t) => (
              <button
                key={t.key}
                onClick={() => openWa(fillTemplate(t.body, lead))}
                className="text-left rounded-md border border-border/60 px-3 py-2 text-xs hover:border-primary/50"
              >
                <span className="font-medium">{t.label}</span>
                <span className="block text-muted-foreground mt-0.5 line-clamp-2">{fillTemplate(t.body, lead)}</span>
              </button>
            ))}
            {lead.car_id && (
              <button
                onClick={() => openWa(`Hi ${lead.full_name}, here's the ${lead.car_name ?? "car"} you asked about: https://gearboxautos.in/car/${lead.car_id}`)}
                className="text-left rounded-md border border-border/60 px-3 py-2 text-xs hover:border-primary/50"
              >
                <span className="font-medium">Send inventory link</span>
                <span className="block text-muted-foreground mt-0.5">Share the live listing page for {lead.car_name}</span>
              </button>
            )}
            <div className="flex gap-2 mt-1">
              <input
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Custom message…"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs"
              />
              <button
                onClick={() => customMsg.trim() && openWa(customMsg)}
                className="rounded-md bg-green-600/15 text-green-400 px-3 py-2 text-xs font-medium hover:bg-green-600/25"
              >
                Send
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div>
            <label className="text-xs text-muted-foreground">Stage</label>
            <select value={lead.status} onChange={(e) => onStatusChange(e.target.value)} className={`mt-1 w-full rounded-md px-2 py-2 text-xs border-0 ${STATUS_COLORS[lead.status]}`}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Priority</label>
            <select value={lead.priority} onChange={(e) => onUpdate({ priority: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-xs">
              {LEAD_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Follow-up date</label>
            <input type="date" value={lead.follow_up_date ?? ""} onChange={(e) => onUpdate({ follow_up_date: e.target.value || null })} className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-xs" />
          </div>
          {lead.status === "lost" && (
            <div>
              <label className="text-xs text-muted-foreground">Lost reason</label>
              <input defaultValue={lead.lost_reason ?? ""} onBlur={(e) => onUpdate({ lost_reason: e.target.value || null })} placeholder="e.g. Price too high" className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-xs" />
            </div>
          )}
        </div>

        {(lead.car_name || lead.budget_inr || lead.email) && (
          <div className="surface p-3 mt-4 text-sm grid gap-1">
            {lead.car_name && <p><span className="text-muted-foreground text-xs">Car:</span> {lead.car_name}</p>}
            {lead.budget_inr != null && <p><span className="text-muted-foreground text-xs">Budget:</span> ₹{lead.budget_inr.toLocaleString("en-IN")}</p>}
            {lead.email && <p><span className="text-muted-foreground text-xs">Email:</span> {lead.email}</p>}
          </div>
        )}

        {lead.notes && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Initial notes</p>
            <p className="text-sm whitespace-pre-wrap surface p-3">{lead.notes}</p>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-semibold text-muted-foreground mb-2">History ({notes.length})</p>
          <div className="flex gap-2 mb-3">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note… (e.g. offered ₹6.2L, counter ₹6.5L)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newNote.trim()) noteMut.mutate(newNote.trim());
              }}
            />
            <button
              onClick={() => newNote.trim() && noteMut.mutate(newNote.trim())}
              disabled={noteMut.isPending}
              className="btn-primary rounded-md px-3 py-2 text-xs font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div className="grid gap-2">
            {notes.map((n) => (
              <div key={n.id} className="surface p-3">
                <p className="text-sm whitespace-pre-wrap">{n.note}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
            {notes.length === 0 && <p className="text-xs text-muted-foreground">No history yet.</p>}
          </div>
        </div>

        <button onClick={onDelete} className="mt-6 flex items-center gap-2 text-xs text-red-400 hover:text-red-300">
          <Trash2 className="h-3.5 w-3.5" /> Delete this lead
        </button>
      </div>
    </div>
  );
}
