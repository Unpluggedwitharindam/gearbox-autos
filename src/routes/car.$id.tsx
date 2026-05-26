import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, User, Phone, MapPin, Car as CarIcon, ShieldCheck, Calendar, Gauge, FileText, Fuel, Settings2, Tv, AirVent, Disc, Radar, Wind, CircleDot } from "lucide-react";
import { listPublicCars, getCarBySlug } from "@/lib/cars.functions";
import { submitTestDrive } from "@/lib/leads.functions";
import { CarImageCarousel } from "@/components/CarImageCarousel";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/car/$id")({
  head: ({ params }) => ({ meta: [{ title: `Car — Gearbox Autos` }] }),
  component: CarDetail,
  notFoundComponent: () => <div className="container-page pt-32"><p>Car not found.</p></div>,
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["car", params.id],
        queryFn: () => getCarBySlug({ data: { slug: params.id } }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["cars", "public"],
        queryFn: () => listPublicCars(),
      }),
    ]);
  },
});

const featureIcons: Record<string, any> = {
  "Touchscreen Infotainment": Tv,
  "Dual Airbags": ShieldCheck,
  "ABS with EBD": Disc,
  "Rear Parking Sensors": Radar,
  "Automatic Climate Control": Wind,
  "Alloy Wheels": CircleDot,
};

function CarDetail() {
  const { id } = Route.useParams();
  const { data: car } = useQuery({ queryKey: ["car", id], queryFn: () => getCarBySlug({ data: { slug: id } }) });
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "public"], queryFn: () => listPublicCars() });
  if (!car) throw notFound();
  const features = car.features ?? ["Touchscreen Infotainment", "Dual Airbags", "ABS with EBD", "Rear Parking Sensors", "Automatic Climate Control", "Alloy Wheels"];

  const [form, setForm] = useState({ full_name: "", phone: "", email: "", car_id: car.id });
  const mut = useMutation({
    mutationFn: () =>
      submitTestDrive({
        data: {
          car_id: form.car_id,
          car_name: cars.find((c) => c.id === form.car_id)?.name,
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
        },
      }),
    onSuccess: () => {
      toast.success("Test drive request submitted! We'll be in touch.");
      setForm({ full_name: "", phone: "", email: "", car_id: car.id });
    },
    onError: (e: Error) => toast.error(e.message || "Submission failed"),
  });

  return (
    <section className="container-page pt-32 pb-12">
      <Link to="/buy" className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Inventory</Link>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
        <div className="surface p-6">
          <CarImageCarousel images={car.images} alt={car.name} />
          <h1 className="text-3xl font-bold mt-6">{car.name}</h1>
          <div className="text-primary text-2xl font-semibold mt-2">{car.price}</div>

          <div className="mt-5 grid grid-cols-3 md:grid-cols-6 gap-4 text-xs border-t border-border pt-5">
            {[
              { Icon: Calendar, v: car.year, l: "Year of Reg." },
              { Icon: Gauge, v: car.km, l: "KMs Driven" },
              { Icon: FileText, v: car.rto, l: "RTO" },
              { Icon: MapPin, v: car.location, l: "Location" },
              { Icon: Fuel, v: car.fuel, l: "Fuel Type" },
              { Icon: Settings2, v: car.transmission, l: "Transmission" },
            ].map((s, i) => (
              <div key={i}><s.Icon className="h-4 w-4 text-primary mb-1" /><div className="font-medium text-foreground">{s.v}</div><div className="text-muted-foreground">{s.l}</div></div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="font-semibold mb-4">Key Features</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-xs text-center">
              {features.map((f) => {
                const I = featureIcons[f] ?? AirVent;
                return (
                  <div key={f} className="flex flex-col items-center gap-2">
                    <I className="h-6 w-6 text-foreground/80" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="surface p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-md border border-primary/40 grid place-items-center text-primary"><Calendar className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-semibold">Book a Test Drive</h2>
              <p className="text-sm text-muted-foreground">Fill in your details and our team will get in touch with you.</p>
            </div>
          </div>
          <Input icon={User} label="Full Name" placeholder="Enter your full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
          <Input icon={Phone} label="Phone Number" placeholder="Enter your 10 digit mobile number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <Input icon={User} label="Email (optional)" placeholder="you@example.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <label className="block">
            <div className="text-sm mb-1.5">Which car are you looking to buy?</div>
            <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
              <CarIcon className="h-4 w-4 text-muted-foreground" />
              <select className="bg-transparent outline-none text-sm flex-1" value={form.car_id} onChange={(e) => setForm({ ...form, car_id: e.target.value })}>
                {cars.map((c) => <option key={c.id} value={c.id} className="bg-background">{c.name}</option>)}
              </select>
            </div>
          </label>

          <button disabled={mut.isPending} className="btn-primary w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {mut.isPending ? "Submitting…" : <>Submit Request <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-xs text-muted-foreground text-center">🔒 Your information is safe with us and will never be shared.</p>
        </form>
      </div>
    </section>
  );
}

function Input({ icon: Icon, label, value, onChange, placeholder, required }: { icon: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="text-sm mb-1.5">{label}</div>
      <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-transparent outline-none text-sm flex-1" />
      </div>
    </label>
  );
}
