import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Loader2, GripVertical } from "lucide-react";
import { adminListCars, adminUpsertCar, adminDeleteCar } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/cars")({
  component: AdminCars,
});

type CarRow = {
  id: string;
  slug: string;
  name: string;
  price_inr: number;
  year: number;
  km: number;
  rto: string;
  location: string;
  fuel: string;
  transmission: string;
  image_url: string;
  images: string[];
  features: string[] | null;
  description: string | null;
  is_active: boolean;
};

const empty: Omit<CarRow, "id"> = {
  slug: "", name: "", price_inr: 0, year: new Date().getFullYear(), km: 0,
  rto: "JH-05", location: "Jamshedpur", fuel: "Petrol", transmission: "Manual",
  image_url: "", images: [], features: [], description: "", is_active: true,
};

const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

function AdminCars() {
  const qc = useQueryClient();
  const { data: cars = [] } = useQuery({ queryKey: ["admin", "cars"], queryFn: () => adminListCars() });
  const [editing, setEditing] = useState<(CarRow | (Omit<CarRow, "id"> & { id?: string })) | null>(null);

  const save = useMutation({
    mutationFn: (c: any) => adminUpsertCar({ data: {
      ...c,
      images: Array.isArray(c.images) ? c.images : [],
      image_url: (c.images?.[0] ?? c.image_url ?? ""),
      features: typeof c.features === "string" ? c.features.split(",").map((s: string) => s.trim()).filter(Boolean) : (c.features ?? []),
      price_inr: Number(c.price_inr), year: Number(c.year), km: Number(c.km),
    } }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin", "cars"] }); qc.invalidateQueries({ queryKey: ["cars", "public"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => adminDeleteCar({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "cars"] }); qc.invalidateQueries({ queryKey: ["cars", "public"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Inventory ({cars.length})</h2>
        <button onClick={() => setEditing(empty)} className="btn-primary rounded-md py-2 px-3 text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add Car</button>
      </div>

      <div className="surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Price</th><th className="text-left p-3">Year</th><th className="text-left p-3">Photos</th><th className="text-left p-3">Active</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {(cars as CarRow[]).map((c) => (
              <tr key={c.id} className="border-b border-border/40">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3">₹{c.price_inr.toLocaleString("en-IN")}</td>
                <td className="p-3">{c.year}</td>
                <td className="p-3">{(c.images?.length ?? 0)}</td>
                <td className="p-3">{c.is_active ? "Yes" : "No"}</td>
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing({ ...c, images: c.images ?? [] })} className="p-1.5 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirm("Delete this car?") && del.mutate(c.id)} className="p-1.5 hover:text-primary"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No cars yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-50 grid place-items-center p-4 overflow-y-auto">
          <div className="surface p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{("id" in editing && editing.id) ? "Edit" : "Add"} Car</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
              className="grid sm:grid-cols-2 gap-3 text-sm"
            >
              {[
                ["name","Name"],["slug","Slug"],["price_inr","Price (INR)","number"],["year","Year","number"],
                ["km","KMs","number"],["rto","RTO"],["location","Location"],["fuel","Fuel"],
                ["transmission","Transmission"],
              ].map(([k,l,t]) => (
                <label key={k} className="block">
                  <div className="text-xs text-muted-foreground mb-1">{l}</div>
                  <input required type={t || "text"} value={(editing as any)[k] ?? ""} onChange={(e) => setEditing({ ...(editing as any), [k]: e.target.value })} className="w-full rounded-md bg-input/60 border border-border/60 px-3 py-2 outline-none" />
                </label>
              ))}

              <div className="sm:col-span-2">
                <ImageUploader
                  slug={(editing as any).slug || "car"}
                  images={(editing as any).images ?? []}
                  onChange={(images) => setEditing({ ...(editing as any), images })}
                />
              </div>

              <label className="block sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Features (comma separated)</div>
                <input value={Array.isArray((editing as any).features) ? ((editing as any).features ?? []).join(", ") : (editing as any).features} onChange={(e) => setEditing({ ...(editing as any), features: e.target.value })} className="w-full rounded-md bg-input/60 border border-border/60 px-3 py-2 outline-none" />
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Description</div>
                <textarea rows={3} value={(editing as any).description ?? ""} onChange={(e) => setEditing({ ...(editing as any), description: e.target.value })} className="w-full rounded-md bg-input/60 border border-border/60 px-3 py-2 outline-none" />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={(editing as any).is_active} onChange={(e) => setEditing({ ...(editing as any), is_active: e.target.checked })} />
                <span>Active (visible publicly)</span>
              </label>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-border/70 px-4 py-2">Cancel</button>
                <button disabled={save.isPending} className="btn-primary rounded-md px-4 py-2 font-semibold disabled:opacity-60">{save.isPending ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageUploader({ slug, images, onChange }: { slug: string; images: string[]; onChange: (next: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) { toast.error(`Max ${MAX_IMAGES} images`); return; }
    const picked = Array.from(files).slice(0, slots);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of picked) {
        if (!file.type.startsWith("image/")) { toast.error(`${file.name}: not an image`); continue; }
        if (file.size > MAX_BYTES) { toast.error(`${file.name}: exceeds 5MB`); continue; }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${slug || "car"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("car-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (error) { toast.error(`${file.name}: ${error.message}`); continue; }
        const { data } = supabase.storage.from("car-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length) onChange([...images, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const onDrop = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    const next = [...images];
    const [m] = next.splice(dragIdx.current, 1);
    next.splice(i, 0, m);
    dragIdx.current = null;
    onChange(next);
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">
        Car photos ({images.length}/{MAX_IMAGES}) — first photo is the cover. Drag to reorder.
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => { dragIdx.current = i; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="relative aspect-[4/3] rounded-md overflow-hidden border border-border/60 group bg-secondary/40"
          >
            <img src={url} alt={`car-${i}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 text-[10px] bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-semibold">COVER</span>
            )}
            <span className="absolute top-1.5 right-7 text-foreground/70 cursor-grab"><GripVertical className="h-4 w-4" /></span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-full bg-background/80 hover:bg-background border border-border/60"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="aspect-[4/3] rounded-md border-2 border-dashed border-border/60 hover:border-primary/60 cursor-pointer grid place-items-center text-center text-xs text-muted-foreground transition">
            {uploading ? (
              <div className="flex flex-col items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Uploading…</div>
            ) : (
              <div className="flex flex-col items-center gap-2 px-2"><Upload className="h-5 w-5" /> Click or drop images<br />JPG/PNG/WebP · max 5MB</div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
